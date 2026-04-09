import { NextRequest, NextResponse } from 'next/server';

// ══════════════════════════════════════════════════════════════
// Normalized Job Schema — every adapter outputs this
// ══════════════════════════════════════════════════════════════

interface NormalizedJob {
  title: string | null;
  company: string | null;
  location: string | null;
  workplace_type: string | null;  // remote/hybrid/onsite
  employment_type: string | null; // full-time/part-time/contract
  seniority: string | null;
  salary: string | null;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  keywords: string[];
  skills: string[];
  experience: string | null;
  industry: string | null;
  source_url: string | null;
  source_type: string; // greenhouse/lever/jsonld/linkedin/regex/ai/paste
}

function emptyJob(): NormalizedJob {
  return {
    title: null, company: null, location: null, workplace_type: null,
    employment_type: null, seniority: null, salary: null, description: null,
    responsibilities: [], requirements: [], preferred: [], keywords: [],
    skills: [], experience: null, industry: null, source_url: null, source_type: 'unknown',
  };
}

// ══════════════════════════════════════════════════════════════
// Common skills dictionary
// ══════════════════════════════════════════════════════════════

const TECH_SKILLS = new Set([
  'javascript','typescript','python','java','c++','c#','go','rust','ruby','php','swift','kotlin',
  'react','angular','vue','next.js','node.js','express','django','flask','spring','rails',
  'aws','azure','gcp','docker','kubernetes','terraform','ci/cd','jenkins','github actions',
  'sql','postgresql','mysql','mongodb','redis','elasticsearch','dynamodb','firebase','supabase',
  'html','css','tailwind','sass','bootstrap','figma','sketch',
  'rest','graphql','api','microservices','serverless','websockets',
  'git','linux','agile','scrum','jira','confluence',
  'machine learning','deep learning','nlp','computer vision','tensorflow','pytorch',
  'data analysis','data science','pandas','numpy','tableau','power bi','excel',
  'product management','product strategy','roadmapping','okrs','kpis',
  'a/b testing','user research','ux design','ui design','wireframing','prototyping',
  'project management','stakeholder management','cross-functional','leadership',
  'salesforce','hubspot','sap','erp','crm',
  'blockchain','web3','solidity','smart contracts',
  'mobile','ios','android','react native','flutter',
  'devops','sre','monitoring','observability','grafana','datadog',
  'security','oauth','encryption','penetration testing','compliance',
  'communication','problem solving','critical thinking','teamwork','collaboration',
  'presentation','negotiation','mentoring','coaching','strategic thinking',
  'budget management','p&l','revenue growth','business development','account management',
  'content marketing','seo','sem','google ads','social media','email marketing',
  'copywriting','brand strategy','market research','competitive analysis',
  'supply chain','logistics','inventory management','procurement','operations',
  'accounting','financial analysis','forecasting','auditing','tax',
  'recruiting','talent acquisition','onboarding','performance management','hr',
  'customer success','customer support','account management','retention',
  'sales','cold calling','pipeline management','crm','closing',
]);

// ══════════════════════════════════════════════════════════════
// HTML helpers
// ══════════════════════════════════════════════════════════════

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBetween(html: string, startPattern: RegExp, endPattern: RegExp): string {
  const startMatch = html.match(startPattern);
  if (!startMatch) return '';
  const startIndex = startMatch.index! + startMatch[0].length;
  const rest = html.slice(startIndex);
  const endMatch = rest.match(endPattern);
  return endMatch ? rest.slice(0, endMatch.index) : rest.slice(0, 3000);
}

// ══════════════════════════════════════════════════════════════
// URL Intelligence — detect source before fetching
// ══════════════════════════════════════════════════════════════

type UrlSource = 'greenhouse' | 'lever' | 'ashby' | 'linkedin' | 'indeed' | 'workable' | 'generic';

function detectSource(url: string): UrlSource {
  const lower = url.toLowerCase();
  if (lower.includes('greenhouse.io') || lower.includes('boards.eu.greenhouse.io')) return 'greenhouse';
  if (lower.includes('jobs.lever.co') || lower.includes('lever.co')) return 'lever';
  if (lower.includes('jobs.ashbyhq.com') || lower.includes('ashbyhq.com')) return 'ashby';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('indeed.com')) return 'indeed';
  if (lower.includes('apply.workable.com')) return 'workable';
  return 'generic';
}

function isSearchPageUrl(url: string): string | null {
  const searchPatterns = [
    { pattern: /\/search\?/i, msg: 'This looks like a job search page, not a specific job listing. Open a specific job first, then paste that URL.' },
    { pattern: /\/search$/i, msg: 'This looks like a job search page, not a specific job listing. Open a specific job first, then paste that URL.' },
    { pattern: /\/jobs\?q=/i, msg: 'This looks like a search results page. Open a specific job first, then paste that URL.' },
    { pattern: /\/results\?/i, msg: 'This looks like a search results page. Open a specific job first, then paste that URL.' },
    { pattern: /\/career(?:s)?\/?(?:\?|$)/i, msg: 'This looks like a careers homepage, not a specific job. Open a specific job first, then paste that URL.' },
    // Note: Glassdoor/Indeed search pages are NOT blocked here because they show
    // a split-view with selected job details. The browser fallback extracts from the detail panel.
    // LinkedIn job search
    { pattern: /linkedin\.com\/jobs\/search/i, msg: 'This is a LinkedIn job search page. Click on a specific job, then paste that job\'s URL here.' },
    // LinkedIn collections/recommendations
    { pattern: /linkedin\.com\/jobs\/collections/i, msg: 'This is a LinkedIn jobs collection page. Click on a specific job, then paste that job\'s URL here.' },
  ];
  for (const { pattern, msg } of searchPatterns) {
    if (pattern.test(url)) return msg;
  }
  return null;
}

// ══════════════════════════════════════════════════════════════
// LAYER 1: Official ATS Adapters (public APIs, most reliable)
// ══════════════════════════════════════════════════════════════

