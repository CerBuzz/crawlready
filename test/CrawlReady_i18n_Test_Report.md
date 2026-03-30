# Informe de Testing: CrawlReady i18n Deployment

**Sitio:** crawlready.dev | **Fecha:** 29 marzo 2026

---

## Resumen ejecutivo

**48 tests ejecutados: 37 PASS | 3 FAIL | 8 WARN — Tasa de exito: 77%**

### Problemas criticos (FAIL)

1. **Redireccion raiz (/) lleva a /en en lugar de /es** — Al abrir `https://crawlready.dev` el usuario es redirigido a `/en`. El `hreflang x-default` apunta a `/es`, por lo que la redireccion por defecto deberia ser a `/es`.
2. **Redireccion /servicios lleva a /en/servicios en lugar de /es/servicios** — Las rutas sin prefijo de idioma deberian redirigir a la version en espanol (`/es/servicios`), pero redirigen a la inglesa.
3. **Resultados del scanner en /es muestran textos en ingles** — Tras escanear `stripe.com` desde `/es`, los textos de cada check aparecen en ingles (ej. "llms.txt found with meaningful content", "robots.txt allows AI crawlers to access your site"). Solo el titulo "Informe de visibilidad IA" y el mensaje resumen estan en espanol.

### Problemas menores (WARN)

1. **No existe boton CTA "Ver como solucionarlo" / "See how to fix it" tras escaneo** — El test esperaba un boton que enlazara a `/es/servicios` o `/en/servicios` despues de los resultados del scanner. No se encontro en ninguno de los dos idiomas.
2. **URL invalida no muestra error explicito** — Al introducir `not-a-valid-url!!!` y pulsar Analizar, no se muestra un mensaje de error. En su lugar, la API procesa la URL y devuelve resultados con score 15/100 (grade F). La pagina no se rompe, pero la UX seria mejor con validacion previa.
3. **/fr redirige a /en/fr y muestra 404** — En vez de redirigir a `/es` o mostrar 404 directamente en `/fr`, la app redirige a `/en/fr` y alli muestra la pagina 404.
4. **Tests mobile no verificables** — El viewport minimo del navegador de testing era 1158px, por lo que no se pudo comprobar si el header colapsa ni si las cards/planes apilan en columna.

---

## Detalle de tests

### 1. Navegacion y redirecciones

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| `crawlready.dev` (raiz) | Redirigir a `/es` | Redirige a `/en` | **FAIL** |
| `/es` | Landing en espanol | Landing en espanol OK | PASS |
| `/en` | Landing en ingles | Landing en ingles OK | PASS |
| `/es/servicios` | Servicios en espanol | Servicios en espanol OK | PASS |
| `/en/servicios` | Servicios en ingles | Servicios en ingles OK | PASS |
| `/servicios` (sin locale) | Redirigir a `/es/servicios` | Redirige a `/en/servicios` | **FAIL** |

### 2. Selector de idioma

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| En `/es`: boton EN | Muestra "EN", lleva a `/en` | Muestra "EN", href=`/en`, navega correctamente | PASS |
| En `/en`: boton ES | Muestra "ES", lleva a `/es` | Muestra "ES", href=`/es`, navega correctamente | PASS |
| En `/es/servicios`: boton EN | Lleva a `/en` | href=`/en` | PASS |
| En `/en/servicios`: boton ES | Lleva a `/es` | href=`/es` | PASS |

### 3. Contenido espanol (`/es`)

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| Hero h1 | "Los agentes de IA no solo buscan. Tambien actuan en tu web." | Texto correcto | PASS |
| Badge | "La busqueda IA esta sustituyendo a Google..." | "La busqueda IA esta sustituyendo a Google. Tu web esta preparada?" | PASS |
| Nav items | Scanner, Como funciona, Servicios | Scanner, Como funciona, Servicios | PASS |
| Seccion "Que analizamos" | 6 cards en espanol | 6 cards: llms.txt, Acceso de crawlers IA, Datos estructurados, Meta tags y OG, Sitemap, Velocidad y seguridad | PASS |
| Footer | "CrawlReady — Agencia de Visibilidad IA" | "CrawlReady — Agencia de Visibilidad IA" | PASS |

### 4. Contenido ingles (`/en`)

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| Hero h1 | "AI agents don't just search. They take action on your website." | Texto correcto | PASS |
| Nav items | Scanner, How It Works, Services | Scanner, How It Works, Services | PASS |
| Seccion "What We Check" | 6 cards en ingles | 6 cards: llms.txt, AI Crawler Access, Structured Data, Meta Tags & OG, Sitemap, Speed & Security | PASS |
| Footer | "CrawlReady — AI Readiness Agency" | Texto correcto | PASS |

### 5. Scanner

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| Placeholder `/es` | "Introduce la URL de tu web..." | "Introduce la URL de tu web (ej. ejemplo.com)" | PASS |
| Placeholder `/en` | "Enter your website URL..." | "Enter your website URL (e.g. example.com)" | PASS |
| Boton vacio deshabilitado | Deshabilitado | `disabled=true` confirmado | PASS |
| Scan `stripe.com` en `/es` | Resultados + boton "Ver como solucionarlo" a `/es/servicios` | Resultados OK (88/100, grade A), pero sin boton CTA | **WARN** |
| Scan `stripe.com` en `/en` | Resultados + boton "See how to fix it" a `/en/servicios` | Resultados OK, titulo "AI Readiness Report", sin boton CTA | **WARN** |
| URL invalida | Muestra error sin romper pagina | No muestra error, devuelve score 15/100 (grade F). Pagina no se rompe | **WARN** |
| Textos resultados en `/es` | Textos en espanol | Textos en ingles (ej. "llms.txt found with meaningful content") | **FAIL** |

