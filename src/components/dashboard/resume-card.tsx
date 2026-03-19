'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TEMPLATE_LIST } from '@/types/resume';

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    template_id: string | null;
    color_scheme: string | null;
    updated_at: string;
    resume_data: {
      personalDetails?: {
        firstName?: string;
        lastName?: string;
        jobTitle?: string;
        photo?: string;
      };
      colorScheme?: string;
    } | null;
  };
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter();
  const [editLoading, setEditLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const templateInfo = TEMPLATE_LIST.find(t => t.id === resume.template_id);
  const resumeData = resume.resume_data;
  const color = resume.color_scheme || resumeData?.colorScheme || '#2563eb';
  const fullName = resumeData?.personalDetails
    ? `${resumeData.personalDetails.firstName || ''} ${resumeData.personalDetails.lastName || ''}`.trim()
    : '';
  const jobTitle = resumeData?.personalDetails?.jobTitle || '';

  const handleEdit = () => {
    setEditLoading(true);
    router.push(`/builder/${resume.id}`);
  };

  const handleDownload = () => {
    setDownloadLoading(true);
    router.push(`/builder/${resume.id}?download=true`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/resume/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Silent fail
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-20/80 rounded-xl overflow-hidden hover:shadow-md hover:border-neutral-30 transition-all group relative">
      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 rounded-xl">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-[14px] font-semibold text-neutral-90 mb-1">Delete resume?</p>
          <p className="text-[13px] text-neutral-50 text-center mb-4">This cannot be undone.</p>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[13px]"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 text-[13px]"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Preview header */}
      <div className="h-[140px] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}>
        <div className="absolute inset-4">
          {/* Mini resume mockup */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-20/50 p-3 h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              {resumeData?.personalDetails?.photo ? (
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <img src={resumeData.personalDetails.photo} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: `${color}25` }} />
              )}
              <div>
                <div className="h-2 rounded-full bg-neutral-90/70 w-20" />
                <div className="h-1.5 rounded-full mt-1 w-14" style={{ backgroundColor: `${color}60` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 bg-neutral-20 rounded-full w-full" />
              <div className="h-1 bg-neutral-20 rounded-full w-4/5" />
              <div className="h-1 bg-neutral-20 rounded-full w-3/5" />
              <div className="h-1.5 rounded-full w-16 mt-2" style={{ backgroundColor: `${color}30` }} />
              <div className="h-1 bg-neutral-20 rounded-full w-full" />
              <div className="h-1 bg-neutral-20 rounded-full w-2/3" />
            </div>
          </div>
        </div>
        {/* Template badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 text-[11px] font-medium text-neutral-60 border border-neutral-20/50">
          {templateInfo?.name || 'Template'}
        </div>
        {/* Delete button (3-dot menu) */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm rounded-md p-1 text-neutral-40 hover:text-red-500 border border-neutral-20/50 transition-all"
          aria-label="Delete resume"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-90 text-[15px] truncate">{resume.title}</h3>
        {(fullName || jobTitle) && (
          <p className="text-[13px] text-neutral-50 truncate mt-0.5">
            {fullName}{fullName && jobTitle ? ' \u2022 ' : ''}{jobTitle}
          </p>
        )}
        <p className="text-[12px] text-neutral-40 mt-1">
          Updated {new Date(resume.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <div className="flex gap-2 mt-3">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 text-[13px]"
            onClick={handleEdit}
            loading={editLoading}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[13px] px-3"
            onClick={handleDownload}
            loading={downloadLoading}
          >
            {!downloadLoading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
