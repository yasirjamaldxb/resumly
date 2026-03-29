'use client';

import { useState } from 'react';
import { PLAN_PRICES } from '@/lib/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string;
  message?: string;
}

export function UpgradeModal({ isOpen, onClose, currentTier, message }: UpgradeModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-40 hover:text-neutral-70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
          </div>
          <h2 className="text-[22px] font-semibold text-neutral-90 tracking-tight">Upgrade to do more</h2>
          {message && <p className="text-neutral-50 text-[14px] mt-1">{message}</p>}
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              billing === 'monthly' ? 'bg-primary text-white' : 'bg-neutral-5 text-neutral-60'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              billing === 'yearly' ? 'bg-primary text-white' : 'bg-neutral-5 text-neutral-60'
            }`}
          >
            Yearly <span className="text-[11px] opacity-80">Save 33%</span>
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-3">
          {/* Starter */}
          <div className={`border rounded-xl p-4 transition-all ${currentTier === 'starter' ? 'border-primary bg-primary/5' : 'border-neutral-20 hover:border-neutral-30'}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-[15px] text-neutral-90">Starter</span>
                {currentTier === 'starter' && <span className="ml-2 text-[11px] bg-primary text-white px-1.5 py-0.5 rounded">Current</span>}
              </div>
              <div className="text-right">
                <span className="text-[20px] font-bold text-neutral-90">
                  ${billing === 'monthly' ? PLAN_PRICES.starter.monthly : (PLAN_PRICES.starter.yearly / 12).toFixed(2)}
                </span>
                <span className="text-[13px] text-neutral-50">/mo</span>
              </div>
            </div>
            <ul className="space-y-1 text-[13px] text-neutral-60">
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 10 applications/month</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Daily job alerts</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Application tracking</li>
            </ul>
            {currentTier !== 'starter' && currentTier !== 'pro' && (
              <button className="mt-3 w-full border border-primary text-primary py-2 rounded-lg text-[14px] font-medium hover:bg-primary/5 transition-colors">
                Upgrade to Starter
              </button>
            )}
          </div>

          {/* Pro */}
          <div className={`border-2 rounded-xl p-4 transition-all ${currentTier === 'pro' ? 'border-primary bg-primary/5' : 'border-primary'}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-[15px] text-neutral-90">Pro</span>
                <span className="ml-2 text-[11px] bg-orange-500 text-white px-1.5 py-0.5 rounded">Most Popular</span>
                {currentTier === 'pro' && <span className="ml-1 text-[11px] bg-primary text-white px-1.5 py-0.5 rounded">Current</span>}
              </div>
              <div className="text-right">
                <span className="text-[20px] font-bold text-neutral-90">
                  ${billing === 'monthly' ? PLAN_PRICES.pro.monthly : (PLAN_PRICES.pro.yearly / 12).toFixed(2)}
                </span>
                <span className="text-[13px] text-neutral-50">/mo</span>
              </div>
            </div>
            <ul className="space-y-1 text-[13px] text-neutral-60">
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Unlimited applications</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Interview prep (AI talking points)</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Bundle downloads (resume + cover letter)</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Weekly progress reports</li>
            </ul>
            {currentTier !== 'pro' && (
              <button className="mt-3 w-full bg-primary text-white py-2 rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[12px] text-neutral-40 mt-4">
          Payments processed securely by Polar. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
