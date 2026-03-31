"use client";

import { useEffect, useRef, useState } from "react";
import type { ReportData, CheckResult } from "@/lib/types";
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

function AgenticTestSection({
  slug,
  companyName,
  isEs,
  hasAgentTest,
}: {
  slug: string;
  companyName: string;
  isEs: boolean;
  hasAgentTest: boolean;
}) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    trackEvent("cta_click", slug, { cta: "agentic_test_5eur" });
    setClicked(true);
  }

  // If we have real agent test data, show the terminal + link to animation
  if (hasAgentTest) {
    return (
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-surface-light" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              {isEs ? "Test agéntico" : "Agentic test"}
            </span>
            <div className="flex-1 h-px bg-surface-light" />
          </div>

          <div className="bg-surface rounded-xl border border-surface-light p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">
                {isEs
                  ? `¿Qué pasa cuando un agente IA intenta contratar a ${companyName}?`
                  : `What happens when an AI agent tries to hire ${companyName}?`}
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                {isEs
                  ? "Hemos simulado el proceso completo. Mira paso a paso lo que ocurre."
                  : "We simulated the full process. Watch step by step what happens."}
              </p>
            </div>

            <div className="text-center">
              <a
                href={`/reports/${slug}-agent-test.html`}
                target="_blank"
                onClick={() => trackEvent("cta_click", slug, { cta: "watch_agent_test" })}
                className="inline-block px-8 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors text-lg"
              >
                {isEs ? "Ver simulación del agente" : "Watch agent simulation"} &rarr;
              </a>
              <p className="text-xs text-zinc-500 mt-3">
                {isEs
                  ? "Animación interactiva — datos reales obtenidos por HTTP"
                  : "Interactive animation — real data obtained via HTTP"}
              </p>
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
        hasAgentTest={!!report.agentTest}
      />

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
