-- AI Usage Log: tracks every AI API call for per-user cost visibility
-- Enables admin dashboard to show which users cost the most

CREATE TABLE IF NOT EXISTS public.ai_usage_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,  -- 'optimize', 'cover-letter', 'generate-resume'
  model TEXT DEFAULT 'gemini-2.5-flash',
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  estimated_cost NUMERIC(10, 6) DEFAULT 0,  -- in USD
  metadata JSONB DEFAULT '{}',  -- job_id, resume_id, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin queries: cost per user, recent usage
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_log (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON public.ai_usage_log (created_at DESC);

-- RLS: users can only see their own usage
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own AI usage' AND tablename = 'ai_usage_log') THEN
    CREATE POLICY "Users can view own AI usage" ON public.ai_usage_log FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can insert AI usage' AND tablename = 'ai_usage_log') THEN
    CREATE POLICY "Service can insert AI usage" ON public.ai_usage_log FOR INSERT WITH CHECK (true);
  END IF;
END $$;
