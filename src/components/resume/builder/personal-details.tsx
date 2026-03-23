'use client';

import { ResumeData } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useState, useRef } from 'react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

function GamificationBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 leading-none">
      {label}
    </span>
  );
}

export function PersonalDetailsForm({ data, onChange }: Props) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(() => {
    // Auto-expand if user already has data in the expandable fields
    return !!(data.personalDetails.website);
  });
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
    setAiError(null);
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
      if (json.text) {
        update('summary', json.text);
      } else {
        setAiError('AI is unavailable. Write your summary manually.');
        setTimeout(() => setAiError(null), 4000);
      }
    } catch {
      setAiError('AI is unavailable. Write your summary manually.');
      setTimeout(() => setAiError(null), 4000);
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
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-90 mb-1">Personal Details</h2>
        <p className="text-sm text-neutral-50">
          Users who added phone number and email received 64% more positive feedback from recruiters.
        </p>
      </div>

      {showWarning && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-amber-700">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>Missing required fields: <strong>{missing.join(', ')}</strong></span>
        </div>
      )}

      {/* Job Title + Photo — same row */}
      <div className="flex gap-4 items-start">
        {/* Job Title — takes more space */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center">
            <label htmlFor="job-title" className="text-sm font-medium text-neutral-70">
              Job Title / Target Role *
            </label>
            {!p.jobTitle && <GamificationBadge label="+10%" />}
          </div>
          <Input
            id="job-title"
            placeholder="Senior Software Engineer"
            value={p.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            hint="Adding a job title increases your resume score by 10%"
          />
        </div>

        {/* Compact Photo Upload */}
        <div className="flex-shrink-0 pt-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-full bg-neutral-10 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:bg-neutral-15 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {p.photo ? (
                <img src={p.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-5 h-5 text-neutral-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-primary hover:text-primary-dark text-left whitespace-nowrap"
              >
                {p.photo ? 'Change' : 'Upload photo'}
              </button>
              {p.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="text-xs text-red-500 hover:text-red-600 text-left"
                >
                  Remove
                </button>
              )}
            </div>
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

      {/* First Name / Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="John"
          value={p.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
        <Input
          label="Last Name *"
          placeholder="Smith"
          value={p.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Email / Phone */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address *"
          type="email"
          placeholder="john@example.com"
          value={p.email}
          onChange={(e) => update('email', e.target.value)}
          className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={p.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* LinkedIn / Location */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="LinkedIn Profile"
          placeholder="linkedin.com/in/johnsmith"
          value={p.linkedIn}
          onChange={(e) => update('linkedIn', e.target.value)}
          className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
        <Input
          label="City, State / Location"
          placeholder="New York, NY"
          value={p.location}
          onChange={(e) => update('location', e.target.value)}
          className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Expandable "Add more details" section */}
      <div className="border-t border-neutral-15 pt-2">
        <button
          type="button"
          onClick={() => setShowMoreDetails((prev) => !prev)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors py-1"
        >
          {showMoreDetails ? (
            <>
              <span>Hide additional details</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Add more details</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {showMoreDetails && (
          <div className="space-y-4 pt-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <Input
              label="Website / Portfolio"
              placeholder="johnsmith.dev"
              value={p.website}
              onChange={(e) => update('website', e.target.value)}
              className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Address"
                placeholder="123 Main St, Apt 4B"
                value=""
                disabled
                hint="Coming soon"
                className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              <Input
                label="Nationality"
                placeholder="United States"
                value=""
                disabled
                hint="Coming soon"
                className="bg-[#f3f4f6] border-0 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {aiError && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {aiError}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label className="text-sm font-medium text-neutral-70">Professional Summary</label>
            {!p.summary && <GamificationBadge label="+15%" />}
          </div>
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
        <RichTextEditor
          value={p.summary}
          onChange={(html) => update('summary', html)}
          placeholder="A results-driven software engineer with 5+ years of experience building scalable web applications..."
          charTarget={400}
          charLabel="Recruiter tip: write 400-600 characters to increase interview chances"
          showPrewrittenPhrases={true}
          phraseCategory="summary"
        />
      </div>
    </div>
  );
}
