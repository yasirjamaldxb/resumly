import { NextResponse } from 'next/server';

/**
 * IndexNow endpoint — submit URL changes to Bing/Yandex/Seznam/Naver/Yep
 * in near-real-time. Unlike Google Search Console, this causes indexing
 * within hours instead of days.
 *
 * Docs: https://www.indexnow.org/documentation
 *
 * Usage:
 *   POST /api/indexnow            -> submits entire sitemap
 *   POST /api/indexnow { urls: [...] } -> submits specific URLs
 *
 * Protected by INDEXNOW_SECRET env var to prevent abuse.
 */

export const runtime = 'nodejs';

const INDEXNOW_KEY = 'abf250ea116072f542eb41cfd87baecc';
const HOST = 'resumly.app';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// IndexNow endpoints — submit to Bing; it propagates to all IndexNow
// participants (Yandex, Seznam, Naver, Yep).
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function fetchAllSitemapUrls(): Promise<string[]> {
  // Pull URLs from our own sitemap so this stays in sync.
  try {
    const res = await fetch(`https://${HOST}/sitemap.xml`, {
      headers: { 'User-Agent': 'Resumly-IndexNow/1.0' },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
    return matches.map((m) => m.replace(/<\/?loc>/g, '').trim()).filter(Boolean);
  } catch {
    return [];
  }
}

async function submitToIndexNow(urls: string[]) {
  if (urls.length === 0) return { ok: false, reason: 'no urls' };
  // IndexNow bulk submit allows up to 10,000 URLs per request
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += 10000) {
    chunks.push(urls.slice(i, i + 10000));
  }

  const results: Array<{ status: number; count: number }> = [];
  for (const chunk of chunks) {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: chunk,
      }),
    });
    results.push({ status: res.status, count: chunk.length });
  }

  return { ok: true, results, totalSubmitted: urls.length };
}

export async function POST(req: Request) {
  // Require secret header to prevent random strangers from spamming our quota
  const secret = req.headers.get('x-indexnow-secret');
  if (secret !== process.env.INDEXNOW_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { urls?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is fine — means "submit everything"
  }

  const urls = body.urls && body.urls.length > 0 ? body.urls : await fetchAllSitemapUrls();
  const result = await submitToIndexNow(urls);

  // Also ping Google sitemap (Google no longer has a direct submit API but
  // this is a soft signal via the well-known sitemap refresh URL).
  try {
    await fetch(`https://www.google.com/ping?sitemap=https://${HOST}/sitemap.xml`, {
      method: 'GET',
    });
  } catch {
    // Non-critical
  }

  return NextResponse.json(result);
}

export async function GET() {
  // Health check — returns the key location so you can verify it matches the
  // txt file in /public.
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    host: HOST,
    usage: 'POST /api/indexnow with x-indexnow-secret header to submit URLs',
  });
}
