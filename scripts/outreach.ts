/**
 * CrawlReady Outreach Pipeline
 *
 * Full pipeline: scan → agentic test → generate report → publish → send email
 *
 * Usage:
 *   pnpm outreach <url> [email] [cc]        # full pipeline (scan → publish → email)
 *   pnpm outreach <url> --competitor=<url>  # include competitor comparison
 *   pnpm outreach <url> --scan-only         # scan + test only, save locally
 *   pnpm outreach <url> [email] --no-email  # scan + publish, skip email
 *   pnpm outreach <url> [email] --no-push   # scan + generate, skip publish + email
 *   pnpm outreach --queue                   # process all pending leads
 *   pnpm outreach --queue --no-email        # process + publish, skip emails (review first)
 *   pnpm outreach --send-email <slug>       # send email for already-published lead
 *
 * Typical flow with confirmation:
 *   1. pnpm outreach --queue --no-email     # agent processes leads, publishes reports
 *   2. Human reviews report URLs
 *   3. pnpm outreach --send-email cfprumasa # human approves, agent sends email
 */
import * as fs from "fs";
import * as path from "path";
import { scanUrl } from "../src/lib/scanner";
import { runAgentTestFull } from "../src/lib/agentTest";
import { sendOutreachEmail } from "../src/lib/email";
import type { ScanResult, AgentTestResult, CompetitorData } from "../src/lib/types";

// --- Load .env.local ---
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

// --- Parse args ---
const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const flags = process.argv.slice(2).filter(a => a.startsWith("--"));
const scanOnly = flags.includes("--scan-only");
const noPush = flags.includes("--no-push");
const noEmail = flags.includes("--no-email");
const competitorFlag = flags.find(f => f.startsWith("--competitor="));
const competitorUrl = competitorFlag ? competitorFlag.split("=")[1] : undefined;

if (flags.includes("--queue")) {
  processQueue().catch(err => { console.error("\n✗ Queue failed:", err); process.exit(1); });
} else if (flags.includes("--send-email")) {
  // Send email for an already-published lead: pnpm outreach --send-email <slug>
  const slug = args[0];
  if (!slug) { console.error("Usage: pnpm outreach --send-email <slug>"); process.exit(1); }
  sendEmailForLead(slug).catch(err => { console.error("\n✗ Send failed:", err); process.exit(1); });
} else {
  const rawUrl = args[0];
  const email = args[1];
  const cc = args[2];
  if (!rawUrl) {
    console.error([
      "Usage:",
      "  pnpm outreach <url> [email] [cc] [--competitor=<url>] [--scan-only] [--no-push] [--no-email]",
      "  pnpm outreach --queue [--no-email]   Process pending leads from queue.json",
      "  pnpm outreach --send-email <slug>    Send email for an already-published lead",
    ].join("\n"));
    process.exit(1);
  }
  runPipeline(rawUrl, email, cc, competitorUrl).catch(err => { console.error("\n✗ Pipeline failed:", err); process.exit(1); });
}

// --- Queue processor ---
async function processQueue() {
  const queuePath = path.join("outreach", "queue.json");
  if (!fs.existsSync(queuePath)) { console.log("No queue.json found."); return; }
  const queue = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
  const pending = queue.filter((l: any) => l.status === "pending");
  if (pending.length === 0) { console.log("No pending leads in queue."); return; }
  console.log(`\nFound ${pending.length} pending lead(s) in queue.\n`);
  for (const lead of pending) {
    await runPipeline(lead.url, lead.email, lead.cc, lead.competitor);
    if (noEmail) {
      lead.status = "ready"; // published but email not sent — waiting for confirmation
    } else {
      lead.status = "done";
      lead.sentAt = new Date().toISOString().split("T")[0];
    }
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n");
  }
  if (noEmail) {
    console.log("\n✓ All leads published. Email NOT sent (--no-email). Review reports and run:");
    for (const lead of pending) {
      const s = toSlug(lead.url.replace(/^(?!https?:\/\/)/i, "https://"));
      console.log(`  pnpm outreach --send-email ${s}`);
    }
  } else {
    console.log("\n✓ All pending leads processed.");
  }
}