// ── Greenhouse ──
// URLs: boards.greenhouse.io/{company}/jobs/{id} or {company}.greenhouse.io/jobs/{id}
// API:  https://boards-api.greenhouse.io/v1/boards/{board}/jobs/{id}
async function parseGreenhouse(url: string): Promise<NormalizedJob | null> {
  try {
    // Extract board token and job ID from URL
    // Pattern 1: boards.greenhouse.io/{board}/jobs/{id}
    // Pattern 2: boards.eu.greenhouse.io/{board}/jobs/{id}
    // Pattern 3: {board}.greenhouse.io/jobs/{id} (custom subdomain)
    let board: string | null = null;
    let jobId: string | null = null;

    const boardsMatch = url.match(/boards(?:\.eu)?\.greenhouse\.io\/([^/]+)\/jobs\/(\d+)/i);
    if (boardsMatch) {
      board = boardsMatch[1];
      jobId = boardsMatch[2];
    }
    if (!board) {
      const customMatch = url.match(/([a-z0-9-]+)\.greenhouse\.io\/jobs\/(\d+)/i);
      if (customMatch && customMatch[1] !== 'boards') {
        board = customMatch[1];
        jobId = customMatch[2];
      }
    }
    if (!board || !jobId) return null;

    const apiUrl = `https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${jobId}`;
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.log(`[job-parse] Greenhouse API returned ${res.status} for ${board}/${jobId}`);
      return null;
    }

    const data = await res.json();
    const desc = stripHtml(data.content || '');
    const job = emptyJob();
    job.title = data.title || null;
    job.company = data.company?.name || board;
    job.location = data.location?.name || null;
    job.description = desc.slice(0, 500);
    job.source_type = 'greenhouse';
    job.source_url = url;

    // Extract from departments
    if (data.departments?.length) {
      job.industry = data.departments[0].name || null;
    }

    // Parse the full description for requirements/skills
    enrichFromText(job, desc);
    return job;
  } catch (err) {
    console.error('[job-parse] Greenhouse adapter error:', err instanceof Error ? err.message : err);
    return null;
  }
}

// ── Lever ──
// URLs: jobs.lever.co/{company}/{id}
// API:  https://api.lever.co/v0/postings/{company}/{id}
async function parseLever(url: string): Promise<NormalizedJob | null> {
  try {
    const match = url.match(/jobs\.lever\.co\/([^/]+)\/([a-f0-9-]+)/i);
    if (!match) return null;

    const [, company, postingId] = match;
    const apiUrl = `https://api.lever.co/v0/postings/${company}/${postingId}`;
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.log(`[job-parse] Lever API returned ${res.status} for ${company}/${postingId}`);
      return null;
    }

    const data = await res.json();
    const job = emptyJob();
    job.title = data.text || null;
    job.company = company.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    job.location = data.categories?.location || null;
    job.seniority = data.categories?.commitment || null;
    job.employment_type = data.categories?.team || null;
    job.source_type = 'lever';
    job.source_url = url;

    // Lever has structured lists
    const fullText: string[] = [];
    if (data.descriptionPlain) fullText.push(data.descriptionPlain);
    if (data.lists?.length) {
      for (const list of data.lists) {
        if (list.text) fullText.push(list.text);
        if (list.content) {
          const items = stripHtml(list.content);
          fullText.push(items);
          const listName = (list.text || '').toLowerCase();
          const bullets = items.split(/[•\-\n]+/).map((b: string) => b.trim()).filter((b: string) => b.length > 10 && b.length < 200);
          if (listName.includes('requirement') || listName.includes('qualif') || listName.includes('must')) {
            job.requirements.push(...bullets.slice(0, 8));
          } else if (listName.includes('nice') || listName.includes('prefer') || listName.includes('bonus')) {
            job.preferred.push(...bullets.slice(0, 5));
          } else if (listName.includes('responsib') || listName.includes('what you')) {
            job.responsibilities.push(...bullets.slice(0, 8));
          }
        }
      }
    }

    const allText = fullText.join('\n');
    job.description = allText.slice(0, 500);
    enrichFromText(job, allText);
    return job;
  } catch (err) {
    console.error('[job-parse] Lever adapter error:', err instanceof Error ? err.message : err);
    return null;
  }
}

// ── Ashby ──
// URLs: jobs.ashbyhq.com/{company}/...
async function parseAshby(url: string): Promise<NormalizedJob | null> {
  try {
    // Ashby uses client-side rendering, but their API is sometimes available
    const match = url.match(/jobs\.ashbyhq\.com\/([^/]+)\/([a-f0-9-]+)/i);
    if (!match) return null;

    // Try fetching the page — Ashby sometimes has JSON-LD or API data embedded
    const html = await fetchPage(url);
    if (!html || stripHtml(html).length < 200) return null;

    // Try JSON-LD first
    const { job: jsonLd } = extractJsonLd(html);
    if (jsonLd?.title) {
      const job = jsonLdToNormalized(jsonLd, url);
      job.source_type = 'ashby';
      job.company = job.company || match[1].replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      return job;
    }

    // Try extracting from embedded __NEXT_DATA__ or similar
    const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const jobInfo = nextData?.props?.pageProps?.jobPosting || nextData?.props?.pageProps?.job;
        if (jobInfo?.title) {
          const job = emptyJob();
          job.title = jobInfo.title;
          job.company = jobInfo.organizationName || match[1];
          job.location = jobInfo.locationName || jobInfo.location || null;
          job.description = stripHtml(jobInfo.descriptionHtml || jobInfo.description || '').slice(0, 500);
          job.source_type = 'ashby';
          job.source_url = url;
          enrichFromText(job, stripHtml(jobInfo.descriptionHtml || jobInfo.description || ''));
          return job;
        }
      } catch { /* not valid JSON */ }
    }

    return null;
  } catch {
    return null;
  }
}

// ── Workable ──
// URLs: apply.workable.com/j/{id}/ or apply.workable.com/{company}/j/{id}/
async function parseWorkable(url: string): Promise<NormalizedJob | null> {
  try {
    // Workable often has JSON-LD on the page
    const html = await fetchPage(url);
    if (!html || stripHtml(html).length < 200) return null;

    const { job: jsonLd } = extractJsonLd(html);
    if (jsonLd?.title) {
      const job = jsonLdToNormalized(jsonLd, url);
      job.source_type = 'workable';
      return job;
    }

    // Try __NEXT_DATA__
    const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const jobInfo = nextData?.props?.pageProps?.job;
        if (jobInfo?.title) {
          const job = emptyJob();
          job.title = jobInfo.title;
          job.company = jobInfo.company?.name || null;
          job.location = jobInfo.location || null;
          job.description = stripHtml(jobInfo.description || '').slice(0, 500);
          job.source_type = 'workable';
          job.source_url = url;
          enrichFromText(job, stripHtml(jobInfo.description || ''));
          return job;
        }
      } catch { /* */ }
    }

    return null;
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════
// LAYER 2: JSON-LD Structured Data (works on many sites)
// ══════════════════════════════════════════════════════════════

