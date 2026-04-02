import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileClient } from './profile-client';

export const metadata: Metadata = {
  title: 'My Profile – Resumly',
  robots: 'noindex',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, location, linkedin_url, headline, target_role, job_level, industry, years_experience, profile_data')
    .eq('id', user.id)
    .single();

  // Try to populate from most recent resume if profile_data is empty
  let profileData = profile?.profile_data || {};
  if (!profileData?.personalDetails && !profileData?.workExperience) {
    const { data: latestResume } = await supabase
      .from('resumes')
      .select('resume_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (latestResume?.resume_data) {
      profileData = latestResume.resume_data;
    }
  }

  return (
    <ProfileClient
      userId={user.id}
      email={user.email || ''}
      profile={{
        full_name: profile?.full_name || user.user_metadata?.name || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        linkedin_url: profile?.linkedin_url || '',
        headline: profile?.headline || '',
        target_role: profile?.target_role || '',
        job_level: profile?.job_level || '',
        industry: profile?.industry || '',
        years_experience: profile?.years_experience || 0,
      }}
      profileData={profileData}
    />
  );
}