// --- Send email for already-published lead ---
async function sendEmailForLead(slug: string) {
  const queuePath = path.join("outreach", "queue.json");
  if (!fs.existsSync(queuePath)) { console.error("No queue.json found."); process.exit(1); }
  const queue = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
  const lead = queue.find((l: any) => toSlug(l.url.replace(/^(?!https?:\/\/)/i, "https://")) === slug);
  if (!lead) { console.error(`No lead found for slug "${slug}"`); process.exit(1); }
  if (!lead.email) { console.error(`Lead "${slug}" has no email`); process.exit(1); }

  // Load report data for email content
  const reportPath = path.join("src", "data", "reports", `${slug}.json`);
  if (!fs.existsSync(reportPath)) { console.error(`No report found at ${reportPath}`); process.exit(1); }
  const reportData = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

  const url = lead.url.replace(/^(?!https?:\/\/)/i, "https://");
  const companyName = lead.company || slugToName(slug);

  console.log(`\nSending email for ${companyName} (${url})`);
  console.log(`  To: ${lead.email}${lead.cc ? ` CC: ${lead.cc}` : ""}`);

  const subject = buildSubjectLine(reportData.agentTest, new URL(url).hostname);
  await sendOutreachEmail({
    to: lead.email,
    cc: lead.cc,
    subject,
    html: buildEmailHtml(reportData.scanResult, reportData.agentTest, companyName, slug, url),
  });

  console.log(`  ✓ Email sent!`);

  // Update queue
  lead.status = "done";
  lead.sentAt = new Date().toISOString().split("T")[0];
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n");
  console.log("  ✓ Queue updated");
}

// --- Helpers ---
function toSlug(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "").replace(/\.\w+$/, "").replace(/[^a-z0-9]/gi, "-");
}

