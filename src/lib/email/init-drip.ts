import { createAdminClient } from '@/lib/supabase/admin';
import { randomBytes } from 'crypto';

/**
 * Initialize drip campaign for a new user.
 * Call this after successful signup/first login.
 * Idempotent — won't create duplicates.
 */
export async function initDripForUser(userId: string, email: string) {
  try {
    const supabase = createAdminClient();

    // Check if drip state already exists (idempotent)
    const { data: existing } = await supabase
      .from('email_drip_state')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) return; // already initialized

    const unsubscribeToken = randomBytes(32).toString('hex');

    await supabase.from('email_drip_state').insert({
      user_id: userId,
      email,
      current_email_number: 0,
      next_email_due_at: new Date().toISOString(), // first email sends on next cron run
      status: 'active',
      unsubscribe_token: unsubscribeToken,
    });
  } catch (err) {
    // Don't block signup if drip init fails
    console.error('Failed to init drip for user:', err);
  }
}

/**
 * Update user's drip state when they complete key actions.
 * Call this from resume save/download handlers.
 */
export async function updateDripProgress(userId: string, action: 'completed_resume' | 'downloaded_pdf') {
  try {
    const supabase = createAdminClient();
    const field = action === 'completed_resume' ? 'has_completed_resume' : 'has_downloaded_pdf';

    await supabase
      .from('email_drip_state')
      .update({ [field]: true })
      .eq('user_id', userId);
  } catch (err) {
    console.error('Failed to update drip progress:', err);
  }
}
