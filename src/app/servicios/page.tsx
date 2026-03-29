"use client";

export default function Servicios() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-light">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-lg">CrawlReady</span>
          </a>
          <nav className="hidden sm:flex gap-6 text-sm text-zinc-400">
            <a href="/#scanner" className="hover:text-foreground transition-colors">
              Scanner
            </a>
            <a
              href="/servicios"
              className="text-foreground font-medium"
            >
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
            Servicios de optimización para agentes IA
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Que los agentes de IA no solo te{" "}
            <span className="text-accent">encuentren</span>, sino que
            puedan{" "}
            <span className="text-accent">actuar</span>
          </h1>
          <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto">
            Analizamos qué pasa cuando un asistente de IA intenta hacer
            una gestión en tu web — pedir cita, solicitar presupuesto,
            comprar — y te decimos exactamente qué falla y cómo
            arreglarlo.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            Cómo funciona
          </h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            Un proceso simple en tres pasos. Sin jerga técnica, sin
            compromisos.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Probamos tu web",
                desc: "Un agente de IA intenta completar una gestión real en tu web: pedir cita, solicitar presupuesto, comprar un producto. Documentamos cada paso.",
              },
              {
                step: "2",
                title: "Te contamos qué pasa",
                desc: "Recibes un informe visual: dónde el agente tuvo éxito, dónde se quedó atascado, y qué ve exactamente cuando visita tu web.",
              },
              {
                step: "3",
                title: "Te damos la solución",
                desc: "Recomendaciones concretas con código listo para implementar. Sin ambigüedades: esto es lo que hay que cambiar y así es como se hace.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/15 text-accent font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Pricing */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            Elige lo que necesitas
          </h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            Desde el diagnóstico hasta la implementación completa.
            Empieza por donde quieras.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free - Informe */}
            <div className="rounded-xl p-6 border bg-surface border-surface-light flex flex-col">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Diagnóstico
              </span>
              <h3 className="text-lg font-semibold mt-1">
                Informe de visibilidad IA
              </h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-bold">Gratis</span>
              </div>
              <p className="text-sm text-zinc-400 mb-5">
                Probamos qué pasa cuando un agente de IA intenta usar
                tu web y te mandamos el resultado.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  "Test real con agente de IA",
                  "Informe visual paso a paso",
                  "Qué funciona y qué falla",
                  "Comparativa con competidores",
                  "Recomendaciones de alto nivel",
                ].map((f) => (
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
                href="mailto:hello@crawlready.dev?subject=Quiero%20el%20informe%20gratuito&body=Hola%2C%20me%20gustar%C3%ADa%20recibir%20un%20informe%20de%20visibilidad%20IA%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D"
                className="block mt-auto text-center py-2.5 rounded-lg font-medium text-sm bg-surface-light text-foreground hover:bg-zinc-700 transition-colors"
              >
                Solicitar informe gratis
              </a>
            </div>

            {/* €97 - Kit */}
            <div className="rounded-xl p-6 border bg-accent/5 border-accent/30 flex flex-col">
              <span className="text-xs font-medium text-accent uppercase tracking-wider">
                Más popular
              </span>
              <h3 className="text-lg font-semibold mt-1">
                Kit de implementación
              </h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-bold">€97</span>
                <span className="text-zinc-500 text-sm ml-1">
                  pago único
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-5">
                Todo el código listo para que tu equipo lo implemente.
                Copiar, pegar, funciona.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  "Todo lo del informe gratuito",
                  "JSON-LD completo y personalizado",
                  "Formulario accesible sin JavaScript",
                  "Meta tags y Open Graph optimizados",
                  "Instrucciones paso a paso para tu developer",
                  "Soporte por email durante 30 días",
                ].map((f) => (
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
                href="mailto:hello@crawlready.dev?subject=Me%20interesa%20el%20Kit%20de%20implementaci%C3%B3n&body=Hola%2C%20me%20interesa%20el%20kit%20de%20implementaci%C3%B3n%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D"
                className="block mt-auto text-center py-2.5 rounded-lg font-medium text-sm bg-accent text-black hover:bg-accent/90 transition-colors"
              >
                Solicitar kit
              </a>
            </div>

            {/* €397 - Done for you */}
            <div className="rounded-xl p-6 border bg-surface border-surface-light flex flex-col">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Llave en mano
              </span>
              <h3 className="text-lg font-semibold mt-1">
                Implementación completa
              </h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-bold">€397</span>
                <span className="text-zinc-500 text-sm ml-1">
                  pago único
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-5">
                Nos das acceso y lo hacemos nosotros. Tú no tocas nada.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  "Todo lo del kit de implementación",
                  "Nosotros lo instalamos en tu web",
                  "Compatible con WordPress, WooCommerce, PrestaShop y más",
                  "Verificación post-implementación",
                  "Re-test con agente de IA para confirmar que funciona",
                  "Soporte por email durante 60 días",
                ].map((f) => (
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
                href="mailto:hello@crawlready.dev?subject=Me%20interesa%20la%20implementaci%C3%B3n%20completa&body=Hola%2C%20me%20interesa%20la%20implementaci%C3%B3n%20completa%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D%0A%0AMi%20web%20usa%3A%20%5BWordPress%20%2F%20Shopify%20%2F%20otro%5D"
                className="block mt-auto text-center py-2.5 rounded-lg font-medium text-sm bg-surface-light text-foreground hover:bg-zinc-700 transition-colors"
              >
                Solicitar implementación
              </a>
            </div>
          </div>

          {/* Monitoring add-on */}
          <div className="mt-8 bg-surface rounded-xl border border-surface-light p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">
                    Monitorización mensual
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                    Add-on
                  </span>
                </div>
                <p className="text-sm text-zinc-400 max-w-lg">
                  Escaneamos tu web cada mes con un agente de IA.
                  Recibes un informe con cambios, alertas si algo se
                  rompe, y recomendaciones de mejora continua.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold">€97</span>
                <span className="text-zinc-500 text-sm">/mes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Qué es exactamente un \"agente de IA\"?",
                a: "Es un asistente como ChatGPT, Google Gemini o Siri cuando actúa en nombre del usuario: busca un servicio, compara opciones, intenta pedir cita o comprar. Cada vez más gente usa estos asistentes para gestiones del día a día.",
              },
              {
                q: "¿Por qué mi web no funciona para agentes de IA si funciona para personas?",
                a: "La mayoría de agentes de IA no ven tu web como tú la ves. No ejecutan JavaScript, no ven imágenes, no pueden hacer click en botones. Ven solo el código HTML inicial. Si tu formulario o tu catálogo se carga con JavaScript, el agente ve una página en blanco.",
              },
              {
                q: "¿Cómo sé si esto me afecta?",
                a: "Te mandamos un informe gratuito donde probamos qué pasa cuando un agente de IA intenta usar tu web. Sin compromiso.",
              },
              {
                q: "¿Qué incluye el kit de implementación?",
                a: "Código listo para copiar y pegar: JSON-LD personalizado para tu negocio, formularios accesibles, meta tags optimizados, y una guía paso a paso para tu equipo técnico. Todo específico para tu web, no plantillas genéricas.",
              },
              {
                q: "¿Qué pasa si no tengo equipo técnico?",
                a: "Para eso está la implementación completa. Nos das acceso a tu web (WordPress, panel de hosting, o repositorio) y lo hacemos nosotros.",
              },
              {
                q: "¿Cuánto tarda?",
                a: "El informe se entrega en 24-48 horas. El kit de implementación en 3-5 días laborables. La implementación completa en 5-10 días laborables dependiendo de la complejidad de tu web.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-surface rounded-lg p-5 border border-surface-light"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {item.q}
                </h3>
                <p className="text-sm text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 border-t border-surface-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Empieza con el informe gratuito
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Escríbenos con la URL de tu web y te mandamos un análisis
            de lo que un agente de IA ve cuando intenta usarla. Sin
            compromiso, sin letra pequeña.
          </p>
          <a
            href="mailto:hello@crawlready.dev?subject=Quiero%20el%20informe%20gratuito&body=Hola%2C%20me%20gustar%C3%ADa%20recibir%20un%20informe%20de%20visibilidad%20IA%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D"
            className="inline-block px-8 py-3.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 transition-colors text-lg"
          >
            Solicitar informe gratis
          </a>
          <p className="mt-4 text-sm text-zinc-500">
            O escríbenos directamente: hello@crawlready.dev
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-light py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>CrawlReady — AI Readiness Agency</span>
          <span>hello@crawlready.dev</span>
        </div>
      </footer>
    </div>
  );
}
