/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://resumly.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/builder', '/auth'],
      },
    ],
    additionalSitemaps: ['https://resumly.app/sitemap.xml'],
  },
  exclude: ['/dashboard', '/builder/*', '/auth/*', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async (config) => {
    const examples = [
      'software-engineer', 'nurse', 'student', 'marketing-manager',
      'data-scientist', 'product-manager', 'web-developer', 'ux-designer',
      'accountant', 'project-manager', 'teacher', 'high-school-student',
      'internship', 'customer-service', 'sales-manager',
    ];

    return [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/resume-builder', changefreq: 'weekly', priority: 0.9 },
      { loc: '/resume-templates', changefreq: 'weekly', priority: 0.9 },
      { loc: '/resume-examples', changefreq: 'weekly', priority: 0.8 },
      { loc: '/cover-letter-builder', changefreq: 'weekly', priority: 0.8 },
      { loc: '/ats-checker', changefreq: 'weekly', priority: 0.8 },
      ...examples.map((slug) => ({
        loc: `/resume-examples/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
      })),
    ];
  },
};
