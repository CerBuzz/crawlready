# CrawlReady — Evaluation Methodology

How we assess a website's AI visibility. This document is the source of truth for all evaluations.

---

## Overview

Every evaluation starts with a **blind search** and then examines two pillars:

| Phase | Question it answers |
|---|---|
| **Step 0: Blind Search** | Does the business even appear when an AI agent searches freely? |
| **Pillar 1: AI Readability** (5 pts) | Can an AI agent understand this business? |
| **Pillar 2: AI Actionability** (5 pts) | Can an AI agent take action through the channels the business already offers? |

Together they produce a single score (0-10) and a grade (A-F).

---

## Step 0: Blind Search (mandatory, not scored)

> If we skip this step, we're testing a page, not a business. The first question is always: does the AI even find them?

### Process

1. **Search WITHOUT naming the business.** Use a realistic prompt that a potential customer would use:
   > "I need [service] in [location]. Find me options."
2. **Document the results:** Which businesses appear? In what position? Does the target business appear at all?
3. **Search a second time** with a slightly different query to check consistency.
4. **Record the finding** in the report: "appeared in position X", "did not appear", or "appeared indirectly (e.g., mentioned in a listicle but not as a direct result)."

### Why this matters

A business that scores 10/10 on readability and actionability but never appears in AI search results has a different problem — a discovery problem, not a readability one. Both matter, but the client needs to understand which one they have.

This step is NOT scored because it depends on the AI search engine used, the specific query, and the moment. But it IS documented in every report as context.

---

## Pillar 1: AI Readability (5 points max)

> Can an AI agent find, read, and understand this business well enough to explain it to a user?

### Evaluation process

Go to the business website and attempt to extract all the information a potential customer would need. Score each dimension:

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

## Pillar 2: AI Actionability (5 points max)

> Can an AI agent complete a meaningful action using the channels this business already provides?

### Evaluation process

**Step 1: Inventory existing channels.** Before testing, list every contact/action channel the business offers:
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

**Step 2: Test each channel.** For each channel the business offers, test whether an AI agent can use it:

| Status | Meaning |
|---|---|
| **Operable** | AI agent can complete the action end-to-end |
| **Readable but not operable** | AI can see the channel exists but cannot use it (e.g., form requires JS, chat is widget-injected) |
| **Invisible** | AI cannot detect the channel at all |

**Step 3: Score.**

| # | Dimension | 1 point | 0.5 points | 0 points |
|---|---|---|---|---|
| A1 | **Primary action channel** | At least one channel is fully operable by AI | At least one channel is readable (agent can tell user what to do) | No channel is readable or operable |
| A2 | **Contact information** | Email and/or phone visible in HTML, structured and contextual | Present but hard to find or ambiguous | Not accessible |
| A3 | **Form accessibility** | Form works without JavaScript; fields are semantic HTML | Form exists in HTML but requires JS for submission | Form is JS-rendered or absent |
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

### 5. Comparison (optional)
- Only include if we have **verified data** from real tests on competitors
- Never fabricate or assume competitor results

### 6. Recommendations
- Specific to THIS business and THEIR existing setup
- Actionable: what to change, not what to add
- Ordered by impact
- Never prescribe channels they don't already use

### 7. CTA
- Adapted to the client profile (agency → partnership pitch, ecommerce → direct service, etc.)

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

*This methodology is maintained by the CrawlReady team. Last revision: 2026-03-30.*
