import { NextRequest, NextResponse } from 'next/server';

// ── Common skills dictionary for keyword extraction ──
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

// ── HTML helpers ──

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

// ── JSON-LD structured data extraction (works on many job sites) ──

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

function extractJsonLd(html: string): JsonLdJob | null {
  const matches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!matches) return null;
  for (const match of matches) {
    try {
      const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
      const data = JSON.parse(jsonStr);
      // Handle arrays of JSON-LD objects
      const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
      for (const item of items) {
        if (item['@type'] === 'JobPosting' || item['@type']?.includes?.('JobPosting')) {
          return item as JsonLdJob;
        }
      }
    } catch { /* invalid JSON, skip */ }
  }
  return null;
}

// ── LinkedIn-specific parsing ──

function extractLinkedInJobId(url: string): string | null {
  const viewMatch = url.match(/\/jobs\/view\/(?:.*?[-/])?(\d{5,})/);
  if (viewMatch) return viewMatch[1];
  const paramMatch = url.match(/currentJobId=(\d+)/);
  if (paramMatch) return paramMatch[1];
  return null;
}

function parseLinkedInHtml(html: string): { title: string; company: string; location: string; description: string } | null {
  // Try extracting from specific LinkedIn HTML classes
  const titleMatch = html.match(/class="[^"]*top-card-layout__title[^"]*"[^>]*>([^<]+)/i)
    || html.match(/<h1[^>]*>([^<]+)/i)
    || html.match(/<h2[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)/i);

  const companyMatch = html.match(/class="[^"]*topcard__org-name[^"]*"[^>]*>[^<]*<[^>]*>([^<]+)/i)
    || html.match(/class="[^"]*company-name[^"]*"[^>]*>([^<]+)/i)
    || html.match(/data-tracking-control-name="[^"]*company[^"]*"[^>]*>([^<]+)/i);

  const locationMatch = html.match(/class="[^"]*topcard__flavor--bullet[^"]*"[^>]*>([^<]+)/i)
    || html.match(/class="[^"]*job-location[^"]*"[^>]*>([^<]+)/i);

  // Get the description section
  const descHtml = extractBetween(html, /class="[^"]*description__text/i, /<\/section/i)
    || extractBetween(html, /class="[^"]*show-more-less-html/i, /<\/section/i)
    || '';

  const title = titleMatch ? titleMatch[1].trim() : '';
  const company = companyMatch ? companyMatch[1].trim() : '';
  const location = locationMatch ? locationMatch[1].trim() : '';
  const description = stripHtml(descHtml);

  if (!title && !description) return null;
  return { title, company, location, description };
}

// ── Keyword extraction (no AI needed) ──

function extractKeywords(text: string): { skills: string[]; keywords: string[] } {
  const lower = text.toLowerCase();
  const foundSkills: string[] = [];

  // Match against known skills dictionary
  for (const skill of TECH_SKILLS) {
    // Word boundary matching
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) {
      // Capitalize properly
      foundSkills.push(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  }

  // Extract years of experience mentions
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i);

  // Extract additional multi-word phrases near "requirements" or "qualifications" sections
  const reqSection = text.match(/(?:requirements?|qualifications?|what you.?ll need|must have|nice to have)[:\s]+([\s\S]{100,1500}?)(?=\n\n|responsibilities|about|benefits|perks|$)/i);
  const keywords: string[] = [];
  if (reqSection) {
    // Extract bullet points or list items
    const bullets = reqSection[1].split(/[•\-\n\r]+/).filter(b => b.trim().length > 10 && b.trim().length < 200);
    for (const bullet of bullets.slice(0, 10)) {
      const cleaned = bullet.trim().replace(/^[\s,;]+|[\s,;]+$/g, '');
      if (cleaned) keywords.push(cleaned);
    }
  }

  // Dedupe skills
  const uniqueSkills = [...new Set(foundSkills)];

  // Keywords = requirements bullets + top skills not already in keywords
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
  const atsKeywords = uniqueSkills.filter(s => !keywordSet.has(s.toLowerCase()));

  return {
    skills: uniqueSkills.slice(0, 15),
    keywords: [...atsKeywords.slice(0, 10), ...(expMatch ? [`${expMatch[1]}+ years experience`] : [])],
  };
}

function extractTitle(text: string): string | null {
  // Try to find job title from common patterns
  const patterns = [
    /(?:job title|position|role)[:\s]+([^\n.]{5,60})/i,
    /^([A-Z][A-Za-z\s/&,()-]{5,60})$/m,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
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

// ── Fetch helpers ──

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'identity',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  });
  return await res.text();
}

