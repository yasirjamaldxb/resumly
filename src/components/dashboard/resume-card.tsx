'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TEMPLATE_LIST } from '@/types/resume';
import { TemplatePreview } from '@/components/resume/template-preview';

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    template_id: string | null;
    color_scheme: string | null;
    updated_at: string;
    is_public: boolean;
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
  const [isPublic, setIsPublic] = useState(resume.is_public);
  const [sharing, setSharing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(resume.title);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/r/${resume.id}` : `/r/${resume.id}`;

  const saveTitle = async (newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === resume.title) { setTitle(resume.title); setEditingTitle(false); return; }
    setTitle(trimmed);
    setEditingTitle(false);
    await fetch('/api/resume/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId: resume.id, title: trimmed }),
    });
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const newState = !isPublic;
      const res = await fetch('/api/resume/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id, isPublic: newState }),
      });
      if (res.ok) {
        setIsPublic(newState);
        if (newState) {
          await navigator.clipboard.writeText(shareUrl);
          setShowShareToast(true);
          setTimeout(() => setShowShareToast(false), 3000);
        }
      }
    } catch {
      // Silent fail
    } finally {
      setSharing(false);
    }
  };

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
    <div className="bg-white border border-neutral-20 rounded-xl overflow-hidden hover:shadow-md hover:border-neutral-30 transition-all group relative">
      {/* Share toast */}
      {showShareToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-neutral-90 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          Link copied to clipboard!
        </div>
      )}

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
          {/* Mini resume mockup matching actual template */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-20/50 h-full overflow-hidden">
            <TemplatePreview templateId={resume.template_id || 'ats-pro'} color={color} className="w-full h-full" />
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
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={title}
            className="font-semibold text-neutral-90 text-[15px] w-full border-b-2 border-primary outline-none bg-transparent pb-0.5"
            onBlur={(e) => saveTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle(e.currentTarget.value);
              if (e.key === 'Escape') { setEditingTitle(false); }
            }}
          />
        ) : (
          <h3
            className="font-semibold text-neutral-90 text-[15px] truncate cursor-pointer hover:text-primary transition-colors"
            onClick={() => setEditingTitle(true)}
            title="Click to rename"
          >
            {title}
          </h3>
        )}
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
          <button
            onClick={handleShare}
            disabled={sharing}
            title={isPublic ? 'Sharing on, click to disable & copy link' : 'Share resume, creates a public link'}
            className={`px-2.5 rounded-lg border transition-all text-[13px] ${
              isPublic
                ? 'border-green-300 bg-green-50 text-green-600 hover:bg-green-100'
                : 'border-neutral-20 text-neutral-50 hover:border-primary hover:text-primary'
            }`}
          >
            {sharing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
