import { MetadataRoute } from 'next';

const BASE_URL = 'https://resumly.app';

// Use a fixed date so Google doesn't see "always changing" timestamps
// Update this when you actually change content
const LAST_UPDATED = '2026-03-23';

const RESUME_EXAMPLES = [
  'software-engineer', 'nurse', 'student', 'marketing-manager',
  'data-scientist', 'product-manager', 'web-developer', 'ux-designer',
  'accountant', 'project-manager', 'teacher', 'high-school-student',
  'internship', 'customer-service', 'sales-manager', 'warehouse-worker',
  'medical-assistant', 'pharmacist', 'financial-analyst', 'graphic-designer',
  'hr-manager', 'business-analyst',
];

const BLOG_SLUGS = [
  'how-to-write-a-resume', 'ats-resume-guide', 'resume-summary-examples',
  'resume-skills', 'how-to-write-a-cover-letter', 'resume-action-words',
  'cv-vs-resume', 'resume-with-no-experience', 'resume-tips',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: LAST_UPDATED, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/resume-builder`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ai-resume-builder`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/resume-templates`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/resume-examples`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/cover-letter-builder`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/ats-checker`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: LAST_UPDATED, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: LAST_UPDATED, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const examplePages: MetadataRoute.Sitemap = RESUME_EXAMPLES.map((slug) => ({
    url: `${BASE_URL}/resume-examples/${slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...examplePages, ...blogPages];
}
