import { SupabaseClient } from '@supabase/supabase-js';
import { PLAN_LIMITS, PlanTier } from './plans';

export async function getUserUsage(supabase: SupabaseClient, userId: string) {
  const [{ data: profile }, { count: appCount }] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_tier, ai_optimizations_used, applications_count')
      .eq('id', userId)
      .single(),
    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  const tier = (profile?.subscription_tier || 'free') as PlanTier;
  const limits = PLAN_LIMITS[tier];

  return {
    tier,
    limits,
    applicationsUsed: appCount || 0,
    optimizationsUsed: profile?.ai_optimizations_used || 0,
  };
}

export function canCreateApplication(usage: Awaited<ReturnType<typeof getUserUsage>>): boolean {
  return usage.applicationsUsed < usage.limits.maxApplications;
}

export function canUseOptimization(usage: Awaited<ReturnType<typeof getUserUsage>>): boolean {
  return usage.optimizationsUsed < usage.limits.maxOptimizations;
}
