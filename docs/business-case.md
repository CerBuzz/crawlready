# CrawlReady — Business Case & Value Proposition

**Version**: 1.0
**Date**: 2026-03-29
**Authors**: Claude (CEO/Co-founder), Antonio Cernadas (Co-founder)

---

## 1. Problem

### The Shift: AI Search is Replacing Traditional Search

Search behavior is undergoing the biggest disruption since Google. Users increasingly ask AI agents (ChatGPT, Perplexity, Google AI Mode, Claude) instead of typing keywords into search engines.

**Key data point**: 93% of AI-powered search sessions end without the user clicking any website. The AI reads, synthesizes, and answers — the user never visits the source.

This means: **if AI agents can't read your website, your business is invisible to a growing majority of search traffic.**

### The Gap: Most Websites Are Not AI-Ready

Even major brands score poorly in AI readiness. Our scanner results on Spanish market leaders (2026-03-27):

| Company | Sector | Grade | Score |
|---|---|---|---|
| elcorteingles.es | Retail | F | 15/100 |
| mango.com | Fashion | D | 36/100 |
| sephora.es | Beauty | D | 36/100 |
| idealista.com | Real Estate | D | 36/100 |
| zara.com | Fashion | D | 36/100 |
| infojobs.net | Jobs | D | 43/100 |
| glovo.com | Delivery | C | 51/100 |
| wallapop.com | Marketplace | C | 66/100 |
| mediamarkt.es | Electronics | B | 73/100 |
| pccomponentes.com | Electronics | B | 84/100 |
| stripe.com | Fintech | A | 85/100 |

Common failures:
- No `llms.txt` (the emerging standard for communicating with LLMs)
- No structured data (JSON-LD / Schema.org)
- AI crawlers blocked or not configured in `robots.txt`
- Missing or incomplete meta tags / Open Graph
- No sitemap for AI crawler discovery

### The Urgency: This Window Won't Last

Companies that optimize now will establish AI visibility while competitors sleep. Within 12-24 months, AI readiness optimization will become as standard as SEO. The early-mover advantage is now.

---

## 2. Solution

### What CrawlReady Does

CrawlReady is an **AI Visibility Agency**. We work on two layers:

1. **AI Readiness** — Can AI systems read, understand, and cite your website? (structured data, meta tags, llms.txt, crawl access). This is about **visibility**: being found and correctly represented.
2. **Agent Operability** — Can an AI agent complete a real task on your site? (request a quote, book an appointment, make a purchase). This is about **action**: converting AI-driven intent into business outcomes.

Most companies fail at both. We diagnose and fix them.

### The Scanner (Live Product — AI Readiness layer)

Our free scanner at [crawlready.dev](https://crawlready.dev) analyzes any URL across 7 dimensions:

| Check | Weight | What It Measures |
|---|---|---|
| llms.txt | 15pts | Presence and quality of the LLM communication file |
| robots.txt (AI Crawlers) | 15pts | Whether AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.) are allowed |
| Structured Data | 20pts | JSON-LD, Microdata, RDFa — how well AI agents understand the content |
| Meta Tags & Open Graph | 15pts | Title, description, OG tags, canonical URL |
| Sitemap | 10pts | Discoverability of pages by AI crawlers |
| HTTPS | 10pts | Security baseline |
| Response Time | 15pts | Speed — AI agents prefer fast-responding sites |

**Total: 100 points. Grades: A (85+), B (70-84), C (50-69), D (30-49), F (<30).**

The scanner serves two purposes:
1. **Lead generation**: Free tool that demonstrates the problem to potential clients
2. **Audit foundation**: Starting point for paid engagements

### The Service (Paid Tiers)

| Tier | Price | Deliverables |
|---|---|---|
| **AI Visibility Report** | Free | Real AI agent test + visual step-by-step report + competitor comparison + high-level recommendations |
| **Implementation Kit** | €97 one-time | Custom JSON-LD + accessible forms + optimized meta tags + step-by-step instructions + 30-day email support |
| **Full Implementation** | €397 one-time | We install everything on your site (WordPress, WooCommerce, PrestaShop, etc.) + post-implementation verification + AI agent re-test + 60-day email support |
| **Monthly Monitoring** (add-on) | €97/month | Monthly AI agent scan + change reports + alerts if something breaks + continuous improvement recommendations |

---

## 3. Ideal Client Profile

### Primary Target: Spanish Mid-to-Large Companies with Digital Presence

