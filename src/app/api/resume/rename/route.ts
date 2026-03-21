import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, title } = await req.json();
    if (!resumeId || !title?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { error } = await supabase
      .from('resumes')
      .update({ title: title.trim(), updated_at: new Date().toISOString() })
      .eq('id', resumeId)
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
