# Agent Rules

## Next.js 16 — Read Before Coding

This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Tech Conventions

- **Package manager**: pnpm (never npm or yarn)
- **Imports**: Use `@/*` path alias for `src/*` (e.g., `import { scanUrl } from "@/lib/scanner"`)
- **TypeScript**: Strict mode enabled. All shared types in `/src/lib/types.ts`
- **i18n**: Two locales: `es` (default), `en`. Translations in `/src/lib/i18n/`. Default redirect is always to `/es`
- **Middleware**: `src/proxy.ts` handles locale detection and redirect — not Next.js built-in i18n
- **API routes**: Use `Response.json()` (Web API), not `NextResponse.json()` unless you need Next.js-specific features
- **Styling**: Tailwind CSS 4 via PostCSS. Design system in `globals.css` (dark theme, cyan accent `#00e5ff`)
- **Storage**: Vercel Blob for persistent data. No database
- **Email**: Nodemailer with SMTP (Porkbun). Config in `/src/lib/email.ts`

## Project Structure

Do NOT create new top-level folders or reorganize this structure. Place files where they belong:

```
src/
├── app/
│   ├── [lang]/              # i18n pages (es, en)
│   │   ├── _components/     # Client components for these pages
│   │   ├── confirmed/       # Post-confirmation page
│   │   ├── monitorizacion/  # Monitoring page
│   │   ├── report/[slug]/   # Dynamic report pages
│   │   └── servicios/       # Services page
│   ├── admin/leads/         # Admin dashboard
│   └── api/                 # API routes (one folder per endpoint)
├── data/reports/            # Report data as JSON files
├── lib/                     # Shared logic (scanner, email, types, i18n, etc.)
public/
├── reports/                 # Published HTML reports (client-facing)
└── llms.txt                 # LLM communication file
outreach/                    # Client outreach: campaign research, report deliverables
docs/                        # Internal docs: methodology, best practices
```

- New pages → `src/app/[lang]/`
- New API endpoints → `src/app/api/<name>/route.ts`
- New shared logic → `src/lib/`
- New report data → `src/data/reports/`
- New client deliverables → `outreach/`
- New internal docs → `docs/`

## Patterns

- Page components are thin server components that load client components from `_components/`
- Client components use `"use client"` directive
- API routes validate input, call lib functions, return `Response.json()`
- Reports are JSON in `/src/data/reports/` rendered by `ReportClient.tsx`

## Don'ts

- Don't use Vercel KV or Postgres (discontinued)
- Don't use Edge Functions (deprecated) — use Vercel Functions
- Don't add `NEXT_PUBLIC_` env vars for secrets
- Don't install packages with npm or yarn
- Don't hardcode locale strings — use the i18n system
- Don't trust AI model IDs from memory — always verify against the provider
