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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-gray-900">resumly.app</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Hi {firstName}! 👋</h1>
          <p className="text-gray-600 mt-1">Build and manage your resumes below.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Resumes', value: resumes?.length || 0, icon: '📄' },
            { label: 'ATS Ready', value: resumes?.length || 0, icon: '✅' },
            { label: 'Templates', value: 6, icon: '🎨' },
            { label: 'Downloads', value: 0, icon: '⬇️' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resumes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Resumes</h2>
            <Button asChild>
              <Link href="/builder/new">+ New Resume</Link>
            </Button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-500 text-sm mb-6">Create your first ATS-friendly resume in under 10 minutes</p>
              <Button asChild>
                <Link href="/builder/new">Create My Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* New resume card */}
              <Link
                href="/builder/new"
                className="group border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[200px]"
              >
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Create New Resume</p>
                <p className="text-sm text-gray-500 mt-1">Start from scratch or use AI</p>
              </Link>

              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-36 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="text-4xl opacity-30">📄</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
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
