import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserUsage, canCreateApplication } from '@/lib/usage';

// GET /api/applications — list user's applications
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id, status, applied_at, notes, created_at, updated_at,
        job:jobs(id, title, company, location, salary, url),
        resume:resumes(id, title, template_id, ats_score),
        cover_letter:cover_letters(id)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error('Applications list error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// POST /api/applications — create a new application
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check usage limits
    const usage = await getUserUsage(supabase, user.id);
    if (!canCreateApplication(usage)) {
      return NextResponse.json({
        error: 'limit_reached',
        message: `You've reached your ${usage.tier} plan limit of ${usage.limits.maxApplications} applications. Upgrade to continue.`,
        tier: usage.tier,
      }, { status: 403 });
    }

    const body = await req.json();
    const { job_id, resume_id, cover_letter_id, status, notes } = body;

    if (!job_id) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        job_id,
        resume_id: resume_id || null,
        cover_letter_id: cover_letter_id || null,
        status: status || 'draft',
        notes: notes || null,
        applied_at: status === 'applied' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment applications_count on profile (non-critical)
    supabase
      .from('profiles')
      .update({ applications_count: usage.applicationsUsed + 1 })
      .eq('id', user.id)
      .then(() => {});

    return NextResponse.json({ id: data.id, success: true });
  } catch (error) {
    console.error('Application create error:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