interface JsonLdJob {
  title?: string;
  hiringOrganization?: { name?: string };
  jobLocation?: { address?: { addressLocality?: string; addressRegion?: string; addressCountry?: string } } | Array<{ address?: { addressLocality?: string; addressRegion?: string } }>;
  description?: string;
  qualifications?: string;
  skills?: string;
  baseSalary?: { value?: { minValue?: number; maxValue?: number }; currency?: string };
  employmentType?: string;
  experienceRequirements?: string;
}

function extractJsonLd(html: string): { job: JsonLdJob | null; isSearchPage: boolean } {
  const matches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!matches) return { job: null, isSearchPage: false };
  let isSearchPage = false;
  for (const match of matches) {
    try {
      const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
      const data = JSON.parse(jsonStr);
      const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
      for (const item of items) {
        if (item['@type'] === 'JobPosting' || item['@type']?.includes?.('JobPosting')) {
          return { job: item as JsonLdJob, isSearchPage: false };
        }
        if (item['@type'] === 'ItemList') isSearchPage = true;
      }
    } catch { /* invalid JSON */ }
  }
  return { job: null, isSearchPage };
}

function jsonLdToNormalized(jsonLd: JsonLdJob, url: string): NormalizedJob {
  const job = emptyJob();
  job.title = jsonLd.title || null;
  job.company = jsonLd.hiringOrganization?.name || null;
  const loc = Array.isArray(jsonLd.jobLocation) ? jsonLd.jobLocation[0] : jsonLd.jobLocation;
  job.location = loc?.address ? [loc.address.addressLocality, loc.address.addressRegion].filter(Boolean).join(', ') : null;
  job.description = jsonLd.description ? stripHtml(jsonLd.description).slice(0, 500) : null;
  job.employment_type = jsonLd.employmentType || null;
  job.experience = jsonLd.experienceRequirements || null;
  if (jsonLd.baseSalary?.value) {
    const sv = jsonLd.baseSalary.value;
    job.salary = sv.minValue && sv.maxValue
      ? `${jsonLd.baseSalary.currency || '$'}${sv.minValue.toLocaleString()} - ${sv.maxValue.toLocaleString()}`
      : null;
  }
  job.source_type = 'jsonld';
  job.source_url = url;

  const fullText = jsonLd.description ? stripHtml(jsonLd.description) : '';
  if (fullText) enrichFromText(job, fullText);
  return job;
}

// ══════════════════════════════════════════════════════════════
// LAYER 3: LinkedIn Guest API
// ══════════════════════════════════════════════════════════════

function extractLinkedInJobId(url: string): string | null {
  const viewMatch = url.match(/\/jobs\/view\/(?:.*?[-/])?(\d{5,})/);
  if (viewMatch) return viewMatch[1];
  const paramMatch = url.match(/currentJobId=(\d+)/);
  if (paramMatch) return paramMatch[1];
  return null;
}

function parseLinkedInHtml(html: string): NormalizedJob | null {
  const titleMatch = html.match(/class="[^"]*top-card-layout__title[^"]*"[^>]*>([^<]+)/i)
    || html.match(/<h1[^>]*>([^<]+)/i)
    || html.match(/<h2[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)/i);

  const companyMatch = html.match(/class="[^"]*topcard__org-name-link[^"]*"[^>]*>\s*([^<]+)/i)
    || html.match(/class="[^"]*topcard__org-name[^"]*"[^>]*>[^<]*<[^>]*>([^<]+)/i)
    || html.match(/class="[^"]*company-name[^"]*"[^>]*>([^<]+)/i)
    || html.match(/data-tracking-control-name="public_jobs_topcard-org-name"[^>]*>\s*([^<]+)/i);

  const locationMatch = html.match(/class="[^"]*topcard__flavor--bullet[^"]*"[^>]*>([^<]+)/i)
    || html.match(/class="[^"]*job-location[^"]*"[^>]*>([^<]+)/i);

  const descHtml = extractBetween(html, /class="[^"]*description__text/i, /<\/section/i)
    || extractBetween(html, /class="[^"]*show-more-less-html/i, /<\/section/i)
    || '';

  const title = titleMatch ? titleMatch[1].trim() : '';
  const company = companyMatch ? companyMatch[1].trim() : '';
  const location = locationMatch ? locationMatch[1].trim() : '';
  const description = stripHtml(descHtml);

  if (!title && !description) return null;

  const job = emptyJob();
  job.title = title || null;
  job.company = company || null;
  job.location = location || null;
  job.description = description.slice(0, 500) || null;
  job.source_type = 'linkedin';

  if (description) enrichFromText(job, description);
  return job;
}

