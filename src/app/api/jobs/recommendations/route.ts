import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getJobRecommendations } from '@/lib/job-recommendations';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's most recent job
    const { data: recentJob, error: jobError } = await supabase
      .from('jobs')
      .select('title, location, skills')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (jobError) {
      console.error('Error fetching recent job:', jobError);
      return NextResponse.json({ error: 'Failed to fetch job data' }, { status: 500 });
    }

    if (!recentJob || !recentJob.title) {
      return NextResponse.json({
        jobs: [],
        basedOn: null,
      });
    }

    const jobTitle = recentJob.title;
    const location = recentJob.location || null;
    const skills: string[] = Array.isArray(recentJob.skills) ? recentJob.skills : [];

    const jobs = await getJobRecommendations(user.id, jobTitle, location, skills);

    return NextResponse.json({
      jobs,
      basedOn: jobTitle,
    });
  } catch (error) {
    console.error('Job recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job recommendations' },
      { status: 500 },
    );
  }
}
