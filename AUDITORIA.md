# Auditoría Completa — CrawlReady

**6 agentes, 5 áreas analizadas. Fecha: 2026-04-02.**

---

## Veredicto Ejecutivo

El producto técnico está **sorprendentemente bien construido** para una startup en validación. Pipeline de outreach automatizado, motor de tests agentic con SSE, informes HTML publicados, i18n funcional. Pero hay **vulnerabilidades de seguridad críticas** que deben arreglarse antes de escalar, y el negocio tiene **0 ingresos y solo 2 leads contactados**.

**Nota global: 7/10 técnico, 3/10 tracción comercial.**

---

## 1. Seguridad — Crítico

| # | Problema | Riesgo |
|---|----------|--------|
| 1 | **Password admin en URL query string** — visible en logs de Vercel, historial del navegador | Cualquiera con acceso a logs ve la contraseña |
| 2 | **Blobs públicos con tokens de confirmación** — `access: "public"` significa que quien adivine la URL del blob tiene email + token del lead | Confirmación de leads por terceros |
| 3 | **Confirmación O(n)** — cada click de confirmación descarga TODOS los blobs. Con 100 leads = 100 fetches por click | Costes de Vercel + lentitud |
| 4 | **Sin rate limiting en /api/scan y /api/track** — scan hace 7 requests externas por llamada | SSRF + abuso como proxy + spam de leads falsos |
| 5 | **Sin validación de email/URL en /api/track** — acepta cualquier string | Datos basura en blobs |
| 6 | **XSS en emails internos** — `lead.email` y `lead.url` se interpolan en HTML sin escapar | Inyección en el inbox de Antonio |
| 7 | **SSRF posible** — /api/scan y /api/agent-test fetch cualquier URL, incluyendo `169.254.169.254` (metadata AWS) | Exposición de infra interna |

---

## 2. Bugs de Lógica

| # | Archivo | Bug |
|---|---------|-----|
| 1 | `src/lib/agentTest.ts:246` | `overallStatus` devuelve `"pass"` cuando todos los substeps son `"partial"` — debería ser `"partial"` |
| 2 | `src/lib/scanner.ts:435` | `checkResponseTime` hace un segundo fetch al homepage (ya se hizo antes). Doble petición innecesaria |
| 3 | `src/lib/scanner.ts:134` | Regex de `blanketBlock` da falso positivo: `Disallow: /private/` se detecta como bloqueo total |
| 4 | `src/app/api/confirm/route.ts` | `del` + `put` no es atómico — doble click envía dos emails de notificación |
| 5 | `src/app/api/confirm/route.ts` | Token no expira nunca (el email dice 48h, el servidor no lo comprueba) |

---

## 3. Frontend / UX

| # | Problema | Impacto |
|---|----------|---------|
| 1 | **Sin navegación móvil** — nav es `hidden sm:flex`, no hay hamburger menu | Usuarios móviles no acceden a secciones ni al cambio de idioma |
| 2 | **Sin og:image** en ninguna página | Todas las comparticiones en redes sociales salen sin imagen |
| 3 | **Link a "Servicios" no existe** en el header del landing — la página existe pero es inaccesible | Página huérfana |
| 4 | **ReportClient tiene strings hardcodeados** fuera del sistema i18n (~20 líneas en español/inglés inline) | Mantenibilidad, inconsistencia |
| 5 | **Subpáginas sin metadata propia** — servicios, monitorización, y report/[slug] heredan meta genérica | SEO pobre, canonicals incorrectos |
| 6 | **AgentTerminal** — textos "Test completed" y "Run again" siempre en inglés | Inconsistencia con locale |
| 7 | **Botón upsell en ReportClient** — trackea click pero no envía email/notificación a CrawlReady | Lead perdido |

---

## 4. Infraestructura

