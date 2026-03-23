'use client';

import { ResumeData, Skill, Language, Certification } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, generateId } from '@/lib/utils';
import { useState, useCallback } from 'react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const SKILL_LEVELS: Skill['level'][] = ['novice', 'beginner', 'intermediate', 'advanced', 'expert'];
const SKILL_LEVEL_LABELS: Record<Skill['level'], string> = {
  novice: 'Novice',
  beginner: 'Beginner',
  intermediate: 'Skillful',
  advanced: 'Experienced',
  expert: 'Expert',
};
const LANG_LEVELS: Language['proficiency'][] = ['elementary', 'limited', 'professional', 'full', 'native'];
const LANG_LEVEL_LABELS: Record<Language['proficiency'], string> = {
  elementary: 'Elementary',
  limited: 'Limited Working',
  professional: 'Professional',
  full: 'Full Professional',
  native: 'Native Speaker',
};

const COMMON_SKILLS = [
  'Communication', 'Leadership', 'Project Management', 'Problem Solving', 'Teamwork',
  'Microsoft Office', 'Excel', 'Data Analysis', 'Customer Service', 'Time Management',
  'Presentation Skills', 'Attention to Detail', 'Critical Thinking', 'Adaptability',
  'Negotiation', 'Sales', 'Marketing', 'Research', 'Writing', 'Budgeting',
  'Python', 'SQL', 'JavaScript', 'React', 'AWS', 'Git', 'Figma', 'Salesforce',
];

function SkillLevelSlider({
  level,
  onChange,
}: {
  level: Skill['level'];
  onChange: (level: Skill['level']) => void;
}) {
  const activeIndex = SKILL_LEVELS.indexOf(level);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {SKILL_LEVELS.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            className={cn(
              'h-2.5 flex-1 rounded-sm transition-colors',
              i <= activeIndex
                ? 'bg-primary'
                : 'bg-neutral-20'
            )}
            aria-label={SKILL_LEVEL_LABELS[l]}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-50">
        Level — <span className="font-medium text-neutral-70">{SKILL_LEVEL_LABELS[level]}</span>
      </p>
    </div>
  );
}

function LanguageLevelSlider({
  proficiency,
  onChange,
}: {
  proficiency: Language['proficiency'];
  onChange: (proficiency: Language['proficiency']) => void;
}) {
  const activeIndex = LANG_LEVELS.indexOf(proficiency);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {LANG_LEVELS.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            className={cn(
              'h-2.5 flex-1 rounded-sm transition-colors',
              i <= activeIndex
                ? 'bg-primary'
                : 'bg-neutral-20'
            )}
            aria-label={LANG_LEVEL_LABELS[l]}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-50">
        Level — <span className="font-medium text-neutral-70">{LANG_LEVEL_LABELS[proficiency]}</span>
      </p>
    </div>
  );
}

