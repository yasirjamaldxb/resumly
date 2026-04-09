import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  detectJobBoard,
  extractCompanySlug,
  extractCompanyName,
  extractGreenhouseJobs,
  extractLeverJobs,
  extractGenericJobs,
  type ScannedJob,
} from '@/lib/career-scanner';

// ══════════════════════════════════════════════════════════════
// POST /api/jobs/scan-company
// Scan a company careers page and extract job listings
// ══════════════════════════════════════════════════════════════

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const MAX_JOBS = 30;

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse body ──
    const body = await req.json();
    const rawUrl = body?.url?.trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 },
      );
    }

    // Normalize URL — add https if missing
    let url = rawUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL. Please enter a valid careers page URL.' },
        { status: 400 },
      );
    }

    // ── Detect job board type ──
    const board = detectJobBoard(url);
    const companyName = extractCompanyName(url);
    let jobs: ScannedJob[] = [];

    try {
      switch (board) {
        case 'greenhouse': {
          const slug = extractCompanySlug(url, 'greenhouse');
          if (!slug) {
            return NextResponse.json(
              { error: 'Could not determine company from this Greenhouse URL. Try a URL like: https://boards.greenhouse.io/company' },
              { status: 400 },
            );
          }
          jobs = await extractGreenhouseJobs(slug);
          break;
        }

        case 'lever': {
          const slug = extractCompanySlug(url, 'lever');
          if (!slug) {
            return NextResponse.json(
              { error: 'Could not determine company from this Lever URL. Try a URL like: https://jobs.lever.co/company' },
              { status: 400 },
            );
          }
          jobs = await extractLeverJobs(slug);
          break;
        }

        case 'ashby': {
          // Ashby jobs pages render client-side, but we can try the API pattern
          const slug = extractCompanySlug(url, 'ashby');
          if (slug) {
            try {
              const apiUrl = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
              const res = await fetch(apiUrl, {
                headers: { 'User-Agent': BROWSER_UA },
                signal: AbortSignal.timeout(12000),
              });
              if (res.ok) {
                const data = await res.json() as {
                  jobs: {
                    title: string;
                    id: string;
                    location: string;
                    departmentName?: string;
                    jobUrl?: string;
                  }[];
                };
                jobs = (data.jobs || []).slice(0, MAX_JOBS).map((j) => ({
                  title: j.title,
                  url: j.jobUrl || `https://jobs.ashbyhq.com/${slug}/${j.id}`,
                  location: j.location || undefined,
                  department: j.departmentName || undefined,
                }));
              }
            } catch {
              // Fall through to generic HTML parsing
            }
          }

          // If the API approach got nothing, try generic HTML
          if (jobs.length === 0) {
            jobs = await fetchAndParseGeneric(url, parsedUrl);
          }
          break;
        }

        case 'workday': {
          // Workday sites are heavily JS-rendered, try generic HTML scraping
          // as a best-effort approach
          jobs = await fetchAndParseGeneric(url, parsedUrl);
          if (jobs.length === 0) {
            return NextResponse.json({
              company: companyName,
              totalJobs: 0,
              jobs: [],
              message: 'Workday career sites use heavy client-side rendering. Try pasting individual job URLs directly instead.',
            });
          }
          break;
        }

        case 'generic':
        default: {
          jobs = await fetchAndParseGeneric(url, parsedUrl);
          break;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json(
        { error: `Failed to scan careers page: ${message}. Check the URL and try again.` },
        { status: 400 },
      );
    }

    // ── Response ──
    return NextResponse.json({
      company: companyName,
      totalJobs: jobs.length,
      jobs: jobs.slice(0, MAX_JOBS),
      ...(jobs.length === 0
        ? { message: 'No job listings found on this page. Try a direct link to the company\'s careers or jobs page.' }
        : {}),
    });
  } catch (err) {
    console.error('[scan-company] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ══════════════════════════════════════════════════════════════
// Helper: fetch page HTML and extract jobs generically
// ══════════════════════════════════════════════════════════════

async function fetchAndParseGeneric(url: string, parsedUrl: URL): Promise<ScannedJob[]> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Page returned HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    throw new Error('URL did not return an HTML page');
  }

  const html = await res.text();
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

  return extractGenericJobs(html, baseUrl);
}