### 6. Servicios espanol (`/es/servicios`)

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| Hero | "Que los agentes de IA no solo te encuentren, sino que puedan actuar" | Texto correcto | PASS |
| 3 pasos | "Probamos tu web", "Te contamos que pasa", "Te damos la solucion" | Los 3 pasos correctos | PASS |
| 3 planes | "Gratis" / "97 pago unico" / "397 pago unico" | Presentes y correctos | PASS |
| Plan medio marcado "Mas popular" | Badge "Mas popular" + borde cyan | Badge `<span>` con texto "Mas popular" + clase `border-accent/30` | PASS |
| Add-on monitorizacion | "Monitorizacion mensual 97/mes" | Presente y correcto | PASS |
| 6 FAQ en espanol | 6 preguntas | 6 preguntas encontradas (Que es un agente IA, Por que mi web no funciona, Como se si me afecta, Que incluye el kit, Que pasa sin equipo tecnico, Cuanto tarda) | PASS |
| CTA "Solicitar informe gratis" | Abre email a hello@crawlready.dev | `mailto:hello@crawlready.dev` con subject pre-rellenado | PASS |
| Botones de planes | Emails con asuntos pre-rellenados | 4 mailto links (Solicitar informe gratis, Solicitar kit, Solicitar implementacion, Solicitar informe gratis) todos con subject | PASS |

### 7. Servicios ingles (`/en/servicios`)

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| Hero | "Let AI agents not just find you, but act on your site" | Texto correcto | PASS |
| 3 steps | "We test your site", "We show you what happens", "We give you the solution" | Los 3 pasos correctos | PASS |
| 3 plans | "Free" / "97 one-time" / "397 one-time" | Presentes y correctos | PASS |
| Plan medio "Most popular" | Badge "Most popular" | Badge `<span>` con texto "Most popular" encontrado | PASS |
| FAQ en ingles | FAQ en ingles | 6 preguntas en ingles | PASS |
| Botones mailto | Emails con asuntos en ingles | 4 mailto links (Request free report, Request kit, Request implementation, Request free report) con subjects | PASS |

### 8. SEO

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| `<title>` en `/es` | Contiene "Tu web funciona para agentes de IA" | "CrawlReady — Tu web funciona para agentes de IA?" | PASS |
| `<title>` en `/en` | Contiene "Is Your Website Ready for AI Agents?" | "CrawlReady — Is Your Website Ready for AI Agents?" | PASS |
| `hreflang="es"` (ambas) | `<link rel="alternate" hreflang="es">` | Presente en `/es` y `/en`, apunta a `crawlready.dev/es` | PASS |
| `hreflang="en"` (ambas) | `<link rel="alternate" hreflang="en">` | Presente en `/es` y `/en`, apunta a `crawlready.dev/en` | PASS |
| `og:locale` en `/es` | `es_ES` | `es_ES` | PASS |
| `og:locale` en `/en` | `en_US` | `en_US` | PASS |

**Nota adicional SEO:** Se detecta tambien un `hreflang="x-default"` apuntando a `/es`, lo cual es correcto pero contradice el comportamiento actual de redireccion de la raiz (que va a `/en`).

### 9. API

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| POST `/api/scan` con `{"url": "stripe.com"}` | Responde JSON con resultados | HTTP 200, JSON con keys: url, totalScore, maxPossibleScore, grade, checks, scannedAt | PASS |

### 10. Mobile

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| `/es` responsive | Header colapsa, cards apilan | No verificable (viewport minimo 1158px en herramienta de testing) | **WARN** |
| `/es/servicios` responsive | Planes apilan en columna | No verificable (viewport minimo 1158px en herramienta de testing) | **WARN** |

### 11. Errores y 404

| Test | Esperado | Resultado | Estado |
|------|----------|-----------|--------|
| `/fr` | 404 o redirigir a `/es` | Redirige a `/en/fr`, muestra "404: This page could not be found" | **WARN** |
| `/en/pagina-que-no-existe` | 404 | "404: This page could not be found" | PASS |

---

## Recomendaciones prioritarias

1. **Corregir la redireccion por defecto** — La raiz `/` y las rutas sin locale (`/servicios`) deben redirigir a `/es` segun el `hreflang x-default`. Revisar el middleware de i18n / configuracion de Next.js.
2. **Traducir los resultados del scanner** — Los textos de los checks individuales (descriptions y recommendations) se devuelven en ingles desde la API. Implementar i18n en las respuestas del endpoint o traducir en el frontend segun el locale activo.
3. **Anadir boton CTA post-escaneo** — Incluir "Ver como solucionarlo" / "See how to fix it" enlazando a `/es/servicios` o `/en/servicios` al final de los resultados del scanner.
4. **Validacion de URL en frontend** — Anadir validacion basica antes de enviar al API para mostrar un mensaje de error claro con URLs invalidas.
5. **Verificar responsive manualmente** — Probar en dispositivo movil real o DevTools que el header colapsa y los planes apilan correctamente.
