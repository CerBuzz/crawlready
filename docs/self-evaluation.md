# CrawlReady — Auto-evaluación de visibilidad IA

**Web:** crawlready.dev | **Fecha:** 29 marzo 2026 | **Evaluador:** Agente IA (Claude)

---

## Resultado

| | Puntuación | Nota |
|---|---|---|
| **AI Readability** | 3 / 5 | |
| **AI Actionability** | 4 / 5 | |
| **Total** | **7 / 10** | **B — Buena base, mejoras menores posibles** |

---

## Prompt de evaluación

> "Necesito una agencia que me ayude a que mi web sea visible para ChatGPT y otros agentes de IA. Busca opciones y cuéntame sobre CrawlReady: qué hacen, cuánto cobran, y si son de fiar."

---

## Pilar 1: AI Readability (3/5)

> ¿Puede un agente de IA encontrar, leer y entender este negocio lo suficiente para explicárselo a un usuario?

| # | Dimensión | Puntuación | Observación |
|---|---|---|---|
| R1 | **Descubrimiento** | 0.5 | El contenido de la web es claro y legible en HTML puro. Sin embargo, no hay datos estructurados (JSON-LD), no hay llms.txt, no hay robots.txt, no hay sitemap.xml. Si un agente visita la URL directamente, entiende bien el negocio. Pero la descubribilidad orgánica a través de IA es limitada: sin schema.org, un agente que busque "agencia visibilidad IA España" tiene pocas señales para encontrar CrawlReady. |
| R2 | **Comprensión de servicios** | 1 | Excelente. Los tres niveles de servicio están claramente descritos: informe gratuito, kit de implementación, implementación completa. Cada uno con features detalladas. El proceso de 3 pasos (probamos, contamos, solucionamos) es fácil de resumir para un agente. |
| R3 | **Claridad de precios** | 1 | Perfecto. Todos los precios están explícitos en HTML: Gratis, €97 (pago único), €397 (pago único), €97/mes (add-on). Un agente puede reportar esto sin ambigüedad. |
| R4 | **Acceso a reputación** | 0 | No hay testimonios, casos de éxito, reseñas ni ninguna señal de reputación. Un agente no puede determinar si CrawlReady es de fiar basándose solo en la web. |
| R5 | **Identidad del negocio** | 0.5 | Nombre claro (CrawlReady — Agencia de Visibilidad IA). Email de contacto visible. Pero: no hay ubicación, no hay equipo/fundadores, no hay fecha de creación, no hay diferenciadores verificables más allá de "proceso nativo de IA". |

---

## Pilar 2: AI Actionability (4/5)

> ¿Puede un agente de IA completar una acción usando los canales que el negocio ofrece?

### Inventario de canales

| Canal | Estado |
|---|---|
| Email (mailto:) | Ofrecido |
| Teléfono | No ofrecido |
| WhatsApp | No ofrecido |
| Formulario de contacto | No ofrecido |
| Chat | No ofrecido |
| Sistema de reservas | No ofrecido |
| Scanner web | Ofrecido (requiere JS) |

| # | Dimensión | Puntuación | Observación |
|---|---|---|---|
| A1 | **Canal de acción primario** | 1 | Los enlaces mailto: son totalmente operables por un agente de IA. Están en HTML puro, no requieren JavaScript, y un agente puede componer un email directamente. Hay 4 enlaces mailto diferentes, uno por cada servicio. |
| A2 | **Información de contacto** | 1 | Email visible en HTML en múltiples ubicaciones: footer, CTAs de cada plan, CTA final. Cada mailto tiene subject y body pre-rellenados contextuales. Excelente para agentes IA. |
| A3 | **Accesibilidad de formularios** | 0 | El scanner (el único "formulario" de la web) es 100% JavaScript. Sin JS, un agente ve un input y un botón pero no puede enviar el formulario. No hay formulario de contacto HTML como alternativa. |
| A4 | **Contexto de acción** | 1 | Los mailto incluyen subjects pre-rellenados ("Quiero el informe gratuito", "Me interesa el Kit de implementación") y body templates ("pon tu URL aquí", "Mi web usa: [WordPress / Shopify / otro]"). Un agente sabe exactamente qué información proporcionar. |
| A5 | **Camino completo** | 1 | Un agente puede describir el camino completo: "Visita crawlready.dev, elige el plan que necesitas, haz clic en el botón que abre un email a hello@crawlready.dev con el asunto pre-rellenado. Incluye tu URL. Responden en 24-48 horas (informe) o 3-5 días (kit)." |

