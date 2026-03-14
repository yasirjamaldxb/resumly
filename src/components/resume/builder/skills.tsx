'use client';

import { ResumeData, Skill, Language, Certification } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const SKILL_LEVELS: Skill['level'][] = ['beginner', 'intermediate', 'advanced', 'expert'];
const LANG_LEVELS: Language['proficiency'][] = ['elementary', 'limited', 'professional', 'full', 'native'];

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git',
  'Project Management', 'Communication', 'Leadership', 'Excel', 'Data Analysis',
  'Marketing', 'Sales', 'Customer Service', 'Figma', 'Docker', 'Kubernetes'
];

export function SkillsForm({ data, onChange }: Props) {
  const [skillInput, setSkillInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const addSkill = (name?: string) => {
    const n = name || skillInput.trim();
    if (!n) return;
    onChange({
      ...data,
      skills: [...data.skills, { id: generateId(), name: n, level: 'intermediate' }],
    });
    setSkillInput('');
  };

  const removeSkill = (id: string) => onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  const updateSkillLevel = (id: string, level: Skill['level']) => {
    onChange({ ...data, skills: data.skills.map((s) => s.id === id ? { ...s, level } : s) });
  };

  const addCert = () => {
    onChange({
      ...data,
      certifications: [...data.certifications, { id: generateId(), name: '', issuer: '', date: '' }],
    });
  };
  const removeCert = (id: string) => onChange({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  const updateCert = (id: string, field: keyof Certification, value: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => c.id === id ? { ...c, [field]: value } : c),
    });
  };

  const addLang = () => {
    onChange({
      ...data,
      languages: [...data.languages, { id: generateId(), name: '', proficiency: 'professional' }],
    });
  };
  const removeLang = (id: string) => onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
  const updateLang = (id: string, field: keyof Language, value: string) => {
    onChange({
      ...data,
      languages: data.languages.map((l) => l.id === id ? { ...l, [field]: value } : l),
    });
  };

  const aiSuggestSkills = async () => {
    if (!data.personalDetails.jobTitle) return;
    setAiLoading(true);
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
      }
    } catch {
      // Silent fail
    } finally {
      setAiLoading(false);
    }
  };

  const existingSkillNames = new Set(data.skills.map((s) => s.name));
  const suggestions = COMMON_SKILLS.filter((s) => !existingSkillNames.has(s));

  return (
    <div className="space-y-8">
      {/* Skills */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-90 mb-1">Skills</h2>
          <p className="text-sm text-neutral-50">Add relevant skills that match your target job description.</p>
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 text-sm border border-neutral-30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type a skill and press Enter..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
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

        {/* Current skills */}
        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1.5 bg-primary-light border border-primary text-primary-dark rounded-lg px-2.5 py-1 text-sm">
                <span>{skill.name}</span>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkillLevel(skill.id, e.target.value as Skill['level'])}
                  className="text-xs bg-transparent border-none outline-none text-primary cursor-pointer"
                >
                  {SKILL_LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <button onClick={() => removeSkill(skill.id)} className="text-primary hover:text-red-500 ml-0.5">×</button>
              </div>
            ))}
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

      {/* Languages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-90 mb-1">Languages</h3>
            <p className="text-sm text-neutral-50">List languages you speak and your proficiency level.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addLang}>+ Add</Button>
        </div>

        {data.languages.map((lang) => (
          <div key={lang.id} className="flex gap-3 items-end">
            <Input
              label="Language"
              placeholder="Spanish"
              value={lang.name}
              onChange={(e) => updateLang(lang.id, 'name', e.target.value)}
              className="flex-1"
            />
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium text-neutral-70">Proficiency</label>
              <select
                value={lang.proficiency}
                onChange={(e) => updateLang(lang.id, 'proficiency', e.target.value)}
                className="w-full rounded-lg border border-neutral-30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {LANG_LEVELS.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            <button onClick={() => removeLang(lang.id)} className="text-neutral-40 hover:text-red-500 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
