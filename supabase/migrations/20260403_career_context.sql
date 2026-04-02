-- Add career context field for AI personalization
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS career_context TEXT;
