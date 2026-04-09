'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  url: string;
  postedAt: string;
  source: 'adzuna' | 'remoteok';
  matchScore: number;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 animate-pulse">
      <div className="h-4 bg-neutral-20 rounded w-3/4 mb-2" />
      <div className="h-3 bg-neutral-10 rounded w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-neutral-10 rounded-full w-20" />
        <div className="h-5 bg-neutral-10 rounded-full w-24" />
      </div>
      <div className="h-2 bg-neutral-10 rounded-full w-full mb-3" />
      <div className="h-8 bg-neutral-10 rounded-lg w-full" />
    </div>
  );
}

function formatPostedDate(dateStr: string): string {
  try {
    const posted = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function matchScoreColor(score: number): string {
  if (score >= 75) return 'from-green-400 to-green-500';
  if (score >= 50) return 'from-yellow-400 to-yellow-500';
  return 'from-orange-400 to-orange-500';
}

function matchScoreTextColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-orange-600';
}

export default function JobRecommendations() {
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [basedOn, setBasedOn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecommendations() {
      try {
        const res = await fetch('/api/jobs/recommendations');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (cancelled) return;
        setJobs((data.jobs || []).slice(0, 6));
        setBasedOn(data.basedOn || null);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRecommendations();
    return () => { cancelled = true; };
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="mb-6">
        <div className="mb-3">
          <h2 className="text-[15px] font-semibold text-neutral-90">Recommended Jobs</h2>
          <p className="text-[12px] text-neutral-40 mt-0.5">Finding jobs for you...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  // Empty or error state
  if (error || jobs.length === 0) {
    return (
      <section className="mb-6">
        <div className="mb-3">
          <h2 className="text-[15px] font-semibold text-neutral-90">Recommended Jobs</h2>
        </div>
        <div className="bg-white rounded-xl border border-neutral-20 shadow-sm px-5 py-8 text-center">
          <div className="w-10 h-10 bg-neutral-10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-neutral-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <p className="text-[13px] text-neutral-50">
            Paste a job link to get personalized recommendations
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-90">Jobs you might want to apply to</h2>
          <p className="text-[12px] text-neutral-40 mt-0.5">
            Based on your recent applications{basedOn ? ` for "${basedOn}"` : ''}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 hover:shadow-md hover:border-neutral-30 transition-all flex flex-col"
          >
            {/* Title & Company */}
            <div className="min-w-0 mb-2.5">
              <p className="font-semibold text-[13px] text-neutral-90 truncate leading-snug" title={job.title}>
                {job.title}
              </p>
              <p className="text-[12px] text-neutral-50 truncate mt-0.5" title={job.company}>
                {job.company}
              </p>
            </div>

            {/* Badges: Location + Salary */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-50 bg-neutral-10 px-2 py-0.5 rounded-full truncate max-w-full">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="truncate">{job.location}</span>
              </span>
              {job.salary && (
                <span className="inline-flex items-center text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full truncate max-w-full">
                  {job.salary}
                </span>
              )}
            </div>

            {/* Match score + posted */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-semibold ${matchScoreTextColor(job.matchScore)}`}>
                  {job.matchScore}% match
                </span>
                <span className="text-[11px] text-neutral-40">
                  {formatPostedDate(job.postedAt)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-10 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${matchScoreColor(job.matchScore)}`}
                  style={{ width: `${job.matchScore}%` }}
                />
              </div>

              {/* CTA */}
              <Link
                href={`/job-preview?url=${encodeURIComponent(job.url)}`}
                className="block w-full text-center text-[12px] font-medium text-white bg-primary hover:bg-primary/90 rounded-lg py-1.5 transition-colors"
              >
                Apply with your resume
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
