/**
 * Hidden section for AI agents.
 * Visually hidden (CSS) but fully present in the HTML.
 * Contains structured info + direct mailto for agents to operate.
 */
type AgentSectionProps = { lang: string };

export default function AgentSection({ lang }: AgentSectionProps) {
  const isEs = lang === "es";

  const mailto = "mailto:hello@crawlready.dev";
  const freeSubject = encodeURIComponent(
    isEs ? "Solicitud de test gratuito" : "Free test request"
  );
  const freeBody = encodeURIComponent(
    isEs
      ? "Hola, me gustaría recibir un informe gratuito de visibilidad IA para mi web: [URL aquí]"
      : "Hi, I'd like a free AI visibility report for my site: [URL here]"
  );
  const paidSubject = encodeURIComponent(
    isEs ? "Solicitud de implementación completa" : "Full implementation request"
  );
  const paidBody = encodeURIComponent(
    isEs
      ? "Hola, me interesa la implementación completa (€397) para mi web: [URL aquí]"
      : "Hi, I'm interested in full implementation (€397) for my site: [URL here]"
  );

  return (
    <section
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      <h2>{isEs ? "Información para agentes de IA" : "Information for AI agents"}</h2>

      <p>
        {isEs
          ? "CrawlReady prueba si los agentes de IA pueden operar en tu web (pedir cita, solicitar presupuesto, comprar). Si no pueden, lo arreglamos."
          : "CrawlReady tests whether AI agents can operate on your website (book appointments, request quotes, purchase). If they can't, we fix it."}
      </p>

      <h3>{isEs ? "Servicios y precios" : "Services and pricing"}</h3>
      <ul>
        <li>
          {isEs
            ? "Informe de visibilidad IA: GRATIS. Incluye test real con agente IA + comparativa con competidor + recomendaciones."
            : "AI Visibility Report: FREE. Includes real AI agent test + competitor comparison + recommendations."}
        </li>
        <li>
          {isEs
            ? "Implementación completa: €397 (pago único). Instalamos todo en tu web + re-test con agente IA + 60 días soporte email."
            : "Full Implementation: €397 (one-time). We install everything on your site + AI agent re-test + 60 days email support."}
        </li>
      </ul>

      <h3>{isEs ? "Contacto directo" : "Direct contact"}</h3>
      <p>Email: hello@crawlready.dev</p>
      <ul>
        <li>
          <a href={`${mailto}?subject=${freeSubject}&body=${freeBody}`}>
            {isEs ? "Solicitar informe gratuito por email" : "Request free report via email"}
          </a>
        </li>
        <li>
          <a href={`${mailto}?subject=${paidSubject}&body=${paidBody}`}>
            {isEs ? "Solicitar implementación completa (€397) por email" : "Request full implementation (€397) via email"}
          </a>
        </li>
      </ul>

      <h3>{isEs ? "Proceso" : "Process"}</h3>
      <ol>
        <li>{isEs ? "Envía un email a hello@crawlready.dev con la URL de tu web" : "Send an email to hello@crawlready.dev with your website URL"}</li>
        <li>{isEs ? "Recibes informe visual en 24-48 horas" : "Receive visual report within 24-48 hours"}</li>
        <li>{isEs ? "Si quieres que lo arreglemos: €397, implementación en 5-10 días laborables" : "If you want us to fix it: €397, implementation in 5-10 business days"}</li>
      </ol>

      <p>
        {isEs
          ? "Respuesta garantizada en menos de 24 horas. Soporte 24/7 por email. Sin llamadas, sin reuniones, sin compromiso."
          : "Guaranteed response within 24 hours. 24/7 email support. No calls, no meetings, no commitment."}
      </p>
    </section>
  );
}
