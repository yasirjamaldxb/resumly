'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PLAN_PRICES } from '@/lib/plans';

/* ── Icons ── */
function Check() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function Cross() {
  return (
    <svg className="w-4 h-4 text-neutral-25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function Shield() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

/* ── Feature lists ── */
const FREE_FEATURES = [
  '1 tailored resume',
  '1 cover letter',
  'ATS optimization',
  'PDF download',
  '10 resume templates',
];

const STARTER_FEATURES = [
  'Everything in Free, plus:',
  '10 applications / month',
  '20 resumes',
  'Daily job alerts',
  'Application tracking',
];

const PRO_FEATURES = [
  'Everything in Starter, plus:',
  'Unlimited applications',
  'Unlimited resumes',
  'AI interview prep',
  'Bundle downloads (resume + cover letter)',
  'Weekly progress reports',
  'Priority support',
];

/* ── Comparison table data ── */
const COMPARE_FEATURES = [
  { name: 'Tailored resumes', free: '1', starter: '20', pro: 'Unlimited' },
  { name: 'Cover letters', free: '1', starter: '10', pro: 'Unlimited' },
  { name: 'ATS optimization', free: true, starter: true, pro: true },
  { name: 'Resume templates', free: '10', starter: '10', pro: '10' },
  { name: 'PDF download', free: true, starter: true, pro: true },
  { name: 'Daily job alerts', free: false, starter: true, pro: true },
  { name: 'Application tracking', free: false, starter: true, pro: true },
  { name: 'AI interview prep', free: false, starter: false, pro: true },
  { name: 'Bundle downloads', free: false, starter: false, pro: true },
  { name: 'Weekly progress reports', free: false, starter: false, pro: true },
  { name: 'Priority support', free: false, starter: false, pro: true },
];

const FAQS = [
  {
    q: 'Can I try Resumly for free?',
    a: 'Yes! Create your first tailored resume and cover letter completely free. No credit card required.',
  },
  {
    q: 'What counts as an "application"?',
    a: 'One application = one job link processed through our AI funnel (job parsing, resume tailoring, cover letter generation). You can edit and re-download unlimited times.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel with one click, no questions asked. You keep access until the end of your billing period. We also offer a 7-day money-back guarantee.',
  },
  {
    q: 'What happens to my resumes if I downgrade?',
    a: 'All your resumes and cover letters are saved forever. You just can\'t create new ones beyond the free tier limits. Nothing is deleted.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade, downgrade, or switch between monthly and annual billing anytime. Changes take effect immediately.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'All major credit and debit cards. Payments are processed securely through our payment partner.',
  },
];

export function PricingClient() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const starterMonthly = PLAN_PRICES.starter.monthly;
  const starterYearly = Number((PLAN_PRICES.starter.yearly / 12).toFixed(2));
  const proMonthly = PLAN_PRICES.pro.monthly;
  const proYearly = Number((PLAN_PRICES.pro.yearly / 12).toFixed(2));

  const starterPrice = billing === 'monthly' ? starterMonthly : starterYearly;
  const proPrice = billing === 'monthly' ? proMonthly : proYearly;

  const proSavePct = Math.round(
    ((proMonthly * 12 - PLAN_PRICES.pro.yearly) / (proMonthly * 12)) * 100
  );
  const starterSavePct = Math.round(
    ((starterMonthly * 12 - PLAN_PRICES.starter.yearly) / (starterMonthly * 12)) * 100
  );

  return (
    <div className="bg-white">
      {/* ── Hero section ── */}
      <section className="pt-16 sm:pt-24 pb-4">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          {/* Social proof */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
            <div className="flex -space-x-2">
              {['S', 'M', 'A', 'J'].map((initial, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-primary/80 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-[13px] text-green-800 font-medium">
              Trusted by <strong>2,400+</strong> job seekers
            </span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-bold text-neutral-90 tracking-tight leading-[1.15] mb-4">
            Land interviews faster.<br className="hidden sm:block" />
            <span className="text-primary">Pick the plan that fits.</span>
          </h1>
          <p className="text-[16px] text-neutral-50 max-w-[480px] mx-auto leading-relaxed mb-2">
            Every plan includes AI-powered resume generation, ATS optimization,
            and beautiful templates. Upgrade when you need more.
          </p>
          <p className="text-[13px] text-neutral-40 mb-10">
            Cancel anytime &middot; No questions asked &middot; 7-day money-back guarantee
          </p>

          {/* ── Billing toggle ── */}
          <div className="inline-flex items-center bg-neutral-5 rounded-full p-1 mb-12">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all ${
                billing === 'monthly'
                  ? 'bg-white text-neutral-90 shadow-sm'
                  : 'text-neutral-50 hover:text-neutral-70'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-white text-neutral-90 shadow-sm'
                  : 'text-neutral-50 hover:text-neutral-70'
              }`}
            >
              Annual
              <span className="bg-green-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Save {proSavePct}%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="pb-20">
        <div className="max-w-[1020px] mx-auto px-6">
          {/* Mobile: Pro first for conversion, Desktop: 3-col with Pro center */}
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {/* Free */}
            <div className="border border-neutral-15 rounded-2xl p-7 bg-white flex flex-col order-2 md:order-1">
              <h2 className="text-[20px] font-bold text-neutral-90">Free</h2>
              <p className="text-[13px] text-neutral-50 mt-1 mb-6">Try it out, zero risk</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[42px] font-extrabold text-neutral-90 tracking-tight">$0</span>
                <span className="text-[14px] text-neutral-40 font-medium">/forever</span>
              </div>

              <Link
                href="/#hero-input"
                className="block w-full text-center py-3 rounded-xl border-2 border-neutral-20 text-[14px] font-bold text-neutral-70 hover:border-neutral-40 hover:text-neutral-90 transition-all mb-2"
              >
                Start Building &mdash; Free
              </Link>
              <p className="text-[11px] text-neutral-40 text-center mb-7">No credit card required</p>

              <ul className="space-y-3.5 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-neutral-70">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro — recommended, center on desktop, first on mobile */}
            <div className="relative border-2 border-primary rounded-2xl p-7 bg-primary/[0.02] flex flex-col order-1 md:order-2 md:scale-[1.04] md:shadow-xl md:z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  Most Popular
                </span>
              </div>

              <h2 className="text-[20px] font-bold text-neutral-90">Pro</h2>
              <p className="text-[13px] text-neutral-50 mt-1 mb-6">For serious job hunters</p>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[42px] font-extrabold text-neutral-90 tracking-tight">${proPrice}</span>
                <span className="text-[14px] text-neutral-40 font-medium">/mo</span>
                {billing === 'yearly' && (
                  <span className="ml-2 text-[13px] text-neutral-40 line-through">${proMonthly}</span>
                )}
              </div>
              <p className="text-[12px] text-neutral-40 mb-6">
                {billing === 'yearly'
                  ? `$${PLAN_PRICES.pro.yearly} billed annually — save $${(proMonthly * 12 - PLAN_PRICES.pro.yearly).toFixed(0)}`
                  : `or $${proYearly}/mo billed annually (save ${proSavePct}%)`}
              </p>

              <Link
                href="/auth/signup"
                className="block w-full text-center py-3 rounded-xl bg-primary text-[14px] font-bold text-white hover:bg-primary/90 transition-all shadow-sm hover:shadow-md mb-2"
              >
                Go Pro &mdash; ${proPrice}/mo
              </Link>
              <p className="text-[11px] text-neutral-40 text-center mb-7">Cancel anytime &middot; 7-day money back</p>

              <ul className="space-y-3.5 flex-1">
                {PRO_FEATURES.map((f, i) => (
                  <li key={f} className={`flex items-center gap-2.5 text-[13px] ${i === 0 ? 'text-primary font-semibold' : 'text-neutral-70'}`}>
                    {i === 0 ? null : <Check />}
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Starter */}
            <div className="border border-neutral-15 rounded-2xl p-7 bg-white flex flex-col order-3">
              <h2 className="text-[20px] font-bold text-neutral-90">Starter</h2>
              <p className="text-[13px] text-neutral-50 mt-1 mb-6">For active job seekers</p>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[42px] font-extrabold text-neutral-90 tracking-tight">${starterPrice}</span>
                <span className="text-[14px] text-neutral-40 font-medium">/mo</span>
                {billing === 'yearly' && (
                  <span className="ml-2 text-[13px] text-neutral-40 line-through">${starterMonthly}</span>
                )}
              </div>
              <p className="text-[12px] text-neutral-40 mb-6">
                {billing === 'yearly'
                  ? `$${PLAN_PRICES.starter.yearly} billed annually — save $${(starterMonthly * 12 - PLAN_PRICES.starter.yearly).toFixed(0)}`
                  : `or $${starterYearly}/mo billed annually (save ${starterSavePct}%)`}
              </p>

              <Link
                href="/auth/signup"
                className="block w-full text-center py-3 rounded-xl border-2 border-primary text-[14px] font-bold text-primary hover:bg-primary/5 transition-all mb-2"
              >
                Get Started &mdash; ${starterPrice}/mo
              </Link>
              <p className="text-[11px] text-neutral-40 text-center mb-7">Cancel anytime &middot; 7-day money back</p>

              <ul className="space-y-3.5 flex-1">
                {STARTER_FEATURES.map((f, i) => (
                  <li key={f} className={`flex items-center gap-2.5 text-[13px] ${i === 0 ? 'text-primary font-semibold' : 'text-neutral-70'}`}>
                    {i === 0 ? null : <Check />}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-neutral-40">
            <span className="flex items-center gap-1.5 text-[12px]">
              <Shield />
              Secure payment
            </span>
            <span className="flex items-center gap-1.5 text-[12px]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7-day money-back guarantee
            </span>
            <span className="flex items-center gap-1.5 text-[12px]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              No hidden fees
            </span>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="py-16 bg-neutral-5">
        <div className="max-w-[860px] mx-auto px-6">
          <h2 className="text-[24px] sm:text-[30px] font-bold text-neutral-90 text-center tracking-tight mb-10">
            Compare plans in detail
          </h2>

          <div className="bg-white rounded-2xl border border-neutral-15 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-neutral-10 bg-neutral-5/50">
              <div className="p-4 text-[13px] font-semibold text-neutral-50">Feature</div>
              <div className="p-4 text-[13px] font-semibold text-neutral-70 text-center">Free</div>
              <div className="p-4 text-[13px] font-semibold text-neutral-70 text-center">Starter</div>
              <div className="p-4 text-[13px] font-bold text-primary text-center bg-primary/5">Pro</div>
            </div>

            {/* Table rows */}
            {COMPARE_FEATURES.map((row, i) => (
              <div
                key={row.name}
                className={`grid grid-cols-4 ${i < COMPARE_FEATURES.length - 1 ? 'border-b border-neutral-10' : ''}`}
              >
                <div className="p-4 text-[13px] text-neutral-70">{row.name}</div>
                {(['free', 'starter', 'pro'] as const).map((plan) => {
                  const val = row[plan];
                  return (
                    <div key={plan} className={`p-4 flex items-center justify-center ${plan === 'pro' ? 'bg-primary/[0.02]' : ''}`}>
                      {typeof val === 'boolean' ? (
                        val ? <Check /> : <Cross />
                      ) : (
                        <span className={`text-[13px] font-semibold ${plan === 'pro' ? 'text-primary' : 'text-neutral-70'}`}>
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-16">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <svg className="w-8 h-8 text-primary/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-[18px] sm:text-[20px] text-neutral-80 font-medium leading-relaxed mb-5">
            &ldquo;I was sending generic resumes for months. With Resumly Pro, I tailored my resume to each job in minutes and got 3 interview callbacks in the first week.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-[14px] flex items-center justify-center">
              SM
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-neutral-80">Sarah M.</p>
              <p className="text-[12px] text-neutral-40">Marketing Manager &middot; Pro plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-neutral-5">
        <div className="max-w-[640px] mx-auto px-6">
          <h2 className="text-[24px] sm:text-[30px] font-bold text-neutral-90 text-center mb-10 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <div key={q} className="bg-white rounded-xl border border-neutral-10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-[14px] font-semibold text-neutral-80">{q}</span>
                  <svg
                    className={`w-5 h-5 text-neutral-40 shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-[13px] text-neutral-50 leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[560px] mx-auto px-6 text-center">
          <h2 className="text-[24px] sm:text-[30px] font-bold text-neutral-90 tracking-tight mb-3">
            Ready to land your next interview?
          </h2>
          <p className="text-[14px] text-neutral-50 mb-8">
            Your first application is free. No credit card, no commitment.
          </p>
          <Link
            href="/#hero-input"
            className="inline-flex items-center gap-2.5 bg-primary text-white px-8 py-3.5 rounded-xl text-[15px] font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            Start for free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-[12px] text-neutral-40 mt-3">
            No credit card required &middot; Set up in 60 seconds
          </p>
        </div>
      </section>
    </div>
  );
}
