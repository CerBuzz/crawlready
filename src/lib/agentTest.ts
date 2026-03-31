import { AgentStepResult, AgentStepStatus, AgentSubstep, AgentTestResult } from "./types";

const FETCH_TIMEOUT = 8000;
const USER_AGENT =
  "CrawlReady-Agent/1.0 (https://crawlready.dev; AI Agent Operability Test)";

// --- Helpers ---

async function fetchPage(url: string): Promise<{ html: string; ok: boolean; status: number; durationMs: number }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  const start = Date.now();
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    const html = await res.text();
    return { html, ok: res.ok, status: res.status, durationMs: Date.now() - start };
  } catch {
    return { html: "", ok: false, status: 0, durationMs: Date.now() - start };
  } finally {
    clearTimeout(id);
  }
}

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : "";
}

function extractHeadings(html: string): string[] {
  const matches = html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi) || [];
  return matches
    .map((m) => m.replace(/<[^>]+>/g, "").trim())
    .filter((t) => t.length > 0)
    .slice(0, 10);
}

function extractLinks(html: string, baseUrl: string): { href: string; text: string }[] {
  const regex = /<a\s[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links: { href: string; text: string }[] = [];
  const seen = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href;
      const origin = new URL(resolved).origin;
      if (origin !== new URL(baseUrl).origin) continue;
      if (seen.has(resolved)) continue;
      seen.add(resolved);
      const text = match[2].replace(/<[^>]+>/g, "").trim();
      links.push({ href: resolved, text });
    } catch {
      // invalid URL
    }
  }
  return links;
}

const NAV_KEYWORDS_ES = [
  "contacto", "servicios", "precios", "tarifas", "presupuesto",
  "sobre", "acerca", "nosotros", "productos", "portfolio", "tienda",
];
const NAV_KEYWORDS_EN = [
  "contact", "services", "pricing", "price", "quote", "about",
  "products", "portfolio", "shop", "store", "hire", "book",
];
const NAV_KEYWORDS = [...NAV_KEYWORDS_ES, ...NAV_KEYWORDS_EN];

function scoreLink(link: { href: string; text: string }): number {
  const combined = `${link.href} ${link.text}`.toLowerCase();
  let score = 0;
  for (const kw of NAV_KEYWORDS) {
    if (combined.includes(kw)) score += 2;
  }
  // Prefer shorter paths (more likely top-level pages)
  const path = new URL(link.href).pathname;
  if (path.split("/").filter(Boolean).length <= 2) score += 1;
  return score;
}

interface FormInfo {
  action: string;
  method: string;
  fields: string[];
  hasSubmit: boolean;
  hasCaptcha: boolean;
  isMailto: boolean;
}

