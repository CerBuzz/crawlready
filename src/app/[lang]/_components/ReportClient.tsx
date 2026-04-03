"use client";

import { useEffect, useRef, useState } from "react";
import type { ReportData, CheckResult, AgentStepResult, AgentTestResult, CompetitorData } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/es";
import { trackEvent } from "@/lib/tracker";

/* ── Helpers ─────────────────────────────────────────────── */

function t(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

function gradeColor(grade: string) {
  return grade === "A"
    ? "#22c55e"
    : grade === "B"
      ? "#22d3ee"
      : grade === "C"
        ? "#eab308"
        : grade === "D"
          ? "#f97316"
          : "#ef4444";
}

/* ── Sub-components ──────────────────────────────────────── */

function GradeRing({
  grade,
  score,
  max,
}: {
  grade: string;
  score: number;
  max: number;
}) {
  const pct = (score / max) * 100;
  const c = 2 * Math.PI * 54;
  const offset = c - (pct / 100) * c;
  const color = gradeColor(grade);
  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#27272a"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {grade}
        </span>
        <span className="text-sm text-zinc-400">
          {score}/{max}
        </span>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: CheckResult["status"] }) {
  if (status === "pass")
    return <span className="text-success font-bold text-lg">&#10003;</span>;
  if (status === "partial")
    return <span className="text-warning font-bold text-lg">&#9679;</span>;
  return <span className="text-danger font-bold text-lg">&#10007;</span>;
}

function CheckCard({
  check,
  dict,
}: {
  check: CheckResult;
  dict: Dictionary;
}) {
  const sr = dict.scannerResults;
  const details =
    check.detailKey && sr[check.detailKey]
      ? t(sr[check.detailKey], check.params)
      : check.details;
  const recommendation =
    check.recommendationKey && sr[check.recommendationKey]
      ? t(sr[check.recommendationKey], check.params)
      : check.recommendation;

  return (
    <div className="bg-surface rounded-lg p-5 border border-surface-light">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusIcon status={check.status} />
          <div>
            <h3 className="font-medium text-foreground">{check.name}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">{details}</p>
          </div>
        </div>
        <span className="text-sm font-mono text-zinc-500 shrink-0">
          {check.score}/{check.maxScore}
        </span>
      </div>
      {recommendation && (
        <div className="mt-3 pl-9 text-sm text-accent-dim bg-accent/5 rounded p-3 border border-accent/10">
          {recommendation}
        </div>
      )}
    </div>
  );
}

/* ── Agentic Test Section ───────────────────────────────── */

// Map step.step IDs to detail key prefixes for deriving keys from old data
const STEP_DETAIL_PREFIX: Record<string, string> = {
  discovery: "discovery",
  navigation: "navigation",
  comprehension: "comprehension",
  contact: "contact",
  form_operability: "formOp",
  structured_data: "structuredData",
};

// Map English substep labels to i18n keys for old data without labelKey
const SUBSTEP_LABEL_MAP: Record<string, string> = {
  "Page title": "substep.pageTitle",
  "Headings": "substep.headings",
  "Readable content": "substep.readableContent",
  "Links found": "substep.linksFound",
  "Email addresses": "substep.emailAddresses",
  "Phone numbers": "substep.phoneNumbers",
  "WhatsApp": "substep.whatsapp",
  "Contact forms": "substep.contactForms",
  "Chat widgets": "substep.chatWidgets",
  "JSON-LD blocks": "substep.jsonLdBlocks",
  "Business name": "substep.businessName",
  "Services/offers": "substep.servicesOffers",
  "Pricing info": "substep.pricingInfo",
  "Contact info": "substep.contactInfo",
};

// Map English substep details to i18n keys for old data without detailKey
const SUBSTEP_DETAIL_MAP: Record<string, string> = {
  "None found in HTML": "substep.emailNone",
  "None found": "substep.phoneNone",
  "Not detected": "substep.whatsappNone",
  "WhatsApp link detected": "substep.whatsappFound",
  "No forms found in HTML": "substep.formsNone",
  "No title found": "substep.noTitle",
  "No headings found": "substep.noHeadings",
  "Found": "substep.fieldFound",
  "Missing": "substep.fieldMissing",
  "No submit button found": "substep.formNoSubmit",
  "CAPTCHA blocks automated submission": "substep.formCaptcha",
  "No action attribute (may be JS-only)": "substep.formNoAction",
  "No visible fields in HTML": "substep.formNoFields",
  "Could not load": "substep.pageLoadFailed",
};

