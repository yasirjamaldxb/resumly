import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('analytics_events')
      .select('metadata, created_at')
      .eq('event_type', 'testimonial')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Public testimonials fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    // Filter: only public testimonials with rating >= 4
    const testimonials = (data || [])
      .filter(
        (row) =>
          row.metadata &&
          row.metadata.allowPublic === true &&
          row.metadata.rating >= 4
      )
      .map((row) => ({
        name: row.metadata.displayName || 'Anonymous',
        rating: row.metadata.rating,
        text: row.metadata.testimonial,
        createdAt: row.created_at,
      }));

    return NextResponse.json(
      { testimonials },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        },
      }
    );
  } catch (error) {
    console.error('Public testimonials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
