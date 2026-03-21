import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackEvent, logError } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumeData = await req.json();
    const { id, userId, ...rest } = resumeData;

    const upsertData = {
      user_id: user.id,
      title: rest.title || 'My Resume',
      template_id: rest.templateId,
      color_scheme: rest.colorScheme,
      resume_data: rest,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
      result = await supabase
        .from('resumes')
        .update(upsertData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('resumes')
        .insert({ ...upsertData, created_at: new Date().toISOString() })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    trackEvent({
      event: id ? 'resume_save' : 'resume_create',
      userId: user.id,
      metadata: { resumeId: result.data.id, templateId: rest.templateId },
    });

    return NextResponse.json({ id: result.data.id, success: true });
  } catch (error) {
    console.error('Save error:', error);
    logError({ endpoint: '/api/resume/save', errorMessage: error instanceof Error ? error.message : 'Save failed' });
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
