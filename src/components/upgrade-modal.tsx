'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PLAN_PRICES } from '@/lib/plans';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Full, already-formatted reason sentence to show (e.g. "You've used your free application."). */
  message?: string;
  /** @deprecated Short feature label — gets wrapped in "You've reached the free plan limit for …". */
  feature?: string;
  currentTier?: string;
}

const PRODUCT_IDS = {
  starter_monthly: process.env.NEXT_PUBLIC_POLAR_STARTER_MONTHLY || '',
  starter_yearly: process.env.NEXT_PUBLIC_POLAR_STARTER_YEARLY || '',
  pro_monthly: process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY || '',
  pro_yearly: process.env.NEXT_PUBLIC_POLAR_PRO_YEARLY || '',
};

const STARTER_FEATURES = [
  '10 applications per month',
  '20 resumes',
  'Daily job alerts',
  'Cover letters',
  'Application tracking',
];

const PRO_FEATURES = [
  'Unlimited applications',
  'Unlimited resumes',
  'Interview prep (AI talking points)',
  'Bundle downloads (resume + cover letter)',
  'Weekly progress reports',
  'Priority support',
];

export function UpgradeModal({ open, onClose, message, feature, currentTier = 'free' }: UpgradeModalProps) {
  // Accept either a full sentence (`message`) or a short label (`feature`).
  // If the "feature" prop already contains a full sentence (ends with a period or
  // is long), treat it as a message to avoid double-wrapping.
  const looksLikeFullSentence = feature && (feature.length > 40 || /[.!?]$/.test(feature.trim()));
  const displayMessage = message || (looksLikeFullSentence ? feature : undefined);
  const shortLabel = !displayMessage ? feature : undefined;
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const handleCheckout = (plan: 'starter' | 'pro') => {
    const productId = PRODUCT_IDS[`${plan}_${billing}`];
    if (!productId) {
      window.location.href = `/api/checkout?plan=${plan}&billing=${billing}`;
      return;
    }
    window.location.href = `/api/checkout?products=${productId}`;
  };

  const getPrice = (plan: 'starter' | 'pro') => {
    if (billing === 'monthly') return PLAN_PRICES[plan].monthly;
    return Number((PLAN_PRICES[plan].yearly / 12).toFixed(2));
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white rounded-xl max-w-[680px] w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-40 hover:text-neutral-70 hover:bg-neutral-10 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM19.5 8.25l.75-2.25.75 2.25 2.25.75-2.25.75-.75 2.25-.75-2.25L17.25 9l2.25-.75z" />
                </svg>
              </div>
              <h2 className="text-[22px] font-bold text-neutral-90 tracking-tight">
                Upgrade your plan
              </h2>
              {displayMessage && (
                <p className="text-neutral-50 text-[14px] mt-1.5 max-w-md mx-auto">
                  {displayMessage}
                </p>
              )}
              {shortLabel && (
                <p className="text-neutral-50 text-[14px] mt-1.5 max-w-sm mx-auto">
                  You&apos;ve reached the free plan limit for <span className="font-medium text-neutral-70">{shortLabel}</span>. Upgrade to continue.
                </p>
              )}
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-1 mb-6 bg-neutral-5 rounded-lg p-1 w-fit mx-auto">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  billing === 'monthly'
                    ? 'bg-white text-neutral-90 shadow-sm'
                    : 'text-neutral-50 hover:text-neutral-70'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  billing === 'yearly'
                    ? 'bg-white text-neutral-90 shadow-sm'
                    : 'text-neutral-50 hover:text-neutral-70'
                }`}
              >
                Yearly
                <span className="ml-1.5 text-[11px] text-green-600 font-semibold">Save 33%</span>
              </button>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Starter */}
              <div
                className={`border rounded-xl p-5 transition-all ${
                  currentTier === 'starter'
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-neutral-20 hover:border-neutral-30'
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-[16px] font-semibold text-neutral-90">Starter</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[28px] font-bold text-neutral-90">
                      ${getPrice('starter')}
                    </span>
                    <span className="text-[13px] text-neutral-50">/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-[12px] text-neutral-40 mt-0.5">
                      ${PLAN_PRICES.starter.yearly}/year billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {STARTER_FEATURES.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[13px] text-neutral-60">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {currentTier === 'starter' ? (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : currentTier === 'pro' ? null : (
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => handleCheckout('starter')}
                  >
                    Get Started
                  </Button>
                )}
              </div>

              {/* Pro */}
              <div
                className={`border-2 rounded-xl p-5 relative transition-all ${
                  currentTier === 'pro'
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-primary'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-[16px] font-semibold text-neutral-90">Pro</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[28px] font-bold text-neutral-90">
                      ${getPrice('pro')}
                    </span>
                    <span className="text-[13px] text-neutral-50">/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-[12px] text-neutral-40 mt-0.5">
                      ${PLAN_PRICES.pro.yearly}/year billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {PRO_FEATURES.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[13px] text-neutral-60">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {currentTier === 'pro' ? (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => handleCheckout('pro')}
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-5 bg-neutral-10/50 rounded-lg p-3 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <div>
                <p className="text-[12px] text-neutral-60 font-medium">Cancel anytime. 7-day money-back guarantee.</p>
                <p className="text-[11px] text-neutral-40 mt-0.5">Payments processed securely by Polar. No hidden fees.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-3">
              <a
                href="/pricing"
                className="text-[12px] text-primary font-medium hover:underline"
              >
                Compare all plans
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
