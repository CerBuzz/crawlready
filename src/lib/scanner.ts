import { CheckResult, ScanResult } from "./types";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "PerplexityBot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
];

const FETCH_TIMEOUT = 8000;

async function fetchWithTimeout(
  url: string,
  timeout = FETCH_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "CrawlReady-Scanner/1.0 (https://crawlready.dev; AI Readiness Audit)",
      },
      redirect: "follow",
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

// --- Individual checks ---

async function checkLlmsTxt(baseUrl: string): Promise<CheckResult> {
  const MAX = 15;
  try {
    const res = await fetchWithTimeout(`${baseUrl}/llms.txt`);
    if (res.ok) {
      const text = await res.text();
      const hasContent = text.trim().length > 50;
      return {
        name: "llms.txt",
        score: hasContent ? MAX : 10,
        maxScore: MAX,
        status: hasContent ? "pass" : "partial",
        details: hasContent
          ? "llms.txt found with meaningful content."
          : "llms.txt exists but has very little content.",
        detailKey: hasContent ? "llmsTxt.pass" : "llmsTxt.partial",
        recommendation: hasContent
          ? undefined
          : "Add detailed descriptions of your site sections, APIs, and key content to llms.txt.",
        recommendationKey: hasContent ? undefined : "llmsTxt.recPartial",
      };
    }
    return {
      name: "llms.txt",
      score: 0,
      maxScore: MAX,
      status: "fail",
      details: "No llms.txt file found.",
      detailKey: "llmsTxt.fail",
      recommendation:
        "Create a /llms.txt file that describes your site structure, key pages, and content for AI agents. See llmstxt.org for the specification.",
      recommendationKey: "llmsTxt.recFail",
    };
  } catch {
    return {
      name: "llms.txt",
      score: 0,
      maxScore: MAX,
      status: "fail",
      details: "Could not check llms.txt (request failed).",
      detailKey: "llmsTxt.error",
      recommendation: "Create a /llms.txt file following the specification at llmstxt.org.",
      recommendationKey: "llmsTxt.recError",
    };
  }
}

async function checkRobotsTxt(baseUrl: string): Promise<CheckResult> {
  const MAX = 15;
  try {
    const res = await fetchWithTimeout(`${baseUrl}/robots.txt`);
    if (!res.ok) {
      return {
        name: "robots.txt (AI Crawlers)",
        score: 8,
        maxScore: MAX,
        status: "partial",
        details: "No robots.txt found. AI crawlers can access your site by default, but there's no explicit configuration.",
        detailKey: "robots.noFile",
        recommendation:
          "Create a robots.txt that explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot).",
        recommendationKey: "robots.recNoFile",
      };
    }

    const text = await res.text();
    const lower = text.toLowerCase();
    const blocked: string[] = [];
    const allowed: string[] = [];

    for (const bot of AI_BOTS) {
      const botLower = bot.toLowerCase();
      const botSection = new RegExp(
        `user-agent:\\s*${botLower}[\\s\\S]*?(?=user-agent:|$)`,
        "i"
      );
      const match = text.match(botSection);
      if (match && /disallow:\s*\//i.test(match[0])) {
        blocked.push(bot);
      } else if (match && /allow:\s*\//i.test(match[0])) {
        allowed.push(bot);
      }
    }

    // Check for blanket disallow all
    const blanketBlock =
      /user-agent:\s*\*[\s\S]*?disallow:\s*\//im.test(text) &&
      !/user-agent:\s*\*[\s\S]*?allow:\s*\//im.test(text);

    if (blocked.length > 3) {
      return {
        name: "robots.txt (AI Crawlers)",
        score: 3,
        maxScore: MAX,
        status: "fail",
        details: `Blocking ${blocked.length} AI crawlers: ${blocked.join(", ")}.`,
        detailKey: "robots.manyBlocked",
        params: { count: blocked.length, bots: blocked.join(", ") },
        recommendation:
          "Consider allowing AI crawlers to index your content. Blocking them means your site won't appear in AI-generated answers.",
        recommendationKey: "robots.recManyBlocked",
      };
    }

    if (blanketBlock && allowed.length === 0) {
      return {
        name: "robots.txt (AI Crawlers)",
        score: 5,
        maxScore: MAX,
        status: "fail",
        details:
          "robots.txt has a blanket disallow for all bots with no AI-specific exceptions.",
        detailKey: "robots.blanketBlock",
        recommendation:
          "Add explicit Allow rules for AI crawlers like GPTBot and ClaudeBot.",
        recommendationKey: "robots.recBlanketBlock",
      };
    }

    if (blocked.length > 0) {
      return {
        name: "robots.txt (AI Crawlers)",
        score: 10,
        maxScore: MAX,
        status: "partial",
        details: `Some AI crawlers blocked: ${blocked.join(", ")}. Others can access your site.`,
        detailKey: "robots.someBlocked",
        params: { bots: blocked.join(", ") },
        recommendation: `Consider allowing ${blocked.join(", ")} to maximize AI visibility.`,
        recommendationKey: "robots.recSomeBlocked",
      };
    }

    return {
      name: "robots.txt (AI Crawlers)",
      score: MAX,
      maxScore: MAX,
      status: "pass",
      details: "robots.txt allows AI crawlers to access your site.",
      detailKey: "robots.pass",
    };
  } catch {
    return {
      name: "robots.txt (AI Crawlers)",
      score: 5,
      maxScore: MAX,
      status: "partial",
      details: "Could not fetch robots.txt.",
      detailKey: "robots.error",
      recommendation: "Ensure your robots.txt is accessible and allows AI crawlers.",
      recommendationKey: "robots.recError",
    };
  }
}

