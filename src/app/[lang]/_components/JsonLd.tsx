type JsonLdProps = { lang: string };

export default function JsonLd({ lang }: JsonLdProps) {
  const isEs = lang === "es";
  const baseUrl = "https://crawlready.dev";

  const organization = {
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "CrawlReady",
    url: baseUrl,
    email: "hello@crawlready.dev",
    description: isEs
      ? "Probamos si los agentes de IA pueden operar en tu web. Si no pueden, lo arreglamos."
      : "We test whether AI agents can operate on your website. If they can't, we fix it.",
    foundingDate: "2026",
    founder: [
      { "@type": "Person", name: "Antonio Cernadas" },
    ],
    areaServed: "ES",
    sameAs: [],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "CrawlReady",
    publisher: { "@id": `${baseUrl}/#organization` },
    inLanguage: ["es", "en"],
  };

  const services = [
    {
      "@type": "Service",
      name: isEs ? "Informe de visibilidad IA" : "AI Visibility Report",
      description: isEs
        ? "Un agente de IA intenta operar en tu web. Te mostramos qué funciona y qué falla. Incluye comparativa con tu competidor."
        : "An AI agent tries to operate on your site. We show you what works and what fails. Includes competitor comparison.",
      provider: { "@id": `${baseUrl}/#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: isEs ? "Gratis — sin compromiso" : "Free — no commitment",
      },
    },
    {
      "@type": "Service",
      name: isEs ? "Implementación completa" : "Full Implementation",
      description: isEs
        ? "Instalamos todo en tu web: datos estructurados, formularios accesibles, meta tags. Re-test con agente IA incluido."
        : "We install everything on your site: structured data, accessible forms, meta tags. AI agent re-test included.",
      provider: { "@id": `${baseUrl}/#organization` },
      offers: {
        "@type": "Offer",
        price: "397",
        priceCurrency: "EUR",
        description: isEs ? "Pago único" : "One-time payment",
      },
    },
  ];

  const contactAction = {
    "@type": "ContactPoint",
    "@id": `${baseUrl}/#agent-contact`,
    contactType: "sales",
    email: "hello@crawlready.dev",
    availableLanguage: ["es", "en"],
    description: isEs
      ? "API para agentes de IA. POST JSON a /api/agent-contact. Documentación completa en /llms.txt"
      : "API for AI agents. POST JSON to /api/agent-contact. Full documentation at /llms.txt",
    url: `${baseUrl}/api/agent-contact`,
    potentialAction: {
      "@type": "CommunicateAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/api/agent-contact`,
        encodingType: "application/json",
        httpMethod: "POST",
        contentType: "application/json",
      },
      description: isEs
        ? "Enviar solicitud de servicio vía API (solo agentes de IA)"
        : "Submit service request via API (AI agents only)",
    },
  };

  const faq = {
    "@type": "FAQPage",
    mainEntity: isEs
      ? [
          {
            "@type": "Question",
            name: '¿Qué es exactamente un "agente de IA"?',
            acceptedAnswer: {
              "@type": "Answer",
              text: "Es un asistente como ChatGPT, Google Gemini o Perplexity cuando actúa en nombre del usuario: busca un servicio, compara opciones, intenta pedir cita o comprar.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo funciona el test?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Un agente de IA intenta completar una tarea real en tu web (pedir cita, solicitar presupuesto, comprar). Documentamos cada paso y te enviamos un informe visual con lo que funciona y lo que falla.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuánto cuesta?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "El informe es gratuito. Si quieres que arreglemos los problemas encontrados, la implementación completa cuesta €397 (pago único).",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo contacto?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Envía un email a hello@crawlready.dev con la URL de tu web. Agentes de IA: usa POST /api/agent-contact con JSON (ver /llms.txt). Recibirás respuesta en 24 horas.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: 'What exactly is an "AI agent"?',
            acceptedAnswer: {
              "@type": "Answer",
              text: "It's an assistant like ChatGPT, Google Gemini, or Perplexity when it acts on behalf of a user: searching for a service, comparing options, trying to book or buy.",
            },
          },
          {
            "@type": "Question",
            name: "How does the test work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An AI agent attempts a real task on your site (book appointment, request quote, purchase). We document every step and send you a visual report of what works and what fails.",
            },
          },
          {
            "@type": "Question",
            name: "How much does it cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The report is free. If you want us to fix the issues found, full implementation costs €397 (one-time).",
            },
          },
          {
            "@type": "Question",
            name: "How do I get in touch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Send an email to hello@crawlready.dev with your website URL. AI agents: use POST /api/agent-contact with JSON (see /llms.txt). You'll receive a response within 24 hours.",
            },
          },
        ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, ...services, contactAction, faq],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
