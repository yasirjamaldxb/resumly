'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PrewrittenPhrasesProps {
  category: string;
  onSelect: (text: string) => void;
  onClose: () => void;
}

const PHRASES: Record<string, string[]> = {
  summary: [
    'Results-driven [role] with X+ years of experience in [industry]. Proven track record of [achievement]. Skilled in [skills]. Passionate about [goal].',
    'Dedicated professional with a strong background in [field] and a passion for delivering high-quality results. Adept at [skill 1], [skill 2], and [skill 3] with a focus on [objective].',
    'Highly motivated [role] with extensive experience in [area]. Successfully [achievement] while maintaining [quality standard]. Seeking to leverage expertise in [skill] to drive [outcome].',
    'Detail-oriented [role] with X+ years of hands-on experience in [industry]. Known for [strength], [strength], and [strength]. Committed to [professional goal].',
    'Dynamic and resourceful [role] with a demonstrated history of [achievement]. Expertise in [skill area] combined with strong [soft skill] abilities. Eager to contribute to [type of organization].',
    'Accomplished [role] bringing X+ years of progressive experience in [field]. Expert in [technical skill] with a track record of [measurable result]. Recognized for [quality] and [quality].',
    'Versatile professional with cross-functional experience spanning [area 1], [area 2], and [area 3]. Known for building strong relationships with stakeholders and delivering projects on time and within budget.',
    'Forward-thinking [role] with deep expertise in [domain]. Passionate about leveraging [technology/methodology] to solve complex problems and create measurable business impact.',
    'Customer-focused [role] with X+ years of experience driving [metric] improvements. Strong communicator with proven ability to lead teams of [size] and manage budgets of [amount].',
    'Strategic [role] with a unique blend of [skill 1] and [skill 2] expertise. Demonstrated success in [achievement], resulting in [quantifiable outcome] for [company type].',
  ],
  experience: [
    'Led a team of X members to successfully deliver [project], resulting in [metric improvement].',
    'Increased [metric] by X% through implementation of [strategy/tool], contributing to [business outcome].',
    'Managed a portfolio of X+ [items/clients/accounts], generating $X in annual revenue.',
    'Spearheaded the development of [product/feature], which was adopted by X+ users within [timeframe].',
    'Reduced [cost/time/errors] by X% by streamlining [process] and introducing [solution].',
    'Collaborated with cross-functional teams including [departments] to deliver [project] ahead of schedule.',
    'Designed and implemented [system/process] that improved [metric] by X%, saving the company $X annually.',
    'Mentored and trained X+ junior team members, resulting in [improvement in team performance].',
    'Developed and maintained [technology/system] serving X+ daily active users with 99.X% uptime.',
    'Presented findings and recommendations to C-level executives, influencing [strategic decision] that led to [outcome].',
  ],
};

export function PrewrittenPhrases({ category, onSelect, onClose }: PrewrittenPhrasesProps) {
  const [filter, setFilter] = useState('');

  const phrases = PHRASES[category] ?? PHRASES.summary;

  const filtered = useMemo(() => {
    if (!filter.trim()) return phrases;
    const lower = filter.toLowerCase();
    return phrases.filter((p) => p.toLowerCase().includes(lower));
  }, [phrases, filter]);

  return (
    <div className="absolute right-0 top-0 z-50 w-80 bg-white border border-neutral-20 rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-right-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-15">
        <h3 className="text-sm font-semibold text-neutral-80">Pre-written Phrases</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-40 hover:text-neutral-60 transition-colors p-0.5 rounded hover:bg-neutral-10"
          aria-label="Close phrases panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-neutral-15">
        <input
          type="text"
          placeholder="Filter phrases by keyword and job title"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full text-xs border border-neutral-20 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-neutral-35"
        />
      </div>

      {/* Section label */}
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-[10px] font-bold text-neutral-50 uppercase tracking-wider">Most Popular</span>
      </div>

      {/* Phrases list */}
      <div className="max-h-80 overflow-y-auto px-2 py-2 space-y-1.5">
        {filtered.length === 0 && (
          <p className="text-xs text-neutral-40 text-center py-4">No phrases match your filter.</p>
        )}
        {filtered.map((phrase, idx) => (
          <div
            key={idx}
            className="group flex items-start gap-2 p-2 rounded-lg hover:bg-neutral-10 transition-colors cursor-pointer"
            onClick={() => onSelect(phrase)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(phrase);
              }}
              className={cn(
                'flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded',
                'text-neutral-30 group-hover:text-primary group-hover:bg-primary/10 transition-colors'
              )}
              aria-label="Insert phrase"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-xs text-neutral-60 leading-relaxed">{phrase}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
