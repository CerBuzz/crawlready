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
        detailKey: "discovery.fail",
        recommendationKey: "rec.discovery.fail",
        params: { status: status || "timeout" },
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
    substeps.push({ label: "Page title", labelKey: "substep.pageTitle", status: "pass", detail: title, detailKey: "substep.titleFound", params: { title } });
  } else {
    substeps.push({ label: "Page title", labelKey: "substep.pageTitle", status: "fail", detail: "No title found", detailKey: "substep.noTitle" });
  }

  if (headings.length > 0) {
    substeps.push({ label: "Headings", labelKey: "substep.headings", status: "pass", detail: `${headings.length} found: "${headings[0]}"`, detailKey: "substep.headingsFound", params: { count: headings.length, first: headings[0] } });
  } else {
    substeps.push({ label: "Headings", labelKey: "substep.headings", status: "fail", detail: "No headings found", detailKey: "substep.noHeadings" });
  }

  const contentStatus: AgentStepStatus = textLength > 200 ? "pass" : textLength > 50 ? "partial" : "fail";
  substeps.push({
    label: "Readable content",
    labelKey: "substep.readableContent",
    status: contentStatus,
    detail: textLength > 200
      ? `${textLength} chars of extractable text`
      : textLength > 50
        ? `Only ${textLength} chars — page may rely on JavaScript rendering`
        : "Very little text content — likely a JS-rendered SPA",
    detailKey: textLength > 200 ? "substep.contentPass" : textLength > 50 ? "substep.contentPartial" : "substep.contentFail",
    params: { chars: textLength },
  });

  const overallStatus: AgentStepStatus =
    substeps.every((s) => s.status === "pass") ? "pass" :
    substeps.some((s) => s.status === "fail") ? "partial" : "pass";

  const discoveryDetailKey = overallStatus === "pass" ? "discovery.pass" : "discovery.partial";

  return {
    html,
    result: {
      step: "discovery",
      action: `Fetching ${url} (${durationMs}ms)`,
      status: overallStatus,
      details: title
        ? `Homepage loaded. "${title}". ${textLength} chars of readable content.`
        : `Homepage loaded but no title found. ${textLength} chars of content.`,
      detailKey: discoveryDetailKey,
      recommendationKey: overallStatus !== "pass" ? `rec.discovery.${overallStatus}` : undefined,
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
    { label: "Links found", labelKey: "substep.linksFound", status: allLinks.length > 0 ? "pass" : "fail", detail: `${allLinks.length} internal links`, detailKey: allLinks.length > 0 ? "substep.linksCount" : "substep.noLinks", params: { count: allLinks.length } },
  ];

  if (scored.length === 0) {
    return {
      pages,
      result: {
        step: "navigation",
        action: "Scanning for relevant pages (services, contact, pricing...)",
        status: "fail",
        details: `Found ${allLinks.length} links but none match service/contact/pricing patterns. Agent cannot navigate the site.`,
        detailKey: "navigation.fail",
        recommendationKey: "rec.navigation.fail",
        params: { total: allLinks.length },
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
      const p = new URL(f.href).pathname;
      substeps.push({
        label: p,
        status: "pass",
        detail: f.text ? `"${f.text}" (${f.durationMs}ms)` : `(${f.durationMs}ms)`,
        detailKey: "substep.pageLoaded",
        params: { text: f.text || p, ms: f.durationMs },
      });
    } else {
      const p = new URL(f.href).pathname;
      substeps.push({ label: p, status: "fail", detail: "Could not load", detailKey: "substep.pageLoadFailed" });
    }
  }

  const loadedCount = fetches.filter((f) => f.ok).length;
  const status: AgentStepStatus = loadedCount >= 2 ? "pass" : loadedCount === 1 ? "partial" : "fail";
  const navDetailKey = status === "pass" ? "navigation.pass" : status === "partial" ? "navigation.partial" : "navigation.fail";

  return {
    pages,
    result: {
      step: "navigation",
      action: `Following ${scored.length} relevant links`,
      status,
      details: `Navigated to ${loadedCount} relevant pages out of ${allLinks.length} total links.`,
      detailKey: navDetailKey,
      recommendationKey: status !== "pass" ? `rec.navigation.${status}` : undefined,
      params: { loaded: loadedCount, total: allLinks.length },
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
    label: "Email addresses", labelKey: "substep.emailAddresses",
    status: emails.length > 0 ? "pass" : "fail",
    detail: emails.length > 0 ? emails.map((e) => e.value).join(", ") : "None found in HTML",
    detailKey: emails.length > 0 ? undefined : "substep.emailNone",
  });

  // Phone
  const phones = uniqueMethods.filter((m) => m.type === "phone");
  substeps.push({
    label: "Phone numbers", labelKey: "substep.phoneNumbers",
    status: phones.length > 0 ? "pass" : "partial",
    detail: phones.length > 0 ? phones.map((p) => p.value).join(", ") : "None found",
    detailKey: phones.length > 0 ? undefined : "substep.phoneNone",
  });

  // WhatsApp
  const wa = uniqueMethods.filter((m) => m.type === "whatsapp");
  substeps.push({
    label: "WhatsApp", labelKey: "substep.whatsapp",
    status: wa.length > 0 ? "pass" : "partial",
    detail: wa.length > 0 ? "WhatsApp link detected" : "Not detected",
    detailKey: wa.length > 0 ? "substep.whatsappFound" : "substep.whatsappNone",
  });

  // Forms
  substeps.push({
    label: "Contact forms", labelKey: "substep.contactForms",
    status: allForms.length > 0 ? "pass" : "fail",
    detail: allForms.length > 0 ? `${allForms.length} form(s) found` : "No forms found in HTML",
    detailKey: allForms.length > 0 ? "substep.formsFound" : "substep.formsNone",
    params: { count: allForms.length },
  });

  // Chat widgets
  if (uniqueWidgets.length > 0) {
    substeps.push({
      label: "Chat widgets", labelKey: "substep.chatWidgets",
      status: "pass",
      detail: uniqueWidgets.join(", "),
    });
  }

  // Only count direct contact methods (email, phone, WhatsApp) as usable channels.
  // Forms are evaluated separately in stepAgentReadyForms — don't double-count here.
  const directChannels = emails.length + phones.length + wa.length;
  const status: AgentStepStatus = directChannels >= 2 ? "pass" : directChannels >= 1 ? "partial" : "fail";
  const channels = [
    emails.length > 0 ? `${emails.length} email` : "",
    phones.length > 0 ? `${phones.length} phone` : "",
    wa.length > 0 ? "WhatsApp" : "",
  ].filter(Boolean).join(", ");

  const contactDetailKey = status === "fail" ? "contact.fail" : status === "pass" ? "contact.pass" : "contact.partial";

  return {
    step: "contact",
    action: "Scanning for direct contact methods across all pages",
    status,
    details: directChannels > 0
      ? `Found ${directChannels} direct contact channel(s): ${channels}.`
      : "No direct contact methods (email, phone, WhatsApp) found in HTML. An AI agent has no way to reach this business.",
    detailKey: contactDetailKey,
    recommendationKey: status !== "pass" ? `rec.contact.${status}` : undefined,
    params: { count: directChannels, channels },
    durationMs: Date.now() - start,
    substeps,
  };
}

function stepAgentReadyForms(pages: Map<string, string>): AgentStepResult {
  const start = Date.now();
  const allForms: FormInfo[] = [];
  for (const html of pages.values()) {
    allForms.push(...extractForms(html));
  }

  if (allForms.length === 0) {
    return {
      step: "agent_ready_forms",
      action: "Looking for forms an AI agent could use",
      status: "fail",
      details: "No HTML forms found. An AI agent has no way to submit a request to this business.",
      detailKey: "formOp.fail",
      recommendationKey: "rec.formOp.fail",
      durationMs: Date.now() - start,
    };
  }

  const substeps: AgentSubstep[] = [];
  let agentReadyCount = 0;

  for (let i = 0; i < allForms.length; i++) {
    const form = allForms[i];
    const issues: string[] = [];

    if (form.hasCaptcha) issues.push("CAPTCHA blocks automated submission");
    if (!form.action && !form.isMailto) issues.push("No action attribute (may be JS-only)");
    if (form.fields.length === 0) issues.push("No visible fields in HTML");
    if (!form.hasSubmit) issues.push("No submit button found");

    const formStatus: AgentStepStatus = issues.length === 0 ? "pass" : issues.length === 1 ? "partial" : "fail";
    if (formStatus === "pass") agentReadyCount++;

    // Build translated detail key for most relevant issue
    let formDetailKey: string | undefined;
    if (issues.length === 0) formDetailKey = "substep.formAgentReady";
    else if (form.hasCaptcha) formDetailKey = "substep.formCaptcha";
    else if (!form.hasSubmit) formDetailKey = "substep.formNoSubmit";
    else if (!form.action && !form.isMailto) formDetailKey = "substep.formNoAction";
    else if (form.fields.length === 0) formDetailKey = "substep.formNoFields";

    substeps.push({
      label: `Form ${i + 1} (${form.fields.length} fields)`,
      status: formStatus,
      detail: issues.length > 0 ? issues.join("; ") : `Agent-ready — fields: ${form.fields.join(", ")}`,
      detailKey: formDetailKey,
      params: { fields: form.fields.join(", ") },
    });
  }

  const status: AgentStepStatus = agentReadyCount > 0 ? "pass" : substeps.some((s) => s.status === "partial") ? "partial" : "fail";
  const formDetailKey = agentReadyCount > 0 ? "formOp.pass" : "formOp.partial";

  return {
    step: "agent_ready_forms",
    action: `Checking ${allForms.length} form(s) — are they adapted for AI agents?`,
    status,
    details: agentReadyCount > 0
      ? `${agentReadyCount} of ${allForms.length} form(s) are adapted for AI agents.`
      : `Found ${allForms.length} form(s) but none are adapted for AI agents — the agent cannot submit any request.`,
    detailKey: formDetailKey,
    recommendationKey: status !== "pass" ? `rec.formOp.${status}` : undefined,
    params: { operable: agentReadyCount, total: allForms.length },
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
      detailKey: "structuredData.fail",
      recommendationKey: "rec.structuredData.fail",
      durationMs: Date.now() - start,
      substeps: [{ label: "JSON-LD blocks", labelKey: "substep.jsonLdBlocks", status: "fail", detail: "None found", detailKey: "substep.jsonLdNone" }],
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

  const types = [...new Set(schemaTypes)].join(", ") || "unknown types";
  substeps.push({
    label: "JSON-LD blocks", labelKey: "substep.jsonLdBlocks",
    status: "pass",
    detail: `${allSchemas.length} found: ${types}`,
    detailKey: "substep.jsonLdFound",
    params: { count: allSchemas.length, types },
  });
  substeps.push({ label: "Business name", labelKey: "substep.businessName", status: hasName ? "pass" : "fail", detail: hasName ? "Found" : "Missing", detailKey: hasName ? "substep.fieldFound" : "substep.fieldMissing" });
  substeps.push({ label: "Services/offers", labelKey: "substep.servicesOffers", status: hasServices ? "pass" : "fail", detail: hasServices ? "Found" : "Missing", detailKey: hasServices ? "substep.fieldFound" : "substep.fieldMissing" });
  substeps.push({ label: "Pricing info", labelKey: "substep.pricingInfo", status: hasPricing ? "pass" : "fail", detail: hasPricing ? "Found" : "Missing", detailKey: hasPricing ? "substep.fieldFound" : "substep.fieldMissing" });
  substeps.push({ label: "Contact info", labelKey: "substep.contactInfo", status: hasContact ? "pass" : "fail", detail: hasContact ? "Found" : "Missing", detailKey: hasContact ? "substep.fieldFound" : "substep.fieldMissing" });

  const richness = [hasName, hasServices, hasPricing, hasContact].filter(Boolean).length;
  const status: AgentStepStatus = richness >= 3 ? "pass" : richness >= 1 ? "partial" : "fail";
  const sdDetailKey = status === "pass" ? "structuredData.pass" : status === "partial" ? "structuredData.partial" : "structuredData.fail";

  return {
    step: "structured_data",
    action: `Analyzing ${allSchemas.length} JSON-LD block(s)`,
    status,
    details: `Found ${allSchemas.length} JSON-LD block(s) with types: ${types}. ${richness}/4 key fields present.`,
    detailKey: sdDetailKey,
    recommendationKey: status !== "pass" ? `rec.structuredData.${status}` : undefined,
    params: { count: allSchemas.length, types, richness },
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
    agent_ready_forms: 3,
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

  // Check if the agent could actually complete the action:
  // Requires at least one direct contact channel OR an agent-ready form
  const contactStep = steps.find((s) => s.step === "contact");
  const formStep = steps.find((s) => s.step === "agent_ready_forms");
  const hasDirectContact = contactStep?.status === "pass" || contactStep?.status === "partial";
  const hasAgentReadyForm = formStep?.status === "pass";
  const canCompleteAction = hasDirectContact || hasAgentReadyForm;

  // If the agent can't complete the action, it's never "pass" regardless of score
  const status: AgentStepStatus = canCompleteAction && pct >= 0.7 ? "pass" : pct >= 0.4 && canCompleteAction ? "partial" : canCompleteAction ? "partial" : "fail";

  const failedSteps = steps.filter((s) => s.status === "fail");
  const failureList = failedSteps.length > 0 ? ` Failures: ${failedSteps.map((s) => s.step).join(", ")}.` : "";

  let details: string;
  if (canCompleteAction && status === "pass") {
    details = `The AI agent found viable channels to complete the task "${task}".${failureList}`;
  } else if (!canCompleteAction) {
    details = `The AI agent COULD NOT complete the task "${task}". No usable contact channel or form was found — a potential customer using AI cannot interact with this business.${failureList}`;
  } else {
    details = `The AI agent COULD NOT fully complete the task "${task}". Some channels exist but have barriers that prevent AI agents from completing the action.${failureList}`;
  }

  return {
    step: "verdict",
    action: "Synthesizing results",
    status,
    details,
    durationMs: Date.now() - start,
  };
}

// --- Main ---

/** Convenience wrapper: runs the full agentic test and returns the final result. */
export async function runAgentTestFull(
  rawUrl: string,
  task?: string
): Promise<AgentTestResult> {
  const gen = runAgentTest(rawUrl, task);
  let result = await gen.next();
  while (!result.done) result = await gen.next();
  return result.value;
}

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

  // Step 4: Agent-Ready Forms
  const formResult = stepAgentReadyForms(pages);
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
