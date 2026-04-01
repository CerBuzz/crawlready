# CrawlReady — Evaluation Methodology

How we assess a website's AI visibility. This document is the source of truth for all evaluations.

---

## Operational Protocol

### Flow: From confirmation to delivery

```
Client confirms via email
  → Phase 0: Intake (Claude, ~5 min)
  → Phase 1: Reconnaissance (Claude, ~15 min)
  → Phase 2: Agentic Test — 5 steps (Claude, ~45 min)
      Step 1: Generic discovery (both businesses)
      Step 2: Named search — target
      Step 3: Named search — competitor
      Step 4: Action — target
      Step 5: Action — competitor
  → Phase 3: Report generation (Claude, ~20 min)
  → Phase 4: Delivery via email (Antonio)
Total: ~1.5 hours per analysis
```

### Phase 0: Intake

When the client confirms they want the analysis, we collect or determine:

- **URL** of their website
- **Sector / what they sell** (from their site)
- **Primary competitor** (we choose — the client does NOT need to provide this)
- **Natural task** for the AI agent (we define this based on their business — e.g., "enroll in a course", "request a quote", "book an appointment")

### Phase 1: Reconnaissance

Before running the agentic test:

1. **Tech stack**: WordPress, Shopify, custom, etc. (determines if we can implement fixes)
2. **Automated scan**: Run our 7-dimension scanner (llms.txt, robots.txt, structured data, meta tags, sitemap, HTTPS, response time)
3. **Contact point mapping**: Identify all forms, booking systems, checkout flows, chat, email, phone — everything an AI agent could try to use
4. **Competitor identification**: If not already set, choose the most obvious direct competitor

### Phase 2: Agentic Test (5 steps)

The test simulates how a real user interacts with an AI agent: first searching broadly, then learning about specific businesses, then trying to take action. Each step is a separate query — this reflects real user behavior (nobody says "find me a course and enroll me" in a single prompt).

#### Step 1: Generic Discovery (covers both target and competitor)

A single blind search WITHOUT naming any business. Realistic prompt a potential customer would use:

> "I need [service] in [location]. Find me options."

**What we measure**: Who appears? In what position? Does the target appear at all? Does the competitor? Run a second query with a slightly different phrasing to check consistency.

This step covers both businesses at once — there's no need to repeat it.

#### Step 2: Named Search — Target

Search specifically for the target business by name:

> "Tell me about [business name]. What do they offer, what are their prices, and are they a good option?"

**What we measure**: Can the AI agent understand and accurately describe this business? Services, pricing, reputation, identity.

#### Step 3: Named Search — Competitor

Same query for the competitor:

> "Tell me about [competitor name]. What do they offer, what are their prices, and are they a good option?"

**What we measure**: Same as Step 2. The side-by-side comparison is what makes the report powerful.

#### Step 4: Action — Target

Give the AI agent a concrete task on the target's website:

> "I've decided to go with [business name]. [Enroll me in their course / Request a quote / Book an appointment]."

**What we measure**: Can the AI agent complete the action end-to-end using the channels the business already offers?

#### Step 5: Action — Competitor

Same task on the competitor's website:

> "Actually, let me try [competitor name] instead. [Same task]."

**What we measure**: Same as Step 4. If the competitor succeeds where the target fails, that's the most impactful finding in the report.

#### Summary

| Step | Query | Who | What it measures |
|---|---|---|---|
| 1 | Generic search | Both | Discovery — who appears? |
| 2 | Named search — target | Target | Comprehension — is the business understood? |
| 3 | Named search — competitor | Competitor | Comprehension — comparison |
| 4 | Action on target | Target | Operability — can the agent act? |
| 5 | Action on competitor | Competitor | Operability — comparison |

### Phase 3: Report Generation

Generate the HTML report (see Report Structure below). Save in the client's outreach folder.

### Phase 4: Delivery

Email only (MVP). Antonio sends the report with a short message highlighting the key finding. No attachments in the first email if it's cold outreach — link to the report or tease the finding first.

---

### File Structure

All analysis data is organized by client and date inside `/outreach/`:

```
outreach/
  {client-slug}/
    {YYYY-MM-DD}/
      intake.json            ← initial data
      recon.json             ← tech stack, scan results, contact points
      test-target.json       ← agentic test results for target
      test-competitor.json   ← agentic test results for competitor
      report.html            ← final deliverable
      evidence/              ← screenshots, transcripts
    {YYYY-MM-DD}/            ← subsequent analysis (only new/changed data)
```

