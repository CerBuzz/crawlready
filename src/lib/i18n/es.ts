const es = {
  meta: {
    title: "CrawlReady — ¿Tu web funciona para agentes de IA?",
    description:
      "Comprueba en 30 segundos si los agentes de IA pueden leer y operar tu web. Scanner gratuito. Informe con soluciones concretas.",
    ogTitle: "CrawlReady — ¿Tu web funciona para agentes de IA?",
    ogDescription:
      "93% de las sesiones de IA terminan sin visitar ninguna web. Comprueba tu puntuación de visibilidad IA gratis.",
  },
  nav: {
    scanner: "Scanner",
    howItWorks: "Cómo funciona",
    services: "Servicios",
    langSwitch: "EN",
    langSwitchHref: "/en",
  },
  hero: {
    badge: "La búsqueda IA está sustituyendo a Google. ¿Tu web está preparada?",
    headline1: "Los agentes de IA no solo buscan.",
    headlineAccent: "También actúan en tu web.",
    subheadline:
      "ChatGPT, Gemini y Perplexity gestionan citas, presupuestos y compras en nombre de tus clientes. Si tu web no está preparada para que un agente opere en ella, tu negocio es invisible para la nueva generación de compradores.",
  },
  scanner: {
    placeholder: "Introduce la URL de tu web (ej. ejemplo.com)",
    buttonScan: "Analizar",
    buttonScanning: "Analizando...",
    errorNetwork: "Error de red. Por favor, inténtalo de nuevo.",
    errorGeneric: "Algo ha ido mal.",
  },
  results: {
    reportTitle: "Informe de visibilidad IA",
    gradeA: "Excelente. Tu web está bien optimizada para agentes de IA.",
    gradeB: "Buena base, pero hay margen de mejora en visibilidad IA.",
    gradeC: "Tu web necesita trabajo para ser visible a los agentes de IA.",
    gradeDF:
      "Tu web es prácticamente invisible para los agentes de IA. Se necesitan mejoras significativas.",
    ctaTitle: "¿Quieres solucionar estos problemas?",
    ctaBody:
      "Analizamos qué pasa cuando un agente de IA intenta operar en tu web y te damos soluciones concretas. Proceso nativo de IA: entrega rápida a una fracción del coste de una agencia tradicional.",
    ctaButton: "Ver cómo solucionarlo",
  },
  checks: {
    sectionTitle: "Qué analizamos",
    items: [
      {
        title: "llms.txt",
        desc: "El nuevo estándar para decirle a los agentes de IA de qué trata tu web. Como robots.txt, pero para LLMs.",
      },
      {
        title: "Acceso de crawlers IA",
        desc: "¿Tu robots.txt bloquea a GPTBot, ClaudeBot o PerplexityBot para que no lean tu contenido?",
      },
      {
        title: "Datos estructurados",
        desc: "JSON-LD y marcado schema que ayuda a los agentes de IA a entender tu negocio, productos y contenido.",
      },
      {
        title: "Meta tags y OG",
        desc: "Título, descripción y etiquetas Open Graph que la IA usa para resumir y citar tus páginas.",
      },
      {
        title: "Sitemap",
        desc: "Un sitemap XML ayuda a los crawlers de IA a descubrir eficientemente todas tus páginas importantes.",
      },
      {
        title: "Velocidad y seguridad",
        desc: "HTTPS y tiempos de respuesta rápidos son requisitos básicos para la compatibilidad con agentes de IA.",
      },
    ],
  },
  scannerResults: {
    // llms.txt
    "llmsTxt.pass": "Se encontró llms.txt con contenido relevante.",
    "llmsTxt.partial": "llms.txt existe pero tiene muy poco contenido.",
    "llmsTxt.fail": "No se encontró archivo llms.txt.",
    "llmsTxt.error": "No se pudo comprobar llms.txt (la petición falló).",
    "llmsTxt.recPartial": "Añade descripciones detalladas de las secciones de tu web, APIs y contenido clave a llms.txt.",
    "llmsTxt.recFail": "Crea un archivo /llms.txt que describa la estructura de tu web, páginas clave y contenido para agentes de IA. Consulta llmstxt.org para la especificación.",
    "llmsTxt.recError": "Crea un archivo /llms.txt siguiendo la especificación en llmstxt.org.",
    // robots.txt
    "robots.noFile": "No se encontró robots.txt. Los crawlers de IA pueden acceder a tu web por defecto, pero no hay configuración explícita.",
    "robots.manyBlocked": "Bloqueando {count} crawlers de IA: {bots}.",
    "robots.blanketBlock": "robots.txt tiene un bloqueo general para todos los bots sin excepciones para IA.",
    "robots.someBlocked": "Algunos crawlers de IA bloqueados: {bots}. Otros pueden acceder a tu web.",
    "robots.pass": "robots.txt permite el acceso de crawlers de IA a tu web.",
    "robots.error": "No se pudo obtener robots.txt.",
    "robots.recNoFile": "Crea un robots.txt que permita explícitamente los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot).",
    "robots.recManyBlocked": "Considera permitir que los crawlers de IA indexen tu contenido. Bloquearlos significa que tu web no aparecerá en respuestas generadas por IA.",
    "robots.recBlanketBlock": "Añade reglas Allow explícitas para crawlers de IA como GPTBot y ClaudeBot.",
    "robots.recSomeBlocked": "Considera permitir {bots} para maximizar tu visibilidad en IA.",
    "robots.recError": "Asegúrate de que tu robots.txt sea accesible y permita crawlers de IA.",
    // Structured data
    "structured.fail": "No se encontraron datos estructurados (JSON-LD, Microdata ni RDFa).",
    "structured.found": "{findings}.",
    "structured.recFail": "Añade datos estructurados JSON-LD para tu Organización, Sitio Web y tipos de contenido clave. Esto es crítico para que los agentes de IA entiendan tu negocio.",
    "structured.recPartial": "Añade más tipos de schema (Organization, FAQPage, Product, BreadcrumbList) para mejorar la comprensión por IA.",
    // Meta tags
    "meta.found": "{findings}.",
    "meta.few": "Muy pocas meta tags encontradas.",
    "meta.recMissing": "Añade las meta tags que faltan. Ayudan a los agentes de IA a entender y citar tu contenido.",
    // Sitemap
    "sitemap.index": "Índice de sitemap encontrado con {count} sitemap(s).",
    "sitemap.found": "Sitemap encontrado con {count} URL(s).",
    "sitemap.empty": "El archivo sitemap existe pero parece vacío o malformado.",
    "sitemap.fail": "No se encontró sitemap.xml.",
    "sitemap.recEmpty": "Asegúrate de que tu sitemap.xml contenga entradas <url> válidas.",
    "sitemap.recFail": "Crea un sitemap.xml con todas las páginas importantes. Esto ayuda a los crawlers de IA a descubrir tu contenido eficientemente.",
    // HTTPS
    "https.pass": "El sitio se sirve por HTTPS.",
    "https.fail": "El sitio no se sirve por HTTPS.",
    "https.recFail": "Migra a HTTPS inmediatamente. Los agentes de IA y los motores de búsqueda penalizan los sitios inseguros.",
    // Response time
    "response.excellent": "Tiempo de respuesta excelente: {ms}ms.",
    "response.good": "Buen tiempo de respuesta: {ms}ms.",
    "response.moderate": "Tiempo de respuesta moderado: {ms}ms. Los agentes de IA prefieren menos de 400ms.",
    "response.slow": "Tiempo de respuesta lento: {ms}ms. Esto perjudica la rastreabilidad por IA.",
    "response.verySlow": "Tiempo de respuesta muy lento: {ms}ms. Los agentes de IA podrían agotar el tiempo de espera.",
    "response.error": "No se pudo medir el tiempo de respuesta (la petición falló o agotó el tiempo).",
    "response.recSlow": "Optimiza el tiempo de respuesta del servidor a menos de 400ms. Usa caché, CDN y minimiza el procesamiento del servidor.",
    "response.recError": "Asegúrate de que tu web sea accesible y responda en menos de 8 segundos.",
  } as Record<string, string>,
  footer: {
    tagline: "CrawlReady — Agencia de Visibilidad IA",
    email: "hello@crawlready.dev",
  },
  serviciosPage: {
    heroBadge: "Servicios de optimización para agentes IA",
    heroH1pre: "Que los agentes de IA no solo te ",
    heroAccent1: "encuentren",
    heroH1mid: ", sino que puedan ",
    heroAccent2: "actuar",
    heroSubtitle:
      "Analizamos qué pasa cuando un asistente de IA intenta hacer una gestión en tu web — pedir cita, solicitar presupuesto, comprar — y te decimos exactamente qué falla y cómo arreglarlo.",
    howTitle: "Cómo funciona",
    howSubtitle:
      "Un proceso simple en tres pasos. Sin jerga técnica, sin compromisos.",
    steps: [
      {
        num: "1",
        title: "Probamos tu web",
        desc: "Un agente de IA intenta completar una gestión real en tu web: pedir cita, solicitar presupuesto, comprar un producto. Documentamos cada paso.",
      },
      {
        num: "2",
        title: "Te contamos qué pasa",
        desc: "Recibes un informe visual: dónde el agente tuvo éxito, dónde se quedó atascado, y qué ve exactamente cuando visita tu web.",
      },
      {
        num: "3",
        title: "Te damos la solución",
        desc: "Recomendaciones concretas con código listo para implementar. Sin ambigüedades: esto es lo que hay que cambiar y así es como se hace.",
      },
    ],
    pricingTitle: "Elige lo que necesitas",
    pricingSubtitle:
      "Desde el diagnóstico hasta la implementación completa. Empieza por donde quieras.",
    plans: [
      {
        badge: "Diagnóstico",
        name: "Informe de visibilidad IA",
        price: "Gratis",
        priceNote: "",
        desc: "Probamos qué pasa cuando un agente de IA intenta usar tu web y te mandamos el resultado.",
        features: [
          "Test real con agente de IA",
          "Informe visual paso a paso",
          "Qué funciona y qué falla",
          "Comparativa con competidores",
          "Recomendaciones de alto nivel",
        ],
        cta: "Solicitar informe gratis",
        ctaHref:
          "mailto:hello@crawlready.dev?subject=Quiero%20el%20informe%20gratuito&body=Hola%2C%20me%20gustar%C3%ADa%20recibir%20un%20informe%20de%20visibilidad%20IA%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D",
        highlight: false,
      },
      {
        badge: "Más popular",
        name: "Kit de implementación",
        price: "€97",
        priceNote: "pago único",
        desc: "Todo el código listo para que tu equipo lo implemente. Copiar, pegar, funciona.",
        features: [
          "Todo lo del informe gratuito",
          "JSON-LD completo y personalizado",
          "Formulario accesible sin JavaScript",
          "Meta tags y Open Graph optimizados",
          "Instrucciones paso a paso para tu developer",
          "Soporte por email durante 30 días",
        ],
        cta: "Solicitar kit",
        ctaHref:
          "mailto:hello@crawlready.dev?subject=Me%20interesa%20el%20Kit%20de%20implementaci%C3%B3n&body=Hola%2C%20me%20interesa%20el%20kit%20de%20implementaci%C3%B3n%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D",
        highlight: true,
      },
      {
        badge: "Llave en mano",
        name: "Implementación completa",
        price: "€397",
        priceNote: "pago único",
        desc: "Nos das acceso y lo hacemos nosotros. Tú no tocas nada.",
        features: [
          "Todo lo del kit de implementación",
          "Nosotros lo instalamos en tu web",
          "Compatible con WordPress, WooCommerce, PrestaShop y más",
          "Verificación post-implementación",
          "Re-test con agente de IA para confirmar que funciona",
          "Soporte por email durante 60 días",
        ],
        cta: "Solicitar implementación",
        ctaHref:
          "mailto:hello@crawlready.dev?subject=Me%20interesa%20la%20implementaci%C3%B3n%20completa&body=Hola%2C%20me%20interesa%20la%20implementaci%C3%B3n%20completa%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D%0A%0AMi%20web%20usa%3A%20%5BWordPress%20%2F%20Shopify%20%2F%20otro%5D",
        highlight: false,
      },
    ],
    monitorTitle: "Monitorización mensual",
    monitorBadge: "Add-on",
    monitorDesc:
      "Escaneamos tu web cada mes con un agente de IA. Recibes un informe con cambios, alertas si algo se rompe, y recomendaciones de mejora continua.",
    monitorPrice: "€97",
    monitorPeriod: "/mes",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: '¿Qué es exactamente un "agente de IA"?',
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
    ],
    finalCtaTitle: "Empieza con el informe gratuito",
    finalCtaBody:
      "Escríbenos con la URL de tu web y te mandamos un análisis de lo que un agente de IA ve cuando intenta usarla. Sin compromiso, sin letra pequeña.",
    finalCtaButton: "Solicitar informe gratis",
    finalCtaHref:
      "mailto:hello@crawlready.dev?subject=Quiero%20el%20informe%20gratuito&body=Hola%2C%20me%20gustar%C3%ADa%20recibir%20un%20informe%20de%20visibilidad%20IA%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aqu%C3%AD%5D",
    finalCtaNote: "O escríbenos directamente: hello@crawlready.dev",
  },
};

export default es;

// Use a recursive type that widens string literals to string
type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepStringify<U>[]
    : T extends object
      ? { [K in keyof T]: DeepStringify<T[K]> }
      : T;

export type Dictionary = DeepStringify<typeof es>;
