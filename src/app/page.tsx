"use client";

import { useState } from "react";
import type { ScanResult, CheckResult } from "@/lib/types";

function StatusIcon({ status }: { status: CheckResult["status"] }) {
  if (status === "pass")
    return <span className="text-success font-bold text-lg">&#10003;</span>;
  if (status === "partial")
    return <span className="text-warning font-bold text-lg">&#9679;</span>;
  return <span className="text-danger font-bold text-lg">&#10007;</span>;
}

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
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;
  const color =
    grade === "A"
      ? "#22c55e"
      : grade === "B"
        ? "#22d3ee"
        : grade === "C"
          ? "#eab308"
          : grade === "D"
            ? "#f97316"
            : "#ef4444";

  return (
    <div className="relative w-36 h-36">
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
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {grade}
        </span>
        <span className="text-sm text-zinc-400">
          {score}/{max}
        </span>
      </div>
    </div>
  );
}

function CheckCard({ check }: { check: CheckResult }) {
  return (
    <div className="bg-surface rounded-lg p-4 border border-surface-light">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusIcon status={check.status} />
          <div>
            <h3 className="font-medium text-foreground">{check.name}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">{check.details}</p>
          </div>
        </div>
        <span className="text-sm font-mono text-zinc-500 shrink-0">
          {check.score}/{check.maxScore}
        </span>
      </div>
      {check.recommendation && (
        <div className="mt-3 pl-9 text-sm text-accent-dim bg-accent/5 rounded p-2.5 border border-accent/10">
          {check.recommendation}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-light">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-lg">CrawlReady</span>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm text-zinc-400">
            <a href="#scanner" className="hover:text-foreground transition-colors">
              Scanner
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/servicios" className="hover:text-foreground transition-colors">
              Servicios
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-scan-pulse" />
            AI Search is replacing Google. Is your site ready?
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Is your website visible to{" "}
            <span className="text-accent">AI agents</span>?
          </h1>
          <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto">
            93% of AI search sessions end without visiting a website. If AI
            agents can&apos;t read your site, your business is invisible.
            Check your AI readiness score in 30 seconds.
          </p>
        </div>
      </section>

      {/* Scanner */}
      <section id="scanner" className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleScan} className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your website URL (e.g. example.com)"
              className="flex-1 px-4 py-3 rounded-lg bg-surface border border-surface-light text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Scanning...
                </span>
              ) : (
                "Scan"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="px-6 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-xl border border-surface-light p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <GradeRing
                  grade={result.grade}
                  score={result.totalScore}
                  max={result.maxPossibleScore}
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold">
                    AI Readiness Report
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1 font-mono">
                    {result.url}
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    {result.grade === "A"
                      ? "Excellent! Your site is well-optimized for AI agents."
                      : result.grade === "B"
                        ? "Good foundation, but there's room to improve AI visibility."
                        : result.grade === "C"
                          ? "Your site needs work to be visible to AI agents."
                          : "Your site is largely invisible to AI agents. Significant improvements needed."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {result.checks.map((check) => (
                <CheckCard key={check.name} check={check} />
              ))}
            </div>

            {/* CTA */}
            {result.grade !== "A" && (
              <div className="mt-8 bg-accent/5 border border-accent/20 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold">
                  Want to fix these issues?
                </h3>
                <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
                  CrawlReady can optimize your website for AI agents — from
                  implementing llms.txt to full modernization. Our AI-native
                  process means faster delivery at a fraction of traditional
                  agency costs.
                </p>
                <a
                  href="/servicios"
                  className="inline-block mt-4 px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors"
                >
                  Ver cómo solucionarlo
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      {!result && (
        <>
          <section id="how-it-works" className="px-6 py-20 border-t border-surface-light">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12">
                What We Check
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "llms.txt",
                    desc: "The new standard for telling AI agents what your site is about. Like robots.txt, but for LLMs.",
                  },
                  {
                    title: "AI Crawler Access",
                    desc: "Is your robots.txt blocking GPTBot, ClaudeBot, or PerplexityBot from reading your content?",
                  },
                  {
                    title: "Structured Data",
                    desc: "JSON-LD and schema markup that helps AI agents understand your business, products, and content.",
                  },
                  {
                    title: "Meta Tags & OG",
                    desc: "Title, description, and Open Graph tags that AI uses to summarize and cite your pages.",
                  },
                  {
                    title: "Sitemap",
                    desc: "An XML sitemap helps AI crawlers discover all your important pages efficiently.",
                  },
                  {
                    title: "Speed & Security",
                    desc: "HTTPS and fast response times are baseline requirements for AI agent compatibility.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-surface rounded-lg p-5 border border-surface-light"
                  >
                    <h3 className="font-semibold text-accent mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="px-6 py-20 border-t border-surface-light">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-4">
                AI-Ready in Days, Not Months
              </h2>
              <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
                We&apos;re an AI-native agency. Our agents do the work, so you
                get agency-quality results at a fraction of the cost and time.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Starter",
                    price: "€497",
                    period: "one-time",
                    features: [
                      "Full AI readiness audit",
                      "Detailed report with fixes",
                      "llms.txt implementation",
                      "Structured data review",
                      "Priority recommendations",
                    ],
                  },
                  {
                    name: "Growth",
                    price: "€897",
                    period: "/month",
                    features: [
                      "Everything in Starter",
                      "Schema markup implementation",
                      "AI visibility monitoring",
                      "Monthly optimization",
                      "3-month commitment",
                    ],
                    highlight: true,
                  },
                  {
                    name: "Full Modernization",
                    price: "€2,497",
                    period: "/month",
                    features: [
                      "Everything in Growth",
                      "Complete website redesign",
                      "Agent-optimized architecture",
                      "Agentic commerce ready",
                      "Dedicated AI team",
                    ],
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl p-6 border ${
                      plan.highlight
                        ? "bg-accent/5 border-accent/30"
                        : "bg-surface border-surface-light"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mt-1">{plan.name}</h3>
                    <div className="mt-3 mb-5">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-zinc-500 text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-zinc-300"
                        >
                          <span className="text-accent mt-0.5">&#10003;</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:hello@crawlready.io"
                      className={`block mt-6 text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        plan.highlight
                          ? "bg-accent text-black hover:bg-accent/90"
                          : "bg-surface-light text-foreground hover:bg-zinc-700"
                      }`}
                    >
                      Get Started
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-light py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>CrawlReady — AI Readiness Agency</span>
          <span>hello@crawlready.io</span>
        </div>
      </footer>
    </div>
  );
}
