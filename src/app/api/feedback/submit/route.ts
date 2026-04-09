import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, testimonial, allowPublic } = body;

    // Validate rating
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    if (!testimonial || typeof testimonial !== 'string' || testimonial.trim().length === 0) {
      return NextResponse.json(
        { error: 'Testimonial text is required' },
        { status: 400 }
      );
    }

    if (testimonial.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Testimonial must be under 1000 characters' },
        { status: 400 }
      );
    }

    // Get user profile for the name
    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const displayName =
      profile?.full_name ||
      user.email?.split('@')[0] ||
      'Anonymous';

    const { error } = await adminSupabase.from('analytics_events').insert({
      event_type: 'testimonial',
      user_id: user.id,
      metadata: {
        rating,
        testimonial: testimonial.trim(),
        allowPublic: allowPublic === true,
        displayName,
      },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Feedback insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (error) {
    console.error('Feedback submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