async function parseLinkedIn(url: string): Promise<NormalizedJob | null> {
  const jobId = extractLinkedInJobId(url);
  if (!jobId) return null;

  // LinkedIn guest API is notoriously flaky. Try multiple approaches.
  const guestUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;

  // Attempt 1: Guest API with retry (fetchPage already retries internally)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1000));
      const html = await fetchPage(guestUrl, attempt === 0 ? 2 : 1);
      if (!html || stripHtml(html).length < 200) {
        console.log(`[job-parse] LinkedIn guest API attempt ${attempt + 1}: too short (${stripHtml(html).length} chars)`);
        continue;
      }

      // Check for security wall/login redirect
      if (isSecurityWall(html)) {
        console.log(`[job-parse] LinkedIn guest API attempt ${attempt + 1}: security wall detected`);
        continue;
      }

      // Try JSON-LD first
      const { job: jsonLd } = extractJsonLd(html);
      if (jsonLd?.title) {
        const job = jsonLdToNormalized(jsonLd, url);
        job.source_type = 'linkedin';
        return job;
      }

      // Fall back to HTML parsing
      const job = parseLinkedInHtml(html);
      if (job) {
        job.source_url = url;
        return job;
      }
      console.log(`[job-parse] LinkedIn guest API attempt ${attempt + 1}: HTML parsing returned null`);
    } catch (err) {
      console.error(`[job-parse] LinkedIn attempt ${attempt + 1} error:`, err instanceof Error ? err.message : err);
    }
  }

  // Attempt 2: Try the direct page URL as fallback (sometimes works when guest API doesn't)
  try {
    const directUrl = `https://www.linkedin.com/jobs/view/${jobId}/`;
    // Clear cache for this URL so we get a fresh fetch
    htmlCache.delete(directUrl);
    const html = await fetchPage(directUrl, 1);
    if (html && stripHtml(html).length >= 200 && !isSecurityWall(html)) {
      const { job: jsonLd } = extractJsonLd(html);
      if (jsonLd?.title) {
        const job = jsonLdToNormalized(jsonLd, url);
        job.source_type = 'linkedin';
        return job;
      }
      const job = parseLinkedInHtml(html);
      if (job) {
        job.source_url = url;
        return job;
      }
    }
  } catch (err) {
    console.error('[job-parse] LinkedIn direct page fallback error:', err instanceof Error ? err.message : err);
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// LAYER 4: Generic page fetch + JSON-LD/readability parsing
// ══════════════════════════════════════════════════════════════

function isSecurityWall(html: string): boolean {
  const lower = html.toLowerCase();
  const title = html.match(/<title[^>]*>([^<]+)/i)?.[1]?.toLowerCase() || '';
  if (title.includes('security') || title.includes('verify') || title.includes('captcha')) return true;
  const loginSignals = ['sign in to continue', 'log in to view', 'create an account to', 'please verify', 'checking your browser', 'access denied'].filter(s => lower.includes(s));
  if (loginSignals.length >= 1) return true;
  const textLen = stripHtml(html).length;
  if (textLen < 200) return true;
  return false;
}

async function parseGenericPage(url: string): Promise<{ job: NormalizedJob | null; error?: string }> {
  try {
    let html: string;

    // Indeed — try viewjob API
    if (url.includes('indeed.com')) {
      html = '';
      const jkMatch = url.match(/jk=([a-f0-9]+)/i) || url.match(/\/([a-f0-9]{16})\b/);
      if (jkMatch) {
        try {
          const viewUrl = `https://www.indeed.com/viewjob?jk=${jkMatch[1]}`;
          html = await fetchPage(viewUrl);
          if (stripHtml(html).length < 200) html = '';
        } catch { /* */ }
      }
      if (!html && !url.includes('m.indeed.com')) {
        const mobileUrl = url.replace('www.indeed.com', 'm.indeed.com').replace(/^(https?:\/\/)indeed\.com/, '$1m.indeed.com');
        try {
          html = await fetchPage(mobileUrl);
          if (stripHtml(html).length < 200) html = '';
        } catch { /* */ }
      }
      if (!html) {
        try { html = await fetchPage(url); } catch { html = ''; }
      }
    } else {
      html = await fetchPage(url);
    }

    if (!html || stripHtml(html).length < 80) {
      return { job: null, error: 'Could not fetch that page. Paste the job description instead.' };
    }

    // Security wall check
    if (isSecurityWall(html)) {
      const siteName = url.match(/(?:www\.)?([a-z]+)\.(com|co|io)/i)?.[1] || '';
      const siteMessages: Record<string, string> = {
        glassdoor: 'Glassdoor blocks automated access.',
        indeed: 'Indeed blocks automated access.',
        monster: 'Monster blocks automated access.',
        ziprecruiter: 'ZipRecruiter blocks automated access.',
        apple: 'Apple\'s career site blocks automated access.',
        google: 'Google\'s career site blocks automated access.',
        meta: 'Meta\'s career site blocks automated access.',
        microsoft: 'Microsoft\'s career site blocks automated access.',
        amazon: 'Amazon\'s career site blocks automated access.',
      };
      const siteMsg = siteMessages[siteName.toLowerCase()] || 'This site blocks automated access.';
      return { job: null, error: `${siteMsg} Copy the job description from the page and paste it below.` };
    }

    // Try JSON-LD
    const { job: jsonLd } = extractJsonLd(html);
    if (jsonLd?.title) {
      return { job: jsonLdToNormalized(jsonLd, url) };
    }

    // Try extracting from __NEXT_DATA__ (many modern career sites use Next.js)
    const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const props = nextData?.props?.pageProps;
        // Common patterns in Next.js career sites
        const jobInfo = props?.job || props?.jobPosting || props?.posting || props?.position;
        if (jobInfo?.title) {
          const job = emptyJob();
          job.title = jobInfo.title;
          job.company = jobInfo.company?.name || jobInfo.companyName || jobInfo.organizationName || null;
          job.location = jobInfo.location?.name || jobInfo.locationName || jobInfo.location || null;
          const descText = jobInfo.descriptionHtml || jobInfo.description || jobInfo.content || '';
          job.description = stripHtml(descText).slice(0, 500);
          job.source_type = 'nextdata';
          job.source_url = url;
          enrichFromText(job, stripHtml(descText));
          return { job };
        }
      } catch { /* */ }
    }

    // Plain text extraction with regex
    const plainText = stripHtml(html);
    const job = emptyJob();
    job.source_type = 'regex';
    job.source_url = url;
    job.title = extractTitle(plainText);
    job.company = extractCompany(plainText);
    job.location = extractLocation(plainText);
    job.description = plainText.slice(0, 500);
    enrichFromText(job, plainText);

    // If regex couldn't find a title, try AI
    if (!job.title && plainText.length > 100) {
      const aiResult = await aiParseJobText(plainText);
      if (aiResult) {
        job.title = aiResult.title || job.title;
        job.company = aiResult.company || job.company;
        job.location = aiResult.location || job.location;
        job.description = aiResult.description || job.description;
        job.source_type = 'ai';
        if (aiResult.requirements?.length) {
          job.requirements = aiResult.requirements;
        }
        if (aiResult.skills?.length) {
          // Merge AI skills with regex skills
          const existingSkills = new Set(job.skills.map(s => s.toLowerCase()));
          for (const s of aiResult.skills) {
            if (!existingSkills.has(s.toLowerCase())) {
              job.skills.push(s);
            }
          }
        }
      } else if (plainText.length < 300) {
        return { job: null, error: 'This page doesn\'t appear to contain a job listing. Paste a direct link to a specific job, or paste the job description below.' };
      }
    }

    return { job: job.title ? job : null };
  } catch {
    return { job: null, error: 'Could not fetch that page. Paste the job description instead.' };
  }
}

