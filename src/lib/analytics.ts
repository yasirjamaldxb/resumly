import { createClient } from '@/lib/supabase/server';

export type EventType =
  | 'page_view'
  | 'signup'
  | 'login'
  | 'resume_create'
  | 'resume_save'
  | 'resume_delete'
  | 'pdf_download'
  | 'pdf_download_error'
  | 'ats_check'
  | 'ats_email_capture'
  | 'ai_suggest'
  | 'api_error'
  | 'funnel_step_viewed'
  | 'funnel_step_completed'
  | 'funnel_abandoned'
  | 'onboarding_complete'
  | 'upgrade_click'
  | 'checkout_started'
  | 'checkout_success'
  | 'cta_click';

interface TrackEventParams {
  event: EventType;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function trackEvent({ event, userId, metadata }: TrackEventParams) {
  try {
    const supabase = await createClient();
    await supabase.from('analytics_events').insert({
      event_type: event,
      user_id: userId || null,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Never let analytics break the app
    console.error('Analytics track error:', err);
  }
}

export async function logError({
  endpoint,
  errorMessage,
  errorCode,
  userId,
  metadata,
}: {
  endpoint: string;
  errorMessage: string;
  errorCode?: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    const supabase = await createClient();
    await supabase.from('error_logs').insert({
      endpoint,
      error_message: errorMessage,
      error_code: errorCode || null,
      user_id: userId || null,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error log write failed:', err);
  }
}
