import type { AgentStepResult, AgentStepStatus } from "./types";

const STATUS_ICON: Record<AgentStepStatus, string> = {
  pass: "\u2713",
  partial: "\u25CF",
  fail: "\u2717",
};

const STATUS_COLOR: Record<AgentStepStatus, string> = {
  pass: "#22c55e",
  partial: "#eab308",
  fail: "#ef4444",
};

const STEP_LABELS: Record<string, string> = {
  discovery: "Discovery",
  navigation: "Navigation",
  contact: "Contact Discovery",
  form_operability: "Form Operability",
  structured_data: "Structured Data",
  verdict: "Verdict",
};

interface HtmlOptions {
  url: string;
  task?: string;
  animationSpeed?: number; // ms per line, default 300
  reportUrl?: string; // link to full report, shown as CTA after animation
}

export function generateTerminalHtml(
  steps: AgentStepResult[],
  options: HtmlOptions
): string {
  const { url, task = "find this business and request a quote", animationSpeed = 300, reportUrl } = options;

  // Build all lines as data for JS animation
  interface Line {
    text: string;
    color: string;
    bold: boolean;
    delay: number; // ms delay before showing this line
  }

  const lines: Line[] = [];
  let delay = 500; // initial delay

  // Intro
  lines.push({ text: "$ Initializing CrawlReady Agent v1.0...", color: "#6b7280", bold: false, delay });
  delay += animationSpeed;
  lines.push({ text: `$ Target: ${url}`, color: "#6b7280", bold: false, delay });
  delay += animationSpeed;
  lines.push({ text: `$ Task: "${task}"`, color: "#6b7280", bold: false, delay });
  delay += animationSpeed * 2;

  let stepIndex = 0;
  const totalSteps = steps.filter((s) => s.step !== "verdict").length;

  for (const step of steps) {
    const label = STEP_LABELS[step.step] || step.step;

    if (step.step === "verdict") {
      lines.push({ text: "", color: "#444", bold: false, delay });
      delay += animationSpeed;
      lines.push({ text: "\u2500".repeat(50), color: "#444", bold: false, delay });
      delay += animationSpeed * 2;
      lines.push({
        text: `${STATUS_ICON[step.status]} VERDICT: ${step.status.toUpperCase()}`,
        color: STATUS_COLOR[step.status],
        bold: true,
        delay,
      });
      delay += animationSpeed * 2;
      lines.push({
        text: step.details,
        color: STATUS_COLOR[step.status],
        bold: true,
        delay,
      });
      continue;
    }

    // Pause between sections
    lines.push({ text: "", color: "#444", bold: false, delay });
    delay += animationSpeed;

    // Step header
    lines.push({
      text: `[${stepIndex + 1}/${totalSteps}] ${label}`,
      color: "#22d3ee",
      bold: true,
      delay,
    });
    delay += animationSpeed * 1.5;

    // Action
    lines.push({ text: `> ${step.action}`, color: "#6b7280", bold: false, delay });
    delay += animationSpeed;

    // Substeps
    if (step.substeps) {
      for (const sub of step.substeps) {
        const icon = STATUS_ICON[sub.status];
        const detail = sub.detail ? ` \u2014 ${sub.detail}` : "";
        lines.push({
          text: `  ${icon} ${sub.label}${detail}`,
          color: STATUS_COLOR[sub.status],
          bold: false,
          delay,
        });
        delay += animationSpeed;
      }
    }

    // Result
    lines.push({
      text: `  ${STATUS_ICON[step.status]} ${step.details}`,
      color: STATUS_COLOR[step.status],
      bold: false,
      delay,
    });
    delay += animationSpeed * 1.5;

    stepIndex++;
  }

  const linesJson = JSON.stringify(lines);
  const totalDuration = delay + 1000;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CrawlReady Agent Test — ${escapeHtml(url)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#e4e4e7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,monospace;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
.terminal{width:100%;max-width:720px;border-radius:12px;overflow:hidden;border:1px solid #27272a;background:#0d1117;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5)}
.title-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#161b22;border-bottom:1px solid #27272a}
.dots{display:flex;gap:6px}
.dot{width:12px;height:12px;border-radius:50%}
.dot-red{background:#ff5f57}
.dot-yellow{background:#febc2e}
.dot-green{background:#28c840}
.title-text{flex:1;text-align:center;font-size:12px;color:#6b7280}
.content{padding:16px;font-family:'SF Mono','Fira Code','Cascadia Code',monospace;font-size:13px;line-height:1.7;min-height:200px;max-height:500px;overflow-y:auto}
.line{opacity:0;transform:translateY(4px);transition:opacity 0.15s,transform 0.15s}
.line.visible{opacity:1;transform:translateY(0)}
.cursor{display:inline-block;width:8px;height:16px;background:#22d3ee;animation:blink 0.8s step-end infinite;vertical-align:text-bottom;margin-left:2px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.footer{padding:10px 16px;background:#161b22;border-top:1px solid #27272a;font-size:11px;color:#6b7280}
.footer-row{display:flex;justify-content:space-between;align-items:center}
.skip-btn{background:none;border:1px solid #333;color:#6b7280;padding:3px 10px;border-radius:4px;font-size:10px;cursor:pointer;font-family:inherit;transition:border-color 0.2s,color 0.2s}
.skip-btn:hover{border-color:#22d3ee;color:#22d3ee}
.skip-btn.hidden{display:none}
.cta{margin-top:12px;text-align:center;opacity:0;transform:translateY(8px);transition:opacity 0.8s ease,transform 0.8s ease;pointer-events:none}
.cta.visible{opacity:1;transform:translateY(0);pointer-events:auto}
.cta a{display:inline-block;padding:10px 28px;background:#22d3ee;color:#000;font-weight:600;font-size:13px;border-radius:8px;text-decoration:none;transition:background 0.2s}
.cta a:hover{background:#0891b2}
.disclaimer{margin-top:8px;padding-top:8px;border-top:1px solid #1a1a1a;font-size:10px;color:#444;line-height:1.5}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px}
.badge-pass{background:rgba(34,197,94,0.15);color:#22c55e}
.badge-partial{background:rgba(234,179,8,0.15);color:#eab308}
.badge-fail{background:rgba(239,68,68,0.15);color:#ef4444}
</style>
</head>
<body>
<div class="terminal">
  <div class="title-bar">
    <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
    <div class="title-text">CrawlReady Agent v1.0 — ${escapeHtml(url)}</div>
  </div>
  <div class="content" id="content">
    <span class="cursor" id="cursor"></span>
  </div>
  <div class="footer" id="footer">
    <div class="footer-row">
      <span>crawlready.dev &mdash; AI Agent Operability Test</span>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="skip-btn" id="skipBtn" onclick="window._skip()">Skip &raquo;</button>
        <span id="badge"></span>
      </div>
    </div>
    <div class="disclaimer">Los datos mostrados son reales &mdash; obtenidos mediante peticiones HTTP al sitio web, tal como har&iacute;a un agente IA. La animaci&oacute;n de terminal es una recreaci&oacute;n visual del proceso para facilitar su comprensi&oacute;n.</div>
${reportUrl ? `    <div class="cta" id="cta"><a href="${escapeHtml(reportUrl)}">Ver informe completo &rarr;</a></div>` : ""}
  </div>
</div>
<script>
(function(){
var lines=${linesJson};
var content=document.getElementById("content");
var cursor=document.getElementById("cursor");
var badge=document.getElementById("badge");
var skipBtn=document.getElementById("skipBtn");
var timer=null;
var i=0;

var speedMultiplier=1;
window._skip=function(){
  if(speedMultiplier===1){
    speedMultiplier=10;
    skipBtn.textContent="x10 \\u25B6\\u25B6";
  } else {
    speedMultiplier=1;
    skipBtn.textContent="Skip \\u00BB";
  }
};

function finish(){
  cursor.style.display="none";
  skipBtn.style.display="none";
  var last=lines[lines.length-1];
  if(last&&last.text.includes("VERDICT")){
    var s=last.text.includes("PASS")?"pass":last.text.includes("PARTIAL")?"partial":"fail";
    badge.className="badge badge-"+s;
    badge.textContent=s;
  }
  var cta=document.getElementById("cta");
  if(cta)setTimeout(function(){cta.classList.add("visible")},600);
}

function addLine(){
if(i>=lines.length){finish();return;}
var l=lines[i];
var div=document.createElement("div");
div.className="line";
div.style.color=l.color;
if(l.bold)div.style.fontWeight="700";
div.textContent=l.text||"\\u00A0";
content.insertBefore(div,cursor);
requestAnimationFrame(function(){div.classList.add("visible")});
content.scrollTop=content.scrollHeight;
i++;
var next=lines[i];
var d=next?(next.delay-l.delay):500;
timer=setTimeout(addLine,Math.max(d/speedMultiplier,15));
}
timer=setTimeout(addLine,500);
})();
</script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