function extractForms(html: string): FormInfo[] {
  const formRegex = /<form[\s\S]*?<\/form>/gi;
  const matches = html.match(formRegex) || [];
  return matches.map((formHtml) => {
    const actionMatch = formHtml.match(/action\s*=\s*["']([^"']*)["']/i);
    const methodMatch = formHtml.match(/method\s*=\s*["']([^"']*)["']/i);
    const action = actionMatch ? actionMatch[1] : "";
    const method = methodMatch ? methodMatch[1].toUpperCase() : "GET";

    const inputRegex = /<(?:input|textarea|select)[^>]*(?:name|id)\s*=\s*["']([^"']*)["'][^>]*>/gi;
    const fields: string[] = [];
    let inputMatch;
    while ((inputMatch = inputRegex.exec(formHtml)) !== null) {
      fields.push(inputMatch[1]);
    }

    const hasSubmit = /<(?:button|input)[^>]*type\s*=\s*["']submit["']/i.test(formHtml)
      || /<button[^>]*>[\s\S]*?<\/button>/i.test(formHtml);

    const hasCaptcha =
      /g-recaptcha|h-captcha|hcaptcha|recaptcha|cf-turnstile/i.test(formHtml) ||
      /captcha/i.test(formHtml);

    const isMailto = action.startsWith("mailto:");

    return { action, method, fields, hasSubmit, hasCaptcha, isMailto };
  });
}

function detectContactMethods(html: string): { type: string; value: string }[] {
  const methods: { type: string; value: string }[] = [];
  const seen = new Set<string>();

  // Email
  const mailtos = html.match(/href\s*=\s*["']mailto:([^"'?]+)/gi) || [];
  for (const m of mailtos) {
    const email = m.replace(/href\s*=\s*["']mailto:/i, "");
    if (!seen.has(email)) { seen.add(email); methods.push({ type: "email", value: email }); }
  }

  // Phone
  const tels = html.match(/href\s*=\s*["']tel:([^"']+)/gi) || [];
  for (const t of tels) {
    const phone = t.replace(/href\s*=\s*["']tel:/i, "");
    if (!seen.has(phone)) { seen.add(phone); methods.push({ type: "phone", value: phone }); }
  }

  // WhatsApp
  if (/wa\.me|api\.whatsapp\.com|whatsapp/i.test(html)) {
    methods.push({ type: "whatsapp", value: "detected" });
  }

  return methods;
}

function detectChatWidgets(html: string): string[] {
  const widgets: string[] = [];
  const checks: [RegExp, string][] = [
    [/intercom/i, "Intercom"],
    [/drift/i, "Drift"],
    [/tawk\.to|tawk/i, "Tawk.to"],
    [/crisp\.chat|crisp/i, "Crisp"],
    [/livechat/i, "LiveChat"],
    [/tidio/i, "Tidio"],
    [/hubspot.*conversations|hs-script-loader/i, "HubSpot Chat"],
    [/zendesk.*widget|zopim/i, "Zendesk Chat"],
    [/freshchat|freshdesk/i, "Freshchat"],
  ];
  for (const [re, name] of checks) {
    if (re.test(html)) widgets.push(name);
  }
  return widgets;
}

function extractJsonLd(html: string): unknown[] {
  const regex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const results: unknown[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      results.push(JSON.parse(match[1]));
    } catch {
      // malformed JSON-LD
    }
  }
  return results;
}

// --- Steps ---

async function stepDiscovery(url: string): Promise<{ result: AgentStepResult; html: string }> {
  const start = Date.now();
  const { html, ok, status, durationMs } = await fetchPage(url);

  if (!ok) {
    return {
      html: "",
      result: {
        step: "discovery",
        action: `Fetching ${url}`,
        status: "fail",
        details: `Could not load homepage (HTTP ${status || "timeout"}). An AI agent cannot interact with this site.`,
        durationMs: Date.now() - start,
      },
    };
  }

  const title = extractTitle(html);
  const headings = extractHeadings(html);
  const textContent = extractText(html);
  const textLength = textContent.length;

  const substeps: AgentSubstep[] = [];

  if (title) {
    substeps.push({ label: "Page title", status: "pass", detail: title });
  } else {
    substeps.push({ label: "Page title", status: "fail", detail: "No title found" });
  }

  if (headings.length > 0) {
    substeps.push({ label: "Headings", status: "pass", detail: `${headings.length} found: "${headings[0]}"` });
  } else {
    substeps.push({ label: "Headings", status: "fail", detail: "No headings found" });
  }

  const contentStatus: AgentStepStatus = textLength > 200 ? "pass" : textLength > 50 ? "partial" : "fail";
  substeps.push({
    label: "Readable content",
    status: contentStatus,
    detail: textLength > 200
      ? `${textLength} chars of extractable text`
      : textLength > 50
        ? `Only ${textLength} chars — page may rely on JavaScript rendering`
        : "Very little text content — likely a JS-rendered SPA",
  });

  const overallStatus: AgentStepStatus =
    substeps.every((s) => s.status === "pass") ? "pass" :
    substeps.some((s) => s.status === "fail") ? "partial" : "pass";

  return {
    html,
    result: {
      step: "discovery",
      action: `Fetching ${url} (${durationMs}ms)`,
      status: overallStatus,
      details: title
        ? `Homepage loaded. "${title}". ${textLength} chars of readable content.`
        : `Homepage loaded but no title found. ${textLength} chars of content.`,
      durationMs: Date.now() - start,
      substeps,
    },
  };
}

async function stepNavigation(
  baseUrl: string,
  homepageHtml: string
): Promise<{ result: AgentStepResult; pages: Map<string, string> }> {
  const start = Date.now();
  const pages = new Map<string, string>();
  pages.set(baseUrl, homepageHtml);

  const allLinks = extractLinks(homepageHtml, baseUrl);
  const scored = allLinks
    .map((l) => ({ ...l, score: scoreLink(l) }))
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const substeps: AgentSubstep[] = [
    { label: "Links found", status: allLinks.length > 0 ? "pass" : "fail", detail: `${allLinks.length} internal links` },
  ];

  if (scored.length === 0) {
    return {
      pages,
      result: {
        step: "navigation",
        action: "Scanning for relevant pages (services, contact, pricing...)",
        status: "fail",
        details: `Found ${allLinks.length} links but none match service/contact/pricing patterns. Agent cannot navigate the site.`,
        durationMs: Date.now() - start,
        substeps,
      },
    };
  }

  // Fetch relevant pages in parallel
  const fetches = await Promise.all(
    scored.map(async (link) => {
      const { html, ok, durationMs } = await fetchPage(link.href);
      return { ...link, html, ok, durationMs };
    })
  );

  for (const f of fetches) {
    if (f.ok) {
      pages.set(f.href, f.html);
      const path = new URL(f.href).pathname;
      substeps.push({
        label: path,
        status: "pass",
        detail: f.text ? `"${f.text}" (${f.durationMs}ms)` : `(${f.durationMs}ms)`,
      });
    } else {
      const path = new URL(f.href).pathname;
      substeps.push({ label: path, status: "fail", detail: "Could not load" });
    }
  }

  const loadedCount = fetches.filter((f) => f.ok).length;
  const status: AgentStepStatus = loadedCount >= 2 ? "pass" : loadedCount === 1 ? "partial" : "fail";

  return {
    pages,
    result: {
      step: "navigation",
      action: `Following ${scored.length} relevant links`,
      status,
      details: `Navigated to ${loadedCount} relevant pages out of ${allLinks.length} total links.`,
      durationMs: Date.now() - start,
      substeps,
    },
  };
}

function stepContactDiscovery(pages: Map<string, string>): AgentStepResult {
  const start = Date.now();
  const allMethods: { type: string; value: string }[] = [];
  const allWidgets: string[] = [];
  const allForms: FormInfo[] = [];

  for (const html of pages.values()) {
    allMethods.push(...detectContactMethods(html));
    allWidgets.push(...detectChatWidgets(html));
    allForms.push(...extractForms(html));
  }

  // Deduplicate
  const uniqueMethods = Array.from(new Map(allMethods.map((m) => [`${m.type}:${m.value}`, m])).values());
  const uniqueWidgets = [...new Set(allWidgets)];

  const substeps: AgentSubstep[] = [];

  // Emails
  const emails = uniqueMethods.filter((m) => m.type === "email");
  substeps.push({
    label: "Email addresses",
    status: emails.length > 0 ? "pass" : "fail",
    detail: emails.length > 0 ? emails.map((e) => e.value).join(", ") : "None found in HTML",
  });

  // Phone
  const phones = uniqueMethods.filter((m) => m.type === "phone");
  substeps.push({
    label: "Phone numbers",
    status: phones.length > 0 ? "pass" : "partial",
    detail: phones.length > 0 ? phones.map((p) => p.value).join(", ") : "None found",
  });

  // WhatsApp
  const wa = uniqueMethods.filter((m) => m.type === "whatsapp");
  substeps.push({
    label: "WhatsApp",
    status: wa.length > 0 ? "pass" : "partial",
    detail: wa.length > 0 ? "WhatsApp link detected" : "Not detected",
  });

  // Forms
  substeps.push({
    label: "Contact forms",
    status: allForms.length > 0 ? "pass" : "fail",
    detail: allForms.length > 0 ? `${allForms.length} form(s) found` : "No forms found in HTML",
  });

  // Chat widgets
  if (uniqueWidgets.length > 0) {
    substeps.push({
      label: "Chat widgets",
      status: "pass",
      detail: uniqueWidgets.join(", "),
    });
  }

  const totalChannels = emails.length + phones.length + wa.length + allForms.length + uniqueWidgets.length;
  const status: AgentStepStatus = totalChannels >= 3 ? "pass" : totalChannels >= 1 ? "partial" : "fail";

  return {
    step: "contact",
    action: "Scanning for contact methods across all pages",
    status,
    details: totalChannels > 0
      ? `Found ${totalChannels} contact channel(s): ${[
          emails.length > 0 ? `${emails.length} email` : "",
          phones.length > 0 ? `${phones.length} phone` : "",
          wa.length > 0 ? "WhatsApp" : "",
          allForms.length > 0 ? `${allForms.length} form(s)` : "",
          uniqueWidgets.length > 0 ? uniqueWidgets.join(", ") : "",
        ].filter(Boolean).join(", ")}.`
      : "No contact methods found. An AI agent cannot reach this business.",
    durationMs: Date.now() - start,
    substeps,
  };
}

function stepFormOperability(pages: Map<string, string>): AgentStepResult {
  const start = Date.now();
  const allForms: FormInfo[] = [];
  for (const html of pages.values()) {
    allForms.push(...extractForms(html));
  }

  if (allForms.length === 0) {
    return {
      step: "form_operability",
      action: "Checking if forms can be submitted by an AI agent",
      status: "fail",
      details: "No HTML forms found. An AI agent has no way to submit a request programmatically.",
      durationMs: Date.now() - start,
    };
  }

  const substeps: AgentSubstep[] = [];
  let operableCount = 0;

  for (let i = 0; i < allForms.length; i++) {
    const form = allForms[i];
    const issues: string[] = [];

    if (form.hasCaptcha) issues.push("CAPTCHA blocks automated submission");
    if (!form.action && !form.isMailto) issues.push("No action attribute (may be JS-only)");
    if (form.fields.length === 0) issues.push("No visible fields in HTML");
    if (!form.hasSubmit) issues.push("No submit button found");

    const formStatus: AgentStepStatus = issues.length === 0 ? "pass" : issues.length === 1 ? "partial" : "fail";
    if (formStatus === "pass") operableCount++;

    substeps.push({
      label: `Form ${i + 1} (${form.fields.length} fields)`,
      status: formStatus,
      detail: issues.length > 0 ? issues.join("; ") : `Operable — fields: ${form.fields.join(", ")}`,
    });
  }

  const status: AgentStepStatus = operableCount > 0 ? "pass" : substeps.some((s) => s.status === "partial") ? "partial" : "fail";

  return {
    step: "form_operability",
    action: `Checking ${allForms.length} form(s) for AI agent operability`,
    status,
    details: operableCount > 0
      ? `${operableCount} of ${allForms.length} form(s) are operable by an AI agent.`
      : `Found ${allForms.length} form(s) but none are fully operable — AI agents cannot submit requests.`,
    durationMs: Date.now() - start,
    substeps,
  };
}

function stepStructuredData(pages: Map<string, string>): AgentStepResult {
  const start = Date.now();
  const allSchemas: unknown[] = [];
  for (const html of pages.values()) {
    allSchemas.push(...extractJsonLd(html));
  }

  const substeps: AgentSubstep[] = [];

  if (allSchemas.length === 0) {
    return {
      step: "structured_data",
      action: "Looking for structured data (JSON-LD) to understand the business",
      status: "fail",
      details: "No JSON-LD structured data found. AI agents cannot programmatically understand services, pricing, or business details.",
      durationMs: Date.now() - start,
      substeps: [{ label: "JSON-LD blocks", status: "fail", detail: "None found" }],
    };
  }

  // Analyze what's in the schemas
  const schemaTypes: string[] = [];
  let hasName = false;
  let hasServices = false;
  let hasPricing = false;
  let hasContact = false;

  for (const schema of allSchemas) {
    if (typeof schema !== "object" || schema === null) continue;
    const obj = schema as Record<string, unknown>;
    const type = String(obj["@type"] || "");
    if (type) schemaTypes.push(type);
    if (obj.name) hasName = true;
    if (obj.hasOfferCatalog || obj.offers || obj.makesOffer) hasServices = true;
    if (obj.priceRange || obj.offers) hasPricing = true;
    if (obj.email || obj.telephone || obj.contactPoint) hasContact = true;
  }

  substeps.push({
    label: "JSON-LD blocks",
    status: "pass",
    detail: `${allSchemas.length} found: ${[...new Set(schemaTypes)].join(", ") || "unknown types"}`,
  });
  substeps.push({ label: "Business name", status: hasName ? "pass" : "fail", detail: hasName ? "Found" : "Missing" });
  substeps.push({ label: "Services/offers", status: hasServices ? "pass" : "fail", detail: hasServices ? "Found" : "Missing" });
  substeps.push({ label: "Pricing info", status: hasPricing ? "pass" : "fail", detail: hasPricing ? "Found" : "Missing" });
  substeps.push({ label: "Contact info", status: hasContact ? "pass" : "fail", detail: hasContact ? "Found" : "Missing" });

  const richness = [hasName, hasServices, hasPricing, hasContact].filter(Boolean).length;
  const status: AgentStepStatus = richness >= 3 ? "pass" : richness >= 1 ? "partial" : "fail";

  return {
    step: "structured_data",
    action: `Analyzing ${allSchemas.length} JSON-LD block(s)`,
    status,
    details: `Found ${allSchemas.length} JSON-LD block(s) with types: ${[...new Set(schemaTypes)].join(", ")}. ${richness}/4 key fields present.`,
    durationMs: Date.now() - start,
    substeps,
  };
}

function stepVerdict(steps: AgentStepResult[], task: string): AgentStepResult {
  const start = Date.now();

  // Weighted scoring
  const weights: Record<string, number> = {
    discovery: 1,
    navigation: 1,
    contact: 2,
    form_operability: 3,
    structured_data: 1,
  };

  let weightedScore = 0;
  let totalWeight = 0;

  for (const step of steps) {
    const w = weights[step.step] || 1;
    totalWeight += w;
    if (step.status === "pass") weightedScore += w;
    else if (step.status === "partial") weightedScore += w * 0.5;
  }

  const pct = totalWeight > 0 ? weightedScore / totalWeight : 0;
  const status: AgentStepStatus = pct >= 0.7 ? "pass" : pct >= 0.4 ? "partial" : "fail";

  const summaries: Record<AgentStepStatus, string> = {
    pass: `An AI agent CAN complete the task "${task}" on this site. The business is operationally visible to AI.`,
    partial: `An AI agent can PARTIALLY complete the task "${task}". Some channels are accessible but there are gaps that reduce AI operability.`,
    fail: `An AI agent CANNOT complete the task "${task}" on this site. Critical barriers prevent AI agents from interacting with this business.`,
  };

  const failedSteps = steps.filter((s) => s.status === "fail");
  const details = failedSteps.length > 0
    ? `${summaries[status]} Failures: ${failedSteps.map((s) => s.step).join(", ")}.`
    : summaries[status];

  return {
    step: "verdict",
    action: "Synthesizing results",
    status,
    details,
    durationMs: Date.now() - start,
  };
}

// --- Main ---

export async function* runAgentTest(
  rawUrl: string,
  task: string = "find this business and request a quote"
): AsyncGenerator<AgentStepResult, AgentTestResult, undefined> {
  const totalStart = Date.now();
  const url = rawUrl.trim().replace(/^(?!https?:\/\/)/i, "https://");
  const baseUrl = new URL(url).origin;
  const steps: AgentStepResult[] = [];

  // Step 1: Discovery
  const { result: discoveryResult, html } = await stepDiscovery(url);
  steps.push(discoveryResult);
  yield discoveryResult;

  if (discoveryResult.status === "fail") {
    const verdict = stepVerdict(steps, task);
    steps.push(verdict);
    yield verdict;
    return {
      url, task, steps,
      verdict: verdict.status,
      verdictSummary: verdict.details,
      totalDurationMs: Date.now() - totalStart,
      testedAt: new Date().toISOString(),
    };
  }

  // Step 2: Navigation
  const { result: navResult, pages } = await stepNavigation(baseUrl, html);
  steps.push(navResult);
  yield navResult;

  // Step 3: Contact Discovery
  const contactResult = stepContactDiscovery(pages);
  steps.push(contactResult);
  yield contactResult;

  // Step 4: Form Operability
  const formResult = stepFormOperability(pages);
  steps.push(formResult);
  yield formResult;

  // Step 5: Structured Data
  const structuredResult = stepStructuredData(pages);
  steps.push(structuredResult);
  yield structuredResult;

  // Step 6: Verdict
  const verdict = stepVerdict(steps, task);
  steps.push(verdict);
  yield verdict;

  return {
    url, task, steps,
    verdict: verdict.status,
    verdictSummary: verdict.details,
    totalDurationMs: Date.now() - totalStart,
    testedAt: new Date().toISOString(),
  };
}