async function checkStructuredData(
  html: string
): Promise<CheckResult> {
  const MAX = 20;
  const jsonLdMatches = html.match(
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  const hasMicrodata = /itemscope|itemtype|itemprop/i.test(html);
  const hasRdfa = /typeof=|property=.*content=/i.test(html);

  let score = 0;
  const findings: string[] = [];

  if (jsonLdMatches && jsonLdMatches.length > 0) {
    score += 12;
    findings.push(`${jsonLdMatches.length} JSON-LD block(s) found`);

    // Check for common useful schemas
    const jsonLdText = jsonLdMatches.join(" ");
    const schemas = ["Organization", "WebSite", "LocalBusiness", "Product", "FAQPage", "Article", "BreadcrumbList"];
    const found = schemas.filter((s) => jsonLdText.includes(s));
    if (found.length > 0) {
      score += Math.min(found.length * 2, 8);
      findings.push(`Schema types: ${found.join(", ")}`);
    }
  }

  if (hasMicrodata) {
    score += 4;
    findings.push("Microdata markup detected");
  }

  if (hasRdfa) {
    score += 2;
    findings.push("RDFa markup detected");
  }

  score = Math.min(score, MAX);

  if (score === 0) {
    return {
      name: "Structured Data",
      score: 0,
      maxScore: MAX,
      status: "fail",
      details: "No structured data (JSON-LD, Microdata, or RDFa) found.",
      detailKey: "structured.fail",
      recommendation:
        "Add JSON-LD structured data for your Organization, WebSite, and key content types. This is critical for AI agents to understand your business.",
      recommendationKey: "structured.recFail",
    };
  }

  return {
    name: "Structured Data",
    score,
    maxScore: MAX,
    status: score >= 15 ? "pass" : "partial",
    details: findings.join(". ") + ".",
    detailKey: "structured.found",
    params: { findings: findings.join(". ") },
    recommendation:
      score < MAX
        ? "Add more schema types (Organization, FAQPage, Product, BreadcrumbList) to improve AI comprehension."
        : undefined,
    recommendationKey: score < MAX ? "structured.recPartial" : undefined,
  };
}

async function checkMetaTags(html: string): Promise<CheckResult> {
  const MAX = 15;
  let score = 0;
  const findings: string[] = [];
  const missing: string[] = [];

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim().length > 10) {
    score += 3;
    findings.push("Title tag present");
  } else {
    missing.push("descriptive title tag");
  }

  // Meta description
  const descMatch = html.match(
    /<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']+)["']/i
  );
  if (descMatch && descMatch[1].length > 50) {
    score += 3;
    findings.push("Meta description present");
  } else {
    missing.push("meta description (50+ chars)");
  }

  // Open Graph
  const ogTags = ["og:title", "og:description", "og:image", "og:type"];
  const foundOg = ogTags.filter((tag) =>
    new RegExp(`property\\s*=\\s*["']${tag}["']`, "i").test(html)
  );
  score += Math.min(foundOg.length * 2, 6);
  if (foundOg.length === ogTags.length) {
    findings.push("Full Open Graph tags");
  } else if (foundOg.length > 0) {
    findings.push(`Partial Open Graph (${foundOg.length}/${ogTags.length})`);
    missing.push(`missing OG tags: ${ogTags.filter((t) => !foundOg.includes(t)).join(", ")}`);
  } else {
    missing.push("Open Graph tags");
  }

  // Canonical
  if (/<link[^>]*rel\s*=\s*["']canonical["']/i.test(html)) {
    score += 3;
    findings.push("Canonical URL set");
  } else {
    missing.push("canonical URL");
  }

  score = Math.min(score, MAX);

  return {
    name: "Meta Tags & Open Graph",
    score,
    maxScore: MAX,
    status: score >= 12 ? "pass" : score >= 6 ? "partial" : "fail",
    details:
      findings.length > 0
        ? findings.join(". ") + "."
        : "Very few meta tags found.",
    detailKey: findings.length > 0 ? "meta.found" : "meta.few",
    params: findings.length > 0 ? { findings: findings.join(". ") } : undefined,
    recommendation:
      missing.length > 0
        ? `Add: ${missing.join(", ")}. These help AI agents understand and cite your content.`
        : undefined,
    recommendationKey: missing.length > 0 ? "meta.recMissing" : undefined,
  };
}

