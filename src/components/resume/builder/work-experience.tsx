'use client';

import { ResumeData, WorkExperience } from '@/types/resume';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';
import { useState } from 'react';

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

export function WorkExperienceForm({ data, onChange }: Props) {
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const addJob = () => {
    onChange({ ...data, workExperience: [...data.workExperience, emptyJob()] });
  };

  const removeJob = (id: string) => {
    onChange({ ...data, workExperience: data.workExperience.filter((j) => j.id !== id) });
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
    updateJob(jobId, 'bullets', job.bullets.filter((_, i) => i !== idx));
  };

  const generateBullets = async (job: WorkExperience) => {
    if (!job.position || !job.company) return;
    setAiLoading(job.id);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bullets', position: job.position, company: job.company, description: job.description }),
      });
      const json = await res.json();
      if (json.bullets) updateJob(job.id, 'bullets', json.bullets);
    } catch {
      // Silent fail
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Work Experience</h2>
        <p className="text-sm text-gray-500">Add your most recent jobs first. Use specific achievements with numbers.</p>
      </div>

      {data.workExperience.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-sm mb-3">No work experience added yet</p>
          <Button variant="outline" size="sm" onClick={addJob}>+ Add Work Experience</Button>
        </div>
      )}

      {data.workExperience.map((job, index) => (
        <div key={job.id} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">
              {job.position || job.company || `Position ${index + 1}`}
            </h3>
            <button
              onClick={() => removeJob(job.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Job Title"
              placeholder="Senior Developer"
              value={job.position}
              onChange={(e) => updateJob(job.id, 'position', e.target.value)}
            />
            <Input
              label="Company"
              placeholder="Acme Corp"
              value={job.company}
              onChange={(e) => updateJob(job.id, 'company', e.target.value)}
            />
          </div>

          <Input
            label="Location"
            placeholder="New York, NY (or Remote)"
            value={job.location}
            onChange={(e) => updateJob(job.id, 'location', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="month"
              value={job.startDate}
              onChange={(e) => updateJob(job.id, 'startDate', e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              {!job.current && (
                <Input
                  label="End Date"
                  type="month"
                  value={job.endDate}
                  onChange={(e) => updateJob(job.id, 'endDate', e.target.value)}
                />
              )}
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={job.current}
                  onChange={(e) => updateJob(job.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Currently working here</span>
              </label>
            </div>
          </div>

          {/* Bullets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Key Achievements / Responsibilities</label>
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
            <p className="text-xs text-gray-400">Start with action verbs. Include numbers where possible. (e.g., "Increased sales by 30%")</p>
            {job.bullets.map((bullet, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-gray-400 mt-2 flex-shrink-0">•</span>
                <input
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Developed and maintained..."
                  value={bullet}
                  onChange={(e) => updateBullet(job.id, idx, e.target.value)}
                />
                <button
                  onClick={() => removeBullet(job.id, idx)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => addBullet(job.id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
            >
              + Add bullet point
            </button>
          </div>
        </div>
      ))}

      {data.workExperience.length > 0 && (
        <Button variant="outline" size="md" onClick={addJob} className="w-full">
          + Add Another Position
        </Button>
      )}
    </div>
  );
}
