'use client';

import { useState, useRef } from 'react';
import { ResumeData, Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateId, cn } from '@/lib/utils';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const emptyEdu = (): Education => ({
  id: generateId(),
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  gpa: '',
});

export function EducationForm({ data, onChange }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (data.education.length > 0) {
      initial.add(data.education[0].id);
    }
    return initial;
  });

  const toggleExpanded = (id: string) => {
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

  const addEdu = () => {
    const newEdu = emptyEdu();
    onChange({ ...data, education: [...data.education, newEdu] });
    // Collapse all previous entries, only expand the new one
    setExpandedIds(new Set([newEdu.id]));
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 200);
  };

  const removeEdu = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateEdu = (id: string, field: keyof Education, value: unknown) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const getEntryTitle = (edu: Education) => {
    if (edu.degree && edu.institution) return `${edu.degree} at ${edu.institution}`;
    if (edu.degree) return edu.degree;
    if (edu.institution) return edu.institution;
    return '(Not specified)';
  };

  const getEntrySubtitle = (edu: Education) => {
    const parts: string[] = [];
    if (edu.field) parts.push(edu.field);
    if (edu.startDate) {
      const end = edu.current ? 'Present' : edu.endDate || '';
      parts.push(`${edu.startDate}${end ? ` — ${end}` : ''}`);
    }
    return parts.join(' · ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-90 mb-1">Education</h2>
        <p className="text-sm text-neutral-50">
          A varied education on your resume sums up the value that your learnings and background will bring to job.
        </p>
      </div>

      {data.education.length === 0 && (
        <div className="text-center py-12 bg-neutral-10 rounded-xl border-2 border-dashed border-neutral-20">
          <div className="mb-3">
            <svg className="w-10 h-10 mx-auto text-neutral-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422A12.083 12.083 0 0121 12.75c0 3.314-4.03 6-9 6s-9-2.686-9-6c0-.84.28-1.636.84-2.328L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 9.5v5" />
            </svg>
          </div>
          <p className="text-neutral-60 text-sm font-medium mb-1">No education added yet</p>
          <p className="text-xs text-neutral-40 mb-4">Add your degrees, certifications, or relevant coursework.</p>
          <Button variant="outline" size="sm" onClick={addEdu}>+ Add Education</Button>
        </div>
      )}

      {data.education.map((edu) => {
        const isExpanded = expandedIds.has(edu.id);
        return (
          <div
            key={edu.id}
            draggable
            onDragStart={(e) => {
              setDraggedId(edu.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (!draggedId || draggedId === edu.id) return;
              const items = [...data.education];
              const fromIdx = items.findIndex(i => i.id === draggedId);
              const toIdx = items.findIndex(i => i.id === edu.id);
              const [moved] = items.splice(fromIdx, 1);
              items.splice(toIdx, 0, moved);
              onChange({ ...data, education: items });
              setDraggedId(null);
            }}
            onDragEnd={() => setDraggedId(null)}
            className={cn(
              'border border-neutral-20 rounded-xl bg-white overflow-hidden',
              draggedId === edu.id && 'opacity-50'
            )}
          >
            {/* Collapsible header */}
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-neutral-5 transition-colors',
                isExpanded && 'border-b border-neutral-20'
              )}
              onClick={() => toggleExpanded(edu.id)}
            >
              {/* Drag handle */}
              <span className={cn("text-neutral-30 flex-shrink-0", draggedId === edu.id ? 'cursor-grabbing' : 'cursor-grab')} aria-hidden="true">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5" />
                  <circle cx="15" cy="6" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="18" r="1.5" />
                  <circle cx="15" cy="18" r="1.5" />
                </svg>
              </span>

              {/* Title + subtitle */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-80 text-sm truncate">
                  {getEntryTitle(edu)}
                </h3>
                {getEntrySubtitle(edu) && (
                  <p className="text-xs text-neutral-40 truncate mt-0.5">{getEntrySubtitle(edu)}</p>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); removeEdu(edu.id); }}
                className="text-neutral-30 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                aria-label="Remove education"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              {/* Chevron */}
              <svg
                className={cn(
                  'w-4 h-4 text-neutral-40 flex-shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Collapsible body */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                <Input
                  label="School / University"
                  placeholder="MIT"
                  value={edu.institution}
                  onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)}
                  className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Degree"
                    placeholder="Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <Input
                    label="Field of Study"
                    placeholder="Computer Science"
                    value={edu.field}
                    onChange={(e) => updateEdu(edu.id, 'field', e.target.value)}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <Input
                  label="Location"
                  placeholder="Cambridge, MA"
                  value={edu.location}
                  onChange={(e) => updateEdu(edu.id, 'location', e.target.value)}
                  className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <div className="flex flex-col gap-1.5">
                    {!edu.current && (
                      <Input
                        label="End Date"
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)}
                        className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    )}
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEdu(edu.id, 'current', e.target.checked)}
                        className="rounded border-neutral-30 text-primary"
                      />
                      <span className="text-sm text-neutral-70">Currently enrolled</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="GPA (optional)"
                  placeholder="3.8 / 4.0"
                  value={edu.gpa}
                  onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)}
                  hint="Include if 3.5 or higher"
                  className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            )}
          </div>
        );
      })}

      {data.education.length > 0 && (
        <button
          onClick={addEdu}
          className="w-full text-center text-sm text-primary hover:text-primary-dark font-medium py-3 transition-colors"
        >
          + Add one more education
        </button>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