// ══════════════════════════════════════════════════════════════
// LAYER 5: AI-powered fallback parser (Gemini)
// ══════════════════════════════════════════════════════════════

async function aiParseJobText(text: string): Promise<{ title: string; company: string; location: string; description: string; requirements: string[]; skills: string[] } | null> {
  if (!process.env.GEMINI_API_KEY || text.length < 100) return null;

  try {
    const { callGemini } = await import('@/lib/gemini');
    const truncated = text.slice(0, 4000);
    const completion = await callGemini('jobs-parse', {
      messages: [
        { role: 'system', content: 'Extract job posting details from text. Return ONLY valid JSON, no markdown.' },
        { role: 'user', content: `Extract the job details from this text. Return JSON with: title, company, location, description (max 300 chars), requirements (array of strings, max 8), skills (array of strings, max 15).

If this is NOT a job posting (e.g. search results, homepage, error page), return {"error": "not_a_job_posting"}.

TEXT:
${truncated}` },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonStr = content.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    if (parsed.error) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════
// Enrichment — extract skills, keywords, requirements from text
// ══════════════════════════════════════════════════════════════

function enrichFromText(job: NormalizedJob, text: string): void {
  // Skills
  if (job.skills.length === 0) {
    const { skills, keywords } = extractKeywords(text);
    job.skills = skills;
    job.keywords = keywords;
  }

  // Requirements
  if (job.requirements.length === 0) {
    const reqMatch = text.match(/(?:requirements?|qualifications?|what (?:you.?ll|we) need|must have)[:\s]+([\s\S]{50,2000}?)(?=\n\n|\b(?:responsibilities|about us|benefits|perks|how to apply)\b|$)/i);
    if (reqMatch) {
      const bullets = reqMatch[1].split(/[•\-\n]+/).map(b => b.trim()).filter(b => b.length > 10 && b.length < 200);
      job.requirements = bullets.slice(0, 8);
    }
  }

  // Responsibilities
  if (job.responsibilities.length === 0) {
    const respMatch = text.match(/(?:responsibilities|what you.?ll do|your role|key duties)[:\s]+([\s\S]{50,2000}?)(?=\n\n|\b(?:requirements|qualifications|about|benefits|nice to have)\b|$)/i);
    if (respMatch) {
      const bullets = respMatch[1].split(/[•\-\n]+/).map(b => b.trim()).filter(b => b.length > 10 && b.length < 200);
      job.responsibilities = bullets.slice(0, 8);
    }
  }

  // Salary
  if (!job.salary) job.salary = extractSalary(text);

  // Experience
  if (!job.experience) job.experience = extractExperience(text);

  // Workplace type
  if (!job.workplace_type) {
    const lower = text.toLowerCase();
    if (/\bremote\b/i.test(lower) && !/no remote|not remote/i.test(lower)) job.workplace_type = 'remote';
    else if (/\bhybrid\b/i.test(lower)) job.workplace_type = 'hybrid';
    else if (/\bon[- ]?site\b/i.test(lower) || /\bin[- ]?office\b/i.test(lower)) job.workplace_type = 'onsite';
  }

  // Seniority
  if (!job.seniority) {
    const titleLower = (job.title || '').toLowerCase();
    if (/\bsenior\b|\bsr\.?\b|\blead\b|\bprincipal\b|\bstaff\b/.test(titleLower)) job.seniority = 'senior';
    else if (/\bjunior\b|\bjr\.?\b|\bentry[- ]level\b|\bassociate\b/.test(titleLower)) job.seniority = 'entry';
    else if (/\bmanager\b|\bdirector\b|\bvp\b|\bhead of\b|\bchief\b/.test(titleLower)) job.seniority = 'executive';
    else if (/\bintern\b/.test(titleLower)) job.seniority = 'intern';
    else job.seniority = 'mid';
  }
}

function extractKeywords(text: string): { skills: string[]; keywords: string[] } {
  const lower = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of TECH_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) {
      foundSkills.push(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  }

  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i);

  const reqSection = text.match(/(?:requirements?|qualifications?|what you.?ll need|must have|nice to have)[:\s]+([\s\S]{100,1500}?)(?=\n\n|responsibilities|about|benefits|perks|$)/i);
  const keywords: string[] = [];
  if (reqSection) {
    const bullets = reqSection[1].split(/[•\-\n\r]+/).filter(b => b.trim().length > 10 && b.trim().length < 200);
    for (const bullet of bullets.slice(0, 10)) {
      const cleaned = bullet.trim().replace(/^[\s,;]+|[\s,;]+$/g, '');
      if (cleaned) keywords.push(cleaned);
    }
  }

  const uniqueSkills = [...new Set(foundSkills)];
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
  const atsKeywords = uniqueSkills.filter(s => !keywordSet.has(s.toLowerCase()));

  return {
    skills: uniqueSkills.slice(0, 15),
    keywords: [...atsKeywords.slice(0, 10), ...(expMatch ? [`${expMatch[1]}+ years experience`] : [])],
  };
}

function extractTitle(text: string): string | null {
  const patterns = [/(?:job title|position|role)[:\s]+([^\n.]{5,60})/i];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  if (firstLine.length >= 5 && firstLine.length <= 80 && /[A-Z]/.test(firstLine[0])) {
    const skipPrefixes = /^(we|our|about|the|this|a |an |i |you|are|is|at |in |on |to |for )/i;
    if (!skipPrefixes.test(firstLine)) return firstLine.replace(/[-–—|]+$/, '').trim();
  }
  const m = text.match(/^([A-Z][A-Za-z\s/&,()-]{5,60})$/m);
  if (m) return m[1].trim();
  return null;
}

function extractCompany(text: string): string | null {
  const patterns = [
    /(?:company|employer|organization|about)\s*[:\-]\s*([^\n]{3,50})/i,
    /(?:at|@)\s+([A-Z][A-Za-z\s&.]{2,40})/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function extractLocation(text: string): string | null {
  const m = text.match(/(?:location|based in|office)[:\s]+([^\n]{3,60})/i)
    || text.match(/((?:Remote|Hybrid|On-?site)(?:\s*[–-]\s*[A-Z][A-Za-z\s,]{3,40})?)/i);
  return m ? m[1].trim() : null;
}

function extractSalary(text: string): string | null {
  const m = text.match(/(\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*(?:per year|\/yr|annually|pa|k))?)/i)
    || text.match(/(£[\d,]+(?:\s*[-–]\s*£[\d,]+)?)/i)
    || text.match(/(€[\d,]+(?:\s*[-–]\s*€[\d,]+)?)/i);
  return m ? m[1].trim() : null;
}

function extractExperience(text: string): string | null {
  const m = text.match(/(\d+)\+?\s*(?:to|-|–)\s*(\d+)\+?\s*years?/i);
  if (m) return `${m[1]}-${m[2]} years`;
  const m2 = text.match(/(\d+)\+?\s*years?\s*(?:of\s+)?(?:experience|exp)/i);
  if (m2) return `${m2[1]}+ years`;
  return null;
}

// ══════════════════════════════════════════════════════════════
// Fetch helper — with retry + backoff for reliability
// ══════════════════════════════════════════════════════════════

// In-memory HTML cache to avoid double-fetching the same URL within one request
const htmlCache = new Map<string, string>();

async function fetchPage(url: string, retries = 2): Promise<string> {
  // Return cached HTML if we already fetched this URL in this request
  const cached = htmlCache.get(url);
  if (cached) return cached;

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff: 800ms, 1600ms
        await new Promise(r => setTimeout(r, 800 * attempt));
      }
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'identity',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
      });
      // Don't retry on 4xx client errors (except 429 rate limit)
      if (!res.ok && res.status !== 429 && res.status >= 400 && res.status < 500) {
        const text = await res.text();
        htmlCache.set(url, text);
        return text;
      }
      // Retry on 429 or 5xx
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }
      const text = await res.text();
      htmlCache.set(url, text);
      return text;
    } catch (err) {
      lastError = err;
      console.error(`[job-parse] fetchPage attempt ${attempt + 1} failed for ${url}:`, err instanceof Error ? err.message : err);
    }
  }
  throw lastError || new Error('fetchPage failed after retries');
}