async function checkSitemap(baseUrl: string): Promise<CheckResult> {
  const MAX = 10;
  const paths = ["/sitemap.xml", "/sitemap_index.xml"];

  for (const path of paths) {
    try {
      const res = await fetchWithTimeout(`${baseUrl}${path}`);
      if (res.ok) {
        const text = await res.text();
        const urlCount = (text.match(/<url>/gi) || []).length;
        const sitemapCount = (text.match(/<sitemap>/gi) || []).length;

        if (urlCount > 0 || sitemapCount > 0) {
          return {
            name: "Sitemap",
            score: MAX,
            maxScore: MAX,
            status: "pass",
            details: sitemapCount > 0
              ? `Sitemap index found with ${sitemapCount} sitemap(s).`
              : `Sitemap found with ${urlCount} URL(s).`,
            detailKey: sitemapCount > 0 ? "sitemap.index" : "sitemap.found",
            params: sitemapCount > 0 ? { count: sitemapCount } : { count: urlCount },
          };
        }

        return {
          name: "Sitemap",
          score: 5,
          maxScore: MAX,
          status: "partial",
          details: "Sitemap file exists but appears empty or malformed.",
          detailKey: "sitemap.empty",
          recommendation: "Ensure your sitemap.xml contains valid <url> entries.",
          recommendationKey: "sitemap.recEmpty",
        };
      }
    } catch {
      // try next path
    }
  }

  return {
    name: "Sitemap",
    score: 0,
    maxScore: MAX,
    status: "fail",
    details: "No sitemap.xml found.",
    detailKey: "sitemap.fail",
    recommendation:
      "Create a sitemap.xml listing all important pages. This helps AI crawlers discover your content efficiently.",
    recommendationKey: "sitemap.recFail",
  };
}

