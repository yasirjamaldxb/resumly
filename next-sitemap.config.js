/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://resumly.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/builder',
          '/auth',
          '/api',
          '/funnel',
          '/import',
          '/job-preview',
          '/r/',
        ],
      },
    ],
  },
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/builder/*',
    '/auth/*',
    '/api/*',
    '/funnel/*',
    '/import',
    '/job-preview',
    '/r/*',
    '/icon.svg',
    '/apple-icon.png',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-0.xml',
    '/z9k-panel',
  ],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async () => {
    const examples = [
      'software-engineer', 'nurse', 'student', 'marketing-manager',
      'data-scientist', 'product-manager', 'web-developer', 'ux-designer',
      'accountant', 'project-manager', 'teacher', 'high-school-student',
      'internship', 'customer-service', 'sales-manager',
    ];

    return [
      { loc: '/', changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() },
      { loc: '/resume-builder', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
      { loc: '/resume-templates', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
      { loc: '/resume-examples', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/cover-letter-builder', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/ai-resume-builder', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/ats-checker', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/blog', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
      ...examples.map((slug) => ({
        loc: `/resume-examples/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
      })),
    ];
  },
};
