'use client';

import { useState, useCallback } from 'react';
import { ResumeData, CustomSection } from '@/types/resume';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, generateId } from '@/lib/utils';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

type SectionType = 'custom' | 'hobbies' | 'references' | 'languages' | 'extracurricular' | 'training';

interface SectionOption {
  type: SectionType;
  label: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
}

const SECTION_OPTIONS: SectionOption[] = [
  {
    type: 'custom',
    label: 'Custom Section',
    description: 'Add any custom section',
    badge: 'Free',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    type: 'hobbies',
    label: 'Hobbies',
    description: 'Interests & hobbies',
    badge: 'Free',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    type: 'references',
    label: 'References',
    description: 'Professional references',
    badge: 'Free',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
  },
  {
    type: 'languages',
    label: 'Languages',
    description: 'Go to Skills & More',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    type: 'extracurricular',
    label: 'Extracurricular Activities',
    description: 'Shows as custom section',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-3.77 1.522m3.77-1.522a6.023 6.023 0 01-3.77 1.522m0 0a6.023 6.023 0 01-3.77-1.522" />
      </svg>
    ),
  },
  {
    type: 'training',
    label: 'Professional Training',
    description: 'Shows as custom section',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v-3.75m0 0h10.5m-10.5 0L12 8.25l5.25 3m-10.5 0v3.75m10.5-3.75v3.75" />
      </svg>
    ),
  },
];

