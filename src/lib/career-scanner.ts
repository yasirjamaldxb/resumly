// ══════════════════════════════════════════════════════════════
// Career Page Scanner — extract job listings from company pages
// ══════════════════════════════════════════════════════════════

export interface ScannedJob {
  title: string;
  url: string;
  location?: string;
  department?: string;
}

export interface ScoredJob extends ScannedJob {
  matchScore: number;
  matchReasons: string[];
}

export interface UserMatchProfile {
  target_role?: string;
  job_level?: string;
  industry?: string;
  years_experience?: number;
  career_context?: string;
  preferred_location?: string;
}

// ══════════════════════════════════════════════════════════════
// Job Board Detection
// ══════════════════════════════════════════════════════════════

export type JobBoard = 'greenhouse' | 'lever' | 'workday' | 'ashby' | 'generic';

export function detectJobBoard(url: string): JobBoard {
  const lower = url.toLowerCase();

  if (
    lower.includes('greenhouse.io') ||
    lower.includes('boards.greenhouse.io') ||
    lower.includes('boards-api.greenhouse.io')
  ) {
    return 'greenhouse';
  }

  if (
    lower.includes('lever.co') ||
    lower.includes('jobs.lever.co')
  ) {
    return 'lever';
  }

  if (lower.includes('myworkdayjobs.com') || lower.includes('myworkdaysite.com')) {
    return 'workday';
  }

  if (lower.includes('ashbyhq.com') || lower.includes('jobs.ashbyhq.com')) {
    return 'ashby';
  }

  return 'generic';
}

// ══════════════════════════════════════════════════════════════
// Company Slug / Name Extraction
// ══════════════════════════════════════════════════════════════

export function extractCompanySlug(url: string, board: JobBoard): string {
  try {
    const parsed = new URL(url);

    switch (board) {
      case 'greenhouse': {
        // https://boards.greenhouse.io/stripe or /stripe/jobs
        const match = parsed.pathname.match(/^\/([^/]+)/);
        return match?.[1] || '';
      }
      case 'lever': {
        // https://jobs.lever.co/openai
        const match = parsed.pathname.match(/^\/([^/]+)/);
        return match?.[1] || '';
      }
      case 'ashby': {
        // https://jobs.ashbyhq.com/company or https://company.jobs.ashbyhq.com
        const subdomainMatch = parsed.hostname.match(/^([^.]+)\.jobs\.ashbyhq\.com$/);
        if (subdomainMatch && subdomainMatch[1] !== 'jobs') return subdomainMatch[1];
        const pathMatch = parsed.pathname.match(/^\/([^/]+)/);
        return pathMatch?.[1] || '';
      }
      case 'workday': {
        // https://company.wd5.myworkdayjobs.com/en-US/careers
        const subMatch = parsed.hostname.match(/^([^.]+)\./);
        return subMatch?.[1] || '';
      }
      default:
        return '';
    }
  } catch {
    return '';
  }
}

