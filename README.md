# CrawlReady

We prove that businesses are losing revenue because AI agents can't operate on their websites — and we fix it.

**Live**: https://crawlready.dev

## Setup

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # Production build
```

Requires Node >= 22.

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Vercel (hosting + Blob storage)
- Resend (transactional email)
- pnpm

## Project Structure

```
src/
├── app/
│   ├── [lang]/              # i18n routes (es, en)
│   │   ├── _components/     # Page-level components
│   │   ├── confirmed/       # Post-confirmation page
│   │   ├── monitorizacion/  # Monitoring page
│   │   ├── report/[slug]/   # Dynamic report pages
│   │   └── servicios/       # Services page (hidden from nav)
│   ├── admin/leads/         # Admin dashboard (password-protected)
│   └── api/
│       ├── agent-test/      # Agentic test endpoint
│       ├── confirm/         # Email confirmation endpoint
│       ├── scan/            # Scanner endpoint
│       └── track/           # Lead tracking endpoint
├── data/reports/            # Report data (JSON)
├── lib/
│   ├── i18n/                # Translations (es.ts, en.ts)
│   ├── agentTest.ts         # Agentic test engine
│   ├── agentTerminalHtml.ts # Terminal animation for reports
│   ├── email.ts             # Email utilities
│   ├── scanner.ts           # AI readiness scanner (7 checks)
│   ├── tracker.ts           # Lead tracking
│   └── types.ts             # Shared types
public/
├── reports/                 # Published HTML reports
└── llms.txt                 # LLM communication file
outreach/                    # Client outreach materials & campaign data
docs/                        # Internal documentation
```

## Environment Variables

See `.env.local` for required variables. Secrets are managed in Vercel dashboard for production.