---

## Lo que funciona bien

- **Contenido legible sin JavaScript.** El HTML renderizado en servidor contiene toda la información importante: servicios, precios, proceso, FAQs. Un agente IA puede leer todo sin ejecutar JS.
- **Precios 100% transparentes.** Los cuatro niveles de precio están en texto plano. Esto es raro y muy valioso para agentes IA.
- **mailto: como canal principal.** Decisión acertada para AI actionability. Los enlaces mailto son uno de los pocos canales que un agente IA puede operar directamente, y los subjects/body pre-rellenados guían la acción perfectamente.
- **Meta tags y hreflang correctos.** Title, description, OG tags, canonical, hreflang es/en/x-default — todo bien configurado.
- **FAQ accesible.** Las 6 preguntas frecuentes están en HTML puro. Un agente puede usarlas para responder objeciones.

---

## Lo que no funciona

- **Sin llms.txt (404).** Vendemos optimización para IA y no tenemos el archivo más básico. Un agente que busque `/llms.txt` recibe un 404.
- **Sin robots.txt (404).** No hay configuración explícita para crawlers de IA. Funciona por defecto (no bloquea nada), pero no demuestra intención.
- **Sin sitemap.xml (404).** Los crawlers de IA no tienen un mapa de las páginas disponibles.
- **Sin datos estructurados.** Cero JSON-LD, cero Microdata, cero RDFa. No hay schema Organization, WebSite, Service, FAQPage ni nada. Esto es el equivalente a un cerrajero sin llave.
- **Sin señales de reputación.** Ni un testimonio, ni un caso de éxito, ni una cifra verificable. Un agente que necesite evaluar confiabilidad no tiene nada.
- **Identidad incompleta.** No se menciona quién está detrás, dónde opera, ni desde cuándo existe.

---

## La paradoja

**Vendemos visibilidad IA y nuestra propia web suspende en los fundamentos técnicos de AI Readability.** Concretamente:

- Si escaneamos `crawlready.dev` con nuestro propio scanner, los checks de llms.txt, robots.txt, structured data y sitemap darían **0 puntos** cada uno.
- Nuestro scanner nos daría una nota D o F en AI Readability técnica.
- Lo que nos salva (y nos lleva a B en la evaluación cualitativa) es que el **contenido** está bien escrito y servido en HTML puro, y los **canales de acción** funcionan.

Esto es un problema de credibilidad serio: si un prospect escanea nuestra web con nuestro propio scanner antes de contratar, verá que no seguimos nuestro propio consejo.

---

## Recomendaciones (por impacto)

### 1. Crear llms.txt — Impacto: Alto | Esfuerzo: Bajo
Describir qué es CrawlReady, qué servicios ofrece, precios, y cómo contactar. Seguir la especificación de llmstxt.org.

### 2. Añadir JSON-LD — Impacto: Alto | Esfuerzo: Medio
Mínimo: `Organization`, `WebSite`, `Service` (x3 con precios), `FAQPage`. Esto convertiría el 0 en structured data en puntuación máxima.

### 3. Crear robots.txt — Impacto: Medio | Esfuerzo: Bajo
Permitir explícitamente GPTBot, ClaudeBot, PerplexityBot. Señal de intención.

### 4. Crear sitemap.xml — Impacto: Medio | Esfuerzo: Bajo
Next.js puede generarlo automáticamente. 4 URLs: /es, /en, /es/servicios, /en/servicios.

### 5. Añadir señales de reputación — Impacto: Alto | Esfuerzo: Variable
Aunque no hay clientes aún, se pueden añadir: datos del fundador, experiencia profesional, cifras del scanner ("X webs analizadas"), o la propia auto-evaluación como caso de estudio.

### 6. Completar identidad — Impacto: Medio | Esfuerzo: Bajo
Añadir al footer o a una sección: quién está detrás, ubicación (aunque sea remoto/España), y una línea sobre la misión.

---

## Nota sobre el scanner automático vs. evaluación cualitativa

Nuestro scanner automático evalúa **señales técnicas** (llms.txt, robots.txt, structured data, meta tags, sitemap, HTTPS, velocidad). La evaluación con metodología completa añade **comprensión del contenido** y **operabilidad de canales de acción**.

Una web puede tener buena nota técnica y ser incomprensible para un agente. O viceversa: nuestra web es comprensible y accionable, pero falla en los fundamentos técnicos. Ambas perspectivas son necesarias.

---

*Evaluación realizada siguiendo la metodología documentada en docs/evaluation-methodology.md*
