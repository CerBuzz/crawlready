"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/es";

/** Interpolate {key} placeholders in a translation string */
function t(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  );
}

function HeroForm({ dict, lang }: { dict: Dictionary; lang: string }) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || !email.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), email: email.trim(), lang }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("sent");
    } catch {
      // Fallback: open mailto
      const subject = encodeURIComponent(
        lang === "es" ? "Test gratuito para mi web" : "Free test for my site"
      );
      const body = encodeURIComponent(
        `URL: ${url.trim()}\nEmail: ${email.trim()}`
      );
      window.open(`mailto:hello@crawlready.dev?subject=${subject}&body=${body}`, "_self");
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 p-6 rounded-xl bg-accent/10 border border-accent/20 text-center max-w-lg mx-auto">
        <p className="text-lg font-semibold text-accent">{dict.heroForm.successTitle}</p>
        <p className="text-sm text-zinc-400 mt-2">
          {t(dict.heroForm.successBody, { email })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto space-y-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={dict.heroForm.urlPlaceholder}
        required
        className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-light text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={dict.heroForm.emailPlaceholder}
        required
        className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-light text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
      />
      <button
        type="submit"
        disabled={status === "sending" || !url.trim() || !email.trim()}
        className="w-full px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "sending" ? dict.heroForm.sending : dict.heroForm.button}
      </button>
      {errorMsg && (
        <p className="text-sm text-danger text-center">{errorMsg}</p>
      )}
    </form>
  );
}

export default function HomeClient({ dict, lang }: { dict: Dictionary; lang: string }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-light">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-lg">CrawlReady</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">{dict.nav.howItWorks}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{dict.nav.pricing}</a>
            <a href={dict.nav.langSwitchHref}
              className="px-2 py-1 rounded border border-surface-light hover:border-accent hover:text-accent transition-colors font-medium">
              {dict.nav.langSwitch}
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
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
          <HeroForm dict={dict} lang={lang} />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">{dict.howItWorks.sectionTitle}</h2>
          <p className="text-zinc-400 text-center mb-12">{dict.howItWorks.sectionSubtitle}</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {dict.howItWorks.steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">{dict.pricing.sectionTitle}</h2>
          <p className="text-zinc-400 text-center mb-12">{dict.pricing.sectionSubtitle}</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="bg-surface rounded-xl border border-surface-light p-6 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                {dict.pricing.free.badge}
              </span>
              <h3 className="text-lg font-semibold mb-1">{dict.pricing.free.name}</h3>
              <p className="text-3xl font-bold text-accent mb-3">{dict.pricing.free.price}</p>
              <p className="text-sm text-zinc-400 mb-5">{dict.pricing.free.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {dict.pricing.free.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-accent mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#top"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="block text-center px-6 py-3 rounded-lg border border-accent text-accent font-semibold hover:bg-accent/10 transition-colors">
                {dict.pricing.free.cta}
              </a>
            </div>
            {/* Paid tier */}
            <div className="bg-surface rounded-xl border-2 border-accent p-6 flex flex-col relative">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                {dict.pricing.paid.badge}
              </span>
              <h3 className="text-lg font-semibold mb-1">{dict.pricing.paid.name}</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-accent">{dict.pricing.paid.price}</span>
                <span className="text-sm text-zinc-500">{dict.pricing.paid.priceNote}</span>
              </div>
              <p className="text-sm text-zinc-400 mb-5">{dict.pricing.paid.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {dict.pricing.paid.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-accent mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={`mailto:hello@crawlready.dev?subject=${encodeURIComponent(lang === "es" ? "Implementación completa" : "Full Implementation")}`}
                className="block text-center px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors">
                {dict.pricing.paid.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dogfooding */}
      <section className="px-6 py-16 border-t border-surface-light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{dict.dogfooding.title}</h2>
          <p className="text-zinc-400 text-lg">{dict.dogfooding.body}</p>
          {dict.dogfooding.highlight && (
            <p className="text-accent font-semibold mt-4">{dict.dogfooding.highlight}</p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{dict.finalCta.title}</h2>
          <p className="text-zinc-400 text-lg mb-6">{dict.finalCta.body}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-block px-8 py-4 rounded-lg bg-accent text-black font-semibold text-lg hover:bg-accent/90 transition-colors"
          >
            {dict.finalCta.button}
          </button>
          <p className="text-sm text-zinc-500 mt-4">{dict.finalCta.note}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-light py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>{dict.footer.tagline}</span>
          <span>{dict.footer.email}</span>
        </div>
      </footer>
    </div>
  );
}