Published reports (shareable via URL) go in `/public/reports/{client-slug}-{date}.html`.

### Economy Rule

Before running a new analysis on a client with existing data:

1. Check if there's a recent analysis (< 30 days old)
2. If yes, only run the NEW parts (different competitor, different task, updated sections)
3. Reference previous `recon.json` if tech stack hasn't changed
4. Note in the report: "Technical reconnaissance from {previous date}, agentic test updated {current date}"

---

## Evaluation

### Overview

Every evaluation follows the 5-step test structure (see Phase 2 above) and scores across three dimensions:

| Dimension | Maps to | Points |
|---|---|---|
| **Discovery** | Step 1 (generic search) | Not scored — documented as context |
| **AI Readability** | Steps 2-3 (named searches) | 5 pts |
| **AI Actionability** | Steps 4-5 (actions) | 5 pts |

Together they produce a single score (0-10) and a grade (A-F). The comparison between target and competitor runs through all dimensions.

**Important**: All tests are performed by Claude directly analyzing the website. We do not simulate or claim to use ChatGPT, Perplexity, or other AI agents. Claude IS the AI agent performing the test.

---

## Discovery (Step 1 — mandatory, not scored)

> If we skip this step, we're testing a page, not a business. The first question is always: does the AI even find them?

### Process

1. **Search WITHOUT naming any business.** Use a realistic prompt that a potential customer would use:
   > "I need [service] in [location]. Find me options."
2. **Document the results:** Which businesses appear? In what position? Does the target appear? Does the competitor?
3. **Search a second time** with a slightly different query to check consistency.
4. **Record the finding** for both businesses: "appeared in position X", "did not appear", or "appeared indirectly."

### Why this matters

A business that scores 10/10 on readability and actionability but never appears in AI search results has a discovery problem, not a readability one. Both matter, but the client needs to understand which one they have.

