import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Dashboard – Resumly',
  robots: 'noindex',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, title, template_id, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const firstName = user.user_metadata?.name?.split(' ')[0] || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-neutral-10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-medium text-neutral-90 tracking-tight">resumly<span className="text-primary">.app</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-50 hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-neutral-50 hover:text-neutral-90 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-[32px] font-medium text-neutral-90 tracking-tight">Hi {firstName}! 👋</h1>
          <p className="text-neutral-50 mt-1">Build and manage your resumes below.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Resumes', value: resumes?.length || 0, icon: '📄' },
            { label: 'ATS Ready', value: resumes?.length || 0, icon: '✅' },
            { label: 'Templates', value: 10, icon: '🎨' },
            { label: 'Downloads', value: 0, icon: '⬇️' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-neutral-20 p-4 text-center hover:shadow-md transition-all">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-[28px] font-semibold text-neutral-90">{stat.value}</div>
              <div className="text-[14px] text-neutral-50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resumes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-neutral-90 tracking-tight">My Resumes</h2>
            <Button asChild>
              <Link href="/builder/new">+ New Resume</Link>
            </Button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-neutral-20">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-neutral-90 mb-2">No resumes yet</h3>
              <p className="text-neutral-50 text-sm mb-6">Create your first ATS-friendly resume in under 10 minutes</p>
              <Button asChild>
                <Link href="/builder/new">Create My Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* New resume card */}
              <Link
                href="/builder/new"
                className="group border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary-light transition-all min-h-[200px]"
              >
                <div className="w-12 h-12 bg-neutral-10 group-hover:bg-primary-light rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <svg className="w-6 h-6 text-neutral-40 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-neutral-70 group-hover:text-primary-dark transition-colors">Create New Resume</p>
                <p className="text-sm text-neutral-50 mt-1">Start from scratch or use AI</p>
              </Link>

              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white border border-neutral-20 rounded-2xl overflow-hidden hover:shadow-md hover:border-neutral-30 transition-all group">
                  <div className="h-36 bg-primary/5 flex items-center justify-center">
                    <div className="text-4xl opacity-30">📄</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-90 truncate">{resume.title}</h3>
                    <p className="text-xs text-neutral-40 mt-1">
                      Updated {new Date(resume.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="primary" size="sm" className="flex-1" asChild>
                        <Link href={`/builder/${resume.id}`}>Edit</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/builder/${resume.id}?download=true`}>⬇</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
