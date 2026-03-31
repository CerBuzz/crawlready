import type { Dictionary } from "./es";

const en: Dictionary = {
  meta: {
    title: "CrawlReady",
    description:
      "Free AI Readiness Scanner. Check if AI agents can read and operate on your website. Get your score in 30 seconds.",
    ogTitle: "CrawlReady — Is Your Website Ready for AI Agents?",
    ogDescription:
      "93% of AI sessions end without visiting a website. Check your AI visibility score for free.",
  },
  nav: {
    howItWorks: "How It Works",
    pricing: "Pricing",
    services: "Services",
    langSwitch: "ES",
    langSwitchHref: "/es",
  },
  hero: {
    badge: "93% of AI sessions end without visiting a website",
    headline1: "An AI agent tried to buy from you.",
    headlineAccent: "It couldn't.",
    subheadline:
      "ChatGPT, Gemini and Perplexity already manage appointments, quotes and purchases on behalf of your customers. If an AI agent can't operate on your site, you're losing sales without knowing it.",
  },
  heroForm: {
    urlPlaceholder: "Your website URL (e.g. example.com)",
    emailPlaceholder: "Your contact email",
    button: "Request your free test",
    sending: "Sending...",
    successTitle: "Check your email!",
    successBody: "We've sent a confirmation email to {email}. Click the link to confirm your request.",
    duplicateTitle: "You already have a request",
    duplicateBody: "This email already has a pending request. If you need another analysis, write to us at hello@crawlready.dev.",
    errorNetwork: "Network error. Please try again.",
    errorGeneric: "Something went wrong. Write to us at hello@crawlready.dev.",
  },
  howItWorks: {
    sectionTitle: "How it works",
    sectionSubtitle: "A simple three-step process. No jargon, no commitments.",
    steps: [
      {
        num: "1",
        title: "We test your site",
        desc: "An AI agent attempts a real task: booking an appointment, requesting a quote, purchasing a product. We document every step.",
      },
      {
        num: "2",
        title: "We show you what fails",
        desc: "You receive a visual report: where the agent succeeded, where it got stuck, and exactly what it sees when visiting your site.",
      },
      {
        num: "3",
        title: "We fix it",
        desc: "We implement the solutions on your site: structured data, accessible forms, meta tags. You don't touch a thing.",
      },
    ],
  },
  pricing: {
    sectionTitle: "Pricing",
    sectionSubtitle: "No small print. No calls. No lock-in.",
    free: {
      badge: "Start here",
      name: "AI Visibility Report",
      price: "Free",
      desc: "We test what happens when an AI agent tries to use your site and send you the results.",
      features: [
        "Real test with an AI agent",
        "Step-by-step visual report",
        "Comparison with your direct competitor",
        "Concrete recommendations",
      ],
      cta: "Request free report",
    },
    paid: {
      badge: "Done for you",
      name: "Full Implementation",
      price: "€397",
      priceNote: "one-time",
      desc: "Give us access and we do it for you. AI agent re-test included.",
      features: [
        "Everything in the free report",
        "We install everything on your site",
        "JSON-LD, accessible forms, meta tags",
        "Compatible with WordPress, Shopify, PrestaShop and more",
        "AI agent re-test post-implementation",
        "Email support for 60 days",
      ],
      cta: "Request implementation",
    },
  },
  dogfooding: {
    title: "Better service. Lower price. What's the catch?",
    body: "There's no catch. We use the same technology we optimize for you: AI agents in all our processes. That's how we provide 24/7 support, deliver in days, and charge €397 instead of €4,000.",
    highlight: "",
  },
  finalCta: {
    title: "Find out what an AI agent sees on your site",
    body: "Send us your URL and your competitor's. You'll have the report in 48 hours. No commitment, no small print.",
    button: "Request free test",
    note: "Or write directly: hello@crawlready.dev",
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
  monitorPage: {
    heroBadge: "Monthly multi-model audit",
    heroH1pre: "Every AI model sees your site ",
    heroAccent1: "differently",
    heroH1mid: ". We test them ",
    heroAccent2: "all",
    heroSubtitle:
      "ChatGPT, Claude, Gemini and Perplexity don't search the same way or recommend the same things. Every month we test your site with all of them, compare you against your competitors, and send you a report with what's changed.",
    whyTitle: "Why does using multiple models matter?",
    whySubtitle: "Each AI agent has a different user profile. If you only optimize for one, you're invisible to the rest.",
    models: [
      {
        name: "ChatGPT",
        share: "60%",
        shareLabel: "of consumer market",
        profile: "Most used by consumers. Dominates B2C searches: restaurants, shops, personal services. 400M+ weekly users.",
        color: "emerald",
      },
      {
        name: "Claude",
        share: "60%",
        shareLabel: "of Fortune 500",
        profile: "Dominant in enterprise. 29% B2B market share, integrated in Slack, Teams and Zoom. If your client is a company, they probably use Claude.",
        color: "violet",
      },
      {
        name: "Perplexity",
        share: "370%",
        shareLabel: "annual growth",
        profile: "The AI-native search engine. Cites sources and links directly. Explosive growth in research and comparison searches.",
        color: "blue",
      },
      {
        name: "Google Gemini",
        share: "21%",
        shareLabel: "and growing fast",
        profile: "From 5.7% to 21.5% in 12 months. Integrated in Google Search, Android and Workspace. Google's bet on AI search.",
        color: "amber",
      },
    ],
    howTitle: "What you get every month",
    howSubtitle: "A complete report covering discovery, readability, actionability and competitive comparison.",
    deliverables: [
      {
        icon: "search",
        title: "Blind search on each model",
        desc: "We ask ChatGPT, Claude, Perplexity and Gemini to search for your service without naming you. Do they find you? In what position? Do they recommend you?",
      },
      {
        icon: "eye",
        title: "Readability test",
        desc: "Does each model understand what you do, what you charge and what your clients say? We score each dimension per model.",
      },
      {
        icon: "zap",
        title: "Actionability test",
        desc: "Can each model use your forms, send emails or interact with your contact channels? We document what works and what doesn't.",
      },
      {
        icon: "users",
        title: "Competitor comparison",
        desc: "We test the same thing with 2-3 of your direct competitors. You see exactly where you're ahead and where they beat you.",
      },
      {
        icon: "trending",
        title: "Month-over-month evolution",
        desc: "We compare with the previous month: have you improved? Have the models changed anything? Has your competitor made changes?",
      },
      {
        icon: "alert",
        title: "Change alerts",
        desc: "If a model stops finding you, if your form breaks, or if a competitor overtakes you — we alert you immediately, not next month.",
      },
    ],
    pricingTitle: "One price, everything included",
    pricingPrice: "€97",
    pricingPeriod: "/month",
    pricingDesc: "No lock-in. Cancel anytime.",
    pricingFeatures: [
      "Monthly test with 4 AI models (ChatGPT, Claude, Perplexity, Gemini)",
      "Blind search + readability + actionability",
      "Comparison with 2-3 competitors in your sector",
      "Visual report with month-over-month evolution",
      "Immediate alerts if something changes",
      "Prioritized improvement recommendations",
      "Email support — we respond same day",
    ],
    pricingCta: "Start monitoring",
    pricingCtaHref:
      "mailto:hello@crawlready.dev?subject=Monthly%20monitoring&body=Hi%2C%20I'm%20interested%20in%20monthly%20monitoring%20for%20my%20site%3A%20%5Byour%20URL%20here%5D%0A%0AMy%20main%20competitors%20are%3A%20%5B1.%20...%2C%202.%20...%2C%203.%20...%5D",
    sampleTitle: "Example of what you receive",
    sampleMonths: [
      {
        month: "January",
        chatgpt: { found: true, position: 5, readable: "B", operable: "C" },
        claude: { found: false, position: null, readable: "C", operable: "D" },
        perplexity: { found: true, position: 3, readable: "B", operable: "C" },
        gemini: { found: true, position: 8, readable: "C", operable: "D" },
      },
      {
        month: "February",
        chatgpt: { found: true, position: 3, readable: "A", operable: "B" },
        claude: { found: true, position: 6, readable: "B", operable: "C" },
        perplexity: { found: true, position: 2, readable: "A", operable: "B" },
        gemini: { found: true, position: 5, readable: "B", operable: "C" },
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Why does each model give different results?",
        a: "Each AI model has its own index, data sources and recommendation criteria. ChatGPT prioritizes popularity and recent content, Claude values structured data more, Perplexity cites sources directly and Gemini integrates with Google's index. Optimizing for just one can leave you invisible on the others.",
      },
      {
        q: "Who are the competitors you analyze?",
        a: "You tell us who your 2-3 main competitors are. If you're not sure, we help identify them based on who appears when we search for your service across the different models.",
      },
      {
        q: "How often do I receive the report?",
        a: "Once a month, always in the first week. If we detect something urgent between reports (a competitor overtaking you, a change on your site that breaks something), we alert you by email immediately.",
      },
      {
        q: "Is there a lock-in period?",
        a: "No. Cancel anytime. No penalties, no questions asked.",
      },
      {
        q: "Can I start with just one report to try?",
        a: "Yes. The free AI visibility report already includes a test with one model. Monthly monitoring expands this to 4 models + competitors + temporal evolution.",
      },
    ],
    finalCtaTitle: "Start monitoring your AI visibility",
    finalCtaBody:
      "Write to us with your URL and main competitors. You'll receive the first multi-model report in less than a week.",
    finalCtaButton: "Request monitoring",
    finalCtaHref:
      "mailto:hello@crawlready.dev?subject=Monthly%20monitoring&body=Hi%2C%20I'm%20interested%20in%20monthly%20monitoring%20for%20my%20site%3A%20%5Byour%20URL%20here%5D%0A%0AMy%20main%20competitors%20are%3A%20%5B1.%20...%2C%202.%20...%2C%203.%20...%5D",
    finalCtaNote: "Or write directly: hello@crawlready.dev",
  },
};

export default en;
