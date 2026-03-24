-- Email drip campaign tables

-- Track each user's position in the drip sequence
CREATE TABLE IF NOT EXISTS public.email_drip_state (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  current_email_number INTEGER DEFAULT 0, -- 0 = not started, 1-7 = email number
  last_email_sent_at TIMESTAMPTZ,
  next_email_due_at TIMESTAMPTZ DEFAULT NOW(), -- first email sends immediately
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'unsubscribed', 'paused', 'bounced')),
  has_completed_resume BOOLEAN DEFAULT FALSE,
  has_downloaded_pdf BOOLEAN DEFAULT FALSE,
  unsubscribe_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track individual email events (opens, clicks, bounces, etc.)
CREATE TABLE IF NOT EXISTS public.email_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_number INTEGER NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
  metadata JSONB DEFAULT '{}', -- link clicked, user agent, resend message id, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.email_drip_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write these tables (no client access)
-- Users should NOT be able to see their drip state
CREATE POLICY "Service role full access on email_drip_state" ON public.email_drip_state
  FOR ALL USING (false); -- blocks all client access; use service_role key server-side

CREATE POLICY "Service role full access on email_events" ON public.email_events
  FOR ALL USING (false);

-- Auto-update updated_at
CREATE TRIGGER handle_updated_at_email_drip_state
  BEFORE UPDATE ON public.email_drip_state
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_drip_state_user_id ON public.email_drip_state(user_id);
CREATE INDEX IF NOT EXISTS idx_email_drip_state_next_due ON public.email_drip_state(next_email_due_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_email_drip_state_status ON public.email_drip_state(status);
CREATE INDEX IF NOT EXISTS idx_email_events_user_id ON public.email_events(user_id);
CREATE INDEX IF NOT EXISTS idx_email_events_email_number ON public.email_events(email_number);
