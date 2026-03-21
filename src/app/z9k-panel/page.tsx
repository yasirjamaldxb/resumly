import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminDashboard } from './admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Resumly',
  robots: { index: false, follow: false },
};

const ADMIN_EMAILS = ['yj.digitall@gmail.com'];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/');
  }

  return <AdminDashboard />;
}
