'use client';

import { ResumeData, WorkExperience } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { generateId, cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const emptyJob = (): WorkExperience => ({
  id: generateId(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  bullets: [''],
});

function DragHandle({ isDragging }: { isDragging?: boolean }) {
  return (
    <div className={cn("flex-shrink-0 text-neutral-30 hover:text-neutral-50 transition-colors p-1", isDragging ? 'cursor-grabbing' : 'cursor-grab')}>
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        <circle cx="2" cy="2" r="1.5" />
        <circle cx="8" cy="2" r="1.5" />
        <circle cx="2" cy="8" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="2" cy="14" r="1.5" />
        <circle cx="8" cy="14" r="1.5" />
      </svg>
    </div>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={cn(
        'w-5 h-5 text-neutral-40 transition-transform duration-200',
        expanded && 'rotate-180'
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export function WorkExperienceForm({ data, onChange }: Props) {
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Track expanded entries by id. Initialize: first entry expanded if it exists.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (data.workExperience.length > 0) {
      initial.add(data.workExperience[0].id);
    }
    return initial;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addJob = () => {
    const newJob = emptyJob();
    onChange({ ...data, workExperience: [...data.workExperience, newJob] });
    // Auto-expand the newly added entry
    setExpandedIds((prev) => new Set(prev).add(newJob.id));
    // Scroll to bottom after render so the new entry + "Add more" button is visible
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };

  const removeJob = (id: string) => {
    onChange({ ...data, workExperience: data.workExperience.filter((j) => j.id !== id) });
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateJob = (id: string, field: keyof WorkExperience, value: unknown) => {
    onChange({
      ...data,
      workExperience: data.workExperience.map((j) =>
        j.id === id ? { ...j, [field]: value } : j
      ),
    });
  };

  const addBullet = (jobId: string) => {
    const job = data.workExperience.find((j) => j.id === jobId);
    if (!job) return;
    updateJob(jobId, 'bullets', [...job.bullets, '']);
  };

  const updateBullet = (jobId: string, idx: number, value: string) => {
    const job = data.workExperience.find((j) => j.id === jobId);
    if (!job) return;
    const bullets = [...job.bullets];
    bullets[idx] = value;
    updateJob(jobId, 'bullets', bullets);
  };

  const removeBullet = (jobId: string, idx: number) => {
    const job = data.workExperience.find((j) => j.id === jobId);
    if (!job) return;
    updateJob(jobId, 'bullets', job.bullets.filter((_: string, i: number) => i !== idx));
  };

  const generateBullets = async (job: WorkExperience) => {
    if (!job.position || !job.company) return;
    setAiLoading(job.id);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bullets', position: job.position, company: job.company, description: job.description }),
      });
      const json = await res.json();
      if (json.bullets) {
        updateJob(job.id, 'bullets', json.bullets);
      } else {
        setAiError('AI is unavailable. Try again later.');
        setTimeout(() => setAiError(null), 4000);
      }
    } catch {
      setAiError('AI is unavailable. Try again later.');
      setTimeout(() => setAiError(null), 4000);
    } finally {
      setAiLoading(null);
    }
  };

  const getHeaderLabel = (job: WorkExperience, index: number): string => {
    if (job.position && job.company) return `${job.position} at ${job.company}`;
    if (job.position) return job.position;
    if (job.company) return job.company;
    return '(Not specified)';
  };

  const getDateLabel = (job: WorkExperience): string => {
    if (!job.startDate) return '';
    const formatMonth = (d: string) => {
      if (!d) return '';
      const [year, month] = d.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(month, 10) - 1]} ${year}`;
    };
    const start = formatMonth(job.startDate);
    const end = job.current ? 'Present' : formatMonth(job.endDate);
    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-90 mb-1">Work Experience</h2>
        <p className="text-sm text-neutral-50">
          Show your relevant experience (last 10 years). Use bullet points to note your achievements,
          if possible - use numbers/facts (Achieved X, measured by Y, by doing Z).
        </p>
      </div>

      {/* AI error banner */}
      {aiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {aiError}
        </div>
      )}

      {/* Empty state */}
      {data.workExperience.length === 0 && (
        <div className="text-center py-12 bg-neutral-10/50 rounded-xl border-2 border-dashed border-neutral-20">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-10 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-neutral-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-neutral-60 text-sm font-medium mb-1">No work experience added yet</p>
          <p className="text-xs text-neutral-40 mb-4 max-w-xs mx-auto">
            Adding relevant work experience greatly improves your resume&apos;s impact with recruiters.
          </p>
          <button
            onClick={addJob}
            className="text-sm text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            + Add employment
          </button>
        </div>
      )}

      {/* Job entries */}
      {data.workExperience.map((job, index) => {
        const isExpanded = expandedIds.has(job.id);
        const headerLabel = getHeaderLabel(job, index);
        const dateLabel = getDateLabel(job);

        return (
          <div
            key={job.id}
            draggable
            onDragStart={(e) => {
              setDraggedId(job.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (!draggedId || draggedId === job.id) return;
              const items = [...data.workExperience];
              const fromIdx = items.findIndex(i => i.id === draggedId);
              const toIdx = items.findIndex(i => i.id === job.id);
              const [moved] = items.splice(fromIdx, 1);
              items.splice(toIdx, 0, moved);
              onChange({ ...data, workExperience: items });
              setDraggedId(null);
            }}
            onDragEnd={() => setDraggedId(null)}
            className={cn(
              'border border-neutral-20 rounded-xl bg-white overflow-hidden shadow-sm',
              draggedId === job.id && 'opacity-50'
            )}
          >
            {/* Collapsible header */}
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-3 cursor-pointer select-none hover:bg-neutral-10/50 transition-colors',
                isExpanded && 'border-b border-neutral-20'
              )}
              onClick={() => toggleExpand(job.id)}
            >
              <DragHandle isDragging={draggedId === job.id} />

              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-semibold truncate',
                  headerLabel === '(Not specified)' ? 'text-neutral-40 italic' : 'text-neutral-80'
                )}>
                  {headerLabel}
                </p>
                {dateLabel && (
                  <p className="text-xs text-neutral-40 mt-0.5">{dateLabel}</p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeJob(job.id);
                }}
                className="text-neutral-30 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                aria-label="Remove employment"
              >
                <TrashIcon />
              </button>

              <ChevronIcon expanded={isExpanded} />
            </div>

            {/* Expandable body */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Job Title"
                    placeholder="e.g. Product Designer"
                    value={job.position}
                    onChange={(e) => updateJob(job.id, 'position', e.target.value)}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <Input
                    label="Employer"
                    placeholder="e.g. Amazon"
                    value={job.company}
                    onChange={(e) => updateJob(job.id, 'company', e.target.value)}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <Input
                  label="Location"
                  placeholder="e.g. New York, NY"
                  value={job.location}
                  onChange={(e) => updateJob(job.id, 'location', e.target.value)}
                  className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    type="month"
                    value={job.startDate}
                    onChange={(e) => updateJob(job.id, 'startDate', e.target.value)}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <div className="flex flex-col gap-1.5">
                    {!job.current && (
                      <Input
                        label="End Date"
                        type="month"
                        value={job.endDate}
                        onChange={(e) => updateJob(job.id, 'endDate', e.target.value)}
                        className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    )}
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={job.current}
                        onChange={(e) => updateJob(job.id, 'current', e.target.checked)}
                        className="rounded border-neutral-30 text-primary"
                      />
                      <span className="text-sm text-neutral-70">Currently working here</span>
                    </label>
                  </div>
                </div>

                {/* Bullets / Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-70">Description</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateBullets(job)}
                      loading={aiLoading === job.id}
                      disabled={!job.position}
                      className="gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Suggest
                    </Button>
                  </div>

                  {job.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-neutral-40 mt-2 flex-shrink-0 text-sm">•</span>
                      <input
                        className="flex-1 text-sm bg-[#f3f4f6] border-0 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        placeholder="e.g. Created and implemented lesson plans based on child-led interests"
                        value={bullet}
                        onChange={(e) => updateBullet(job.id, idx, e.target.value)}
                      />
                      <button
                        onClick={() => removeBullet(job.id, idx)}
                        className="text-neutral-30 hover:text-red-400 transition-colors flex-shrink-0 mt-1.5"
                        aria-label="Remove bullet"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addBullet(job.id)}
                    className="text-sm text-primary hover:text-primary-dark font-medium mt-1"
                  >
                    + Add bullet point
                  </button>

                  {/* Rich text description */}
                  <div className="pt-3">
                    <RichTextEditor
                      value={job.description}
                      onChange={(html) => updateJob(job.id, 'description', html)}
                      placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
                      charTarget={200}
                      charLabel="Recruiter tip: write 200+ characters to increase interview chances"
                      showPrewrittenPhrases={true}
                      phraseCategory="experience"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add more button */}
      {data.workExperience.length > 0 && (
        <button
          onClick={addJob}
          className="w-full text-sm text-primary hover:text-primary-dark font-semibold py-3 transition-colors"
        >
          + Add one more employment
        </button>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
