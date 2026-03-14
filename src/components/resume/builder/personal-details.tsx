'use client';

import { ResumeData } from '@/types/resume';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function PersonalDetailsForm({ data, onChange }: Props) {
  const [aiLoading, setAiLoading] = useState(false);

  const update = (field: string, value: string) => {
    onChange({
      ...data,
      personalDetails: { ...data.personalDetails, [field]: value },
    });
  };

  const generateSummary = async () => {
    if (!data.personalDetails.jobTitle) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'summary',
          jobTitle: data.personalDetails.jobTitle,
          experience: data.workExperience,
        }),
      });
      const json = await res.json();
      if (json.text) update('summary', json.text);
    } catch {
      // Silent fail
    } finally {
      setAiLoading(false);
    }
  };

  const p = data.personalDetails;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Personal Details</h2>
        <p className="text-sm text-gray-500">This information appears at the top of your resume.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          value={p.firstName}
          onChange={(e) => update('firstName', e.target.value)}
        />
        <Input
          label="Last Name"
          placeholder="Smith"
          value={p.lastName}
          onChange={(e) => update('lastName', e.target.value)}
        />
      </div>

      <Input
        label="Job Title / Target Role"
        placeholder="Senior Software Engineer"
        value={p.jobTitle}
        onChange={(e) => update('jobTitle', e.target.value)}
        hint="Adding a job title increases your resume score by 10%"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={p.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={p.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City, State / Location"
          placeholder="New York, NY"
          value={p.location}
          onChange={(e) => update('location', e.target.value)}
        />
        <Input
          label="LinkedIn Profile"
          placeholder="linkedin.com/in/johnsmith"
          value={p.linkedIn}
          onChange={(e) => update('linkedIn', e.target.value)}
        />
      </div>

      <Input
        label="Website / Portfolio"
        placeholder="johnsmith.dev"
        value={p.website}
        onChange={(e) => update('website', e.target.value)}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Professional Summary</label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            loading={aiLoading}
            disabled={!p.jobTitle}
            className="gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Write
          </Button>
        </div>
        <Textarea
          placeholder="A results-driven software engineer with 5+ years of experience building scalable web applications..."
          value={p.summary}
          onChange={(e) => update('summary', e.target.value)}
          className="min-h-[120px]"
          hint="3-5 sentences highlighting your key strengths and career goals. Recruiters spend 7 seconds on a resume."
        />
      </div>
    </div>
  );
}
