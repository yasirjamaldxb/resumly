import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export const metadata: Metadata = {
  title: 'Settings – Resumly',
  robots: 'noindex',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_tier, job_level, industry, years_experience, target_role, preferred_location, ai_optimizations_used, career_context, polar_subscription_id')
    .eq('id', user.id)
    .single();

  const { count: appCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const hasPassword = user.app_metadata?.providers?.includes('email') || false;
  const hasGoogle = user.app_metadata?.providers?.includes('google') || false;

  return (
    <SettingsClient
      user={{
        id: user.id,
        email: user.email || '',
        name: profile?.full_name || user.user_metadata?.name || '',
        hasPassword,
        hasGoogle,
      }}
      profile={{
        subscription_tier: profile?.subscription_tier || 'free',
        job_level: profile?.job_level || '',
        industry: profile?.industry || '',
        years_experience: profile?.years_experience || 0,
        target_role: profile?.target_role || '',
        preferred_location: profile?.preferred_location || '',
        career_context: profile?.career_context || '',
        ai_optimizations_used: profile?.ai_optimizations_used || 0,
        polar_subscription_id: profile?.polar_subscription_id || null,
      }}
      usage={{
        applicationsUsed: appCount || 0,
        optimizationsUsed: profile?.ai_optimizations_used || 0,
      }}
    />
  );
}
