'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PipelineView } from '@/components/dashboard/pipeline-view';

interface Application {
  id: string;
  status: string;
  applied_at: string | null;
  created_at: string;
  notes: string | null;
  job: { id: string; title: string; company: string; location: string; salary: string; url: string } | null;
  resume: { id: string; title: string; ats_score: number } | null;
  cover_letter: { id: string; content: string; tone: string } | null;
}

interface StatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

interface ApplicationsClientProps {
  applications: Application[];
  statusConfig: Record<string, StatusStyle>;
}

export function ApplicationsClient({ applications, statusConfig }: ApplicationsClientProps) {
  const [view, setView] = useState<'list' | 'pipeline'>('list');

  return (
    <>
      {/* View Toggle */}
      <div className="flex items-center gap-1 mb-4 bg-neutral-10 rounded-lg p-1 w-fit">
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            view === 'list'
              ? 'bg-white text-neutral-90 shadow-sm'
              : 'text-neutral-50 hover:text-neutral-70'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
          List
        </button>
        <button
          onClick={() => setView('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            view === 'pipeline'
              ? 'bg-white text-neutral-90 shadow-sm'
              : 'text-neutral-50 hover:text-neutral-70'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          Pipeline
        </button>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[1fr_140px_140px_120px_90px] gap-4 px-4 py-2 border-b border-neutral-20">
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Position</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Resume</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Cover Letter</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Status</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Date</span>
          </div>
          {applications.map((app) => {
            const job = app.job;
            const resume = app.resume;
            const coverLetter = app.cover_letter;
            const status = statusConfig[app.status] || statusConfig.draft;

            return (
              <div key={app.id} className="grid sm:grid-cols-[1fr_140px_140px_120px_90px] gap-1.5 sm:gap-4 px-4 py-3 border-b border-neutral-20/60 last:border-0 hover:bg-primary/[0.02] transition-colors items-center">
                <div className="min-w-0">
                  <p className="font-medium text-[13px] text-neutral-90 truncate">{job?.title || 'Untitled'}</p>
                  <p className="text-[11px] text-neutral-50 truncate">{job?.company}{job?.location ? ` \u00b7 ${job.location}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  {resume ? (
                    <>
                      <Link href={`/dashboard/resume/${resume.id}`} className="text-[12px] text-primary hover:underline font-medium">View</Link>
                      <span className="text-neutral-20">&middot;</span>
                      <Link href={`/dashboard/resume/${resume.id}?download=true`} className="text-[12px] text-neutral-50 hover:text-primary font-medium">PDF</Link>
                    </>
                  ) : (
                    <span className="text-[12px] text-neutral-30">&mdash;</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {coverLetter ? (
                    <>
                      <Link href={`/dashboard/cover-letter/${coverLetter.id}`} className="text-[12px] text-green-600 hover:underline font-medium">View</Link>
                      <span className="text-neutral-20">&middot;</span>
                      <Link href={`/dashboard/cover-letter/${coverLetter.id}?download=true`} className="text-[12px] text-neutral-50 hover:text-green-600 font-medium">PDF</Link>
                    </>
                  ) : job ? (
                    <Link href={`/funnel/${job.id}/cover-letter${resume ? `?resumeId=${resume.id}` : ''}`} className="text-[12px] text-primary hover:underline font-medium">Generate</Link>
                  ) : (
                    <span className="text-[12px] text-neutral-30">&mdash;</span>
                  )}
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
                <div className="text-[12px] text-neutral-40">
                  {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pipeline View */}
      {view === 'pipeline' && (
        <PipelineView applications={applications} />
      )}
    </>
  );
}
