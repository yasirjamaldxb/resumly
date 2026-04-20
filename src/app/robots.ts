import { MetadataRoute } from 'next';

// Explicit allow-list for AI crawlers — we WANT to be indexed and cited by
// ChatGPT, Perplexity, Claude, Gemini, and other answer engines.
// Also keeps traditional search bots (Googlebot, Bingbot) happy.
export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/dashboard',
    '/builder/',
    '/auth/',
    '/api/',
    '/funnel/',
    '/import',
    '/job-preview',
    '/preview/',
    '/r/', // shareable public resumes — don't index user content
    '/z9k-panel', // admin
  ];

  // AI crawlers we explicitly want to allow
  const aiCrawlers = [
    'GPTBot', // OpenAI / ChatGPT
    'ChatGPT-User', // ChatGPT browsing
    'OAI-SearchBot', // OpenAI SearchGPT
    'Google-Extended', // Google Gemini / Bard training
    'PerplexityBot', // Perplexity
    'Perplexity-User', // Perplexity user-initiated fetches
    'ClaudeBot', // Anthropic Claude
    'Claude-Web', // Anthropic legacy
    'anthropic-ai', // Anthropic legacy
    'CCBot', // Common Crawl (feeds most LLMs)
    'Applebot', // Apple Intelligence / Siri
    'Applebot-Extended', // Apple AI training
    'Bytespider', // ByteDance / Doubao
    'YouBot', // You.com
    'cohere-ai', // Cohere
    'Meta-ExternalAgent', // Meta AI
    'Meta-ExternalFetcher', // Meta AI fetcher
    'DuckAssistBot', // DuckDuckGo AI
    'Diffbot', // Diffbot (knowledge graph)
    'Amazonbot', // Amazon Alexa / Rufus
    'Bingbot', // Bing (also feeds Copilot)
  ];

  const aiRules = aiCrawlers.map((userAgent) => ({
    userAgent,
    allow: '/',
    disallow: privatePaths,
  }));

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      ...aiRules,
    ],
    sitemap: [
      'https://resumly.app/sitemap.xml',
    ],
    host: 'https://resumly.app',
  };
}