export function extractCompanyName(url: string): string {
  try {
    const parsed = new URL(url);
    const board = detectJobBoard(url);

    if (board !== 'generic') {
      const slug = extractCompanySlug(url, board);
      if (slug) {
        // Capitalize and clean slug
        return slug
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    // Generic: use hostname
    const host = parsed.hostname.replace(/^www\./, '');
    const parts = host.split('.');
    const name = parts[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Unknown Company';
  }
}

// ══════════════════════════════════════════════════════════════
// Greenhouse Extractor
// ══════════════════════════════════════════════════════════════

interface GreenhouseApiJob {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  departments: { name: string }[];
}

export async function extractGreenhouseJobs(companySlug: string): Promise<ScannedJob[]> {
  const apiUrl = `https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs`;

  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    throw new Error(`Greenhouse API returned ${res.status}`);
  }

  const data = await res.json() as { jobs: GreenhouseApiJob[] };

  return (data.jobs || []).slice(0, 30).map((job) => ({
    title: job.title,
    url: job.absolute_url,
    location: job.location?.name || undefined,
    department: job.departments?.[0]?.name || undefined,
  }));
}

// ══════════════════════════════════════════════════════════════
// Lever Extractor
// ══════════════════════════════════════════════════════════════

interface LeverApiJob {
  id: string;
  text: string;
  hostedUrl: string;
  categories: {
    location?: string;
    team?: string;
    department?: string;
  };
}

export async function extractLeverJobs(companySlug: string): Promise<ScannedJob[]> {
  const apiUrl = `https://api.lever.co/v0/postings/${companySlug}?mode=json`;

  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    throw new Error(`Lever API returned ${res.status}`);
  }

  const data = await res.json() as LeverApiJob[];

  return (data || []).slice(0, 30).map((job) => ({
    title: job.text,
    url: job.hostedUrl,
    location: job.categories?.location || undefined,
    department: job.categories?.team || job.categories?.department || undefined,
  }));
}

// ══════════════════════════════════════════════════════════════
// Generic HTML Extractor
// ══════════════════════════════════════════════════════════════

export function extractGenericJobs(html: string, baseUrl: string): ScannedJob[] {
  const jobs: ScannedJob[] = [];
  const seenUrls = new Set<string>();

  // Patterns that indicate a job listing link
  const jobPathPatterns = [
    /\/jobs?\//i,
    /\/careers?\//i,
    /\/positions?\//i,
    /\/openings?\//i,
    /\/vacancies?\//i,
    /\/opportunities?\//i,
    /\/apply\//i,
    /\/job-details?\//i,
    /\/role\//i,
  ];

  // Paths to exclude (navigation, static pages)
  const excludePatterns = [
    /\/jobs\/?$/i,        // The careers page itself
    /\/careers\/?$/i,
    /\/search/i,
    /\/login/i,
    /\/signup/i,
    /\/about/i,
    /\/contact/i,
    /\/faq/i,
    /\/blog/i,
    /\/privacy/i,
    /\/terms/i,
    /\.(css|js|png|jpg|svg|ico|pdf)$/i,
    /#/,
    /mailto:/i,
    /javascript:/i,
  ];

  // Extract all anchor tags with href
  const anchorRegex = /<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[1].trim();
    const innerHtml = match[2];

    // Skip excluded patterns
    if (excludePatterns.some((p) => p.test(href))) continue;

    // Check if the href looks like a job listing
    const isJobLink = jobPathPatterns.some((p) => p.test(href));
    if (!isJobLink) continue;

    // Resolve the URL
    let fullUrl: string;
    try {
      fullUrl = new URL(href, baseUrl).href;
    } catch {
      continue;
    }

    // Deduplicate
    if (seenUrls.has(fullUrl)) continue;
    seenUrls.add(fullUrl);

    // Extract the link text as job title
    const title = innerHtml
      .replace(/<[^>]+>/g, '')  // strip HTML tags
      .replace(/\s+/g, ' ')    // normalize whitespace
      .trim();

    if (!title || title.length < 3 || title.length > 200) continue;

    jobs.push({ title, url: fullUrl });
  }

  // Also try to find job data in JSON-LD
  const jsonLdRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1]);
      const items = Array.isArray(jsonData) ? jsonData : [jsonData];
      for (const item of items) {
        if (item['@type'] === 'JobPosting' && item.title && item.url) {
          const url = item.url;
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            jobs.push({
              title: item.title,
              url,
              location: item.jobLocation?.address?.addressLocality || undefined,
              department: item.occupationalCategory || undefined,
            });
          }
        }
      }
    } catch {
      // Invalid JSON-LD, skip
    }
  }

  return jobs.slice(0, 30);
}

// ══════════════════════════════════════════════════════════════
// Job Match Scoring
// ══════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(/\s+/).filter((t) => t.length > 1);
}

function computeTokenOverlap(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setB = new Set(tokensB);
  const matches = tokensA.filter((t) => setB.has(t)).length;
  return matches / Math.max(tokensA.length, tokensB.length);
}

// Common job title words that shouldn't be weighted heavily
const STOP_WORDS = new Set([
  'senior', 'junior', 'lead', 'staff', 'principal', 'associate', 'intern',
  'manager', 'director', 'head', 'vp', 'chief', 'officer',
  'i', 'ii', 'iii', 'iv', 'v', 'the', 'and', 'or', 'of', 'for', 'at', 'in',
]);

