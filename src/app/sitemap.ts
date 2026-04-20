import { MetadataRoute } from 'next';

const BASE_URL = 'https://resumly.app';

// Fixed date so Google doesn't see "always changing" timestamps.
// Update this when you materially change content.
const LAST_UPDATED = '2026-04-20';

// High-search-volume resume example slugs. All render via the
// `[category]/page.tsx` route — hardcoded entries in EXAMPLES get rich data,
// the rest fall through to the programmatic default in getExampleData().
const RESUME_EXAMPLES = [
  // Tech & Engineering
  'software-engineer', 'web-developer', 'data-scientist', 'data-analyst',
  'machine-learning-engineer', 'devops-engineer', 'cloud-engineer',
  'cybersecurity-analyst', 'qa-engineer', 'full-stack-developer',
  'frontend-developer', 'backend-developer', 'mobile-developer',
  'android-developer', 'ios-developer', 'game-developer', 'systems-engineer',
  'network-engineer', 'database-administrator', 'site-reliability-engineer',

  // Product, Design, Marketing
  'product-manager', 'ux-designer', 'ui-designer', 'graphic-designer',
  'web-designer', 'interior-designer', 'marketing-manager', 'digital-marketing',
  'social-media-manager', 'content-writer', 'copywriter', 'seo-specialist',
  'brand-manager', 'public-relations', 'video-editor', 'photographer',

  // Business, Sales, Finance
  'business-analyst', 'project-manager', 'program-manager', 'operations-manager',
  'sales-manager', 'sales-representative', 'account-manager', 'account-executive',
  'business-development', 'accountant', 'bookkeeper', 'financial-analyst',
  'investment-banker', 'auditor', 'tax-accountant', 'consultant',
  'management-consultant', 'hr-manager', 'recruiter', 'hr-generalist',
  'executive-assistant', 'administrative-assistant', 'office-manager',

  // Healthcare
  'nurse', 'registered-nurse', 'nursing-assistant', 'medical-assistant',
  'pharmacist', 'pharmacy-technician', 'physician', 'dentist', 'dental-hygienist',
  'physical-therapist', 'occupational-therapist', 'radiologic-technologist',
  'medical-receptionist', 'home-health-aide', 'caregiver', 'veterinary-technician',

  // Education
  'teacher', 'elementary-teacher', 'substitute-teacher', 'tutor',
  'teaching-assistant', 'school-counselor', 'librarian', 'professor',

  // Students & Entry-Level
  'student', 'high-school-student', 'college-student', 'internship',
  'recent-graduate', 'entry-level', 'no-experience', 'career-change',

  // Skilled Trades & Labor
  'electrician', 'plumber', 'carpenter', 'mechanic', 'auto-mechanic',
  'hvac-technician', 'welder', 'construction-worker', 'general-laborer',
  'forklift-operator', 'warehouse-worker', 'cdl-driver', 'truck-driver',
  'delivery-driver', 'uber-driver',

  // Service & Retail
  'customer-service', 'call-center', 'retail-sales', 'cashier',
  'barista', 'bartender', 'server', 'waiter', 'cook', 'chef',
  'hostess', 'housekeeper', 'cleaner', 'security-guard', 'flight-attendant',

  // Legal & Government
  'lawyer', 'attorney', 'paralegal', 'legal-assistant', 'police-officer',
  'firefighter', 'military-to-civilian', 'social-worker',

  // Misc high-volume
  'freelancer', 'real-estate-agent', 'insurance-agent', 'event-planner',
  'personal-trainer', 'yoga-instructor',
];

// Blog posts — grows as we ship more guides
const BLOG_SLUGS = [
  'how-to-write-a-resume', 'ats-resume-guide', 'resume-summary-examples',
  'resume-skills', 'how-to-write-a-cover-letter', 'resume-action-words',
  'cv-vs-resume', 'resume-with-no-experience', 'resume-tips',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: LAST_UPDATED, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/resume-builder`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/ai-resume-builder`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/resume-templates`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/resume-examples`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ats-checker`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/cover-letter-builder`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/pricing`, lastModified: LAST_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: LAST_UPDATED, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: LAST_UPDATED, changeFrequency: 'yearly', priority: 0.2 },
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
    priority: 0.65,
  }));

  return [...staticPages, ...examplePages, ...blogPages];
}
