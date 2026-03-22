import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const getBaseUrl = (req: NextRequest) => {
  const origin = req.headers.get('origin');
  if (origin && !origin.includes('localhost')) return origin;
  return process.env.NEXT_PUBLIC_APP_URL || 'https://resumly.app';
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Use 303 to force browser to GET the redirect target (not POST)
  return NextResponse.redirect(new URL('/', getBaseUrl(req)), 303);
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', getBaseUrl(req)), 303);
}
