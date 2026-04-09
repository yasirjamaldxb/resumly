import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Paths that require authentication — only these run Supabase auth
const PROTECTED_PATHS = ['/dashboard', '/builder', '/z9k-panel', '/funnel'];

export async function middleware(request: NextRequest) {
  // Force canonical domain: redirect www → non-www, http → https
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = host.replace('www.', '');
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // If Supabase redirects to homepage with ?code= instead of /auth/callback,
  // forward to the callback route so the code can be exchanged for a session.
  if (
    request.nextUrl.pathname === '/' &&
    request.nextUrl.searchParams.has('code')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/callback';
    return NextResponse.redirect(url);
  }

  // ── Skip auth for public pages (marketing, blog, SEO pages) ──
  // This lets Googlebot crawl without hitting Supabase auth on every request
  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // ── Auth check only for protected paths ──
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // If auth check fails (network error), let the request through
    // rather than redirecting to login and creating a loop
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    const jobParam = request.nextUrl.searchParams.get('job');
    if (jobParam) loginUrl.searchParams.set('job', jobParam);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
