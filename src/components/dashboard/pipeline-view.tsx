'use client';

import { useState, useCallback, type DragEvent } from 'react';
import Link from 'next/link';

const PIPELINE_COLUMNS = ['draft', 'ready', 'applied', 'interviewing', 'offered'] as const;
type PipelineStatus = (typeof PIPELINE_COLUMNS)[number];

const COLUMN_CONFIG: Record<
  string,
  { label: string; headerBg: string; headerText: string; dot: string }
> = {
  draft: { label: 'Draft', headerBg: 'bg-neutral-100', headerText: 'text-white', dot: 'bg-neutral-40' },
  ready: { label: 'Ready', headerBg: 'bg-blue-500', headerText: 'text-white', dot: 'bg-blue-500' },
  applied: { label: 'Applied', headerBg: 'bg-green-500', headerText: 'text-white', dot: 'bg-green-500' },
  interviewing: { label: 'Interviewing', headerBg: 'bg-purple-500', headerText: 'text-white', dot: 'bg-purple-500' },
  offered: { label: 'Offered', headerBg: 'bg-emerald-500', headerText: 'text-white', dot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', headerBg: 'bg-red-400', headerText: 'text-white', dot: 'bg-red-400' },
  withdrawn: { label: 'Withdrawn', headerBg: 'bg-neutral-300', headerText: 'text-white', dot: 'bg-neutral-30' },
};

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

interface PipelineViewProps {
  applications: Application[];
}

export function PipelineView({ applications: initialApps }: PipelineViewProps) {
  const [apps, setApps] = useState(initialApps);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState({ rejected: true, withdrawn: true });

  const appsByStatus = useCallback(
    (status: string) => apps.filter((a) => a.status === status),
    [apps]
  );

  function handleDragStart(e: DragEvent<HTMLDivElement>, appId: string) {
    setDraggedId(appId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', appId);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>, column: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  async function handleDrop(e: DragEvent<HTMLDivElement>, newStatus: string) {
    e.preventDefault();
    setDragOverColumn(null);
    const appId = e.dataTransfer.getData('text/plain');
    if (!appId) return;

    // Optimistically update
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    setDraggedId(null);

    // Persist to server
    try {
      await fetch('/api/applications/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
    } catch {
      // Revert on failure
      setApps(initialApps);
    }
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverColumn(null);
  }

  const rejectedApps = appsByStatus('rejected');
  const withdrawnApps = appsByStatus('withdrawn');

  return (
    <div>
      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {PIPELINE_COLUMNS.map((status) => {
          const columnApps = appsByStatus(status);
          const config = COLUMN_CONFIG[status];
          const isOver = dragOverColumn === status;

          return (
            <div
              key={status}
              className={`flex-shrink-0 w-[260px] rounded-xl border transition-colors ${
                isOver ? 'border-primary bg-primary/[0.03]' : 'border-neutral-20 bg-[#fafbfc]'
              }`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className={`px-3 py-2 rounded-t-xl ${config.headerBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[13px] font-semibold ${config.headerText}`}>
                    {config.label}
                  </span>
                  <span className={`text-[11px] font-bold ${config.headerText} opacity-80 bg-white/20 px-1.5 py-0.5 rounded-full`}>
                    {columnApps.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[100px]">
                {columnApps.length === 0 && (
                  <div className="text-center py-6 text-neutral-30 text-[12px]">
                    Drop here
                  </div>
                )}
                {columnApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg border border-neutral-20 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-shadow ${
                      draggedId === app.id ? 'opacity-40' : ''
                    }`}
                  >
                    <p className="text-[13px] font-medium text-neutral-90 truncate">
                      {app.job?.title || 'Untitled'}
                    </p>
                    <p className="text-[11px] text-neutral-50 truncate mt-0.5">
                      {app.job?.company || 'Unknown company'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-neutral-40">
                        {new Date(app.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {app.resume && (
                        <Link
                          href={`/dashboard/resume/${app.resume.id}`}
                          className="text-[11px] text-primary hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Resume
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsed sections: Rejected / Withdrawn */}
      {(rejectedApps.length > 0 || withdrawnApps.length > 0) && (
        <div className="mt-5 space-y-3">
          {rejectedApps.length > 0 && (
            <div className="bg-white rounded-xl border border-neutral-20 overflow-hidden">
              <button
                onClick={() =>
                  setCollapsedSections((prev) => ({ ...prev, rejected: !prev.rejected }))
                }
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-[13px] font-medium text-neutral-70">
                    Rejected ({rejectedApps.length})
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-neutral-40 transition-transform ${
                    collapsedSections.rejected ? '' : 'rotate-180'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {!collapsedSections.rejected && (
                <div className="px-4 pb-3 space-y-2">
                  {rejectedApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between py-1.5 border-t border-neutral-20/60">
                      <div className="min-w-0">
                        <p className="text-[13px] text-neutral-60 truncate">{app.job?.title || 'Untitled'}</p>
                        <p className="text-[11px] text-neutral-40 truncate">{app.job?.company}</p>
                      </div>
                      <span className="text-[11px] text-neutral-40 shrink-0 ml-3">
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {withdrawnApps.length > 0 && (
            <div className="bg-white rounded-xl border border-neutral-20 overflow-hidden">
              <button
                onClick={() =>
                  setCollapsedSections((prev) => ({ ...prev, withdrawn: !prev.withdrawn }))
                }
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-30" />
                  <span className="text-[13px] font-medium text-neutral-70">
                    Withdrawn ({withdrawnApps.length})
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-neutral-40 transition-transform ${
                    collapsedSections.withdrawn ? '' : 'rotate-180'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {!collapsedSections.withdrawn && (
                <div className="px-4 pb-3 space-y-2">
                  {withdrawnApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between py-1.5 border-t border-neutral-20/60">
                      <div className="min-w-0">
                        <p className="text-[13px] text-neutral-60 truncate">{app.job?.title || 'Untitled'}</p>
                        <p className="text-[11px] text-neutral-40 truncate">{app.job?.company}</p>
                      </div>
                      <span className="text-[11px] text-neutral-40 shrink-0 ml-3">
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