async function checkHttpsAndSpeed(
  baseUrl: string
): Promise<CheckResult> {
  const MAX = 10;
  const isHttps = baseUrl.startsWith("https://");

  if (!isHttps) {
    return {
      name: "HTTPS",
      score: 0,
      maxScore: MAX,
      status: "fail",
      details: "Site is not served over HTTPS.",
      detailKey: "https.fail",
      recommendation:
        "Migrate to HTTPS immediately. AI agents and search engines penalize insecure sites.",
      recommendationKey: "https.recFail",
    };
  }

  return {
    name: "HTTPS",
    score: MAX,
    maxScore: MAX,
    status: "pass",
    details: "Site is served over HTTPS.",
    detailKey: "https.pass",
  };
}

async function checkResponseTime(
  baseUrl: string
): Promise<CheckResult> {
  const MAX = 15;
  try {
    const start = Date.now();
    await fetchWithTimeout(baseUrl);
    const elapsed = Date.now() - start;

    let score: number;
    let status: "pass" | "partial" | "fail";
    let details: string;

    let detailKey: string;

    if (elapsed < 400) {
      score = MAX;
      status = "pass";
      details = `Excellent response time: ${elapsed}ms.`;
      detailKey = "response.excellent";
    } else if (elapsed < 1000) {
      score = 12;
      status = "pass";
      details = `Good response time: ${elapsed}ms.`;
      detailKey = "response.good";
    } else if (elapsed < 2000) {
      score = 8;
      status = "partial";
      details = `Moderate response time: ${elapsed}ms. AI agents prefer sub-400ms.`;
      detailKey = "response.moderate";
    } else if (elapsed < 4000) {
      score = 4;
      status = "partial";
      details = `Slow response time: ${elapsed}ms. This hurts AI crawlability.`;
      detailKey = "response.slow";
    } else {
      score = 1;
      status = "fail";
      details = `Very slow response time: ${elapsed}ms. AI agents may timeout.`;
      detailKey = "response.verySlow";
    }

    return {
      name: "Response Time",
      score,
      maxScore: MAX,
      status,
      details,
      detailKey,
      params: { ms: elapsed },
      recommendation:
        elapsed >= 1000
          ? "Optimize server response time to under 400ms. Use caching, CDN, and minimize server-side processing."
          : undefined,
      recommendationKey: elapsed >= 1000 ? "response.recSlow" : undefined,
    };
  } catch {
    return {
      name: "Response Time",
      score: 0,
      maxScore: MAX,
      status: "fail",
      details: "Could not measure response time (request failed or timed out).",
      detailKey: "response.error",
      recommendation: "Ensure your site is accessible and responds within 8 seconds.",
      recommendationKey: "response.recError",
    };
  }
}

function calculateGrade(
  score: number,
  max: number
): "A" | "B" | "C" | "D" | "F" {
  const pct = (score / max) * 100;
  if (pct >= 85) return "A";
  if (pct >= 70) return "B";
  if (pct >= 50) return "C";
  if (pct >= 30) return "D";
  return "F";
}

export async function scanUrl(rawUrl: string): Promise<ScanResult> {
  const url = normalizeUrl(rawUrl);
  const baseUrl = new URL(url).origin;

  // Fetch the homepage HTML first
  let html = "";
  try {
    const res = await fetchWithTimeout(url);
    html = await res.text();
  } catch {
    // Will be reflected in individual check scores
  }

  // Run all checks in parallel
  const checks = await Promise.all([
    checkLlmsTxt(baseUrl),
    checkRobotsTxt(baseUrl),
    checkStructuredData(html),
    checkMetaTags(html),
    checkSitemap(baseUrl),
    checkHttpsAndSpeed(url),
    checkResponseTime(url),
  ]);

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxPossibleScore = checks.reduce((sum, c) => sum + c.maxScore, 0);

  return {
    url,
    totalScore,
    maxPossibleScore,
    grade: calculateGrade(totalScore, maxPossibleScore),
    checks,
    scannedAt: new Date().toISOString(),
  };
}
