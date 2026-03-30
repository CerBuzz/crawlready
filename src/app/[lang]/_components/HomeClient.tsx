"use client";

import { useState } from "react";
import type { ScanResult, CheckResult } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/es";

/** Interpolate {key} placeholders in a translation string */
function t(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  );
}

function StatusIcon({ status }: { status: CheckResult["status"] }) {
  if (status === "pass")
    return <span className="text-success font-bold text-lg">&#10003;</span>;
  if (status === "partial")
    return <span className="text-warning font-bold text-lg">&#9679;</span>;
  return <span className="text-danger font-bold text-lg">&#10007;</span>;
}

function GradeRing({ grade, score, max }: { grade: string; score: number; max: number }) {
  const pct = (score / max) * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;
  const color =
    grade === "A" ? "#22c55e" :
    grade === "B" ? "#22d3ee" :
    grade === "C" ? "#eab308" :
    grade === "D" ? "#f97316" : "#ef4444";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#27272a" strokeWidth="8" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{grade}</span>
        <span className="text-sm text-zinc-400">{score}/{max}</span>
      </div>
    </div>
  );
}

function CheckCard({ check, dict }: { check: CheckResult; dict: Dictionary }) {
  const sr = dict.scannerResults;
  const details = check.detailKey && sr[check.detailKey]
    ? t(sr[check.detailKey], check.params)
    : check.details;
  const recommendation = check.recommendationKey && sr[check.recommendationKey]
    ? t(sr[check.recommendationKey], check.params)
    : check.recommendation;

  return (
    <div className="bg-surface rounded-lg p-4 border border-surface-light">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusIcon status={check.status} />
          <div>
            <h3 className="font-medium text-foreground">{check.name}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">{details}</p>
          </div>
        </div>
        <span className="text-sm font-mono text-zinc-500 shrink-0">{check.score}/{check.maxScore}</span>
      </div>
      {recommendation && (
        <div className="mt-3 pl-9 text-sm text-accent-dim bg-accent/5 rounded p-2.5 border border-accent/10">
          {recommendation}
        </div>
      )}
    </div>
  );
}

export default function HomeClient({ dict, lang }: { dict: Dictionary; lang: string }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  function isValidUrl(input: string): boolean {
    const trimmed = input.trim();
    // Must have at least one dot and no spaces
    return /^[^\s]+\.[^\s]+$/.test(trimmed) && trimmed.length >= 4;
  }

  const [urlError, setUrlError] = useState("");

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setUrlError(lang === "es"
        ? "Introduce una URL válida (ej. ejemplo.com)"
        : "Enter a valid URL (e.g. example.com)");
      return;
    }

    setLoading(true);
    setError("");
    setUrlError("");
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || dict.scanner.errorGeneric); return; }
      setResult(data);
    } catch {
      setError(dict.scanner.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  const gradeMessage = result
    ? result.grade === "A" ? dict.results.gradeA
    : result.grade === "B" ? dict.results.gradeB
    : result.grade === "C" ? dict.results.gradeC
    : dict.results.gradeDF
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-surface-light">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-lg">CrawlReady</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#scanner" className="hover:text-foreground transition-colors">{dict.nav.scanner}</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">{dict.nav.howItWorks}</a>
            <a href={`/${lang}/servicios`} className="hover:text-foreground transition-colors">{dict.nav.services}</a>
            <a href={dict.nav.langSwitchHref}
              className="px-2 py-1 rounded border border-surface-light hover:border-accent hover:text-accent transition-colors font-medium">
              {dict.nav.langSwitch}
            </a>
          </nav>
        </div>
      </header>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-scan-pulse" />
            {dict.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {dict.hero.headline1}{" "}
            <span className="text-accent">{dict.hero.headlineAccent}</span>
          </h1>
          <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto">{dict.hero.subheadline}</p>
        </div>
      </section>

      <section id="scanner" className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleScan} className="flex gap-3">
            <input type="text" value={url} onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
              placeholder={dict.scanner.placeholder}
              className="flex-1 px-4 py-3 rounded-lg bg-surface border border-surface-light text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              disabled={loading} />
            <button type="submit" disabled={loading || !url.trim()}
              className="px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {dict.scanner.buttonScanning}
                </span>
              ) : dict.scanner.buttonScan}
            </button>
          </form>
          {urlError && (
            <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">{urlError}</div>
          )}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
          )}
        </div>
      </section>

      {result && (
        <section className="px-6 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-xl border border-surface-light p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <GradeRing grade={result.grade} score={result.totalScore} max={result.maxPossibleScore} />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold">{dict.results.reportTitle}</h2>
                  <p className="text-sm text-zinc-400 mt-1 font-mono">{result.url}</p>
                  <p className="text-sm text-zinc-500 mt-2">{gradeMessage}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {result.checks.map((check) => <CheckCard key={check.name} check={check} dict={dict} />)}
            </div>
            <div className="mt-8 bg-accent/5 border border-accent/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold">{dict.results.ctaTitle}</h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">{dict.results.ctaBody}</p>
              <a href={`/${lang}/servicios`}
                className="inline-block mt-4 px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors">
                {dict.results.ctaButton}
              </a>
            </div>
          </div>
        </section>
      )}

      {!result && (
        <>
          <section id="how-it-works" className="px-6 py-20 border-t border-surface-light">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12">{dict.checks.sectionTitle}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dict.checks.items.map((item) => (
                  <div key={item.title} className="bg-surface rounded-lg p-5 border border-surface-light">
                    <h3 className="font-semibold text-accent mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="mt-auto border-t border-surface-light py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>{dict.footer.tagline}</span>
          <span>{dict.footer.email}</span>
        </div>
      </footer>
    </div>
  );
}
