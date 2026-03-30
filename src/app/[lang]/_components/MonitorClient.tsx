"use client";

import type { Dictionary } from "@/lib/i18n/es";

const iconMap: Record<string, string> = {
  search: "🔍",
  eye: "👁",
  zap: "⚡",
  users: "👥",
  trending: "📈",
  alert: "🔔",
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

function gradeColor(grade: string) {
  if (grade === "A") return "text-emerald-400";
  if (grade === "B") return "text-blue-400";
  if (grade === "C") return "text-amber-400";
  return "text-red-400";
}

export default function MonitorClient({ dict, lang }: { dict: Dictionary; lang: string }) {
  const d = dict.monitorPage;

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
            <a href={`/${lang}#scanner`} className="hover:text-foreground transition-colors">{dict.nav.scanner}</a>
            <a href={`/${lang}/servicios`} className="hover:text-foreground transition-colors">{dict.nav.services}</a>
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
            {d.heroBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {d.heroH1pre}
            <span className="text-accent">{d.heroAccent1}</span>
            {d.heroH1mid}
            <span className="text-accent">{d.heroAccent2}</span>
          </h1>
          <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto">{d.heroSubtitle}</p>
        </div>
      </section>

      {/* Why multiple models */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">{d.whyTitle}</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">{d.whySubtitle}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {d.models.map((model) => {
              const c = colorMap[model.color] || colorMap.blue;
              return (
                <div key={model.name} className={`rounded-xl p-6 border ${c.bg} ${c.border}`}>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className={`text-3xl font-bold ${c.text}`}>{model.share}</span>
                    <span className="text-sm text-zinc-400">{model.shareLabel}</span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${c.text}`}>{model.name}</h3>
                  <p className="text-sm text-zinc-400">{model.profile}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">{d.howTitle}</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">{d.howSubtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.deliverables.map((item) => (
              <div key={item.title} className="bg-surface rounded-xl border border-surface-light p-5">
                <span className="text-2xl mb-3 block">{iconMap[item.icon] || "•"}</span>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample report table */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">{d.sampleTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-light">
                  <th className="text-left py-3 px-4 text-zinc-500 font-medium"></th>
                  <th className="py-3 px-4 text-zinc-500 font-medium">ChatGPT</th>
                  <th className="py-3 px-4 text-zinc-500 font-medium">Claude</th>
                  <th className="py-3 px-4 text-zinc-500 font-medium">Perplexity</th>
                  <th className="py-3 px-4 text-zinc-500 font-medium">Gemini</th>
                </tr>
              </thead>
              <tbody>
                {d.sampleMonths.map((row) => (
                  <tr key={row.month} className="border-b border-surface-light/50">
                    <td className="py-4 px-4 font-semibold">{row.month}</td>
                    {[row.chatgpt, row.claude, row.perplexity, row.gemini].map((cell, i) => (
                      <td key={i} className="py-4 px-4 text-center">
                        <div className={`text-xs mb-1 ${cell.found ? "text-emerald-400" : "text-red-400"}`}>
                          {cell.found ? `#${cell.position}` : "—"}
                        </div>
                        <div className="flex justify-center gap-1.5">
                          <span className={`text-xs font-mono ${gradeColor(cell.readable)}`}>
                            L:{cell.readable}
                          </span>
                          <span className={`text-xs font-mono ${gradeColor(cell.operable)}`}>
                            O:{cell.operable}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center">
            L = Legibilidad · O = Operabilidad · # = Posición en búsqueda ciega · — = No encontrado
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">{d.pricingTitle}</h2>
          <div className="bg-accent/5 border border-accent/30 rounded-xl p-8">
            <div className="text-center mb-6">
              <span className="text-5xl font-bold">{d.pricingPrice}</span>
              <span className="text-zinc-400 text-lg ml-1">{d.pricingPeriod}</span>
              <p className="text-sm text-zinc-400 mt-2">{d.pricingDesc}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {d.pricingFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="text-accent mt-0.5">&#10003;</span>{f}
                </li>
              ))}
            </ul>
            <a href={d.pricingCtaHref}
              className="block text-center py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors">
              {d.pricingCta}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">{d.faqTitle}</h2>
          <div className="space-y-6">
            {d.faq.map((item) => (
              <div key={item.q} className="bg-surface rounded-lg p-5 border border-surface-light">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{d.finalCtaTitle}</h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">{d.finalCtaBody}</p>
          <a href={d.finalCtaHref}
            className="inline-block px-8 py-3.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors text-lg">
            {d.finalCtaButton}
          </a>
          <p className="mt-4 text-sm text-zinc-500">{d.finalCtaNote}</p>
        </div>
      </section>

      <footer className="mt-auto border-t border-surface-light py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>{dict.footer.tagline}</span>
          <span>{dict.footer.email}</span>
        </div>
      </footer>
    </div>
  );
}