export function SkillsForm({ data, onChange }: Props) {
  const [skillInput, setSkillInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hideSkillLevels, setHideSkillLevels] = useState(false);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [expandedLangId, setExpandedLangId] = useState<string | null>(null);
  const [draggedSkillId, setDraggedSkillId] = useState<string | null>(null);

  const addSkill = useCallback((name?: string) => {
    const n = name || skillInput.trim();
    if (!n) return;
    const newSkill: Skill = { id: generateId(), name: n, level: 'intermediate' };
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    });
    setSkillInput('');
    setExpandedSkillId(newSkill.id);
  }, [skillInput, data, onChange]);

  const removeSkill = useCallback((id: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
    if (expandedSkillId === id) setExpandedSkillId(null);
  }, [data, onChange, expandedSkillId]);

  const updateSkillLevel = useCallback((id: string, level: Skill['level']) => {
    onChange({ ...data, skills: data.skills.map((s) => s.id === id ? { ...s, level } : s) });
  }, [data, onChange]);

  const handleSkillDragStart = useCallback((id: string) => {
    setDraggedSkillId(id);
  }, []);

  const handleSkillDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedSkillId || draggedSkillId === targetId) return;
    const skills = [...data.skills];
    const fromIndex = skills.findIndex((s) => s.id === draggedSkillId);
    const toIndex = skills.findIndex((s) => s.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = skills.splice(fromIndex, 1);
    skills.splice(toIndex, 0, moved);
    onChange({ ...data, skills });
  }, [draggedSkillId, data, onChange]);

  const handleSkillDragEnd = useCallback(() => {
    setDraggedSkillId(null);
  }, []);

  const addCert = useCallback(() => {
    onChange({
      ...data,
      certifications: [...data.certifications, { id: generateId(), name: '', issuer: '', date: '' }],
    });
  }, [data, onChange]);

  const removeCert = useCallback((id: string) => {
    onChange({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  }, [data, onChange]);

  const updateCert = useCallback((id: string, field: keyof Certification, value: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => c.id === id ? { ...c, [field]: value } : c),
    });
  }, [data, onChange]);

  const addLang = useCallback(() => {
    const newLang: Language = { id: generateId(), name: '', proficiency: 'professional' };
    onChange({
      ...data,
      languages: [...data.languages, newLang],
    });
    setExpandedLangId(newLang.id);
  }, [data, onChange]);

  const removeLang = useCallback((id: string) => {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
    if (expandedLangId === id) setExpandedLangId(null);
  }, [data, onChange, expandedLangId]);

  const updateLang = useCallback((id: string, field: keyof Language, value: string) => {
    onChange({
      ...data,
      languages: data.languages.map((l) => l.id === id ? { ...l, [field]: value } : l),
    });
  }, [data, onChange]);

  const aiSuggestSkills = async () => {
    if (!data.personalDetails.jobTitle) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'skills', jobTitle: data.personalDetails.jobTitle }),
      });
      const json = await res.json();
      if (json.skills) {
        const existing = new Set(data.skills.map((s) => s.name.toLowerCase()));
        const newSkills: Skill[] = json.skills
          .filter((s: string) => !existing.has(s.toLowerCase()))
          .map((s: string) => ({ id: generateId(), name: s, level: 'intermediate' as const }));
        onChange({ ...data, skills: [...data.skills, ...newSkills] });
      } else {
        setAiError('AI unavailable. Add skills manually from the suggestions below.');
        setTimeout(() => setAiError(null), 4000);
      }
    } catch {
      setAiError('AI unavailable. Add skills manually from the suggestions below.');
      setTimeout(() => setAiError(null), 4000);
    } finally {
      setAiLoading(false);
    }
  };

  const existingSkillNames = new Set(data.skills.map((s) => s.name));
  const suggestions = COMMON_SKILLS.filter((s) => !existingSkillNames.has(s));
  const showSkillsBadge = data.skills.length < 5;
  const showLangsBadge = data.languages.length === 0;

  return (
    <div className="space-y-8">
      {/* Skills */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-neutral-90">Skills</h2>
            {showSkillsBadge && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
                +4%
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-50">
            Choose 5 important skills that show you fit the position. Make sure they match the key skills mentioned in the job listing.
          </p>
        </div>

        {/* Hide experience level toggle */}
        <div className="flex items-center justify-between bg-neutral-5 rounded-lg px-4 py-3 border border-neutral-15">
          <span className="text-sm text-neutral-70">Don&apos;t show experience level</span>
          <button
            type="button"
            role="switch"
            aria-checked={hideSkillLevels}
            onClick={() => setHideSkillLevels(!hideSkillLevels)}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
              hideSkillLevels ? 'bg-primary' : 'bg-neutral-30'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5',
                hideSkillLevels ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>

        {aiError && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-700">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {aiError}
          </div>
        )}

        <div className="flex gap-2">
          <input
            className="flex-1 text-sm border border-neutral-30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type a skill and press Enter..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button variant="outline" size="md" onClick={() => addSkill()}>Add</Button>
          <Button
            variant="outline"
            size="md"
            onClick={aiSuggestSkills}
            loading={aiLoading}
            disabled={!data.personalDetails.jobTitle}
            className="gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI
          </Button>
        </div>

        {/* Collapsible skill entries */}
        {data.skills.length > 0 && (
          <div className="space-y-2">
            {data.skills.map((skill) => {
              const isExpanded = expandedSkillId === skill.id;
              return (
                <div
                  key={skill.id}
                  draggable
                  onDragStart={() => handleSkillDragStart(skill.id)}
                  onDragOver={(e) => handleSkillDragOver(e, skill.id)}
                  onDragEnd={handleSkillDragEnd}
                  className={cn(
                    'border rounded-xl bg-white transition-shadow',
                    draggedSkillId === skill.id
                      ? 'border-primary shadow-md opacity-50'
                      : 'border-neutral-20 shadow-sm'
                  )}
                >
                  {/* Collapsed header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
                    onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                  >
                    {/* Drag handle */}
                    <span className="text-neutral-30 cursor-grab active:cursor-grabbing flex-shrink-0" onMouseDown={(e) => e.stopPropagation()}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="9" cy="6" r="1.5" />
                        <circle cx="15" cy="6" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="18" r="1.5" />
                        <circle cx="15" cy="18" r="1.5" />
                      </svg>
                    </span>

                    {/* Skill name */}
                    <span className="text-sm font-medium text-neutral-80 flex-1 truncate">{skill.name}</span>

                    {/* Level label (right side) */}
                    {!hideSkillLevels && (
                      <span className="text-xs text-neutral-50 flex-shrink-0">
                        {SKILL_LEVEL_LABELS[skill.level]}
                      </span>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSkill(skill.id);
                      }}
                      className="text-neutral-30 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Expand chevron */}
                    <svg
                      className={cn(
                        'w-4 h-4 text-neutral-40 transition-transform flex-shrink-0',
                        isExpanded && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded content: level slider */}
                  {isExpanded && !hideSkillLevels && (
                    <div className="px-4 pb-3 pt-1 border-t border-neutral-10">
                      <SkillLevelSlider
                        level={skill.level}
                        onChange={(level) => updateSkillLevel(skill.id, level)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <p className="text-xs text-neutral-50 mb-2">Common skills — click to add:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.slice(0, 10).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="text-xs bg-neutral-10 hover:bg-primary-light hover:text-primary-dark text-neutral-60 rounded-lg px-2.5 py-1 border border-neutral-20 hover:border-primary transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-neutral-90">Languages</h3>
              {showLangsBadge && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
                  +3%
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-50">List languages you speak and your proficiency level.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addLang}>+ Add</Button>
        </div>

        {data.languages.length > 0 && (
          <div className="space-y-2">
            {data.languages.map((lang) => {
              const isExpanded = expandedLangId === lang.id;
              return (
                <div
                  key={lang.id}
                  className="border border-neutral-20 rounded-xl bg-white shadow-sm"
                >
                  {/* Header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
                    onClick={() => setExpandedLangId(isExpanded ? null : lang.id)}
                  >
                    <span className="text-sm font-medium text-neutral-80 flex-1 truncate">
                      {lang.name || 'Untitled Language'}
                    </span>
                    <span className="text-xs text-neutral-50 flex-shrink-0">
                      {LANG_LEVEL_LABELS[lang.proficiency]}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLang(lang.id);
                      }}
                      className="text-neutral-30 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg
                      className={cn(
                        'w-4 h-4 text-neutral-40 transition-transform flex-shrink-0',
                        isExpanded && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-neutral-10 space-y-3">
                      <Input
                        label="Language"
                        placeholder="Spanish"
                        value={lang.name}
                        onChange={(e) => updateLang(lang.id, 'name', e.target.value)}
                      />
                      <LanguageLevelSlider
                        proficiency={lang.proficiency}
                        onChange={(proficiency) => updateLang(lang.id, 'proficiency', proficiency)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-90 mb-1">Certifications</h3>
            <p className="text-sm text-neutral-50">Add relevant certifications and licenses.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addCert}>+ Add</Button>
        </div>

        {data.certifications.map((cert) => (
          <div key={cert.id} className="border border-neutral-20 rounded-xl p-4 space-y-3 bg-white">
            <div className="flex justify-between items-start">
              <Input
                label="Certification Name"
                placeholder="AWS Solutions Architect"
                value={cert.name}
                onChange={(e) => updateCert(cert.id, 'name', e.target.value)}
                className="flex-1 mr-2"
              />
              <button onClick={() => removeCert(cert.id)} className="text-neutral-40 hover:text-red-500 mt-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Issuing Organization"
                placeholder="Amazon Web Services"
                value={cert.issuer}
                onChange={(e) => updateCert(cert.id, 'issuer', e.target.value)}
              />
              <Input
                label="Date"
                type="month"
                value={cert.date}
                onChange={(e) => updateCert(cert.id, 'date', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
