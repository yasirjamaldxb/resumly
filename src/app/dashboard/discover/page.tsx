'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ScannedJob {
  title: string;
  location?: string;
  department?: string;
  url: string;
  matchScore: number;
  matchReasons: string[];
}

interface ScanResult {
  company: string;
  totalJobs: number;
  jobs: ScannedJob[];
}

interface ProcessingJob extends ScannedJob {
  status: 'pending' | 'processing' | 'done' | 'error';
}

type ViewState = 'input' | 'results' | 'processing' | 'complete';

export default function DiscoverPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set());
  const [filterQuery, setFilterQuery] = useState('');
  const [viewState, setViewState] = useState<ViewState>('input');
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [scanError, setScanError] = useState('');

  const filteredJobs = useMemo(() => {
    if (!scanResult) return [];
    if (!filterQuery.trim()) return scanResult.jobs;
    const q = filterQuery.toLowerCase();
    return scanResult.jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.department?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
    );
  }, [scanResult, filterQuery]);

  const allFilteredSelected = filteredJobs.length > 0 && filteredJobs.every((_, i) => {
    const originalIndex = scanResult!.jobs.indexOf(filteredJobs[i]);
    return selectedJobs.has(originalIndex);
  });

  async function handleScan() {
    if (!url.trim()) return;
    setScanning(true);
    setScanError('');
    try {
      const res = await fetch('/api/jobs/scan-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Scan failed' }));
        throw new Error(err.error || 'Scan failed');
      }
      const data: ScanResult = await res.json();
      setScanResult(data);
      setSelectedJobs(new Set());
      setViewState('results');
    } catch (e: unknown) {
      setScanError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setScanning(false);
    }
  }

  function toggleJob(index: number) {
    setSelectedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleAllFiltered() {
    if (allFilteredSelected) {
      setSelectedJobs((prev) => {
        const next = new Set(prev);
        filteredJobs.forEach((_, i) => {
          const originalIndex = scanResult!.jobs.indexOf(filteredJobs[i]);
          next.delete(originalIndex);
        });
        return next;
      });
    } else {
      setSelectedJobs((prev) => {
        const next = new Set(prev);
        filteredJobs.forEach((_, i) => {
          const originalIndex = scanResult!.jobs.indexOf(filteredJobs[i]);
          next.add(originalIndex);
        });
        return next;
      });
    }
  }

  async function handleBatchApply() {
    if (!scanResult || selectedJobs.size === 0) return;

    const jobs: ProcessingJob[] = Array.from(selectedJobs).map((idx) => ({
      ...scanResult.jobs[idx],
      status: 'pending' as const,
    }));
    setProcessingJobs(jobs);
    setProcessedCount(0);
    setViewState('processing');

    for (let i = 0; i < jobs.length; i++) {
      setProcessingJobs((prev) =>
        prev.map((j, idx) => (idx === i ? { ...j, status: 'processing' } : j))
      );

      try {
        // Parse the job
        const parseRes = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobs[i].url }),
        });
        if (!parseRes.ok) throw new Error('Parse failed');
        const parsed = await parseRes.json();

        // Save the job
        const saveRes = await fetch('/api/jobs/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });
        if (!saveRes.ok) throw new Error('Save failed');

        setProcessingJobs((prev) =>
          prev.map((j, idx) => (idx === i ? { ...j, status: 'done' } : j))
        );
      } catch {
        setProcessingJobs((prev) =>
          prev.map((j, idx) => (idx === i ? { ...j, status: 'error' } : j))
        );
      }

      setProcessedCount(i + 1);
    }

    setViewState('complete');
  }

  function getScoreColor(score: number) {
    if (score >= 70) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 40) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-500 border-red-200 bg-red-50';
  }

  function getScoreRingColor(score: number) {
    if (score >= 70) return 'stroke-green-500';
    if (score >= 40) return 'stroke-yellow-500';
    return 'stroke-red-400';
  }

  return (
    <>
      <div className="mb-5">
        <h1 className="text-[18px] sm:text-[20px] font-semibold text-neutral-90 tracking-tight">
          Discover Jobs
        </h1>
        <p className="text-neutral-50 text-[13px] mt-0.5">
          Scan company career pages and batch-save jobs
        </p>
      </div>

      {/* Section 1: Scanner Input */}
      {(viewState === 'input' || viewState === 'results') && (
        <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5 sm:p-6 mb-5">
          <label htmlFor="company-url" className="block text-[14px] font-semibold text-neutral-90 mb-2">
            Paste a company careers page URL
          </label>
          <div className="flex gap-3">
            <input
              id="company-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="https://boards.greenhouse.io/stripe"
              className="flex-1 px-4 py-2.5 border border-neutral-20 rounded-lg text-[14px] text-neutral-90 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Button onClick={handleScan} loading={scanning} disabled={!url.trim()}>
              {scanning ? 'Scanning...' : 'Scan'}
            </Button>
          </div>
          <p className="text-[12px] text-neutral-40 mt-2">
            Try: greenhouse.io/stripe, jobs.lever.co/openai
          </p>
          {scanError && (
            <p className="text-[13px] text-red-600 mt-2">{scanError}</p>
          )}
          {scanning && (
            <div className="flex items-center gap-2 mt-4 text-[13px] text-primary">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Scanning for open positions...
            </div>
          )}
        </div>
      )}

      {/* Section 2: Results Grid */}
      {viewState === 'results' && scanResult && (
        <>
          <div className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-semibold text-neutral-90">
                    {scanResult.company} &mdash; {scanResult.totalJobs} open positions
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filter by keyword..."
                    className="px-3 py-1.5 border border-neutral-20 rounded-lg text-[13px] text-neutral-90 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-[200px]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <label className="flex items-center gap-2 text-[13px] text-neutral-60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAllFiltered}
                    className="w-4 h-4 rounded border-neutral-30 text-primary focus:ring-primary cursor-pointer"
                  />
                  Select all matching ({filteredJobs.length})
                </label>
              </div>
            </div>

            {/* Job Cards Grid */}
            <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job, i) => {
                const originalIndex = scanResult.jobs.indexOf(job);
                const selected = selectedJobs.has(originalIndex);
                const circumference = 2 * Math.PI * 16;
                const offset = circumference - (job.matchScore / 100) * circumference;

                return (
                  <div
                    key={originalIndex}
                    onClick={() => toggleJob(originalIndex)}
                    className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                      selected
                        ? 'border-primary bg-primary/[0.03] ring-1 ring-primary/20'
                        : 'border-neutral-20 hover:border-neutral-30 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleJob(originalIndex)}
                        className="mt-0.5 w-4 h-4 rounded border-neutral-30 text-primary focus:ring-primary cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[14px] text-neutral-90 truncate">
                          {job.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.location && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-10 text-neutral-60">
                              {job.location}
                            </span>
                          )}
                          {job.department && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600">
                              {job.department}
                            </span>
                          )}
                        </div>
                        {job.matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.matchReasons.map((reason, ri) => (
                              <span
                                key={ri}
                                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/8 text-primary"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Match Score Circle */}
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getScoreColor(job.matchScore)}`}>
                        <svg className="w-10 h-10 -rotate-90 absolute" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-10" />
                          <circle
                            cx="18" cy="18" r="16" fill="none" strokeWidth="2.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className={getScoreRingColor(job.matchScore)}
                          />
                        </svg>
                        <span className="text-[11px] font-bold relative">{job.matchScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-10 text-neutral-40 text-[13px]">
                No jobs match your filter.
              </div>
            )}
          </div>

          {/* Sticky bottom bar */}
          {selectedJobs.size > 0 && (
            <div className="fixed bottom-0 left-0 right-0 lg:left-[240px] bg-white border-t border-neutral-20 shadow-lg z-40">
              <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <p className="text-[14px] font-medium text-neutral-90">
                  {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
                </p>
                <Button onClick={handleBatchApply}>
                  Apply to selected
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Section 3: Batch Processing */}
      {(viewState === 'processing' || viewState === 'complete') && (
        <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5 sm:p-6">
          {viewState === 'processing' && (
            <div className="mb-4">
              <h2 className="text-[16px] font-semibold text-neutral-90 mb-1">
                Processing jobs...
              </h2>
              <p className="text-[13px] text-neutral-50">
                Processing {processedCount} of {processingJobs.length}...
              </p>
              <div className="w-full bg-neutral-10 rounded-full h-2 mt-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(processedCount / processingJobs.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {viewState === 'complete' && (
            <div className="mb-4 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[16px] font-semibold text-neutral-90 mb-1">
                All {processingJobs.length} jobs saved!
              </h2>
              <p className="text-[13px] text-neutral-50 mb-4">
                Go to your dashboard to start optimizing resumes.
              </p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}

          <div className="space-y-2 mt-4">
            {processingJobs.map((job, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-20 bg-neutral-5/50"
              >
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {job.status === 'done' && (
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {job.status === 'processing' && (
                    <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {job.status === 'error' && (
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {job.status === 'pending' && (
                    <div className="w-3 h-3 rounded-full border-2 border-neutral-20" />
                  )}
                </div>
                <span className="text-[13px] text-neutral-80 font-medium truncate flex-1">{job.title}</span>
                {job.status === 'done' && <span className="text-[11px] text-green-600 font-medium">Saved</span>}
                {job.status === 'error' && <span className="text-[11px] text-red-500 font-medium">Failed</span>}
              </div>
            ))}
          </div>

          {viewState === 'complete' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setViewState('input');
                  setScanResult(null);
                  setSelectedJobs(new Set());
                  setUrl('');
                }}
                className="text-[13px] text-primary hover:underline font-medium"
              >
                Scan another company
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