| Área | Estado | Nota |
|------|--------|------|
| Next.js 16.2.1 + React 19 | OK | Versiones correctas |
| TypeScript strict | OK | Path aliases, tipos compartidos |
| Tailwind CSS 4 | OK | Color accent discrepante (#22d3ee vs #00e5ff documentado) |
| Dependencias | OK | Sin bloat, pnpm lock en sync |
| .gitignore | OK | .env* excluido |
| CI/CD | NO EXISTE | Sin GitHub Actions, sin pre-commit hooks, sin tests |
| next.config.ts | VACÍO | Sin security headers (CSP, X-Frame-Options) |
| AGENTS.md | DESACTUALIZADO | Dice "Nodemailer + SMTP" pero usa Resend |
| Telegram alerts | PARCIAL | agent-contact no envía alerta Telegram |
| /api/resend | INCOMPLETO | Solo busca `leads/`, no `agent-leads/` |

---

## 5. Negocio / Tracción

| Métrica | Valor |
|---------|-------|
| **Ingresos** | €0 |
| **Leads contactados** | 2 (Eso Es Agency, CFP Rumasa) |
| **Respuestas de clientes** | 0 documentadas |
| **Reportes publicados** | 2 (esoesagency, cfprumasa) |
| **Tests de validación** | 4 (+ escuela-emprende, ecommaster) |
| **Pipeline automatizado** | Funcional (scan → test → report → deploy → email) |
| **Canales activos** | Solo email frío |
| **LinkedIn** | TODO (no activado) |
| **Precio validado** | No — €197/€397 son hipótesis |

**Caso estrella**: Ecommaster (Grade F, 0/10) — prueba irrefutable del problema. Site de €3.500/programa totalmente invisible para agentes IA por JavaScript rendering.

---

## 6. Detalles Técnicos por Área

### 6.1 Scanner (src/lib/scanner.ts)

7 checks en paralelo con `Promise.all`:

| Check | Peso | Qué mide |
|-------|------|----------|
| llms.txt | 15 | Archivo de comunicación LLM |
| robots.txt | 15 | Acceso de crawlers IA |
| Structured Data | 20 | JSON-LD / Schema.org |
| Meta Tags & OG | 15 | Title, description, Open Graph |
| Sitemap | 10 | Descubribilidad de páginas |
| HTTPS | 10 | Seguridad base |
| Response Time | 15 | Velocidad para crawlers IA |

**Score**: Suma de pesos, Grade A>=85%, B>=70%, C>=50%, D>=30%, F<30%.

**Problemas**:
- `checkResponseTime` hace fetch duplicado del homepage (ya se hizo antes)
- Regex `blanketBlock` da falso positivo con disallows parciales como `/private/`
- Sin rate limiting — se puede usar como proxy para bombardear URLs externas

### 6.2 Agentic Test Engine (src/lib/agentTest.ts)

SSE streaming con 6 pasos:

1. **Discovery** — Fetch URL, extrae título, headings, texto (2000 chars max)
2. **Navigation** — Extrae links internos, puntúa por keywords, fetch top 4
3. **Contact Discovery** — Busca mailto, tel, WhatsApp, forms, chat widgets
4. **Agent-Ready Forms** — Evalúa forms contra 4 criterios (CAPTCHA, action, fields, submit)
5. **Structured Data** — Parsea JSON-LD, verifica 4 campos clave
6. **Verdict** — Scoring ponderado (forms x3, contact x2, resto x1)

`maxDuration = 60` en Vercel. Peor caso: ~40s (5 fetches x 8s timeout).

**Bug confirmado**: `stepDiscovery:246` — tercer branch devuelve `"pass"` en vez de `"partial"`.

### 6.3 Lead Pipeline

**POST /api/track** — Captura lead:
1. Acepta JSON y text/plain (para `sendBeacon`)
2. Sin email/URL = analytics event (silencioso)
3. Con email = lead: scan duplicados O(n), genera token UUID, intenta enviar email confirmación
4. Almacena en Vercel Blob `leads/{timestamp}-{email}.json` con `access: "public"`
5. Telegram alert fire-and-forget

**GET /api/track** — Admin listing (password en query string).

**GET /api/confirm** — Confirmación por token:
1. Itera TODOS los blobs buscando match (O(n))
2. `del` + `put` (no atómico)
3. Envía notificación interna + Telegram alert
4. Redirect a `/{lang}/confirmed`

### 6.4 Agent Contact (/api/agent-contact)

**El endpoint mejor diseñado del proyecto**:
- Rate limiting (5 req/min por IP)
- Body size limit (4096 bytes)
- Honeypot field
- Sanitización HTML
- Validación email/URL con regex
- Almacena IP y User-Agent

**Gap**: No envía Telegram alert. No tiene campo `emailSent`. `/api/resend` no busca en `agent-leads/`.

### 6.5 Email System (src/lib/email.ts)

3 funciones via Resend API:
- `sendConfirmationEmail` — Bilingüe, URL desde `VERCEL_PROJECT_PRODUCTION_URL`
- `notifyNewLead` — Notificación interna cuando lead confirma
- `sendOutreachEmail` — Email frío desde "Antonio @ CrawlReady"

Sin retry logic. Un fallo de Resend = no email.

### 6.6 i18n

`es.ts` y `en.ts` con tipo `Dictionary` que fuerza paridad de keys en TypeScript. Sin keys faltantes.

**Pero**: ReportClient.tsx tiene ~20 líneas de texto hardcodeado con `isEs ? "español" : "english"` fuera del diccionario. AgentTerminal footer siempre en inglés.

---

## 7. Prioridades Recomendadas

### Inmediato (antes de más outreach)
1. Fix bug `agentTest.ts:246` — "pass" → "partial"
2. Actualizar AGENTS.md — Resend, no Nodemailer
3. Navegación móvil (hamburger menu)
4. og:image para comparticiones sociales

### Corto plazo (esta semana)
5. Password admin en header Authorization (no query string)
6. Blobs con `access: "private"` o separar tokens
7. Token en filename del blob para lookup directo (elimina O(n))
8. Rate limiting en /api/scan y /api/track
9. Validación email/URL en /api/track
10. HTML escape en emails internos

### Medio plazo
11. GitHub Actions CI (lint + type-check + build)
12. Activar LinkedIn outreach
13. Security headers en next.config.ts
14. Telegram alert para agent-contact leads
15. Metadata propia para subpáginas y reportes

---

*Auditoría realizada por Claude (co-founder técnico) con 6 agentes especializados en paralelo: Code Reviewer, Frontend Auditor, Backend Auditor, Business Auditor, Infra Auditor, Live Site Checker.*