async function fetchJobHtml(url: string): Promise<string> {
  try {
    // LinkedIn — use guest API
    if (url.includes('linkedin.com')) {
      const jobId = extractLinkedInJobId(url);
      if (jobId) {
        const guestUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
        try {
          return await fetchPage(guestUrl);
        } catch { /* fall through */ }
      }
    }

    // Indeed — try mobile
    if (url.includes('indeed.com') && !url.includes('m.indeed.com')) {
      const mobileUrl = url.replace('www.indeed.com', 'm.indeed.com').replace(/^(https?:\/\/)indeed\.com/, '$1m.indeed.com');
      try {
        const html = await fetchPage(mobileUrl);
        if (stripHtml(html).length > 200) return html;
      } catch { /* fall through */ }
    }

    return await fetchPage(url);
  } catch {
    return '';
  }
}

// ── Main handler ──

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, text } = body;

    let jobTitle: string | null = null;
    let company: string | null = null;
    let location: string | null = null;
    let description = '';
    let salary: string | null = null;
    let experience: string | null = null;
    let plainText = '';

    if (text && typeof text === 'string' && text.trim().length > 50) {
      // ── Raw pasted text ──
      plainText = text.trim();
      description = plainText.slice(0, 500);
      jobTitle = extractTitle(plainText);
      company = extractCompany(plainText);
      location = extractLocation(plainText);

    } else if (url && typeof url === 'string') {
      // ── Fetch and parse HTML ──
      const html = await fetchJobHtml(url);
      if (!html || stripHtml(html).length < 80) {
        return NextResponse.json({
          error: 'fetch_failed',
          message: 'Could not fetch that page. Paste the job description instead.',
        }, { status: 422 });
      }

      // Strategy 1: JSON-LD structured data (most reliable, works on many sites)
      const jsonLd = extractJsonLd(html);
      if (jsonLd) {
        jobTitle = jsonLd.title || null;
        company = jsonLd.hiringOrganization?.name || null;
        const loc = Array.isArray(jsonLd.jobLocation) ? jsonLd.jobLocation[0] : jsonLd.jobLocation;
        location = loc?.address ? [loc.address.addressLocality, loc.address.addressRegion].filter(Boolean).join(', ') : null;
        description = jsonLd.description ? stripHtml(jsonLd.description).slice(0, 500) : '';
        if (jsonLd.baseSalary?.value) {
          const sv = jsonLd.baseSalary.value;
          salary = sv.minValue && sv.maxValue
            ? `${jsonLd.baseSalary.currency || '$'}${sv.minValue.toLocaleString()} - ${sv.maxValue.toLocaleString()}`
            : null;
        }
        plainText = jsonLd.description ? stripHtml(jsonLd.description) : stripHtml(html);
      }

      // Strategy 2: LinkedIn-specific HTML parsing
      if (!jobTitle && url.includes('linkedin.com')) {
        const liData = parseLinkedInHtml(html);
        if (liData) {
          jobTitle = liData.title || jobTitle;
          company = liData.company || company;
          location = liData.location || location;
          description = liData.description?.slice(0, 500) || description;
          plainText = liData.description || plainText;
        }
      }

      // Strategy 3: Plain text extraction as fallback
      if (!plainText) {
        plainText = stripHtml(html);
      }

      // If we still don't have a title, try from plain text
      if (!jobTitle) jobTitle = extractTitle(plainText);
      if (!company) company = extractCompany(plainText);
      if (!location) location = extractLocation(plainText);

    } else {
      return NextResponse.json({ error: 'URL or job description text is required' }, { status: 400 });
    }

    // ── Extract keywords and skills from the full text ──
    salary = salary || extractSalary(plainText);
    experience = experience || extractExperience(plainText);
    const { skills, keywords } = extractKeywords(plainText);

    // Detect login walls
    if (skills.length === 0 && !jobTitle) {
      const lower = plainText.toLowerCase();
      const loginSignals = ['sign in', 'log in', 'create an account', 'join now'].filter(s => lower.includes(s));
      if (loginSignals.length >= 2 || plainText.length < 150) {
        return NextResponse.json({
          error: 'login_wall',
          message: 'This site requires login to see job details. Paste the job description instead.',
        }, { status: 422 });
      }
    }

    // Build requirements from text near "requirements"/"qualifications" sections
    const requirements: string[] = [];
    const reqMatch = plainText.match(/(?:requirements?|qualifications?|what (?:you.?ll|we) need|must have)[:\s]+([\s\S]{50,2000}?)(?=\n\n|\b(?:responsibilities|about us|benefits|perks|how to apply)\b|$)/i);
    if (reqMatch) {
      const bullets = reqMatch[1].split(/[•\-\n]+/).map(b => b.trim()).filter(b => b.length > 10 && b.length < 200);
      requirements.push(...bullets.slice(0, 8));
    }

    return NextResponse.json({
      job: {
        title: jobTitle,
        company,
        location,
        description: description.slice(0, 300) || null,
        requirements,
        skills,
        keywords,
        experience,
        salary,
      },
      source: url || null,
    });
  } catch (error) {
    console.error('Job parse error:', error);
    return NextResponse.json({ error: 'Failed to parse job listing' }, { status: 500 });
  }
}