// ══════════════════════════════════════════════════════════════
// LAYER 6: Headless Browser — nuclear option, works on almost everything
// Opens the URL in real Chromium, waits for JS to render, extracts text
// ══════════════════════════════════════════════════════════════

// Detect if extracted text is actually a security/CAPTCHA wall, not a job
function isBrowserSecurityWall(text: string, title: string | null): boolean {
  const lower = (text + ' ' + (title || '')).toLowerCase();
  const securitySignals = [
    'help us protect', 'verify you are human', 'captcha', 'are you a robot',
    'checking your browser', 'please verify', 'access denied', 'security check',
    'enable javascript', 'enable cookies', 'unusual traffic', 'automated access',
    'prove you\'re not a robot', 'complete the security check', 'blocked your ip',
    'too many requests', 'rate limited', 'cloudflare', 'just a moment',
    'attention required', 'please wait while we verify',
  ];
  const matchCount = securitySignals.filter(s => lower.includes(s)).length;
  return matchCount >= 1;
}

async function fetchWithBrowser(url: string): Promise<NormalizedJob | null> {
  let browser: any = null;
  try {
    console.log('[job-parse] Launching headless browser for:', url);
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = (await import('puppeteer-core')).default;

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--disable-blink-features=AutomationControlled', // Hide automation flag
        '--disable-features=IsolateOrigins,site-per-process',
      ],
      defaultViewport: { width: 1280, height: 900 },
      executablePath: await chromium.executablePath(),
      headless: 'shell' as any,
    });

    const page = await browser.newPage();

    // ── Stealth: make headless browser look like a real user ──
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    // Remove webdriver flag (main way sites detect headless)
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      // Fake plugins array (headless has 0 plugins)
      Object.defineProperty(navigator, 'plugins', {
        get: () => [
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          { name: 'Native Client', filename: 'internal-nacl-plugin' },
        ],
      });
      // Fake languages
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      // Override chrome.runtime to look like real Chrome
      (window as any).chrome = { runtime: {}, loadTimes: () => ({}), csi: () => ({}) };
      // Fake permissions query
      const originalQuery = window.navigator.permissions.query.bind(window.navigator.permissions);
      window.navigator.permissions.query = (parameters: any) => {
        if (parameters.name === 'notifications') {
          return Promise.resolve({ state: 'denied' } as PermissionStatus);
        }
        return originalQuery(parameters);
      };
    });

    // Set extra headers to look more real
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'sec-ch-ua': '"Chromium";v="131", "Google Chrome";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });

    // Wait for dynamic content to render (SPAs, lazy loading)
    await new Promise(r => setTimeout(r, 2000));

    // Try to dismiss common overlays/modals that block content
    await page.evaluate(() => {
      // Close cookie banners, sign-up modals, notification popups
      const dismissSelectors = [
        '[class*="cookie"] button', '[id*="cookie"] button',
        '[class*="consent"] button', '[class*="modal"] button[class*="close"]',
        '[class*="overlay"] button[class*="close"]', '[aria-label="Close"]',
        'button[class*="dismiss"]', '[class*="banner"] button',
        '#onetrust-accept-btn-handler', // OneTrust cookie banner
        '[data-testid="close-button"]',
      ];
      dismissSelectors.forEach(sel => {
        const btn = document.querySelector(sel) as HTMLElement;
        if (btn) try { btn.click(); } catch { /* */ }
      });
    });
    await new Promise(r => setTimeout(r, 500));

    // ── Site-specific extraction strategies ──
    const isGlassdoor = url.includes('glassdoor.com');
    const isIndeed = url.includes('indeed.com');

    let visibleText = '';
    let html = '';

    if (isGlassdoor) {
      // Glassdoor: split-view. Job detail panel is on the right side.
      // Click the first job card if no job is selected yet
      console.log('[job-parse] Browser: Glassdoor detected, extracting from detail panel');

      // Wait for job detail panel to appear
      try {
        await page.waitForSelector('[class*="JobDetails"], [class*="jobDetails"], [data-test="job-details"], [class*="JobDetail"], .job-detail, #JobDescriptionContainer, [class*="description"]', { timeout: 5000 });
      } catch {
        // Try clicking the first job card to load details
        console.log('[job-parse] Browser: clicking first job card...');
        await page.evaluate(() => {
          const jobCard = document.querySelector('[class*="JobCard"], [class*="jobCard"], [data-test="job-listing"], li[class*="job"], a[class*="job"]') as HTMLElement;
          if (jobCard) jobCard.click();
        });
        await new Promise(r => setTimeout(r, 2000));
      }

      // Extract from the job detail panel (right side)
      visibleText = await page.evaluate(() => {
        // Glassdoor job detail selectors (they change class names but structure is consistent)
        const detailSelectors = [
          '[class*="JobDetails"]', '[class*="jobDetails"]',
          '[data-test="job-details"]', '[class*="JobDetail"]',
          '#JobDescriptionContainer', '.job-detail',
          '[class*="description"]', '[class*="Detail"]',
          // The right panel is usually the second main column
          'main > div:last-child', '[class*="rightCol"]', '[class*="right-col"]',
        ];
        for (const sel of detailSelectors) {
          const el = document.querySelector(sel);
          if (el && (el as HTMLElement).innerText?.length > 200) {
            return (el as HTMLElement).innerText;
          }
        }
        // Fallback: grab the largest content block on the page
        let bestEl: HTMLElement | null = null;
        let bestLen = 0;
        document.querySelectorAll('div, section, article').forEach(el => {
          const text = (el as HTMLElement).innerText || '';
          if (text.length > bestLen && text.length < 15000) {
            bestLen = text.length;
            bestEl = el as HTMLElement;
          }
        });
        return (bestEl as HTMLElement | null)?.innerText || document.body?.innerText || '';
      });

    } else if (isIndeed) {
      // Indeed: also split-view. Detail panel on the right.
      console.log('[job-parse] Browser: Indeed detected, extracting from detail panel');

      try {
        await page.waitForSelector('#jobDescriptionText, [class*="jobsearch-JobComponent"], [id*="vjs-desc"], [class*="job-description"]', { timeout: 5000 });
      } catch { /* may not exist */ }

      visibleText = await page.evaluate(() => {
        const detailSelectors = [
          '#jobDescriptionText', '[class*="jobsearch-JobComponent"]',
          '[id*="vjs-desc"]', '[class*="job-description"]',
          '#jobsearch-ViewjobPaneWrapper', '[class*="jobDescription"]',
        ];
        for (const sel of detailSelectors) {
          const el = document.querySelector(sel);
          if (el && (el as HTMLElement).innerText?.length > 200) {
            return (el as HTMLElement).innerText;
          }
        }
        return document.body?.innerText || '';
      });

    } else {
      // Generic site: grab the main content area
      visibleText = await page.evaluate(() => {
        // Remove nav, footer, cookie banners
        const removeSelectors = ['nav', 'footer', 'header', '[class*="cookie"]', '[class*="banner"]', '[class*="popup"]', '[id*="cookie"]'];
        removeSelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => el.remove());
        });
        // Try common job detail containers
        const mainSelectors = ['main', 'article', '[role="main"]', '#content', '.content', '[class*="job-detail"]', '[class*="jobDetail"]'];
        for (const sel of mainSelectors) {
          const el = document.querySelector(sel);
          if (el && (el as HTMLElement).innerText?.length > 200) {
            return (el as HTMLElement).innerText;
          }
        }
        return document.body?.innerText || '';
      });
    }

    html = await page.content();
    await browser.close();
    browser = null;

    if (!visibleText || visibleText.length < 100) {
      console.log('[job-parse] Browser: page text too short:', visibleText.length);
      return null;
    }

    // Check if we got a security/CAPTCHA wall instead of actual job content
    if (isBrowserSecurityWall(visibleText, null)) {
      console.log('[job-parse] Browser: security wall detected in extracted text, aborting');
      return null;
    }

    console.log(`[job-parse] Browser: got ${visibleText.length} chars of text from ${isGlassdoor ? 'Glassdoor detail panel' : isIndeed ? 'Indeed detail panel' : 'page'}`);

    // Try JSON-LD from the rendered HTML first
    const { job: jsonLd } = extractJsonLd(html);
    if (jsonLd?.title && !isBrowserSecurityWall('', jsonLd.title)) {
      const job = jsonLdToNormalized(jsonLd, url);
      job.source_type = 'browser';
      return job;
    }

    // Try __NEXT_DATA__
    const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const props = nextData?.props?.pageProps;
        const jobInfo = props?.job || props?.jobPosting || props?.posting || props?.position;
        if (jobInfo?.title) {
          const job = emptyJob();
          job.title = jobInfo.title;
          job.company = jobInfo.company?.name || jobInfo.companyName || jobInfo.organizationName || null;
          job.location = jobInfo.location?.name || jobInfo.locationName || jobInfo.location || null;
          const descText = jobInfo.descriptionHtml || jobInfo.description || jobInfo.content || '';
          job.description = stripHtml(descText).slice(0, 500);
          job.source_type = 'browser';
          job.source_url = url;
          enrichFromText(job, stripHtml(descText));
          return job;
        }
      } catch { /* not valid JSON */ }
    }

    // Use AI to parse the extracted text (most reliable)
    const aiResult = await aiParseJobText(visibleText);
    if (aiResult && aiResult.title && !isBrowserSecurityWall('', aiResult.title)) {
      const job = emptyJob();
      job.title = aiResult.title;
      job.company = aiResult.company || null;
      job.location = aiResult.location || null;
      job.description = aiResult.description || visibleText.slice(0, 500);
      job.requirements = aiResult.requirements || [];
      job.skills = aiResult.skills || [];
      job.source_type = 'browser';
      job.source_url = url;
      enrichFromText(job, visibleText);
      return job;
    }

    // Last resort: regex extraction
    const job = emptyJob();
    job.title = extractTitle(visibleText);
    job.company = extractCompany(visibleText);
    job.location = extractLocation(visibleText);
    job.description = visibleText.slice(0, 500);
    job.source_type = 'browser';
    job.source_url = url;
    enrichFromText(job, visibleText);

    // Final safety: never return a security wall as a job
    if (job.title && isBrowserSecurityWall('', job.title)) {
      console.log('[job-parse] Browser: extracted title is a security wall, rejecting');
      return null;
    }

    return job.title ? job : null;
  } catch (err) {
    console.error('[job-parse] Browser fallback error:', err instanceof Error ? err.message : err);
    return null;
  } finally {
    if (browser) {
      try { await browser.close(); } catch { /* */ }
    }
  }
}