export function computeJobMatchScore(
  job: ScannedJob,
  profile: UserMatchProfile,
  resumeSkills: string[],
  recentJobTitles: string[],
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const jobTitle = normalizeText(job.title);
  const jobTokens = tokenize(job.title).filter((t) => !STOP_WORDS.has(t));

  // ── Title match to target_role (up to 30 points) ──
  if (profile.target_role) {
    const targetTokens = tokenize(profile.target_role).filter((t) => !STOP_WORDS.has(t));
    const overlap = computeTokenOverlap(targetTokens, jobTokens);
    const titlePoints = Math.round(overlap * 30);
    if (titlePoints > 0) {
      score += titlePoints;
      reasons.push(`Title matches your target role "${profile.target_role}"`);
    }
  }

  // ── Title match to recent job titles (up to 20 points) ──
  if (recentJobTitles.length > 0) {
    let bestOverlap = 0;
    let bestTitle = '';
    for (const title of recentJobTitles) {
      const tokens = tokenize(title).filter((t) => !STOP_WORDS.has(t));
      const overlap = computeTokenOverlap(tokens, jobTokens);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestTitle = title;
      }
    }
    const recentPoints = Math.round(bestOverlap * 20);
    if (recentPoints > 0) {
      score += recentPoints;
      reasons.push(`Similar to your experience as "${bestTitle}"`);
    }
  }

  // ── Location match (up to 10 points) ──
  if (profile.preferred_location && job.location) {
    const prefLoc = normalizeText(profile.preferred_location);
    const jobLoc = normalizeText(job.location);
    if (jobLoc.includes('remote') || jobLoc.includes('anywhere')) {
      score += 10;
      reasons.push('Remote position — available from anywhere');
    } else if (jobLoc.includes(prefLoc) || prefLoc.includes(jobLoc)) {
      score += 10;
      reasons.push(`Location matches your preference: ${job.location}`);
    } else {
      // Partial location match (city, state, country)
      const prefParts = prefLoc.split(/[,\s]+/);
      const jobParts = jobLoc.split(/[,\s]+/);
      const locOverlap = prefParts.some((p) => jobParts.includes(p));
      if (locOverlap) {
        score += 5;
        reasons.push(`Partial location match: ${job.location}`);
      }
    }
  } else if (job.location) {
    const jobLoc = normalizeText(job.location);
    if (jobLoc.includes('remote') || jobLoc.includes('anywhere')) {
      score += 5;
      reasons.push('Remote position');
    }
  }

  // ── Department/industry match (up to 20 points) ──
  if (profile.industry && job.department) {
    const industryTokens = tokenize(profile.industry);
    const deptTokens = tokenize(job.department);
    const deptOverlap = computeTokenOverlap(industryTokens, deptTokens);
    const deptPoints = Math.round(deptOverlap * 20);
    if (deptPoints > 0) {
      score += deptPoints;
      reasons.push(`Department "${job.department}" aligns with your industry`);
    }
  }

  // Also check department against target role for relevance
  if (profile.target_role && job.department) {
    const targetTokens = tokenize(profile.target_role);
    const deptTokens = tokenize(job.department);
    const deptOverlap = computeTokenOverlap(targetTokens, deptTokens);
    const bonus = Math.round(deptOverlap * 10);
    if (bonus > 0 && score < 90) {
      score += Math.min(bonus, 10);
      reasons.push(`Department "${job.department}" relates to your target role`);
    }
  }

  // ── Skills keyword overlap (up to 20 points) ──
  if (resumeSkills.length > 0) {
    const skillsNorm = resumeSkills.map(normalizeText);
    const combined = `${jobTitle} ${normalizeText(job.department || '')}`;
    const matchedSkills = skillsNorm.filter((skill) => combined.includes(skill));
    const skillPoints = Math.min(Math.round((matchedSkills.length / Math.max(skillsNorm.length, 1)) * 20), 20);
    if (skillPoints > 0) {
      score += skillPoints;
      reasons.push(`Skills match: ${matchedSkills.slice(0, 5).join(', ')}`);
    }
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Default reason if no matches
  if (reasons.length === 0) {
    reasons.push('No strong profile match detected');
  }

  return { score, reasons };
}