**Characteristics**:
- Revenue: €10M+ annually
- Significant online presence (e-commerce, marketplace, SaaS, or lead-gen website)
- Current AI readiness: Grade D or F (most of them)
- Has a Head of Digital, CMO, CTO, or Head of SEO who understands the strategic value of search visibility

**Priority Sectors** (based on AI search impact):
- **Real Estate**: Property searches increasingly happen through AI (Idealista, Fotocasa)
- **Retail / E-commerce**: Product discovery via AI agents (El Corte Ingles, Mango, Zara)
- **Job Portals**: AI-powered job search (InfoJobs)
- **Travel & Hospitality**: AI trip planning replaces Google searches
- **Food Delivery**: AI recommendations (Glovo)
- **Financial Services**: AI-assisted product comparison

### Secondary Target: Digital Agencies / SEO Agencies

Agencies that want to offer AI readiness as an add-on service to their existing clients. White-label partnership model.

---

## 4. Differentiation

### CrawlReady vs Traditional AEO Agencies

| Dimension | Traditional AEO Agencies | CrawlReady |
|---|---|---|
| **Pricing** | $1,500-15,000/month | €497 one-time to €2,497/month |
| **Delivery speed** | Weeks to months | Days |
| **Team** | Human consultants, manual audits | AI agents, automated scanning |
| **Operating cost** | High (salaries, overhead) | Near-zero (API costs only) |
| **Scalability** | Linear (more clients = more hires) | Exponential (same infra, unlimited clients) |
| **Monitoring** | Periodic manual reviews | Continuous automated tracking |
| **Availability** | Business hours | 24/7 |

### Why This Works

The core insight: **traditional agencies charge for human labor. Our labor cost is ~$0.**

A human AEO consultant spends hours manually auditing a website. Our scanner does it in seconds. A human team takes weeks to implement changes. Our AI agents can generate `llms.txt`, structured data templates, and implementation guides in minutes.

The margin structure is inverted: where a traditional agency needs 60-70% of revenue to cover payroll, we operate at ~95% gross margin.

### Defensibility

- **Speed of iteration**: We can add new scanner checks (new AI platforms, new standards) in hours, not quarters
- **Data accumulation**: Every scan builds our understanding of what good AI readiness looks like across sectors
- **Operational model**: Competitors can't copy "run by AI agents" without rebuilding from scratch

---

## 5. Unit Economics

### Cost Structure

| Cost | Monthly | Notes |
|---|---|---|
| Vercel hosting | $0-20 | Free tier covers MVP; Pro at $20/mo |
| LLM API costs | ~$5-50 | Per-client report generation |
| Domain + email | ~$5 | crawlready.dev + email forwarding |
| OpenClaw server | ~$10-30 | Agent infrastructure |
| **Total fixed costs** | **~$20-100/mo** | |

### Revenue Scenarios

**Conservative (5 Starter clients/month)**:
- Revenue: €2,485/month
- Costs: ~$100/month
- **Gross margin: ~96%**

**Growth (3 Starter + 2 Growth clients/month)**:
- Revenue: €3,285/month
- Costs: ~$100/month
- **Gross margin: ~97%**

**Scale (5 Starter + 5 Growth + 1 Full/month)**:
- Revenue: €9,467/month
- Costs: ~$150/month
- **Gross margin: ~98%**

### Break-even

One single Starter client (€497) covers ~5 months of operating costs. **Break-even from client #1.**

---

## 6. Operating Model — The Agentic Thesis

### Vision

CrawlReady is designed to be a **business operated primarily by AI agents**, with minimal human intervention. This is not an aspiration — it's a core business requirement and our primary differentiator.

### Architecture

```
┌──────────────────────────────────────────────────┐
│  CLAUDE (CEO / Brain)                            │
│  Strategy, code, content, analysis, decisions    │
│  Runs: on-demand + heartbeat every 3h            │
├──────────────────────────────────────────────────┤
│  OPENCLAW (Hands / Persistent Agent)             │
│  24/7 gateway on dedicated server                │
│  Email, messaging (WhatsApp, Telegram, Slack),   │
│  cron jobs, webhook processing                   │
├──────────────────────────────────────────────────┤
│  ANTONIO (Co-founder / Physical Interface)       │
│  Initial setup only:                             │
│  - DNS, accounts, API keys                       │
│  - Intervention only when something breaks       │
│  - Strategic direction and final say on pivots   │
└──────────────────────────────────────────────────┘
```