// ══════════════════════════════════════════════════════════════
// MAIN HANDLER — orchestrates all layers
// ══════════════════════════════════════════════════════════════

// Allow up to 60 seconds on Vercel for headless browser fallback
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Clear HTML cache from any previous request
  htmlCache.clear();

  try {
    const body = await req.json();
    const { url, text } = body;

    // ── PASTE INPUT: User pasted job description text ──
    if (text && typeof text === 'string' && text.trim().length > 20) {
      const plainText = text.trim();
      const job = emptyJob();
      job.source_type = 'paste';
      job.description = plainText.slice(0, 500);

      // Try pipe-separated format: "Title | Company | Location"
      const pipeSegments = plainText.split('|').map(s => s.trim());
      if (pipeSegments.length >= 2 && pipeSegments[0].length < 80) {
        job.title = pipeSegments[0];
        job.company = pipeSegments.length >= 3 ? pipeSegments[1] : null;
        job.location = pipeSegments.length >= 4 ? pipeSegments[2] : (pipeSegments.length === 3 ? pipeSegments[2] : null);
      }

      if (!job.title) job.title = extractTitle(plainText);
      if (!job.company) job.company = extractCompany(plainText);
      if (!job.location) job.location = extractLocation(plainText);

      // For pasted text, always try AI to get better extraction
      if ((!job.title || !job.company) && plainText.length > 100) {
        const aiResult = await aiParseJobText(plainText);
        if (aiResult) {
          job.title = job.title || aiResult.title || null;
          job.company = job.company || aiResult.company || null;
          job.location = job.location || aiResult.location || null;
          job.description = aiResult.description || job.description;
          if (aiResult.requirements?.length) job.requirements = aiResult.requirements;
          if (aiResult.skills?.length) {
            for (const s of aiResult.skills) job.skills.push(s);
          }
          job.source_type = 'ai';
        }
      }

      enrichFromText(job, plainText);

      return NextResponse.json({
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          description: (job.description || '').slice(0, 300) || null,
          requirements: job.requirements,
          skills: job.skills,
          keywords: job.keywords,
          experience: job.experience,
          salary: job.salary,
          workplace_type: job.workplace_type,
          seniority: job.seniority,
          source_type: job.source_type,
        },
        source: null,
      });
    }

    // ── URL INPUT: Multi-layer parsing ──
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL or job description text is required' }, { status: 400 });
    }

    // Check for search/listing page URLs before any fetching
    const searchMsg = isSearchPageUrl(url);
    if (searchMsg) {
      return NextResponse.json({
        error: 'search_page',
        message: `${searchMsg} Click on a specific job first, then paste that URL here, or copy the job description and paste it below.`,
      }, { status: 422 });
    }

    const source = detectSource(url);
    let job: NormalizedJob | null = null;

    // Sites that ALWAYS need a real browser (they block fetch, serve JS-only content, or use split-view panels)
    const browserFirstSites = ['glassdoor.com', 'monster.com', 'ziprecruiter.com', 'dice.com', 'careerbuilder.com'];
    const needsBrowserFirst = browserFirstSites.some(site => url.toLowerCase().includes(site));

    if (needsBrowserFirst) {
      // Skip fetch-based parsers entirely, go straight to headless browser
      console.log(`[job-parse] Browser-first site detected, launching headless browser directly`);
      job = await fetchWithBrowser(url);
      if (job) {
        console.log(`[job-parse] Browser-first succeeded: "${job.title}" at ${job.company}`);
      }
    } else {
      // Layer 1: Try official ATS adapter (fast, structured data)
      switch (source) {
        case 'greenhouse':
          job = await parseGreenhouse(url);
          break;
        case 'lever':
          job = await parseLever(url);
          break;
        case 'ashby':
          job = await parseAshby(url);
          break;
        case 'workable':
          job = await parseWorkable(url);
          break;
        case 'linkedin':
          job = await parseLinkedIn(url);
          break;
      }

      // Layer 2-4: Generic page fetch (JSON-LD → __NEXT_DATA__ → regex → AI)
      if (!job) {
        const result = await parseGenericPage(url);
        if (result.job) {
          job = result.job;
        }
      }

      // Layer 5: Headless browser fallback for everything else that failed
      if (!job) {
        console.log('[job-parse] All fast parsers failed. Trying headless browser...');
        job = await fetchWithBrowser(url);
        if (job) {
          console.log(`[job-parse] Browser fallback succeeded: "${job.title}" at ${job.company}`);
        }
      }
    }

    // Nothing worked at all
    if (!job) {
      const siteName = url.match(/(?:www\.)?([a-z]+)\.(com|co|io)/i)?.[1] || '';
      return NextResponse.json({
        error: 'parse_failed',
        message: `Could not extract job details from ${siteName || 'this site'}. Copy the job description from the page and paste it below. That always works.`,
      }, { status: 422 });
    }

    // Final quality check
    if (job.skills.length === 0 && !job.title) {
      return NextResponse.json({
        error: 'login_wall',
        message: 'Could not find job details on this page. Copy the job description and paste it below.',
      }, { status: 422 });
    }

    return NextResponse.json({
      job: {
        title: job.title,
        company: job.company,
        location: job.location,
        description: (job.description || '').slice(0, 300) || null,
        requirements: job.requirements,
        skills: job.skills,
        keywords: job.keywords,
        experience: job.experience,
        salary: job.salary,
        workplace_type: job.workplace_type,
        seniority: job.seniority,
        source_type: job.source_type,
      },
      source: url,
    });
  } catch (error) {
    console.error('Job parse error:', error);
    return NextResponse.json({ error: 'Failed to parse job listing' }, { status: 500 });
  }
}
