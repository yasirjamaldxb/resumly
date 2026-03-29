-- Phase 1: Jobs, Applications, Cover Letters + Profile enhancements
-- Supports the job application hub funnel

-- ══════════════════════════════════════════════
-- 1. New tables
-- ══════════════════════════════════════════════

-- Jobs table — stores parsed job listings (user-submitted + recommended)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'adzuna', 'remoteok', 'jooble')),
  external_id TEXT,
  title TEXT,
  company TEXT,
  location TEXT,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  experience TEXT,
  salary TEXT,
  raw_text TEXT,
  remote BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cover letters table
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  content TEXT NOT NULL DEFAULT '',
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'formal', 'enthusiastic')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table — tracks job applications through the funnel
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  cover_letter_id UUID REFERENCES public.cover_letters(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  applied_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════
-- 2. Alter existing tables
-- ══════════════════════════════════════════════

-- Add job_id to resumes (link resume to a specific job application)
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL;

-- Add profile columns for onboarding + usage tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_level TEXT CHECK (job_level IN ('student', 'entry', 'mid', 'senior', 'executive'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_optimizations_used INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;

-- Update subscription_tier check to include 'starter'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- ══════════════════════════════════════════════
-- 3. Row Level Security
-- ══════════════════════════════════════════════

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Jobs: users can manage their own jobs
CREATE POLICY "Users can view own jobs" ON public.jobs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON public.jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Cover letters: users can manage their own
CREATE POLICY "Users can view own cover letters" ON public.cover_letters
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cover letters" ON public.cover_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cover letters" ON public.cover_letters
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cover letters" ON public.cover_letters
  FOR DELETE USING (auth.uid() = user_id);

-- Applications: users can manage their own
CREATE POLICY "Users can view own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON public.applications
  FOR DELETE USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════
-- 4. Triggers for updated_at
-- ══════════════════════════════════════════════

CREATE TRIGGER handle_updated_at_jobs
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_cover_letters
  BEFORE UPDATE ON public.cover_letters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_applications
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ══════════════════════════════════════════════
-- 5. Indexes for performance
-- ══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_external_id ON public.jobs(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_job_id ON public.cover_letters(job_id);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resumes_job_id ON public.resumes(job_id) WHERE job_id IS NOT NULL;
