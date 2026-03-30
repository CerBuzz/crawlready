import type { Dictionary } from "./es";

const en: Dictionary = {
  meta: {
    title: "CrawlReady — Is Your Website Ready for AI Agents?",
    description:
      "Free AI Readiness Scanner. Check if AI agents can read and operate on your website. Get your score in 30 seconds.",
    ogTitle: "CrawlReady — Is Your Website Ready for AI Agents?",
    ogDescription:
      "93% of AI sessions end without visiting a website. Check your AI visibility score for free.",
  },
  nav: {
    scanner: "Scanner",
    howItWorks: "How It Works",
    services: "Services",
    langSwitch: "ES",
    langSwitchHref: "/es",
  },
  hero: {
    badge: "AI Search is replacing Google. Is your site ready?",
    headline1: "AI agents don't just search.",
    headlineAccent: "They take action on your website.",
    subheadline:
      "ChatGPT, Gemini and Perplexity already book appointments, request quotes and make purchases on behalf of your customers. If AI agents can't operate on your site, your business is invisible to the next generation of buyers.",
  },
  scanner: {
    placeholder: "Enter your website URL (e.g. example.com)",
    buttonScan: "Scan",
    buttonScanning: "Scanning...",
    errorNetwork: "Network error. Please try again.",
    errorGeneric: "Something went wrong.",
  },
  results: {
    reportTitle: "AI Readiness Report",
    gradeA: "Excellent! Your site is well-optimized for AI agents.",
    gradeB: "Good foundation, but there's room to improve AI visibility.",
    gradeC: "Your site needs work to be visible to AI agents.",
    gradeDF:
      "Your site is largely invisible to AI agents. Significant improvements needed.",
    ctaTitle: "Want to fix these issues?",
    ctaBody:
      "We test what happens when an AI agent tries to operate on your website and give you concrete solutions. AI-native process: fast delivery at a fraction of traditional agency costs.",
    ctaButton: "See how to fix it",
  },
  checks: {
    sectionTitle: "What We Check",
    items: [
      {
        title: "llms.txt",
        desc: "The new standard for telling AI agents what your site is about. Like robots.txt, but for LLMs.",
      },
      {
        title: "AI Crawler Access",
        desc: "Is your robots.txt blocking GPTBot, ClaudeBot, or PerplexityBot from reading your content?",
      },
      {
        title: "Structured Data",
        desc: "JSON-LD and schema markup that helps AI agents understand your business, products, and content.",
      },
      {
        title: "Meta Tags & OG",
        desc: "Title, description, and Open Graph tags that AI uses to summarize and cite your pages.",
      },
      {
        title: "Sitemap",
        desc: "An XML sitemap helps AI crawlers discover all your important pages efficiently.",
      },
      {
        title: "Speed & Security",
        desc: "HTTPS and fast response times are baseline requirements for AI agent compatibility.",
      },
    ],
  },
  scannerResults: {
    // llms.txt
    "llmsTxt.pass": "llms.txt found with meaningful content.",
    "llmsTxt.partial": "llms.txt exists but has very little content.",
    "llmsTxt.fail": "No llms.txt file found.",
    "llmsTxt.error": "Could not check llms.txt (request failed).",
    "llmsTxt.recPartial": "Add detailed descriptions of your site sections, APIs, and key content to llms.txt.",
    "llmsTxt.recFail": "Create a /llms.txt file that describes your site structure, key pages, and content for AI agents. See llmstxt.org for the specification.",
    "llmsTxt.recError": "Create a /llms.txt file following the specification at llmstxt.org.",
    // robots.txt
    "robots.noFile": "No robots.txt found. AI crawlers can access your site by default, but there's no explicit configuration.",
    "robots.manyBlocked": "Blocking {count} AI crawlers: {bots}.",
    "robots.blanketBlock": "robots.txt has a blanket disallow for all bots with no AI-specific exceptions.",
    "robots.someBlocked": "Some AI crawlers blocked: {bots}. Others can access your site.",
    "robots.pass": "robots.txt allows AI crawlers to access your site.",
    "robots.error": "Could not fetch robots.txt.",
    "robots.recNoFile": "Create a robots.txt that explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot).",
    "robots.recManyBlocked": "Consider allowing AI crawlers to index your content. Blocking them means your site won't appear in AI-generated answers.",
    "robots.recBlanketBlock": "Add explicit Allow rules for AI crawlers like GPTBot and ClaudeBot.",
    "robots.recSomeBlocked": "Consider allowing {bots} to maximize AI visibility.",
    "robots.recError": "Ensure your robots.txt is accessible and allows AI crawlers.",
    // Structured data
    "structured.fail": "No structured data (JSON-LD, Microdata, or RDFa) found.",
    "structured.found": "{findings}.",
    "structured.recFail": "Add JSON-LD structured data for your Organization, WebSite, and key content types. This is critical for AI agents to understand your business.",
    "structured.recPartial": "Add more schema types (Organization, FAQPage, Product, BreadcrumbList) to improve AI comprehension.",
    // Meta tags
    "meta.found": "{findings}.",
    "meta.few": "Very few meta tags found.",
    "meta.recMissing": "Add the missing meta tags. These help AI agents understand and cite your content.",
    // Sitemap
    "sitemap.index": "Sitemap index found with {count} sitemap(s).",
    "sitemap.found": "Sitemap found with {count} URL(s).",
    "sitemap.empty": "Sitemap file exists but appears empty or malformed.",
    "sitemap.fail": "No sitemap.xml found.",
    "sitemap.recEmpty": "Ensure your sitemap.xml contains valid <url> entries.",
    "sitemap.recFail": "Create a sitemap.xml listing all important pages. This helps AI crawlers discover your content efficiently.",
    // HTTPS
    "https.pass": "Site is served over HTTPS.",
    "https.fail": "Site is not served over HTTPS.",
    "https.recFail": "Migrate to HTTPS immediately. AI agents and search engines penalize insecure sites.",
    // Response time
    "response.excellent": "Excellent response time: {ms}ms.",
    "response.good": "Good response time: {ms}ms.",
    "response.moderate": "Moderate response time: {ms}ms. AI agents prefer sub-400ms.",
    "response.slow": "Slow response time: {ms}ms. This hurts AI crawlability.",
    "response.verySlow": "Very slow response time: {ms}ms. AI agents may timeout.",
    "response.error": "Could not measure response time (request failed or timed out).",
    "response.recSlow": "Optimize server response time to under 400ms. Use caching, CDN, and minimize server-side processing.",
    "response.recError": "Ensure your site is accessible and responds within 8 seconds.",
  } as Record<string, string>,
  footer: {
    tagline: "CrawlReady — AI Readiness Agency",
    email: "hello@crawlready.dev",
  },
  serviciosPage: {
    heroBadge: "AI agent optimization services",
    heroH1pre: "Let AI agents not just ",
    heroAccent1: "find you",
    heroH1mid: ", but ",
    heroAccent2: "act on your site",
    heroSubtitle:
      "We test what happens when an AI assistant tries to complete a task on your website — booking an appointment, requesting a quote, making a purchase — and tell you exactly what fails and how to fix it.",
    howTitle: "How it works",
    howSubtitle:
      "A simple three-step process. No jargon, no commitments.",
    steps: [
      {
        num: "1",
        title: "We test your site",
        desc: "An AI agent attempts to complete a real task on your site: book an appointment, request a quote, purchase a product. We document every step.",
      },
      {
        num: "2",
        title: "We show you what happens",
        desc: "You receive a visual report: where the agent succeeded, where it got stuck, and exactly what it sees when visiting your site.",
      },
      {
        num: "3",
        title: "We give you the solution",
        desc: "Concrete recommendations with implementation-ready code. No ambiguity: this is what needs to change and this is how to do it.",
      },
    ],
    pricingTitle: "Choose what you need",
    pricingSubtitle:
      "From diagnosis to full implementation. Start wherever you want.",
    plans: [
      {
        badge: "Diagnosis",
        name: "AI Visibility Report",
        price: "Free",
        priceNote: "",
        desc: "We test what happens when an AI agent tries to use your site and send you the results.",
        features: [
          "Real test with an AI agent",
          "Step-by-step visual report",
          "What works and what fails",
          "Competitor comparison",
          "High-level recommendations",
        ],
        cta: "Request free report",
        ctaHref:
          "mailto:hello@crawlready.dev?subject=Free%20AI%20Visibility%20Report&body=Hi%2C%20I'd%20like%20an%20AI%20visibility%20report%20for%20my%20site%3A%20%5Byour%20URL%20here%5D",
        highlight: false,
      },
      {
        badge: "Most popular",
        name: "Implementation Kit",
        price: "€97",
        priceNote: "one-time",
        desc: "All the code ready for your team to implement. Copy, paste, done.",
        features: [
          "Everything in the free report",
          "Complete custom JSON-LD",
          "JavaScript-free accessible forms",
          "Optimized meta tags and Open Graph",
          "Step-by-step instructions for your developer",
          "Email support for 30 days",
        ],
        cta: "Request kit",
        ctaHref:
          "mailto:hello@crawlready.dev?subject=Implementation%20Kit&body=Hi%2C%20I'm%20interested%20in%20the%20implementation%20kit%20for%20my%20site%3A%20%5Byour%20URL%20here%5D",
        highlight: true,
      },
      {
        badge: "Done for you",
        name: "Full Implementation",
        price: "€397",
        priceNote: "one-time",
        desc: "Give us access and we do it for you. You don't touch a thing.",
        features: [
          "Everything in the implementation kit",
          "We install it on your site",
          "Compatible with WordPress, WooCommerce, PrestaShop and more",
          "Post-implementation verification",
          "AI agent re-test to confirm it works",
          "Email support for 60 days",
        ],
        cta: "Request implementation",
        ctaHref:
          "mailto:hello@crawlready.dev?subject=Full%20Implementation&body=Hi%2C%20I'm%20interested%20in%20full%20implementation%20for%20my%20site%3A%20%5Byour%20URL%20here%5D%0A%0AMy%20site%20uses%3A%20%5BWordPress%20%2F%20Shopify%20%2F%20other%5D",
        highlight: false,
      },
    ],
    monitorTitle: "Monthly monitoring",
    monitorBadge: "Add-on",
    monitorDesc:
      "We scan your site every month with an AI agent. You receive a report with changes, alerts if something breaks, and continuous improvement recommendations.",
    monitorPrice: "€97",
    monitorPeriod: "/month",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: 'What exactly is an "AI agent"?',
        a: "It's an assistant like ChatGPT, Google Gemini, or Siri when it acts on behalf of a user: searching for a service, comparing options, trying to book an appointment or make a purchase.",
      },
      {
        q: "Why doesn't my site work for AI agents if it works for people?",
        a: "Most AI agents don't see your site the way you do. They don't run JavaScript, they can't see images, they can't click buttons. They only see the initial HTML code. If your form loads with JavaScript, the agent sees a blank page.",
      },
      {
        q: "How do I know if this affects me?",
        a: "We'll send you a free report where we test what happens when an AI agent tries to use your site. No commitment.",
      },
      {
        q: "What does the implementation kit include?",
        a: "Copy-paste ready code: custom JSON-LD for your business, accessible forms, optimized meta tags, and a step-by-step guide for your technical team. Everything specific to your site, not generic templates.",
      },
      {
        q: "What if I don't have a technical team?",
        a: "That's what the full implementation is for. Give us access to your site (WordPress, hosting panel, or repository) and we do it.",
      },
      {
        q: "How long does it take?",
        a: "The report is delivered in 24-48 hours. The implementation kit in 3-5 business days. Full implementation in 5-10 business days depending on complexity.",
      },
    ],
    finalCtaTitle: "Start with the free report",
    finalCtaBody:
      "Write to us with your site's URL and we'll send you an analysis of what an AI agent sees when it tries to use it. No commitment, no small print.",
    finalCtaButton: "Request free report",
    finalCtaHref:
      "mailto:hello@crawlready.dev?subject=Free%20AI%20Visibility%20Report&body=Hi%2C%20I'd%20like%20an%20AI%20visibility%20report%20for%20my%20site%3A%20%5Byour%20URL%20here%5D",
    finalCtaNote: "Or write directly: hello@crawlready.dev",
  },
};

export default en;