export function AdditionalSections({ data, onChange }: Props) {
  const [activeSections, setActiveSections] = useState<Set<SectionType>>(() => {
    const active = new Set<SectionType>();
    if (data.hobbies) active.add('hobbies');
    if (data.references && data.references.length > 0) active.add('references');
    if (data.customSections && data.customSections.length > 0) active.add('custom');
    return active;
  });
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionType>>(new Set());
  const [languageNote, setLanguageNote] = useState(false);

  const toggleSection = useCallback((type: SectionType) => {
    if (type === 'languages') {
      setLanguageNote((prev) => !prev);
      return;
    }

    setActiveSections((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
        // Clear data when deactivating
        if (type === 'hobbies') {
          onChange({ ...data, hobbies: '' });
        } else if (type === 'references') {
          onChange({ ...data, references: [] });
        }
        // For custom/extracurricular/training we don't auto-clear
      } else {
        next.add(type);
        // Initialize data when activating
        if (type === 'references' && (!data.references || data.references.length === 0)) {
          onChange({
            ...data,
            references: [{ id: generateId(), name: '', company: '', phone: '', email: '' }],
          });
        }
        if ((type === 'custom' || type === 'extracurricular' || type === 'training') && (!data.customSections || data.customSections.length === 0)) {
          const title =
            type === 'extracurricular'
              ? 'Extracurricular Activities'
              : type === 'training'
              ? 'Professional Training'
              : 'Custom Section';
          onChange({
            ...data,
            customSections: [
              {
                id: generateId(),
                title,
                items: [{ id: generateId(), title: '', subtitle: '', startDate: '', endDate: '', description: '' }],
              },
            ],
          });
        }
      }
      return next;
    });
  }, [data, onChange]);

  const toggleCollapse = useCallback((type: SectionType) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  // --- Hobbies ---
  const renderHobbies = () => (
    <div className="mt-4 rounded-xl border border-neutral-20 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => toggleCollapse('hobbies')}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-10/50 transition-colors"
      >
        <span className="text-[14px] font-semibold text-neutral-80">Hobbies</span>
        <svg
          className={cn('w-4 h-4 text-neutral-40 transition-transform', collapsedSections.has('hobbies') && '-rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {!collapsedSections.has('hobbies') && (
        <div className="px-4 pb-4 border-t border-neutral-20">
          <Textarea
            label="Your hobbies & interests"
            placeholder="e.g., Photography, Hiking, Reading, Chess, Volunteering..."
            value={data.hobbies || ''}
            onChange={(e) => onChange({ ...data, hobbies: e.target.value })}
            className="mt-3"
          />
        </div>
      )}
    </div>
  );

  // --- References ---
  const renderReferences = () => {
    const refs = data.references || [];
    return (
      <div className="mt-4 rounded-xl border border-neutral-20 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => toggleCollapse('references')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-10/50 transition-colors"
        >
          <span className="text-[14px] font-semibold text-neutral-80">References</span>
          <svg
            className={cn('w-4 h-4 text-neutral-40 transition-transform', collapsedSections.has('references') && '-rotate-180')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {!collapsedSections.has('references') && (
          <div className="px-4 pb-4 border-t border-neutral-20 space-y-4">
            {refs.map((ref, idx) => (
              <div key={ref.id} className="mt-3 space-y-3">
                {refs.length > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-neutral-60">Reference {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = refs.filter((r) => r.id !== ref.id);
                        onChange({ ...data, references: updated });
                      }}
                      className="text-[12px] text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Name"
                    placeholder="Full name"
                    value={ref.name}
                    onChange={(e) => {
                      const updated = [...refs];
                      updated[idx] = { ...ref, name: e.target.value };
                      onChange({ ...data, references: updated });
                    }}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <Input
                    label="Company"
                    placeholder="Company name"
                    value={ref.company}
                    onChange={(e) => {
                      const updated = [...refs];
                      updated[idx] = { ...ref, company: e.target.value };
                      onChange({ ...data, references: updated });
                    }}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <Input
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    value={ref.phone}
                    onChange={(e) => {
                      const updated = [...refs];
                      updated[idx] = { ...ref, phone: e.target.value };
                      onChange({ ...data, references: updated });
                    }}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={ref.email}
                    onChange={(e) => {
                      const updated = [...refs];
                      updated[idx] = { ...ref, email: e.target.value };
                      onChange({ ...data, references: updated });
                    }}
                    className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onChange({
                  ...data,
                  references: [...refs, { id: generateId(), name: '', company: '', phone: '', email: '' }],
                });
              }}
              className="w-full mt-2 gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Reference
            </Button>
          </div>
        )}
      </div>
    );
  };

  // --- Custom Sections (also used for extracurricular/training) ---
  const renderCustomSections = () => {
    const sections = data.customSections || [];
    return (
      <div className="mt-4 space-y-4">
        {sections.map((section, sIdx) => (
          <div key={section.id} className="rounded-xl border border-neutral-20 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCollapse('custom')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-10/50 transition-colors"
            >
              <span className="text-[14px] font-semibold text-neutral-80">{section.title || 'Custom Section'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = sections.filter((s) => s.id !== section.id);
                    onChange({ ...data, customSections: updated });
                    if (updated.length === 0) {
                      setActiveSections((prev) => {
                        const next = new Set(prev);
                        next.delete('custom');
                        next.delete('extracurricular');
                        next.delete('training');
                        return next;
                      });
                    }
                  }}
                  className="text-[12px] text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
                <svg
                  className={cn('w-4 h-4 text-neutral-40 transition-transform', collapsedSections.has('custom') && '-rotate-180')}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {!collapsedSections.has('custom') && (
              <div className="px-4 pb-4 border-t border-neutral-20 space-y-4">
                <Input
                  label="Section Title"
                  placeholder="e.g., Volunteer Work, Awards, Publications..."
                  value={section.title}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[sIdx] = { ...section, title: e.target.value };
                    onChange({ ...data, customSections: updated });
                  }}
                  className="mt-3"
                />
                {section.items.map((item, iIdx) => (
                  <div key={item.id} className="space-y-3 pt-3 border-t border-neutral-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-neutral-60">Item {iIdx + 1}</span>
                      {section.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedItems = section.items.filter((it) => it.id !== item.id);
                            const updated = [...sections];
                            updated[sIdx] = { ...section, items: updatedItems };
                            onChange({ ...data, customSections: updated });
                          }}
                          className="text-[12px] text-red-500 hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Title"
                        placeholder="Item title"
                        value={item.title}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[iIdx] = { ...item, title: e.target.value };
                          const updated = [...sections];
                          updated[sIdx] = { ...section, items: updatedItems };
                          onChange({ ...data, customSections: updated });
                        }}
                      />
                      <Input
                        label="Subtitle"
                        placeholder="Organization, etc."
                        value={item.subtitle || ''}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[iIdx] = { ...item, subtitle: e.target.value };
                          const updated = [...sections];
                          updated[sIdx] = { ...section, items: updatedItems };
                          onChange({ ...data, customSections: updated });
                        }}
                      />
                      <Input
                        label="Start Date"
                        type="month"
                        value={item.startDate || ''}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[iIdx] = { ...item, startDate: e.target.value };
                          const updated = [...sections];
                          updated[sIdx] = { ...section, items: updatedItems };
                          onChange({ ...data, customSections: updated });
                        }}
                      />
                      <Input
                        label="End Date"
                        type="month"
                        value={item.endDate || ''}
                        onChange={(e) => {
                          const updatedItems = [...section.items];
                          updatedItems[iIdx] = { ...item, endDate: e.target.value };
                          const updated = [...sections];
                          updated[sIdx] = { ...section, items: updatedItems };
                          onChange({ ...data, customSections: updated });
                        }}
                      />
                    </div>
                    <Textarea
                      label="Description"
                      placeholder="Describe this item..."
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedItems = [...section.items];
                        updatedItems[iIdx] = { ...item, description: e.target.value };
                        const updated = [...sections];
                        updated[sIdx] = { ...section, items: updatedItems };
                        onChange({ ...data, customSections: updated });
                      }}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updatedItems = [
                      ...section.items,
                      { id: generateId(), title: '', subtitle: '', startDate: '', endDate: '', description: '' },
                    ];
                    const updated = [...sections];
                    updated[sIdx] = { ...section, items: updatedItems };
                    onChange({ ...data, customSections: updated });
                  }}
                  className="w-full gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </Button>
              </div>
            )}
          </div>
        ))}
        {/* Add another custom section */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onChange({
              ...data,
              customSections: [
                ...(data.customSections || []),
                {
                  id: generateId(),
                  title: '',
                  items: [{ id: generateId(), title: '', subtitle: '', startDate: '', endDate: '', description: '' }],
                },
              ],
            });
          }}
          className="w-full gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Custom Section
        </Button>
      </div>
    );
  };

  const isActive = (type: SectionType) => {
    if (type === 'languages') return languageNote;
    if (type === 'extracurricular' || type === 'training') return activeSections.has(type) || activeSections.has('custom');
    return activeSections.has(type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-semibold text-neutral-90 tracking-tight">Additional Sections</h2>
        <p className="text-[14px] text-neutral-50 mt-1">
          Here are additional sections you can add to strengthen your resume, or skip without them.
        </p>
      </div>

      {/* Section type grid */}
      <div className="grid grid-cols-2 gap-3">
        {SECTION_OPTIONS.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => toggleSection(option.type)}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:shadow-sm',
              isActive(option.type)
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-neutral-20 bg-white hover:border-neutral-30'
            )}
          >
            {/* Checkmark for active */}
            {isActive(option.type) && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {/* Badge */}
            {option.badge && (
              <span className="absolute top-2 left-2 text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                {option.badge}
              </span>
            )}
            <div className={cn('text-neutral-50', isActive(option.type) && 'text-primary')}>
              {option.icon}
            </div>
            <span className={cn('text-[13px] font-semibold', isActive(option.type) ? 'text-primary' : 'text-neutral-70')}>
              {option.label}
            </span>
            <span className="text-[11px] text-neutral-40">{option.description}</span>
          </button>
        ))}
      </div>

      {/* Languages note */}
      {languageNote && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-[13px] text-blue-800">
            Languages can be added in the <strong>Skills & More</strong> step. Use the &quot;Back&quot; button to navigate there.
          </p>
        </div>
      )}

      {/* Active section forms */}
      {activeSections.has('hobbies') && renderHobbies()}
      {activeSections.has('references') && renderReferences()}
      {(activeSections.has('custom') || activeSections.has('extracurricular') || activeSections.has('training')) &&
        renderCustomSections()}
    </div>
  );
}
