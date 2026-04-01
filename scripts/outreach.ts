/**
 * CrawlReady Outreach Pipeline
 *
 * Full pipeline: scan → agentic test → generate report → publish → send email
 *
 * Usage:
 *   pnpm outreach <url> [email] [cc]       # full pipeline
 *   pnpm outreach <url> --scan-only        # scan + test only, no email
 *   pnpm outreach <url> [email] --no-push  # generate everything but don't push/email
 *   pnpm outreach --queue                  # process all pending leads from queue.json
 *
 * Examples:
 *   pnpm outreach esoesagency.com yulia@example.com
 *   pnpm outreach cfprumasa.com carvalja@gmail.com cernadas.business@gmail.com
 *   pnpm outreach --queue
 */
import * as fs from "fs";
import * as path from "path";
import nodemailer from "nodemailer";
import { scanUrl } from "../src/lib/scanner";
import { runAgentTestFull } from "../src/lib/agentTest";
import { generateTerminalHtml } from "../src/lib/agentTerminalHtml";
import type { ScanResult, AgentTestResult } from "../src/lib/types";

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

if (flags.includes("--queue")) {
  processQueue().catch(err => { console.error("\n✗ Queue failed:", err); process.exit(1); });
} else {
  const rawUrl = args[0];
  const email = args[1];
  const cc = args[2];
  if (!rawUrl) {
    console.error("Usage: pnpm outreach <url> [email] [cc] [--scan-only] [--no-push]\n       pnpm outreach --queue");
    process.exit(1);
  }
  runPipeline(rawUrl, email, cc).catch(err => { console.error("\n✗ Pipeline failed:", err); process.exit(1); });
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
    await runPipeline(lead.url, lead.email, lead.cc);
    lead.status = "done";
    lead.sentAt = new Date().toISOString().split("T")[0];
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n");
  }
  console.log("\n✓ All pending leads processed.");
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
  const resultSentence = failSteps.length === 0
    ? "El agente completó la tarea con éxito."
    : `${failSteps[failSteps.length - 1].details.split(".")[0]}.`;

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
async function runPipeline(rawUrl: string, email?: string, cc?: string) {
  const url = rawUrl.replace(/^(?!https?:\/\/)/i, "https://");
  const slug = toSlug(url);
  const companyName = slugToName(slug);

  console.log(`\n========================================`);
  console.log(`  CrawlReady Outreach Pipeline`);
  console.log(`  Target: ${url}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Company: ${companyName}`);
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

  // Step 3: Save report JSON
  console.log("\n[3/6] Saving report data...");
  const reportData = { slug, companyName, scanResult, agentTest };
  const reportJsonPath = path.join("src", "data", "reports", `${slug}.json`);
  fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
  fs.writeFileSync(reportJsonPath, JSON.stringify(reportData, null, 2));
  console.log(`  ✓ ${reportJsonPath}`);

  // Step 4: Generate terminal HTML
  console.log("\n[4/6] Generating terminal animation...");
  const terminalHtml = generateTerminalHtml(agentTest.steps, {
    url: agentTest.url,
    task: agentTest.task,
    reportUrl: `https://crawlready.dev/es/report/${slug}`,
  });
  const terminalPath = path.join("public", "reports", `${slug}-agent-test.html`);
  fs.mkdirSync(path.dirname(terminalPath), { recursive: true });
  fs.writeFileSync(terminalPath, terminalHtml);
  console.log(`  ✓ ${terminalPath}`);

  if (scanOnly) {
    console.log("\n✓ Scan complete (--scan-only). Files saved locally.");
    return;
  }

  // Step 5: Git commit + push
  if (!noPush) {
    console.log("\n[5/6] Publishing (git commit + push)...");
    const { execSync } = await import("child_process");
    const exec = (cmd: string) => execSync(cmd, { encoding: "utf-8", stdio: "pipe" });

    try {
      exec(`git add "${reportJsonPath}" "${terminalPath}"`);
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
    console.log("\n[5/6] Skipped (--no-push)");
  }

  // Step 6: Send email
  if (email && !noPush) {
    console.log("\n[6/6] Sending cold email...");
    const transporter = nodemailer.createTransport({
      host: "smtp.porkbun.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.PORKBUN_EMAIL,
        pass: process.env.PORKBUN_EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const subject = buildSubjectLine(agentTest, new URL(url).hostname);

    const info = await transporter.sendMail({
      from: '"Antonio @ CrawlReady" <hello@crawlready.dev>',
      to: email,
      ...(cc ? { cc } : {}),
      subject,
      html: buildEmailHtml(scanResult, agentTest, companyName, slug, url),
    });
    console.log(`  ✓ Email sent to ${email}${cc ? ` (cc: ${cc})` : ""} (${info.messageId})`);
  } else if (!email) {
    console.log("\n[6/6] Skipped (no email provided)");
  } else {
    console.log("\n[6/6] Skipped (--no-push)");
  }

  console.log(`\n========================================`);
  console.log(`  ✓ Pipeline complete!`);
  console.log(`  Report: https://crawlready.dev/es/report/${slug}`);
  console.log(`  Agent test: https://crawlready.dev/reports/${slug}-agent-test.html`);
  console.log(`========================================\n`);
}
