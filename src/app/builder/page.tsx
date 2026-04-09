import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { emptyResume } from '@/types/resume';

export const dynamic = 'force-dynamic';

export default async function NewResumePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirectTo=/builder');

  const resumeData = emptyResume();

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: resumeData.title,
      template_id: resumeData.templateId,
      color_scheme: resumeData.colorScheme,
      resume_data: resumeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    redirect('/dashboard/resumes?error=create_failed');
  }

  redirect(`/builder/${data.id}`);
}
