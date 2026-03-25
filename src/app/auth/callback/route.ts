import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { initDripForUser } from '@/lib/email/init-drip';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const job = searchParams.get('job');
  const type = searchParams.get('type');

  if (code) {
    // If a job URL was passed through OAuth, send user to builder with it
    const redirectPath = job ? `/builder/new?job=${encodeURIComponent(job)}` : next;
    const redirectUrl = type === 'recovery'
      ? `${origin}/auth/reset-password`
      : `${origin}${redirectPath}`;
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Initialize drip campaign for new users (idempotent)
      if (sessionData?.user) {
        const user = sessionData.user;
        initDripForUser(user.id, user.email || '').catch(() => {});
      }
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Could not authenticate`);
}