This dimension is NOT scored because it depends on the AI search engine used, the specific query, and the moment. But it IS documented in every report as context — and the comparison (who appeared vs. who didn't) is often the most impactful finding.

---

## AI Readability — Steps 2 & 3 (5 points max)

> Can an AI agent understand this business well enough to explain it to a user?

Evaluated via the named search queries (Step 2 for target, Step 3 for competitor). Score each dimension for both businesses:

| # | Dimension | 1 point | 0.5 points | 0 points |
|---|---|---|---|---|
| R1 | **Discoverability** | AI finds the business on first attempt | Finds it but with difficulty or indirectly | Cannot find it |
| R2 | **Service comprehension** | AI accurately describes services with detail | Partial or vague understanding | Cannot determine what they do |
| R3 | **Pricing clarity** | AI can report prices or price ranges | AI finds vague pricing signals ("from...", "affordable") | No pricing information accessible |
| R4 | **Reputation access** | AI can read real testimonials or reviews | AI sees reputation claims but no verifiable reviews | No reputation data accessible |
| R5 | **Business identity** | AI extracts name, location, team, differentiators | Partial identity (e.g., name and location only) | Cannot determine basic identity |

### Rules

- Score what the AI agent **actually** extracts, not what's theoretically on the page.
- If content exists but is behind JavaScript rendering (carousels, SPAs, lazy-loaded sections), it counts as **inaccessible** unless the agent actually reads it.
- Structured data (JSON-LD) counts as readable content — it's one of the best ways to communicate with AI agents.
- Do NOT penalize for information the business legitimately chooses not to publish (e.g., not showing prices is a valid business decision — score 0 but note it neutrally, not as a failure).

---

## AI Actionability — Steps 4 & 5 (5 points max)

> Can an AI agent complete a meaningful action using the channels this business already provides?

### Evaluation process

**Inventory existing channels.** Before testing, list every contact/action channel the business offers:
- Contact form
- Email (mailto: link)
- Phone (tel: link)
- WhatsApp (wa.me link)
- Chat widget
- Booking system (Calendly, etc.)
- Quote request form
- Social media DMs
- API endpoints
- Any other action mechanism

**Test each channel.** For each channel the business offers, test whether an AI agent can use it (Step 4 for target, Step 5 for competitor):

| Status | Meaning |
|---|---|
| **Operable** | AI agent can complete the action end-to-end |
| **Readable but not operable** | AI can see the channel exists but cannot use it (e.g., form requires JS, chat is widget-injected) |
| **Invisible** | AI cannot detect the channel at all |

**Score.**

| # | Dimension | 1 point | 0.5 points | 0 points |
|---|---|---|---|---|
| A1 | **Primary action channel** | At least one channel is fully operable by AI | At least one channel is readable (agent can tell user what to do) | No channel is readable or operable |
| A2 | **Contact information** | Email and/or phone visible in HTML, structured and contextual | Present but hard to find or ambiguous | Not accessible |
| A3 | **Form accessibility** | Form works without JavaScript; fields are semantic HTML | Form exists in HTML but requires JS for submission | Form is JS-rendered or absent |

> **Forms — solution hierarchy**: Most AI agents today (ChatGPT, Perplexity, Claude) access websites via HTTP fetch, not a browser. They cannot click buttons or submit forms. When a form is not operable: (1) **Immediate fix**: add a `<button type="submit">` — this enables browser-based agents (Operator, etc.); (2) **Recommended fix**: expose an API endpoint and document it in `llms.txt` — this is what the majority of AI agents can actually use today and in the future.
| A4 | **Action context** | AI can pre-fill or describe what info to provide | Partial context (generic "contact us") | No guidance on what the action requires |
| A5 | **Completion path** | AI can describe a complete path from discovery to action | Path exists but has gaps | No viable path from discovery to action |

### Rules

- **Only evaluate channels the business already offers.** Never penalize for not having WhatsApp, chat, Calendly, or any specific channel. The question is: "Do the channels you chose to offer work for AI agents?"
- A business with only an email link that's clearly visible in HTML and well-structured scores better than a business with 5 channels that are all JavaScript-dependent.
- Phone numbers with `tel:` links count as "readable" (AI can tell the user to call) but not "operable" (AI cannot make the call on behalf of the user).
- reCAPTCHA or similar bot protection on forms is NOT a failure — it's a legitimate security measure. Note it factually, don't frame it as a problem.

---

## Scoring

### Calculate the total

```
Total = Readability score (0-5) + Actionability score (0-5) = 0-10
```

### Grade mapping

| Score | Grade | Label |
|---|---|---|
| 9-10 | A | Excellent — fully AI-ready |
| 7-8 | B | Good — minor improvements possible |
| 5-6 | C | Partial — significant gaps |
| 3-4 | D | Poor — major barriers for AI agents |
| 0-2 | F | Failing — essentially invisible to AI |

---

## Report Structure

Every report follows this format:

### 1. Header
- CrawlReady branding
- Business name and URL
- Date
- Overall grade and score

### 2. What we tested
- The exact prompt given to the AI agent
- Step-by-step documentation of what the agent did
- Pass/fail/partial for each step — based on observed behavior, not assumptions

### 3. Summary
- What works (green)
- What doesn't work (red)
- Opportunities (yellow) — only for things they already have but could improve

### 4. Technical detail
- Table with each dimension scored
- Factual observations, not judgments

### 5. Comparison (mandatory)
- Side-by-side table: target vs competitor on all dimensions
- Based on **verified data** from real tests (Phase 3)
- Never fabricate or assume competitor results

### 6. Recommendations
- Specific to THIS business and THEIR existing setup
- Actionable: what to change, not what to add
- Ordered by impact
- Never prescribe channels they don't already use

### 7. Next Steps CTA
- Implementation offer: "¿Quieres que lo implementemos? €X"
- Expansion offer: "¿Te gustaría analizar otro competidor u otra tarea del agente?"
- Adapted to client profile (agency → partnership pitch, ecommerce → direct service, etc.)

### 8. Delivery Channel (MVP)
- Email only. No WhatsApp, no LinkedIn, no phone.
- Short message highlighting the single most impactful finding
- Report attached as HTML or linked if published at public URL

---

## Tone Guidelines

- **Factual, not condescending.** We report what we found, we don't lecture.
- **Opportunity, not criticism.** "Here's what an AI agent sees" — not "here's what you're doing wrong."
- **Specific, not generic.** Recommendations reference their actual tech stack, their actual forms, their actual content.
- **Honest about limitations.** If we didn't test something, we say so. If a score is subjective, we explain the reasoning.

---

## Quality Checklist

Before sending any report:

- [ ] All text has correct accents and special characters (á, é, í, ó, ú, ñ, ¿, ¡)
- [ ] Every claim is based on observed behavior, not assumptions
- [ ] Comparison data is from real verified tests (or section is omitted)
- [ ] No recommendations prescribe channels the business doesn't already use
- [ ] CTA is adapted to the client's profile
- [ ] Score matches the rubric — can be explained if questioned
- [ ] Report has been previewed in a browser
- [ ] Tone is respectful and opportunity-focused

---

*This methodology is maintained by the CrawlReady team. Last revision: 2026-04-01.*
