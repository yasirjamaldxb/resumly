'use client';

import { useUpgradeModal } from '@/hooks/use-upgrade-modal';

interface UpgradeBannerProps {
  resumeCount: number;
  maxResumes: number;
  tier: string;
}

export function UpgradeBanner({ resumeCount, maxResumes, tier }: UpgradeBannerProps) {
  const { openUpgrade } = useUpgradeModal();

  if (tier !== 'free' || resumeCount < maxResumes) return null;

  const isAtLimit = resumeCount >= maxResumes;
  // Cap display count at max so legacy accounts don't show "51/3"
  const displayCount = Math.min(resumeCount, maxResumes);

  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-purple-50 border border-primary/20 rounded-xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-neutral-90">
            {isAtLimit
              ? `You've used all ${maxResumes} free resumes`
              : `${resumeCount} of ${maxResumes} free resumes used`}
          </h3>
          <p className="text-[13px] text-neutral-50 mt-0.5">
            {isAtLimit
              ? 'Upgrade to keep creating tailored resumes for every job application. Plans start at $4.99/mo.'
              : 'You\'re close to the free plan limit. Upgrade for unlimited resumes and more features.'}
          </p>
        </div>
        <button
          onClick={() => openUpgrade('resumes')}
          className="shrink-0 bg-primary text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
        >
          Upgrade Now
        </button>
      </div>

      {/* Usage bar */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 bg-white/60 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isAtLimit ? 'bg-red-400' : 'bg-primary'}`}
            style={{ width: `${Math.min((resumeCount / maxResumes) * 100, 100)}%` }}
          />
        </div>
        <span className={`text-[11px] font-semibold ${isAtLimit ? 'text-red-500' : 'text-primary'}`}>
          {displayCount}/{maxResumes}
        </span>
      </div>
    </div>
  );
}
