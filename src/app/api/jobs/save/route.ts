import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      url, title, company, location, description,
      requirements, skills, keywords, experience,
      salary, raw_text, remote, source, external_id, posted_at,
    } = body;

    // Check for existing job with same URL for this user (dedup)
    if (url) {
      const { data: existing } = await supabase
        .from('jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('url', url)
        .maybeSingle();

      if (existing) {
        // Update existing job
        const { data, error } = await supabase
          .from('jobs')
          .update({
            title, company, location, description,
            requirements: requirements || [],
            skills: skills || [],
            keywords: keywords || [],
            experience, salary, raw_text,
            remote: remote || false,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ id: data.id, success: true, updated: true });
      }
    }

    // Insert new job
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        user_id: user.id,
        url: url || null,
        source: source || 'manual',
        external_id: external_id || null,
        title: title || null,
        company: company || null,
        location: location || null,
        description: description || null,
        requirements: requirements || [],
        skills: skills || [],
        keywords: keywords || [],
        experience: experience || null,
        salary: salary || null,
        raw_text: raw_text || null,
        remote: remote || false,
        posted_at: posted_at || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, success: true });
  } catch (error) {
    console.error('Job save error:', error);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}
