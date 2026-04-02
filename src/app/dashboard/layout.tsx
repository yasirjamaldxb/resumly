import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_tier')
    .eq('id', user.id)
    .single();

  const name = profile?.full_name || user.user_metadata?.name || null;
  const avatarInitial = (name?.[0] || user.email?.[0] || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Sidebar
        user={{
          email: user.email || '',
          name,
          avatarInitial,
          tier: profile?.subscription_tier || 'free',
        }}
      />
      {/* Main content area — offset for desktop sidebar */}
      <div className="lg:pl-[240px]">
        <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