function useStepTranslation(step: AgentStepResult, dict: Dictionary) {
  const at = dict.agentTest;
  const stepName = at[`step.${step.step}`] || step.step;

  const prefix = STEP_DETAIL_PREFIX[step.step];
  const derivedDetailKey = prefix ? `${prefix}.${step.status}` : undefined;
  const effectiveDetailKey = step.detailKey || derivedDetailKey;
  const details = effectiveDetailKey && at[effectiveDetailKey]
    ? t(at[effectiveDetailKey], step.params)
    : step.details;

  const derivedRecKey = prefix && step.status !== "pass" ? `rec.${prefix}.${step.status}` : undefined;
  const effectiveRecKey = step.recommendationKey || derivedRecKey;
  const recommendation = effectiveRecKey && at[effectiveRecKey]
    ? t(at[effectiveRecKey], step.params)
    : undefined;

  return { stepName, details, recommendation };
}

function AgentStepRow({
  step,
  dict,
  isExpanded,
  onToggle,
}: {
  step: AgentStepResult;
  dict: Dictionary;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const at = dict.agentTest;
  const { stepName, details, recommendation } = useStepTranslation(step, dict);
  const hasDetail = (step.substeps && step.substeps.length > 0) || recommendation;

  return (
    <div>
      {/* Summary row — always visible */}
      <button
        type="button"
        onClick={hasDetail ? onToggle : undefined}
        className={`w-full flex items-center gap-3 text-sm py-3 px-1 text-left ${hasDetail ? "cursor-pointer hover:bg-white/[0.02] rounded transition-colors" : "cursor-default"}`}
      >
        <StatusIcon status={step.status} />
        <span className="text-zinc-200 font-medium shrink-0">{stepName}</span>
        <span className="text-zinc-500 flex-1 truncate">{details}</span>
        {hasDetail && (
          <span className={`text-zinc-600 text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            &#9660;
          </span>
        )}
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="pl-9 pb-4 space-y-3">
          {/* Full detail text */}
          <p className="text-sm text-zinc-400">{details}</p>

          {/* Substeps */}
          {step.substeps && step.substeps.length > 0 && (
            <div className="space-y-1.5">
              {step.substeps.map((sub, i) => {
                const derivedLabelKey = SUBSTEP_LABEL_MAP[sub.label];
                const effectiveLabelKey = sub.labelKey || derivedLabelKey;
                const subLabel = effectiveLabelKey && at[effectiveLabelKey]
                  ? at[effectiveLabelKey]
                  : sub.label;

                const derivedSubDetailKey = sub.detail ? SUBSTEP_DETAIL_MAP[sub.detail] : undefined;
                const effectiveSubDetailKey = sub.detailKey || derivedSubDetailKey;
                const subDetail = effectiveSubDetailKey && at[effectiveSubDetailKey]
                  ? t(at[effectiveSubDetailKey], sub.params)
                  : sub.detail;

                return (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="shrink-0 mt-0.5">
                      {sub.status === "pass" ? (
                        <span className="text-success text-xs">&#10003;</span>
                      ) : sub.status === "partial" ? (
                        <span className="text-warning text-xs">&#9679;</span>
                      ) : (
                        <span className="text-danger text-xs">&#10007;</span>
                      )}
                    </span>
                    <span className="text-zinc-400">
                      <span className="text-zinc-300">{subLabel}</span>
                      {subDetail && (
                        <span className="text-zinc-500 ml-1.5">— {subDetail}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div className="text-sm text-accent-dim bg-accent/5 rounded p-3 border border-accent/10">
              {recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgenticTestSection({
  slug,
  companyName,
  isEs,
  agentTest,
  dict,
}: {
  slug: string;
  companyName: string;
  isEs: boolean;
  agentTest?: AgentTestResult;
  dict: Dictionary;
}) {
  const [clicked, setClicked] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  function handleClick() {
    trackEvent("cta_click", slug, { cta: "agentic_test_5eur" });
    setClicked(true);
  }

  const at = dict.agentTest;

  if (agentTest) {
    const testSteps = agentTest.steps.filter((s) => s.step !== "verdict");
    const passed = testSteps.filter((s) => s.status === "pass").length;
    const partial = testSteps.filter((s) => s.status === "partial").length;
    const failed = testSteps.filter((s) => s.status === "fail").length;

    return (
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-surface-light" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              {at.sectionLabel}
            </span>
            <div className="flex-1 h-px bg-surface-light" />
          </div>

          <div className="bg-surface rounded-xl border border-surface-light p-8">
            {/* Title + subtitle */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">
                {t(at.title, { company: companyName })}
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                {at.subtitle}
              </p>
            </div>

            {/* Verdict banner */}
            {(() => {
              const verdict = agentTest.verdict;
              const verdictLabel = at[`verdict.${verdict}`] || verdict;
              const verdictDetail = at[`verdict.${verdict}.detail`] || "";
              const verdictColor = verdict === "pass" ? "#22c55e" : verdict === "partial" ? "#f97316" : "#ef4444";
              const verdictBg = verdict === "pass" ? "rgba(34,197,94,0.08)" : verdict === "partial" ? "rgba(249,115,22,0.08)" : "rgba(239,68,68,0.08)";
              const verdictBorder = verdict === "pass" ? "rgba(34,197,94,0.25)" : verdict === "partial" ? "rgba(249,115,22,0.25)" : "rgba(239,68,68,0.25)";
              const verdictIcon = verdict === "pass" ? "\u2713" : verdict === "partial" ? "\u26A0" : "\u2717";
              return (
                <div
                  className="rounded-lg px-5 py-4 mt-2 mb-4 flex items-start gap-3"
                  style={{ background: verdictBg, border: `1px solid ${verdictBorder}` }}
                >
                  <span className="text-2xl leading-none mt-0.5" style={{ color: verdictColor }}>{verdictIcon}</span>
                  <div>
                    <p className="font-semibold text-base" style={{ color: verdictColor }}>{verdictLabel}</p>
                    {verdictDetail && <p className="text-sm text-zinc-400 mt-1">{verdictDetail}</p>}
                  </div>
                </div>
              );
            })()}

            {/* Summary counters */}
            <div className="grid grid-cols-3 gap-4 text-center pt-4 pb-4 border-t border-b border-surface-light mb-4">
              <div>
                <p className="text-2xl font-bold text-success">{passed}</p>
                <p className="text-xs text-zinc-500 mt-1">{at.passed}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{partial}</p>
                <p className="text-xs text-zinc-500 mt-1">{at.partial}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger">{failed}</p>
                <p className="text-xs text-zinc-500 mt-1">{at.failed}</p>
              </div>
            </div>

            {/* Comprehension narrative block */}
            {agentTest.comprehension && agentTest.comprehension.services.length > 0 && (
              <div className="rounded-lg px-5 py-4 mb-4 bg-accent/5 border border-accent/15">
                <p className="text-sm font-medium text-accent mb-2">
                  {isEs
                    ? `El agente entendió que ${companyName}...`
                    : `The agent understood that ${companyName}...`}
                </p>
                <p className="text-sm text-zinc-300">{agentTest.comprehension.description}</p>
                {agentTest.comprehension.headingSample.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {agentTest.comprehension.headingSample.slice(0, 4).map((h, i) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-zinc-400">
                        &ldquo;{h}&rdquo;
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {agentTest.comprehension && agentTest.comprehension.services.length === 0 && (
              <div className="rounded-lg px-5 py-4 mb-4 bg-danger/5 border border-danger/15">
                <p className="text-sm font-medium text-danger mb-1">
                  {isEs
                    ? `El agente no pudo entender a qué se dedica ${companyName}`
                    : `The agent could not understand what ${companyName} does`}
                </p>
                <p className="text-xs text-zinc-400">
                  {isEs
                    ? "El contenido visible no contiene información suficiente sobre los servicios, sector o público objetivo."
                    : "The visible content does not contain enough information about services, industry, or target audience."}
                </p>
              </div>
            )}

            {/* Step rows (accordion) */}
            <div className="divide-y divide-surface-light">
              {testSteps.map((step) => (
                <AgentStepRow
                  key={step.step}
                  step={step}
                  dict={dict}
                  isExpanded={expandedStep === step.step}
                  onToggle={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                />
              ))}
            </div>

          </div>
        </div>
      </section>
    );
  }

  // No agent test data — show upsell
  const steps = isEs
    ? [
        "Un agente de IA busca tu negocio como lo haría un cliente real",
        "Intenta completar una gestión: pedir cita, solicitar presupuesto, comprar...",
        "Documentamos cada paso: qué funciona, qué falla, qué es invisible",
        "Recibes un informe visual con capturas y recomendaciones concretas",
      ]
    : [
        "An AI agent searches for your business like a real customer would",
        "It tries to complete a task: book an appointment, request a quote, buy...",
        "We document every step: what works, what fails, what's invisible",
        "You receive a visual report with screenshots and concrete recommendations",
      ];

  return (
    <section className="px-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-surface-light" />
          <span className="text-xs text-zinc-500 uppercase tracking-widest">
            {isEs ? "Siguiente nivel" : "Next level"}
          </span>
          <div className="flex-1 h-px bg-surface-light" />
        </div>

        <div className="bg-surface rounded-xl border border-surface-light p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEs
                ? "Ya conoces tu nota técnica. Pero la pregunta real es otra."
                : "You know your technical score. But the real question is different."}
            </h2>
            <p className="text-lg text-accent font-medium mt-3">
              {isEs
                ? `¿Qué pasa cuando un cliente le pide a ChatGPT que contrate a ${companyName}?`
                : `What happens when a customer asks ChatGPT to hire ${companyName}?`}
            </p>
          </div>

          <div className="space-y-3 mb-8 max-w-xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-zinc-300">{step}</p>
              </div>
            ))}
          </div>

          {!clicked ? (
            <div className="text-center">
              <button
                onClick={handleClick}
                className="px-8 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors text-lg"
              >
                {isEs
                  ? "Solicitar test agéntico — €5"
                  : "Request agentic test — €5"}
              </button>
              <p className="text-xs text-zinc-500 mt-3">
                {isEs
                  ? "Entrega en 24-48 horas. Informe visual personalizado."
                  : "Delivered in 24-48 hours. Personalized visual report."}
              </p>
            </div>
          ) : (
            <div className="text-center bg-accent/5 border border-accent/20 rounded-lg p-6">
              <p className="text-accent font-semibold">
                {isEs ? "Recibido" : "Received"}
              </p>
              <p className="text-sm text-zinc-300 mt-2">
                {isEs
                  ? `Te contactaremos en hello@crawlready.dev en las próximas 24 horas para realizar el test agéntico de ${companyName}.`
                  : `We'll contact you at hello@crawlready.dev within 24 hours to run the agentic test for ${companyName}.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Competitor Comparison Section ───────────────────────── */

const STATUS_RANK: Record<string, number> = { pass: 2, partial: 1, fail: 0 };

function ComparisonSectionFull({
  companyName,
  targetTest,
  competitor,
  dict,
  isEs,
}: {
  companyName: string;
  targetTest: AgentTestResult;
  competitor: CompetitorData;
  dict: Dictionary;
  isEs: boolean;
}) {
  const at = dict.agentTest;
  const targetSteps = targetTest.steps.filter(s => s.step !== "verdict");
  const competitorSteps = competitor.agentTest.steps.filter(s => s.step !== "verdict");

  // Build step-by-step comparison
  const rows = targetSteps.map(tStep => {
    const cStep = competitorSteps.find(c => c.step === tStep.step);
    const tRank = STATUS_RANK[tStep.status] ?? 0;
    const cRank = cStep ? (STATUS_RANK[cStep.status] ?? 0) : 0;
    const winner: "target" | "competitor" | "tie" =
      tRank > cRank ? "target" : cRank > tRank ? "competitor" : "tie";
    return { step: tStep.step, target: tStep, competitor: cStep, winner };
  });

  const total = rows.length;
  const targetWins = rows.filter(r => r.winner === "target").length;
  const competitorWins = rows.filter(r => r.winner === "competitor").length;
  const ties = rows.filter(r => r.winner === "tie").length;

  return (
    <section className="px-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-surface-light" />
          <span className="text-xs text-zinc-500 uppercase tracking-widest">
            {at["comparison.targetLabel"]} vs {at["comparison.competitorLabel"]}
          </span>
          <div className="flex-1 h-px bg-surface-light" />
        </div>

        <div className="bg-surface rounded-xl border border-surface-light p-8">
          {/* Title + narrative intro */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">
              {t(at["comparison.title"], { target: companyName, competitor: competitor.companyName })}
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              {at["comparison.subtitle"]}
            </p>
          </div>

          {/* Narrative connection from comprehension */}
          {targetTest.comprehension && targetTest.comprehension.services.length > 0 && (
            <div className="rounded-lg px-5 py-4 mb-6 bg-white/[0.02] border border-surface-light text-sm text-zinc-400">
              <p>
                {isEs
                  ? <>Dado que {companyName} se dedica a <span className="text-zinc-200">{targetTest.comprehension.services.join(", ")}</span>, el agente identifica a <span className="text-zinc-200">{competitor.companyName}</span> como competidor directo en el mismo sector.</>
                  : <>Since {companyName} offers <span className="text-zinc-200">{targetTest.comprehension.services.join(", ")}</span>, the agent identifies <span className="text-zinc-200">{competitor.companyName}</span> as a direct competitor in the same sector.</>
                }
              </p>
            </div>
          )}

          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4 text-center pt-4 pb-4 border-t border-b border-surface-light mb-6">
            <div>
              <p className="text-2xl font-bold text-success">{targetWins}</p>
              <p className="text-xs text-zinc-500 mt-1">{companyName}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-500">{ties}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {at["comparison.verdictEqual"]?.replace("Ambas webs tienen un rendimiento similar.", "Empate") || "Tie"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-danger">{competitorWins}</p>
              <p className="text-xs text-zinc-500 mt-1">{competitor.companyName}</p>
            </div>
          </div>

          {/* Step-by-step comparison rows */}
          <div className="space-y-3">
            {rows.map(row => {
              const stepName = at[`step.${row.step}`] || row.step;
              return (
                <div key={row.step} className="rounded-lg border border-surface-light overflow-hidden">
                  {/* Step header */}
                  <div className="px-4 py-2 bg-white/[0.02] border-b border-surface-light">
                    <span className="text-sm font-medium text-zinc-300">{stepName}</span>
                  </div>
                  {/* Two columns */}
                  <div className="grid grid-cols-2 divide-x divide-surface-light">
                    {/* Target */}
                    <div className={`px-4 py-3 ${row.winner === "target" ? "bg-success/5" : ""}`}>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={row.target.status} />
                        <span className="text-xs text-zinc-500 truncate">{companyName}</span>
                      </div>
                    </div>
                    {/* Competitor */}
                    <div className={`px-4 py-3 ${row.winner === "competitor" ? "bg-danger/5" : ""}`}>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={row.competitor?.status ?? "fail"} />
                        <span className="text-xs text-zinc-500 truncate">{competitor.companyName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning box — only if competitor wins any */}
          {competitorWins > 0 && (
            <div className="mt-6 rounded-lg px-5 py-4 bg-danger/5 border border-danger/20">
              <p className="font-semibold text-danger text-sm">{at["comparison.warningTitle"]}</p>
              <p className="text-sm text-zinc-400 mt-1">{at["comparison.warningBody"]}</p>
            </div>
          )}

          {/* Summary sentence */}
          <div className="mt-6 text-center text-sm text-zinc-400">
            {targetWins > competitorWins
              ? t(at["comparison.summaryWinning"], { target: companyName, count: targetWins, total })
              : competitorWins > targetWins
                ? t(at["comparison.summaryLosing"], { competitor: competitor.companyName, count: competitorWins, total })
                : t(at["comparison.summaryTied"], { count: ties, total })
            }
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export default function ReportClient({
  report,
  dict,
  lang,
}: {
  report: ReportData;
  dict: Dictionary;
  lang: string;
}) {
  const { slug, companyName, scanResult: r } = report;
  const isEs = lang === "es";
  const startTime = useRef(Date.now());

  // ── Tracking: pageview, scroll depth, time on page ─────
  useEffect(() => {
    trackEvent("pageview", slug);

    // Scroll depth tracking
    const milestones = [25, 50, 75, 100];
    const reached = new Set<number>();

    function onScroll() {
      const scrollPct = Math.round(
        ((window.scrollY + window.innerHeight) /
          document.documentElement.scrollHeight) *
          100,
      );
      for (const m of milestones) {
        if (scrollPct >= m && !reached.has(m)) {
          reached.add(m);
          trackEvent("scroll", slug, { depth: m });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // fire once in case the page is short enough to be 100% visible
    onScroll();

    // Time on page — send every 30 s
    const timer = setInterval(() => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      trackEvent("time_on_page", slug, { seconds });
    }, 30_000);

    // On leave — send final time
    function onLeave() {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      trackEvent("page_leave", slug, { seconds });
    }
    window.addEventListener("beforeunload", onLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onLeave);
      clearInterval(timer);
    };
  }, [slug]);

  // ── Grade message ──
  const gradeMsg =
    r.grade === "A"
      ? dict.results.gradeA
      : r.grade === "B"
        ? dict.results.gradeB
        : r.grade === "C"
          ? dict.results.gradeC
          : dict.results.gradeDF;

  // ── Date formatting ──
  const date = new Date(r.scannedAt).toLocaleDateString(
    isEs ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  // ── Final CTA mailto ──
  const finalSubject = encodeURIComponent(
    isEs
      ? `Re: Informe de visibilidad IA — ${companyName}`
      : `Re: AI Visibility Report — ${companyName}`,
  );
  const finalBody = encodeURIComponent(
    isEs
      ? `Hola,\n\nHe revisado el informe de ${companyName} y me gustaría saber más sobre cómo mejorar nuestra visibilidad IA.\n\n¿Cuáles son las opciones?`
      : `Hi,\n\nI reviewed the report for ${companyName} and I'd like to learn more about improving our AI visibility.\n\nWhat are the options?`,
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header — minimal, report-focused */}
      <header className="border-b border-surface-light">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-lg">CrawlReady</span>
          </a>
          <span className="text-sm text-zinc-500">{date}</span>
        </div>
      </header>

      {/* Hero — grade + company */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface rounded-xl border border-surface-light p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <GradeRing
                grade={r.grade}
                score={r.totalScore}
                max={r.maxPossibleScore}
              />
              <div className="text-center sm:text-left">
                <p className="text-sm text-accent font-medium mb-1">
                  {isEs
                    ? "Informe de visibilidad IA"
                    : "AI Visibility Report"}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {companyName}
                </h1>
                <p className="text-sm text-zinc-500 mt-1 font-mono">{r.url}</p>
                <p className="text-sm text-zinc-400 mt-3 max-w-md">
                  {gradeMsg}
                </p>
              </div>
            </div>

            {/* Summary counts */}
            <div className="grid grid-cols-3 gap-4 text-center mt-6 pt-6 border-t border-surface-light">
              {[
                {
                  label: isEs ? "Aprobados" : "Passed",
                  count: r.checks.filter((c) => c.status === "pass").length,
                  color: "text-success",
                },
                {
                  label: isEs ? "Parciales" : "Partial",
                  count: r.checks.filter((c) => c.status === "partial").length,
                  color: "text-warning",
                },
                {
                  label: isEs ? "Fallidos" : "Failed",
                  count: r.checks.filter((c) => c.status === "fail").length,
                  color: "text-danger",
                },
              ].map((s) => (
                <div key={s.label}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                  <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Checks — each one with optional inline CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold mb-6">
            {isEs ? "Resultados del análisis" : "Analysis Results"}
          </h2>

          {r.checks.map((check) => (
            <CheckCard key={check.name} check={check} dict={dict} />
          ))}
        </div>
      </section>

      {/* ── Agentic Test ────────────────────────────────── */}
      <AgenticTestSection
        slug={slug}
        companyName={companyName}
        isEs={isEs}
        agentTest={report.agentTest}
        dict={dict}
      />

      {/* ── Competitor Comparison ────────────────────────── */}
      {report.competitor && report.agentTest && (
        <ComparisonSectionFull
          companyName={companyName}
          targetTest={report.agentTest}
          competitor={report.competitor}
          dict={dict}
          isEs={isEs}
        />
      )}

      {/* Final CTA — "Hablamos" */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold">
              {isEs ? "¿Hablamos?" : "Let's talk?"}
            </h2>
            <p className="text-sm text-zinc-400 mt-3 max-w-lg mx-auto">
              {isEs
                ? "Podemos solucionar todos estos problemas. Proceso 100% digital: te explicamos qué hay que hacer, te damos el código listo, o lo implementamos nosotros. Sin llamadas, sin reuniones."
                : "We can fix all these issues. 100% digital process: we explain what needs to be done, give you ready-to-use code, or implement it ourselves. No calls, no meetings."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href={`mailto:hello@crawlready.dev?subject=${finalSubject}&body=${finalBody}`}
                onClick={() =>
                  trackEvent("cta_click", slug, { cta: "final_hablamos" })
                }
                className="px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors"
              >
                {isEs ? "Responder por email" : "Reply by email"}
              </a>
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              {isEs
                ? "O escríbenos directamente: hello@crawlready.dev"
                : "Or write directly: hello@crawlready.dev"}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-light py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>{dict.footer.tagline}</span>
          <span>{dict.footer.email}</span>
        </div>
      </footer>
    </div>
  );
}
