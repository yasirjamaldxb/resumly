-- Add master profile data (JSONB) to profiles table
-- This stores the user's canonical professional profile:
-- personal details, work experience, education, skills, summary
-- New resumes pre-fill from this data.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}';

-- Also add phone + location + linkedin to profiles for quick access
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS headline TEXT;
