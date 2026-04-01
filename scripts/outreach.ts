/**
 * CrawlReady Outreach Pipeline
 *
 * Full pipeline: scan → agentic test → generate report → publish → send email
 *
 * Usage:
 *   pnpm outreach <url> [email]           # full pipeline
 *   pnpm outreach <url> --scan-only       # scan + test only, no email
 *   pnpm outreach <url> [email] --no-push # generate everything but don't push/email
 *
 * Examples:
 *   pnpm outreach esoesagency.com yulia@example.com
 *   pnpm outreach ecommaster.es --scan-only
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
const rawUrl = args[0];
const email = args[1];
const scanOnly = flags.includes("--scan-only");
const noPush = flags.includes("--no-push");

if (!rawUrl) {
  console.error("Usage: pnpm outreach <url> [email] [--scan-only] [--no-push]");
  process.exit(1);
}

const url = rawUrl.replace(/^(?!https?:\/\/)/i, "https://");
const slug = new URL(url).hostname.replace(/^www\./, "").replace(/\.\w+$/, "").replace(/[^a-z0-9]/gi, "-");
const today = new Date().toISOString().split("T")[0];

// --- Helpers ---
function slugToName(s: string): string {
  return s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function gradeColor(grade: string): string {
  if (grade === "A") return "#22c55e";
  if (grade === "B") return "#22d3ee";
  if (grade === "C") return "#eab308";
  return "#ef4444";
}

function buildSubjectFinding(agentTest: AgentTestResult, hostname: string): string {
  const failSteps = agentTest.steps.filter(s => s.status !== "pass" && s.step !== "verdict");
  if (failSteps.length === 0) return `${hostname}: un agente IA complet&oacute; una tarea en tu web`;

  // Pick the most relevant failing step for the subject
  const step = failSteps[failSteps.length - 1]; // last failing step = deepest in funnel
  const stepMap: Record<string, string> = {
    contact: "un agente IA no pudo contactar con vosotros desde tu web",
    form: "un agente IA no pudo completar el formulario en tu web",
    quote: "un agente IA no pudo solicitar presupuesto en tu web",
    booking: "un agente IA no pudo reservar cita en tu web",
    services: "un agente IA no pudo entender vuestros servicios",
    findability: "un agente IA no pudo encontraros",
  };
  return `${hostname}: ${stepMap[step.step] || "un agente IA no pudo completar una tarea en tu web"}`;
}

function buildResultSentence(agentTest: AgentTestResult): string {
  const failSteps = agentTest.steps.filter(s => s.status !== "pass" && s.step !== "verdict");
  if (failSteps.length === 0) return "El agente complet&oacute; la tarea con &eacute;xito.";
  const lastFail = failSteps[failSteps.length - 1];
  return `${lastFail.details.split(".")[0]}.`;
}

function buildEmailHtml(scanResult: ScanResult, agentTest: AgentTestResult, companyName: string): string {
  const reportUrl = `https://crawlready.dev/es/report/${slug}`;
  const hostname = new URL(url).hostname;

  const resultSentence = buildResultSentence(agentTest);

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
async function main() {
  const companyName = slugToName(slug);
  console.log(`\n========================================`);
  console.log(`  CrawlReady Outreach Pipeline`);
  console.log(`  Target: ${url}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Company: ${companyName}`);
  if (email) console.log(`  Email: ${email}`);
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
      exec(`git commit -m "${msg}

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"`);
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

    const subject = buildSubjectFinding(agentTest, new URL(url).hostname);

    const info = await transporter.sendMail({
      from: '"Antonio @ CrawlReady" <hello@crawlready.dev>',
      to: email,
      subject,
      html: buildEmailHtml(scanResult, agentTest, companyName),
    });
    console.log(`  ✓ Email sent to ${email} (${info.messageId})`);
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

main().catch(err => {
  console.error("\n✗ Pipeline failed:", err);
  process.exit(1);
});
