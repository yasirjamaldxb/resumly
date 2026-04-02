-- Add Polar payment fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS polar_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT;
