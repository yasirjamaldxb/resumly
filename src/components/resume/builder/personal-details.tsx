'use client';

import { ResumeData } from '@/types/resume';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function PersonalDetailsForm({ data, onChange }: Props) {
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) => {
    onChange({
      ...data,
      personalDetails: { ...data.personalDetails, [field]: value },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Resize image to keep resume data manageable
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let w = img.width;
        let h = img.height;
        if (w > h) { h = (h / w) * maxSize; w = maxSize; }
        else { w = (w / h) * maxSize; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const resized = canvas.toDataURL('image/jpeg', 0.85);
        update('photo', resized);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    update('photo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  // Validation
  const missing: string[] = [];
  if (!p.firstName || !p.lastName) missing.push('Full name');
  if (!p.email) missing.push('Email');
  if (!p.jobTitle) missing.push('Job title');
  const showWarning = missing.length > 0 && (p.firstName || p.lastName || p.email);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-90 mb-1">Personal Details</h2>
        <p className="text-sm text-neutral-50">This information appears at the top of your resume.</p>
      </div>

      {showWarning && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-amber-700">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>Missing required fields: <strong>{missing.join(', ')}</strong></span>
        </div>
      )}

      {/* Photo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-70">Profile Photo <span className="text-neutral-40 font-normal">(optional)</span></label>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-30 flex items-center justify-center overflow-hidden bg-neutral-10 flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {p.photo ? (
              <img src={p.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-neutral-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-primary hover:text-primary-dark text-left"
            >
              {p.photo ? 'Change photo' : 'Upload photo'}
            </button>
            {p.photo && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-sm text-red-500 hover:text-red-600 text-left"
              >
                Remove
              </button>
            )}
            <p className="text-xs text-neutral-40">JPG, PNG. Max 5MB. Shows on supported templates.</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="John"
          value={p.firstName}
          onChange={(e) => update('firstName', e.target.value)}
        />
        <Input
          label="Last Name *"
          placeholder="Smith"
          value={p.lastName}
          onChange={(e) => update('lastName', e.target.value)}
        />
      </div>

      <Input
        label="Job Title / Target Role *"
        placeholder="Senior Software Engineer"
        value={p.jobTitle}
        onChange={(e) => update('jobTitle', e.target.value)}
        hint="Adding a job title increases your resume score by 10%"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address *"
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
          <label className="text-sm font-medium text-neutral-70">Professional Summary</label>
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
