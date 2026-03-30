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
      ? "Agencia de Visibilidad IA. Ayudamos a que tu web sea visible y operable para agentes de IA."
      : "AI Readiness Agency. We help your website become visible and operable for AI agents.",
    foundingDate: "2026",
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
        ? "Probamos qué pasa cuando un agente de IA intenta usar tu web y te mandamos el resultado."
        : "We test what happens when an AI agent tries to use your site and send you the results.",
      provider: { "@id": `${baseUrl}/#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: isEs ? "Gratis" : "Free",
      },
    },
    {
      "@type": "Service",
      name: isEs ? "Kit de implementación" : "Implementation Kit",
      description: isEs
        ? "Todo el código listo para que tu equipo lo implemente. JSON-LD, formularios accesibles, meta tags optimizados."
        : "All the code ready for your team to implement. Custom JSON-LD, accessible forms, optimized meta tags.",
      provider: { "@id": `${baseUrl}/#organization` },
      offers: {
        "@type": "Offer",
        price: "97",
        priceCurrency: "EUR",
        description: isEs ? "Pago único" : "One-time payment",
      },
    },
    {
      "@type": "Service",
      name: isEs ? "Implementación completa" : "Full Implementation",
      description: isEs
        ? "Nos das acceso y lo hacemos nosotros. Compatible con WordPress, WooCommerce, PrestaShop."
        : "Give us access and we do it for you. Compatible with WordPress, WooCommerce, PrestaShop.",
      provider: { "@id": `${baseUrl}/#organization` },
      offers: {
        "@type": "Offer",
        price: "397",
        priceCurrency: "EUR",
        description: isEs ? "Pago único" : "One-time payment",
      },
    },
  ];

  const faq = {
    "@type": "FAQPage",
    mainEntity: isEs
      ? [
          {
            "@type": "Question",
            name: '¿Qué es exactamente un "agente de IA"?',
            acceptedAnswer: {
              "@type": "Answer",
              text: "Es un asistente como ChatGPT, Google Gemini o Siri cuando actúa en nombre del usuario: busca un servicio, compara opciones, intenta pedir cita o comprar.",
            },
          },
          {
            "@type": "Question",
            name: "¿Por qué mi web no funciona para agentes de IA si funciona para personas?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "La mayoría de agentes de IA no ven tu web como tú la ves. No ejecutan JavaScript, no ven imágenes, no pueden hacer click en botones. Ven solo el código HTML inicial.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo sé si esto me afecta?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Te mandamos un informe gratuito donde probamos qué pasa cuando un agente de IA intenta usar tu web. Sin compromiso.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué incluye el kit de implementación?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Código listo para copiar y pegar: JSON-LD personalizado para tu negocio, formularios accesibles, meta tags optimizados, y una guía paso a paso para tu equipo técnico.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué pasa si no tengo equipo técnico?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Para eso está la implementación completa. Nos das acceso a tu web y lo hacemos nosotros.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuánto tarda?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "El informe se entrega en 24-48 horas. El kit en 3-5 días laborables. La implementación completa en 5-10 días laborables.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: 'What exactly is an "AI agent"?',
            acceptedAnswer: {
              "@type": "Answer",
              text: "It's an assistant like ChatGPT, Google Gemini, or Siri when it acts on behalf of a user: searching for a service, comparing options, trying to book an appointment or make a purchase.",
            },
          },
          {
            "@type": "Question",
            name: "Why doesn't my site work for AI agents if it works for people?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most AI agents don't see your site the way you do. They don't run JavaScript, they can't see images, they can't click buttons. They only see the initial HTML code.",
            },
          },
          {
            "@type": "Question",
            name: "How do I know if this affects me?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We'll send you a free report where we test what happens when an AI agent tries to use your site. No commitment.",
            },
          },
          {
            "@type": "Question",
            name: "What does the implementation kit include?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copy-paste ready code: custom JSON-LD for your business, accessible forms, optimized meta tags, and a step-by-step guide for your technical team.",
            },
          },
          {
            "@type": "Question",
            name: "What if I don't have a technical team?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "That's what the full implementation is for. Give us access to your site and we do it.",
            },
          },
          {
            "@type": "Question",
            name: "How long does it take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The report is delivered in 24-48 hours. The kit in 3-5 business days. Full implementation in 5-10 business days.",
            },
          },
        ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, ...services, faq],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
