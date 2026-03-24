import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateDripProgress } from '@/lib/email/init-drip';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: true }); // silently skip for unauthenticated
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'downloaded_pdf' || action === 'completed_resume') {
      await updateDripProgress(user.id, action);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never block the user
  }
}
