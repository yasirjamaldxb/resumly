import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/applications/[id] — update application status/notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes, resume_id, cover_letter_id } = body;

    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
      if (status === 'applied' && !body.applied_at) {
        updateData.applied_at = new Date().toISOString();
      }
    }
    if (notes !== undefined) updateData.notes = notes;
    if (resume_id !== undefined) updateData.resume_id = resume_id;
    if (cover_letter_id !== undefined) updateData.cover_letter_id = cover_letter_id;

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

// DELETE /api/applications/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Application delete error:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
