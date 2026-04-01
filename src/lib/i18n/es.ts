const es = {
  meta: {
    title: "CrawlReady",
    description:
      "Comprueba en 30 segundos si los agentes de IA pueden leer y operar tu web. Scanner gratuito. Informe con soluciones concretas.",
    ogTitle: "CrawlReady — ¿Tu web funciona para agentes de IA?",
    ogDescription:
      "93% de las sesiones de IA terminan sin visitar ninguna web. Comprueba tu puntuación de visibilidad IA gratis.",
  },
  nav: {
    howItWorks: "Cómo funciona",
    pricing: "Precios",
    services: "Servicios",
    langSwitch: "EN",
    langSwitchHref: "/en",
  },
  hero: {
    badge: "El 93% de sesiones IA terminan sin visitar ninguna web",
    headline1: "Un agente IA intentó comprarte.",
    headlineAccent: "No pudo.",
    subheadline:
      "ChatGPT, Gemini y Perplexity ya gestionan citas, presupuestos y compras en nombre de tus clientes. Si un agente de IA no puede operar en tu web, estás perdiendo ventas sin saberlo.",
  },
  heroForm: {
    urlPlaceholder: "URL de tu web (ej. ejemplo.com)",
    emailPlaceholder: "Tu email de contacto",
    button: "Pide tu test gratuito",
    sending: "Enviando...",
    successTitle: "¡Revisa tu email!",
    successBody: "Te hemos enviado un email de confirmación a {email}. Haz clic en el enlace para confirmar tu solicitud.",
    duplicateTitle: "Ya tienes una solicitud",
    duplicateBody: "Este email ya tiene una solicitud en curso. Si necesitas otro análisis, escríbenos a hello@crawlready.dev.",
    errorNetwork: "Error de red. Por favor, inténtalo de nuevo.",
    errorGeneric: "Algo ha ido mal. Escríbenos a hello@crawlready.dev.",
  },
  howItWorks: {
    sectionTitle: "Cómo funciona",
    sectionSubtitle: "Un proceso simple en tres pasos. Sin jerga, sin compromiso.",
    steps: [
      {
        num: "1",
        title: "Probamos tu web",
        desc: "Un agente de IA intenta completar una gestión real: pedir cita, solicitar presupuesto, comprar un producto. Documentamos cada paso.",
      },
      {
        num: "2",
        title: "Te mostramos qué falla",
        desc: "Recibes un informe visual: dónde el agente tuvo éxito, dónde se atascó, y qué ve exactamente cuando visita tu web.",
      },
      {
        num: "3",
        title: "Lo arreglamos",
        desc: "Implementamos las soluciones en tu web: datos estructurados, formularios accesibles, meta tags. Tú no tocas nada.",
      },
    ],
  },
  pricing: {
    sectionTitle: "Precios",
    sectionSubtitle: "Sin letra pequeña. Sin llamadas. Sin permanencia.",
    free: {
      badge: "Empieza aquí",
      name: "Informe de visibilidad IA",
      price: "Gratis",
      desc: "Probamos qué pasa cuando un agente de IA intenta usar tu web y te mandamos el resultado.",
      features: [
        "Test real con agente de IA",
        "Informe visual paso a paso",
        "Comparativa con tu competidor directo",
        "Recomendaciones concretas",
      ],
      cta: "Pedir informe gratis",
    },
    paid: {
      badge: "Llave en mano",
      name: "Implementación completa",
      price: "€397",
      priceNote: "pago único",
      desc: "Nos das acceso y lo hacemos nosotros. Verificación con agente de IA incluida.",
      features: [
        "Todo lo del informe gratuito",
        "Instalamos todo en tu web",
        "JSON-LD, formularios accesibles, meta tags",
        "Compatible con WordPress, Shopify, PrestaShop y más",
        "Re-test con agente de IA post-implementación",
        "Soporte por email durante 60 días",
      ],
      cta: "Solicitar implementación",
    },
  },
  dogfooding: {
    title: "Mejor servicio. Menos precio. ¿El truco?",
    body: "No hay truco. Usamos la misma tecnología que optimizamos para ti: agentes de IA en todos nuestros procesos. Así podemos dar soporte 24/7, entregar en días, y cobrar €397 en vez de €4.000.",
    highlight: "",
  },
  finalCta: {
    title: "Descubre qué ve un agente IA en tu web",
    body: "Escríbenos con tu URL y la de tu competidor. En 48 horas tienes el informe. Sin compromiso, sin letra pequeña.",
    button: "Pedir test gratuito",
    note: "O escríbenos directamente: hello@crawlready.dev",
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
  agentTest: {
    sectionLabel: "Test agéntico",
    title: "¿Qué pasa cuando un agente IA intenta contratar a {company}?",
    subtitle: "Simulamos el proceso completo con peticiones HTTP reales.",
    passed: "Aprobados",
    partial: "Parciales",
    failed: "Fallidos",
    watchSimulation: "Ver simulación del agente",
    simulationNote: "Animación interactiva — datos reales obtenidos por HTTP",
    // Step names
    "step.discovery": "Descubrimiento",
    "step.navigation": "Navegación",
    "step.contact": "Contacto",
    "step.agent_ready_forms": "Formularios adaptados para agentes",
    "step.form_operability": "Formularios adaptados para agentes",
    "step.structured_data": "Datos estructurados",
    // Substep labels
    "substep.pageTitle": "Título de página",
    "substep.headings": "Encabezados",
    "substep.readableContent": "Contenido legible",
    "substep.linksFound": "Enlaces encontrados",
    "substep.emailAddresses": "Direcciones de email",
    "substep.phoneNumbers": "Teléfonos",
    "substep.whatsapp": "WhatsApp",
    "substep.contactForms": "Formularios de contacto",
    "substep.chatWidgets": "Chat en vivo",
    "substep.jsonLdBlocks": "Bloques JSON-LD",
    "substep.businessName": "Nombre del negocio",
    "substep.servicesOffers": "Servicios/ofertas",
    "substep.pricingInfo": "Información de precios",
    "substep.contactInfo": "Información de contacto",
    // Discovery details
    "discovery.pass": "El agente encontró la web y pudo leer el contenido.",
    "discovery.partial": "La web carga pero con contenido limitado — puede depender de JavaScript.",
    "discovery.fail": "No se pudo cargar la web (HTTP {status}). Un agente IA no puede interactuar con este sitio.",
    // Navigation details
    "navigation.pass": "Navegó a {loaded} páginas relevantes de {total} enlaces internos.",
    "navigation.partial": "Solo pudo acceder a {loaded} página(s) relevante(s) de {total} enlaces.",
    "navigation.fail": "Encontró {total} enlaces pero ninguno coincide con patrones de servicios/contacto/precios.",
    // Contact details
    "contact.pass": "Encontró {count} canal(es) de contacto directo: {channels}.",
    "contact.partial": "Canales de contacto directo limitados: {channels}.",
    "contact.fail": "No se encontraron métodos de contacto directo (email, teléfono, WhatsApp) en el HTML. Un agente IA no tiene forma de contactar con este negocio.",
    // Agent-ready forms details
    "formOp.pass": "{operable} de {total} formulario(s) están adaptados para agentes IA.",
    "formOp.partial": "{total} formulario(s) detectado(s), pero ninguno está adaptado para agentes IA — el agente no puede enviar ninguna solicitud.",
    "formOp.fail": "No se encontraron formularios HTML. Un agente IA no tiene forma de enviar una solicitud.",
    // Structured data details
    "structuredData.pass": "{count} bloque(s) JSON-LD con tipos: {types}. {richness}/4 campos clave presentes.",
    "structuredData.partial": "{count} bloque(s) JSON-LD encontrado(s) pero con campos clave incompletos ({richness}/4).",
    "structuredData.fail": "No se encontraron datos estructurados JSON-LD. Los agentes IA no pueden entender programáticamente los servicios ni datos del negocio.",
    // Substep details
    "substep.titleFound": "{title}",
    "substep.noTitle": "Sin título encontrado",
    "substep.headingsFound": "{count} encontrado(s): \"{first}\"",
    "substep.noHeadings": "Sin encabezados encontrados",
    "substep.contentPass": "{chars} caracteres de texto extraíble",
    "substep.contentPartial": "Solo {chars} caracteres — la página puede depender de renderizado JavaScript",
    "substep.contentFail": "Muy poco contenido de texto — probablemente una SPA renderizada con JS",
    "substep.linksCount": "{count} enlaces internos",
    "substep.noLinks": "Sin enlaces internos",
    "substep.emailNone": "No aparece en el HTML",
    "substep.phoneNone": "No encontrado",
    "substep.whatsappNone": "No detectado",
    "substep.whatsappFound": "Enlace de WhatsApp detectado",
    "substep.formsFound": "{count} formulario(s) encontrado(s)",
    "substep.formsNone": "No se encontraron formularios en el HTML",
    "substep.jsonLdNone": "No encontrados",
    "substep.jsonLdFound": "{count} encontrado(s): {types}",
    "substep.fieldFound": "Encontrado",
    "substep.fieldMissing": "Ausente",
    "substep.formAgentReady": "Adaptado para agentes — campos: {fields}",
    "substep.formOperable": "Adaptado para agentes — campos: {fields}",
    "substep.formNoSubmit": "Sin botón de envío",
    "substep.formCaptcha": "CAPTCHA bloquea el envío automático",
    "substep.formNoAction": "Sin atributo action (puede ser solo JS)",
    "substep.formNoFields": "Sin campos visibles en el HTML",
    "substep.pageLoaded": "\"{text}\" ({ms}ms)",
    "substep.pageLoadFailed": "No se pudo cargar",
    // Recommendations
    "rec.discovery.partial": "Asegúrate de que el contenido principal de la web se renderice en HTML estático, no solo con JavaScript. Los agentes IA no ejecutan JavaScript.",
    "rec.discovery.fail": "La web no es accesible. Verifica que el servidor responde correctamente y que no hay bloqueos por IP o User-Agent.",
    "rec.navigation.partial": "Añade enlaces de texto claros a las páginas principales (servicios, contacto, precios) desde la página de inicio.",
    "rec.navigation.fail": "Los enlaces de navegación no son detectables. Usa etiquetas <a> con href y texto descriptivo en vez de botones JavaScript.",
    "rec.contact.partial": "Añade email y teléfono visibles en el HTML. Los agentes IA no pueden extraer datos de imágenes o PDFs.",
    "rec.contact.fail": "Añade al menos un email (mailto:) y un teléfono (tel:) en el HTML. Sin esto, un agente IA no puede contactar con el negocio.",
    "rec.formOp.partial": "Cada formulario necesita un botón <button type=\"submit\"> y un atributo action con la URL de destino. Sin esto, un agente IA no puede enviar datos.",
    "rec.formOp.fail": "Añade un formulario HTML con campos name, botón submit y atributo action. Los formularios que dependen solo de JavaScript son invisibles para agentes IA.",
    "rec.structuredData.partial": "Completa los datos estructurados JSON-LD con name, offers/services, priceRange y contactPoint en schema.org Organization.",
    "rec.structuredData.fail": "Añade schema.org Organization con name, description, contactPoint. Añade los servicios/productos con schema type apropiado.",
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
  monitorPage: {
    heroBadge: "Auditoría mensual multi-modelo",
    heroH1pre: "Cada modelo de IA ve tu web ",
    heroAccent1: "diferente",
    heroH1mid: ". Nosotros los probamos ",
    heroAccent2: "todos",
    heroSubtitle:
      "ChatGPT, Claude, Gemini y Perplexity no buscan igual ni recomiendan lo mismo. Cada mes testamos tu web con todos ellos, la comparamos con tus competidores y te enviamos un informe con lo que ha cambiado.",
    whyTitle: "¿Por qué importa usar varios modelos?",
    whySubtitle: "Cada agente de IA tiene un perfil de usuario distinto. Si solo optimizas para uno, eres invisible para los demás.",
    models: [
      {
        name: "ChatGPT",
        share: "60%",
        shareLabel: "del mercado consumer",
        profile: "El más usado por consumidores. Domina búsquedas B2C: restaurantes, tiendas, servicios personales. 400M+ usuarios semanales.",
        color: "emerald",
      },
      {
        name: "Claude",
        share: "60%",
        shareLabel: "de Fortune 500",
        profile: "Dominante en entorno enterprise. 29% del mercado B2B, integrado en Slack, Teams y Zoom. Si tu cliente es una empresa, probablemente usa Claude.",
        color: "violet",
      },
      {
        name: "Perplexity",
        share: "370%",
        shareLabel: "crecimiento anual",
        profile: "El buscador nativo de IA. Cita fuentes y enlaza directamente. Crecimiento explosivo en búsquedas de investigación y comparación de opciones.",
        color: "blue",
      },
      {
        name: "Google Gemini",
        share: "21%",
        shareLabel: "y creciendo rápido",
        profile: "De 5.7% a 21.5% en 12 meses. Integrado en Google Search, Android y Workspace. La apuesta de Google por la búsqueda IA.",
        color: "amber",
      },
    ],
    howTitle: "Qué recibes cada mes",
    howSubtitle: "Un informe completo que cubre descubrimiento, legibilidad, operabilidad y comparativa competitiva.",
    deliverables: [
      {
        icon: "search",
        title: "Búsqueda ciega en cada modelo",
        desc: "Le pedimos a ChatGPT, Claude, Perplexity y Gemini que busquen tu servicio sin nombrarte. ¿Te encuentran? ¿En qué posición? ¿Te recomiendan?",
      },
      {
        icon: "eye",
        title: "Test de legibilidad",
        desc: "¿Cada modelo entiende qué haces, cuánto cobras y qué dicen tus clientes? Puntuamos cada dimensión por modelo.",
      },
      {
        icon: "zap",
        title: "Test de operabilidad",
        desc: "¿Puede cada modelo usar tus formularios, enviar emails o interactuar con tus canales de contacto? Documentamos qué funciona y qué no.",
      },
      {
        icon: "users",
        title: "Comparativa con competidores",
        desc: "Probamos lo mismo con 2-3 competidores directos tuyos. Ves exactamente dónde estás por delante y dónde te superan.",
      },
      {
        icon: "trending",
        title: "Evolución mes a mes",
        desc: "Comparamos con el mes anterior: ¿has mejorado? ¿Ha cambiado algo en los modelos? ¿Tu competidor ha hecho cambios?",
      },
      {
        icon: "alert",
        title: "Alertas de cambios",
        desc: "Si un modelo deja de encontrarte, si tu formulario deja de funcionar, o si un competidor te adelanta — te avisamos inmediatamente, no al mes siguiente.",
      },
    ],
    pricingTitle: "Un precio, todo incluido",
    pricingPrice: "€97",
    pricingPeriod: "/mes",
    pricingDesc: "Sin permanencia. Cancela cuando quieras.",
    pricingFeatures: [
      "Test mensual con 4 modelos de IA (ChatGPT, Claude, Perplexity, Gemini)",
      "Búsqueda ciega + legibilidad + operabilidad",
      "Comparativa con 2-3 competidores de tu sector",
      "Informe visual con evolución mes a mes",
      "Alertas inmediatas si algo cambia",
      "Recomendaciones de mejora priorizadas",
      "Soporte por email — respondemos en el mismo día",
    ],
    pricingCta: "Empezar monitorización",
    pricingCtaHref:
      "mailto:hello@crawlready.dev?subject=Monitorización%20mensual&body=Hola%2C%20me%20interesa%20la%20monitorización%20mensual%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aquí%5D%0A%0AMis%20competidores%20principales%20son%3A%20%5B1.%20...%2C%202.%20...%2C%203.%20...%5D",
    sampleTitle: "Ejemplo de lo que recibes",
    sampleMonths: [
      {
        month: "Enero",
        chatgpt: { found: true, position: 5, readable: "B", operable: "C" },
        claude: { found: false, position: null, readable: "C", operable: "D" },
        perplexity: { found: true, position: 3, readable: "B", operable: "C" },
        gemini: { found: true, position: 8, readable: "C", operable: "D" },
      },
      {
        month: "Febrero",
        chatgpt: { found: true, position: 3, readable: "A", operable: "B" },
        claude: { found: true, position: 6, readable: "B", operable: "C" },
        perplexity: { found: true, position: 2, readable: "A", operable: "B" },
        gemini: { found: true, position: 5, readable: "B", operable: "C" },
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Por qué cada modelo da resultados distintos?",
        a: "Cada modelo de IA tiene su propio índice, sus fuentes de datos y sus criterios de recomendación. ChatGPT prioriza popularidad y contenido reciente, Claude valora más los datos estructurados, Perplexity cita fuentes directamente y Gemini se integra con el índice de Google. Optimizar solo para uno puede dejarte invisible en los demás.",
      },
      {
        q: "¿Quiénes son los competidores que analizáis?",
        a: "Tú nos dices quiénes son tus 2-3 competidores principales. Si no estás seguro, te ayudamos a identificarlos basándonos en quién aparece cuando buscamos tu servicio en los distintos modelos.",
      },
      {
        q: "¿Cada cuánto recibo el informe?",
        a: "Una vez al mes, siempre en la primera semana. Si detectamos algo urgente entre informes (un competidor que te adelanta, un cambio en tu web que rompe algo), te avisamos por email inmediatamente.",
      },
      {
        q: "¿Hay permanencia?",
        a: "No. Cancela cuando quieras. Sin penalizaciones, sin preguntas.",
      },
      {
        q: "¿Puedo empezar con un solo informe para probar?",
        a: "Sí. El informe de visibilidad IA gratuito ya incluye un test con un modelo. La monitorización mensual amplía esto a 4 modelos + competidores + evolución temporal.",
      },
    ],
    finalCtaTitle: "Empieza a monitorizar tu visibilidad IA",
    finalCtaBody:
      "Escríbenos con tu URL y tus competidores principales. Recibirás el primer informe multi-modelo en menos de una semana.",
    finalCtaButton: "Solicitar monitorización",
    finalCtaHref:
      "mailto:hello@crawlready.dev?subject=Monitorización%20mensual&body=Hola%2C%20me%20interesa%20la%20monitorización%20mensual%20para%20mi%20web%3A%20%5Bpon%20tu%20URL%20aquí%5D%0A%0AMis%20competidores%20principales%20son%3A%20%5B1.%20...%2C%202.%20...%2C%203.%20...%5D",
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
