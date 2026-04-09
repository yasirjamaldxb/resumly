// Job Recommendations - Adzuna + RemoteOK API clients with caching

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  url: string;
  postedAt: string;
  source: 'adzuna' | 'remoteok';
  matchScore: number;
}

interface CacheEntry {
  data: RecommendedJob[];
  timestamp: number;
}

// ---------- In-memory cache (4-hour TTL) ----------

const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours in ms
const cache = new Map<string, CacheEntry>();

function getCacheKey(userId: string, jobTitle: string): string {
  return `${userId}:${jobTitle}`;
}

export function getCached(userId: string, jobTitle: string): RecommendedJob[] | null {
  const key = getCacheKey(userId, jobTitle);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(userId: string, jobTitle: string, data: RecommendedJob[]): void {
  const key = getCacheKey(userId, jobTitle);
  cache.set(key, { data, timestamp: Date.now() });

  // Evict stale entries to prevent unbounded growth (max 500 entries)
  if (cache.size > 500) {
    const now = Date.now();
    cache.forEach((v, k) => {
      if (now - v.timestamp > CACHE_TTL) cache.delete(k);
    });
  }
}

// ---------- Country detection ----------

const COUNTRY_MAP: Record<string, string> = {
  // Full country names
  'united kingdom': 'gb',
  'uk': 'gb',
  'england': 'gb',
  'scotland': 'gb',
  'wales': 'gb',
  'united arab emirates': 'ae',
  'uae': 'ae',
  'dubai': 'ae',
  'abu dhabi': 'ae',
  'canada': 'ca',
  'australia': 'au',
  'germany': 'de',
  'deutschland': 'de',
  'france': 'fr',
  'india': 'in',
  'united states': 'us',
  'usa': 'us',
  'us': 'us',
  // Common cities
  'london': 'gb',
  'manchester': 'gb',
  'birmingham': 'gb',
  'toronto': 'ca',
  'vancouver': 'ca',
  'montreal': 'ca',
  'sydney': 'au',
  'melbourne': 'au',
  'brisbane': 'au',
  'berlin': 'de',
  'munich': 'de',
  'hamburg': 'de',
  'paris': 'fr',
  'lyon': 'fr',
  'mumbai': 'in',
  'bangalore': 'in',
  'bengaluru': 'in',
  'delhi': 'in',
  'hyderabad': 'in',
  'new delhi': 'in',
  'pune': 'in',
  'chennai': 'in',
};

export function detectCountry(location: string | null): string {
  if (!location) return 'us';
  const lower = location.toLowerCase().trim();

  for (const [keyword, code] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(keyword)) return code;
  }

  return 'us';
}

// ---------- Match score calculation ----------

export function calculateMatchScore(
  jobTitle: string,
  jobDescription: string,
  userSkills: string[],
  userJobTitle: string,
): number {
  if (!userSkills.length && !userJobTitle) return 50;

  const titleLower = jobTitle.toLowerCase();
  const descLower = (jobDescription || '').toLowerCase();
  const userTitleWords = userJobTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  let score = 0;
  let maxPoints = 0;

  // Title keyword overlap (weighted heavily)
  if (userTitleWords.length > 0) {
    maxPoints += 50;
    const titleMatches = userTitleWords.filter(
      w => titleLower.includes(w) || descLower.includes(w),
    ).length;
    score += Math.round((titleMatches / userTitleWords.length) * 50);
  }

  // Skills overlap
  if (userSkills.length > 0) {
    maxPoints += 50;
    const skillMatches = userSkills.filter(skill => {
      const s = skill.toLowerCase();
      return titleLower.includes(s) || descLower.includes(s);
    }).length;
    score += Math.round((skillMatches / userSkills.length) * 50);
  }

  if (maxPoints === 0) return 50;
  return Math.max(10, Math.min(100, Math.round((score / maxPoints) * 100)));
}

// ---------- Adzuna API ----------

interface AdzunaResult {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
  description: string;
}

interface AdzunaResponse {
  results: AdzunaResult[];
}

export async function fetchAdzunaJobs(
  jobTitle: string,
  location: string | null,
  userSkills: string[],
): Promise<RecommendedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.warn('Adzuna API credentials not configured');
    return [];
  }

  const country = detectCountry(location);

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: jobTitle,
    results_per_page: '10',
    'content-type': 'application/json',
  });

  if (location) {
    params.set('where', location);
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
  }

  const data: AdzunaResponse = await response.json();

  return (data.results || []).map((job) => {
    const salary = job.salary_min && job.salary_max
      ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`
      : job.salary_min
        ? `From $${Math.round(job.salary_min).toLocaleString()}`
        : null;

    return {
      id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Unknown',
      location: job.location?.display_name || 'Unknown',
      salary,
      url: job.redirect_url,
      postedAt: job.created,
      source: 'adzuna' as const,
      matchScore: calculateMatchScore(job.title, job.description, userSkills, jobTitle),
    };
  });
}

// ---------- RemoteOK API ----------

interface RemoteOKResult {
  id: string;
  position: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  url: string;
  date: string;
  description: string;
  tags: string[];
}

export async function fetchRemoteOKJobs(
  jobTitle: string,
  userSkills: string[],
): Promise<RecommendedJob[]> {
  const response = await fetch('https://remoteok.com/api', {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Resumly/1.0',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`RemoteOK API error: ${response.status} ${response.statusText}`);
  }

  const data: RemoteOKResult[] = await response.json();

  // RemoteOK returns a legal notice as the first element
  const jobs = Array.isArray(data) ? data.filter((item) => item.id && item.position) : [];

  // Filter by relevance to job title
  const titleWords = jobTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  const relevant = jobs.filter((job) => {
    const text = `${job.position} ${job.description || ''} ${(job.tags || []).join(' ')}`.toLowerCase();
    return titleWords.some(w => text.includes(w));
  });

  return relevant.slice(0, 10).map((job) => {
    const salary = job.salary_min && job.salary_max
      ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
      : null;

    return {
      id: `remoteok-${job.id}`,
      title: job.position,
      company: job.company || 'Unknown',
      location: job.location || 'Remote',
      salary,
      url: job.url.startsWith('http') ? job.url : `https://remoteok.com${job.url}`,
      postedAt: job.date,
      source: 'remoteok' as const,
      matchScore: calculateMatchScore(
        job.position,
        `${job.description || ''} ${(job.tags || []).join(' ')}`,
        userSkills,
        jobTitle,
      ),
    };
  });
}

// ---------- Combined fetcher ----------

export async function getJobRecommendations(
  userId: string,
  jobTitle: string,
  location: string | null,
  skills: string[],
): Promise<RecommendedJob[]> {
  // Check cache first
  const cached = getCached(userId, jobTitle);
  if (cached) return cached;

  let jobs: RecommendedJob[] = [];

  // Try Adzuna first
  try {
    jobs = await fetchAdzunaJobs(jobTitle, location, skills);
  } catch (error) {
    console.error('Adzuna API failed:', error);
  }

  // If Adzuna returned no results or failed, try RemoteOK as fallback
  if (jobs.length === 0) {
    try {
      jobs = await fetchRemoteOKJobs(jobTitle, skills);
    } catch (error) {
      console.error('RemoteOK API failed:', error);
    }
  }

  // Sort by match score descending
  jobs.sort((a, b) => b.matchScore - a.matchScore);

  // Cache results
  setCache(userId, jobTitle, jobs);

  return jobs;
}
