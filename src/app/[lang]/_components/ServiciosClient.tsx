"use client";

import type { Dictionary } from "@/lib/i18n/es";

export default function ServiciosClient({ dict, lang }: { dict: Dictionary; lang: string }) {
  const d = dict.serviciosPage;

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
            <a href={`/${lang}/servicios`} className="text-foreground font-medium">{dict.nav.services}</a>
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

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">{d.howTitle}</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">{d.howSubtitle}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {d.steps.map((item) => (
              <div key={item.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/15 text-accent font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">{d.pricingTitle}</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">{d.pricingSubtitle}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {d.plans.map((plan) => (
              <div key={plan.name}
                className={`rounded-xl p-6 border flex flex-col ${
                  plan.highlight ? "bg-accent/5 border-accent/30" : "bg-surface border-surface-light"
                }`}>
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  plan.highlight ? "text-accent" : "text-zinc-500"
                }`}>{plan.badge}</span>
                <h3 className="text-lg font-semibold mt-1">{plan.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.priceNote && <span className="text-zinc-500 text-sm ml-1">{plan.priceNote}</span>}
                </div>
                <p className="text-sm text-zinc-400 mb-5">{plan.desc}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="text-accent mt-0.5">&#10003;</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={plan.ctaHref}
                  className={`block mt-auto text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    plan.highlight ? "bg-accent text-black hover:bg-accent/90" : "bg-surface-light text-foreground hover:bg-zinc-700"
                  }`}>{plan.cta}</a>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-surface rounded-xl border border-surface-light p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">{d.monitorTitle}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{d.monitorBadge}</span>
                </div>
                <p className="text-sm text-zinc-400 max-w-lg">{d.monitorDesc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold">{d.monitorPrice}</span>
                <span className="text-zinc-500 text-sm">{d.monitorPeriod}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