function slugToName(s: string): string {
  return s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function buildSubjectLine(agentTest: AgentTestResult, hostname: string): string {
  const failSteps = agentTest.steps.filter(s => s.status !== "pass" && s.step !== "verdict");
  if (failSteps.length === 0) return `${hostname}: un agente IA completó una tarea en tu web`;
  const step = failSteps[failSteps.length - 1];
  const stepMap: Record<string, string> = {
    discovery: "un agente IA no pudo encontrar tu negocio",
    navigation: "un agente IA no pudo navegar tu web",
    contact: "un agente IA no pudo contactar con vosotros",
    form_operability: "un agente IA no pudo enviar un formulario en tu web",
    structured_data: "un agente IA no entiende tu negocio",
  };
  return `${hostname}: ${stepMap[step.step] || "un agente IA no pudo completar una tarea en tu web"}`;
}

function buildEmailHtml(scanResult: ScanResult, agentTest: AgentTestResult, companyName: string, slug: string, url: string): string {
  const reportUrl = `https://crawlready.dev/es/report/${slug}`;
  const hostname = new URL(url).hostname;

  const failSteps = agentTest.steps.filter(s => s.status !== "pass" && s.step !== "verdict");
  const verdictMap: Record<string, string> = {
    discovery: "No pudo ni cargar la p&aacute;gina.",
    navigation: "Pudo entrar, pero no encontr&oacute; las p&aacute;ginas clave (servicios, contacto, precios).",
    contact: "No encontr&oacute; ninguna forma de contactar con vosotros.",
    agent_ready_forms: "No pudo enviar ninguna solicitud &mdash; no hay formularios que un agente IA pueda usar.",
    structured_data: "No pudo entender vuestros servicios ni precios de forma autom&aacute;tica.",
  };
  const resultSentence = failSteps.length === 0
    ? "El agente complet&oacute; la tarea con &eacute;xito."
    : verdictMap[failSteps[failSteps.length - 1].step] || "No pudo completar la tarea.";

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1f2937">

  <p style="font-size:15px;line-height:1.7;margin:0 0 16px">Hola,</p>

  <p style="font-size:15px;line-height:1.7;margin:0 0 16px">Hice una prueba con ${hostname}: le ped&iacute; a un agente IA que encontrara vuestros servicios y solicitara presupuesto.</p>

  <p style="font-size:15px;line-height:1.7;margin:0 0 20px">${resultSentence}</p>

  <p style="font-size:15px;line-height:1.7;margin:0 0 24px">He documentado todo paso a paso en un informe gratuito con lo que funciona, lo que falla y c&oacute;mo solucionarlo:</p>

  <p style="text-align:center;margin:0 0 32px">
    <a href="${reportUrl}" style="background:#06b6d4;color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">Ver informe completo &rarr;</a>
  </p>

  <p style="font-size:15px;line-height:1.7;margin:0 0 16px">&iquest;Por qu&eacute; hago esto? Los asistentes de IA (ChatGPT, Perplexity, Gemini) ya est&aacute;n haciendo tareas por los usuarios: buscar servicios, comparar opciones, solicitar presupuestos. Es tr&aacute;fico real que crece cada mes. Me dedico a preparar webs para este cambio.</p>

  <p style="font-size:15px;line-height:1.7;margin:0 0 4px">Un saludo,</p>
  <p style="font-size:15px;line-height:1.7;margin:0 0 4px"><strong>Antonio Cernadas</strong></p>
  <p style="font-size:13px;color:#6b7280;margin:0">CrawlReady &mdash; <a href="https://crawlready.dev" style="color:#06b6d4">crawlready.dev</a></p>

</div>`;
}

// --- Main pipeline ---
async function runPipeline(rawUrl: string, email?: string, cc?: string, competitorRawUrl?: string) {
  const url = rawUrl.replace(/^(?!https?:\/\/)/i, "https://");
  const slug = toSlug(url);
  const companyName = slugToName(slug);

  console.log(`\n========================================`);
  console.log(`  CrawlReady Outreach Pipeline`);
  console.log(`  Target: ${url}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Company: ${companyName}`);
  if (competitorRawUrl) console.log(`  Competitor: ${competitorRawUrl}`);
  if (email) console.log(`  Email: ${email}`);
  if (cc) console.log(`  CC: ${cc}`);
  console.log(`========================================\n`);

  // Step 1: Scan
  console.log("[1/6] Scanning...");
  const scanResult = await scanUrl(url);
  console.log(`  Score: ${scanResult.totalScore}/${scanResult.maxPossibleScore} (Grade ${scanResult.grade})`);
  for (const check of scanResult.checks) {
    const icon = check.status === "pass" ? "✓" : check.status === "partial" ? "●" : "✗";
    console.log(`  ${icon} ${check.name}: ${check.score}/${check.maxScore}`);
  }

  // Step 2: Agentic test
  console.log("\n[2/6] Running agentic test...");
  const task = "Find this business, understand their services, and request a quote";
  const agentTest = await runAgentTestFull(url, task);
  console.log(`  Verdict: ${agentTest.verdict} (${agentTest.totalDurationMs}ms)`);
  for (const step of agentTest.steps) {
    const icon = step.status === "pass" ? "✓" : step.status === "partial" ? "●" : "✗";
    console.log(`  ${icon} ${step.step}: ${step.details.substring(0, 100)}`);
  }

  // Log comprehension for competitor research
  if (agentTest.comprehension) {
    const c = agentTest.comprehension;
    console.log(`\n  Business comprehension:`);
    if (c.services.length > 0) console.log(`    Services: ${c.services.join(", ")}`);
    if (c.locations.length > 0) console.log(`    Location: ${c.locations.join(", ")}`);
    if (c.audiences.length > 0) console.log(`    Audience: ${c.audiences.join(", ")}`);
    if (c.prices.length > 0) console.log(`    Prices: ${c.prices.join(", ")}`);
  }

  if (!competitorRawUrl && agentTest.comprehension?.services.length) {
    const svc = agentTest.comprehension.services.join(", ");
    const loc = agentTest.comprehension.locations.join(", ") || "España";
    console.log(`\n  ⚠ No competitor provided. Suggested search: "${svc} ${loc}"`);
    console.log(`    Re-run with --competitor=<url> to include comparison.`);
  }

  // Step 2b: Competitor agentic test (if provided)
  let competitor: CompetitorData | undefined;
  if (competitorRawUrl) {
    const cUrl = competitorRawUrl.replace(/^(?!https?:\/\/)/i, "https://");
    const cName = slugToName(toSlug(cUrl));
    console.log(`\n[2b/6] Running competitor agentic test (${cName})...`);
    const cAgentTest = await runAgentTestFull(cUrl, task);
    console.log(`  Verdict: ${cAgentTest.verdict} (${cAgentTest.totalDurationMs}ms)`);
    for (const step of cAgentTest.steps) {
      const icon = step.status === "pass" ? "✓" : step.status === "partial" ? "●" : "✗";
      console.log(`  ${icon} ${step.step}: ${step.details.substring(0, 100)}`);
    }
    competitor = { url: cUrl, companyName: cName, agentTest: cAgentTest };
  }

  // Step 3: Save report JSON
  console.log("\n[3/6] Saving report data...");
  const reportData = { slug, companyName, scanResult, agentTest, ...(competitor ? { competitor } : {}) };
  const reportJsonPath = path.join("src", "data", "reports", `${slug}.json`);
  fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
  fs.writeFileSync(reportJsonPath, JSON.stringify(reportData, null, 2));
  console.log(`  ✓ ${reportJsonPath}`);

  if (scanOnly) {
    console.log("\n✓ Scan complete (--scan-only). Files saved locally.");
    return;
  }

  // Step 4: Git commit + push
  if (!noPush) {
    console.log("\n[4/5] Publishing (git commit + push)...");
    const { execSync } = await import("child_process");
    const exec = (cmd: string) => execSync(cmd, { encoding: "utf-8", stdio: "pipe" });

    try {
      exec(`git add "${reportJsonPath}"`);
      const msg = `Add/update ${companyName} report (${scanResult.totalScore}/${scanResult.maxPossibleScore} Grade ${scanResult.grade})`;
      exec(`git commit -m "${msg}\n\nCo-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"`);
      exec("git push origin master");
      console.log("  ✓ Pushed to master — Vercel deploying");
    } catch (e: any) {
      if (e.message?.includes("nothing to commit")) {
        console.log("  ✓ No changes to commit (report already up to date)");
      } else {
        console.error("  ✗ Git error:", e.message);
      }
    }
  } else {
    console.log("\n[4/5] Skipped (--no-push)");
  }

  // Step 5: Send email
  if (email && !noPush && !noEmail) {
    console.log("\n[5/5] Sending cold email...");
    const subject = buildSubjectLine(agentTest, new URL(url).hostname);
    await sendOutreachEmail({
      to: email,
      cc,
      subject,
      html: buildEmailHtml(scanResult, agentTest, companyName, slug, url),
    });
    console.log(`  ✓ Email sent to ${email}${cc ? ` (cc: ${cc})` : ""}`);
  } else if (noEmail) {
    console.log("\n[5/5] Skipped (--no-email). To send later: pnpm outreach --send-email " + slug);
  } else if (!email) {
    console.log("\n[5/5] Skipped (no email provided)");
  } else {
    console.log("\n[5/5] Skipped (--no-push)");
  }

  console.log(`\n========================================`);
  console.log(`  ✓ Pipeline complete!`);
  console.log(`  Report: https://crawlready.dev/es/report/${slug}`);
  console.log(`========================================\n`);
}