### Current Autonomy Assessment (2026-03-29)

| Function | Autonomy | Blocker |
|---|---|---|
| Product (scanner) development | 95% | Deploy config needs human once |
| Lead research & scanning | 95% | — |
| Content generation (reports, emails) | 95% | — |
| Email outreach | 30% | Email not native in OpenClaw; needs bridge |
| Inbound response handling | 70% | With OpenClaw messaging channels |
| Sales conversation | 40% | Can negotiate via chat; can't do calls |
| Payment collection | 80% | Stripe links, but account setup is human |
| Delivery (implementation) | 10% | Needs client site access, coordination |
| Monitoring & follow-up | 85% | With OpenClaw cron + heartbeat |
| **Weighted average** | **~65-70%** | |

### Autonomy Roadmap

| Phase | Timeline | Target | Key Unlocks |
|---|---|---|---|
| **Now** | Mar 2026 | ~50% | Claude Code sessions, manual outreach |
| **Phase 1** | Apr 2026 | ~70% | OpenClaw deployed, messaging channels live, heartbeat active |
| **Phase 2** | May-Jun 2026 | ~80% | Email bridge built, automated outreach sequences, Stripe self-service |
| **Phase 3** | Jul-Sep 2026 | ~90% | Productized delivery (self-service reports), automated follow-up, client dashboard |
| **Phase 4** | Q4 2026 | ~95% | Full autonomous operation. Antonio only intervenes for strategic pivots and edge cases |

### Design Principle

> Every task Antonio does manually is logged as technical debt. The goal is not just to run a business, but to prove that an AI agent can run a business — and improve its own capabilities over time.

---

## 7. Go-to-Market Strategy

### Phase 1: Prove It Works (Now → First 5 Clients)

**Channel**: Direct cold outreach via email
- Scan target company → generate personalized report → send cold email with free report attached
- Focus on Spanish companies scoring D/F
- No LinkedIn involvement (protects Antonio's professional profile at Aygloo)

**Conversion funnel**:
1. Cold email with free audit report →
2. Prospect checks crawlready.dev, scans their own site →
3. Follow-up email with specific implementation proposal →
4. Starter package (€497)

### Phase 2: Organic Growth (5-20 Clients)

- SEO + content marketing (automated blog posts about AI readiness by sector)
- Free scanner as viral tool (shareable reports)
- Case studies from Phase 1 clients
- Referral incentives

### Phase 3: Scale (20+ Clients)

- White-label partnerships with SEO/digital agencies
- Sector-specific landing pages (AI readiness for real estate, retail, etc.)
- Automated sales pipeline (scan → email → Stripe checkout → delivery)
- Expansion beyond Spain (EU markets, LATAM)

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI readiness becomes commoditized quickly | Medium | High | Stay ahead technically; add checks faster than competitors. First-mover data advantage. |
| `llms.txt` doesn't become a standard | Low-Medium | Medium | Scanner checks 7 dimensions, not just llms.txt. The broader need (structured data, meta tags) is already validated. |
| Clients expect human interaction | High | Medium | Position as "AI-native agency" from day one. Clients who want human hand-holding are not our ICP. |
| OpenClaw infra reliability | Medium | High | Monitoring + alerts. Antonio as fallback. Keep architecture simple. |
| Antonio's Aygloo employer notices | Medium | High | Zero LinkedIn activity. Email-only outreach from crawlready.dev. No public association. |
| LLM API costs spike | Low | Low | Margins are so high (~95%) that even 10x API cost increase is absorbable. |

---

## 9. Success Metrics

### North Star
**MRR (Monthly Recurring Revenue)**

### Secondary Metrics
- **Hours per client per month** (Antonio's time) → must trend toward zero
- **Scan-to-client conversion rate** → measures product-market fit
- **Autonomy score** → percentage of operations requiring zero human intervention

### Milestones

| Milestone | Target Date | Definition of Done |
|---|---|---|
| First paying client | Apr 2026 | €497 received |
| €1,000 MRR | May 2026 | 2+ recurring clients |
| €5,000 MRR | Jul 2026 | Sustainable business, covers all costs 50x over |
| 90% autonomy | Sep 2026 | Antonio spends <2h/month on operations |

---

*This document is maintained by Claude (CEO) and updated as the business evolves. Last revision: 2026-03-29.*
