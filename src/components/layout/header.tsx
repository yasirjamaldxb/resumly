'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/* ── Mega-menu item with icon + description ── */
function MegaItem({ icon, label, desc, href }: { icon: React.ReactNode; label: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 py-3">
      <span className="mt-0.5 text-primary/70 group-hover:text-primary transition-colors">{icon}</span>
      <div className="min-w-0">
        <span className="flex items-center gap-1.5 text-[15px] font-semibold text-neutral-80 group-hover:text-primary transition-colors">
          {label}
          <svg className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </span>
        <p className="text-[13px] text-neutral-50 leading-snug mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}

/* ── Simple link used in "Most Popular" columns ── */
function MegaLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="block py-1.5 text-[14px] text-neutral-60 hover:text-primary transition-colors">
      {label}
    </Link>
  );
}

/* ── Icons (inline SVG kept small) ── */
const icons = {
  ats: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  modern: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
  classic: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  creative: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072" /></svg>,
  professional: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>,
  simple: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
  education: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>,
  engineering: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1M4.5 12a7.5 7.5 0 1015 0 7.5 7.5 0 00-15 0z" /></svg>,
  retail: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" /></svg>,
  healthcare: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
  video: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>,
  podcast: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>,
  builder: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  ai: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
  coverletter: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
  word: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v4.5m-12-9V3.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V7.5M4.5 19.5h15" /></svg>,
};

/* ── Mega-menu content per nav item ── */
function MegaTemplates() {
  return (
    <div className="flex gap-0">
      <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-1 py-6 px-8">
        <MegaItem icon={icons.ats} label="ATS-Friendly" desc="Optimise your resume and impress employers with these ATS-friendly designs." href="/resume-templates#ats" />
        <MegaItem icon={icons.modern} label="Modern" desc="A current and stylish feel for forward-thinking candidates in innovative fields." href="/resume-templates#modern" />
        <MegaItem icon={icons.classic} label="Classic" desc="Time-tested layouts that recruiters know and trust for any industry." href="/resume-templates#classic" />
        <MegaItem icon={icons.professional} label="Professional" desc="Job-winning templates to showcase professionalism, dependability, and expertise." href="/resume-templates#professional" />
        <MegaItem icon={icons.simple} label="Simple" desc="Clean, timeless templates with a classic balanced structure. A perfect basic canvas." href="/resume-templates#simple" />
        <MegaItem icon={icons.creative} label="Creative" desc="Stand out with bold, unique designs for creative roles and portfolios." href="/resume-templates#creative" />
      </div>
      <div className="w-[280px] bg-[#f8f9fb] border-l border-neutral-20 py-6 px-6 flex flex-col gap-6">
        <Link href="/resume-builder" className="group block">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">{icons.builder}</div>
          <span className="text-[15px] font-semibold text-neutral-80 group-hover:text-primary transition-colors flex items-center gap-1">Resume Builder <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
          <p className="text-[13px] text-neutral-50 mt-1 leading-snug">Build powerful resumes in under 60 seconds with our easy to use Resume Builder.</p>
        </Link>
        <Link href="/ai-resume-builder" className="group block">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">{icons.ai}</div>
          <span className="text-[15px] font-semibold text-neutral-80 group-hover:text-primary transition-colors flex items-center gap-1">Get help from AI <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
          <p className="text-[13px] text-neutral-50 mt-1 leading-snug">Get ahead with our AI resume builder and land more interviews.</p>
        </Link>
      </div>
    </div>
  );
}

function MegaExamples() {
  return (
    <div className="flex gap-0">
      <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-1 py-6 px-8">
        <MegaItem icon={icons.education} label="Education" desc="Educate employers on your skills with a resume fit for any role in or outside the classroom." href="/resume-examples/teacher" />
        <MegaItem icon={icons.healthcare} label="Healthcare" desc="Create a healthcare resume that commands the attention of hiring managers." href="/resume-examples/nurse" />
        <MegaItem icon={icons.engineering} label="Engineering" desc="Build the foundation for success with a resume tailored to highlight your engineering skills." href="/resume-examples/software-engineer" />
        <MegaItem icon={icons.retail} label="Retail" desc="Showcase your retail experience with a resume that's as well-crafted as your displays." href="/resume-examples" />
      </div>
      <div className="w-[200px] border-l border-neutral-20 py-6 px-6">
        <h4 className="text-[14px] font-semibold text-neutral-80 mb-3">Most Popular</h4>
        <MegaLink label="Nurse" href="/resume-examples/nurse" />
        <MegaLink label="Software Engineer" href="/resume-examples/software-engineer" />
        <MegaLink label="Internship" href="/resume-examples/student" />
        <MegaLink label="Student" href="/resume-examples/student" />
        <MegaLink label="Accountant" href="/resume-examples/accountant" />
        <Link href="/resume-examples" className="flex items-center gap-1 mt-3 text-[14px] font-semibold text-primary hover:text-primary-dark transition-colors">
          All Examples <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <div className="w-[280px] bg-[#f8f9fb] border-l border-neutral-20 py-6 px-6">
        <Link href="/resume-examples" className="group block">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">{icons.builder}</div>
          <span className="text-[16px] font-bold text-neutral-80 group-hover:text-primary transition-colors">500+ Resume Examples by industry</span>
          <p className="text-[13px] text-neutral-50 mt-2 leading-snug">Use the expert guides and our resume builder to create a beautiful resume in minutes.</p>
          <span className="inline-flex items-center gap-1 mt-3 text-[14px] font-semibold text-primary group-hover:text-primary-dark transition-colors">Get started now <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
        </Link>
      </div>
    </div>
  );
}

function MegaCoverLetter() {
  return (
    <div className="flex gap-0">
      <div className="flex-1 py-6 px-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-neutral-80">Cover Letter Templates</h3>
          <Link href="/cover-letter-builder" className="text-[14px] font-semibold text-primary hover:text-primary-dark transition-colors">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          <MegaItem icon={icons.professional} label="Professional" desc="Polished designs to help you highlight your knowledge and expertise in formal fields." href="/cover-letter-builder" />
          <MegaItem icon={icons.simple} label="Simple" desc="Clean, straightforward templates aiming to keep the focus on your letter's writing and content." href="/cover-letter-builder" />
          <MegaItem icon={icons.modern} label="Modern" desc="A contemporary feel for candidates who want to stand out with style." href="/cover-letter-builder" />
          <MegaItem icon={icons.classic} label="Classic" desc="Traditional, trusted formats that work across all industries and roles." href="/cover-letter-builder" />
        </div>
      </div>
      <div className="w-[200px] border-l border-neutral-20 py-6 px-6">
        <h4 className="text-[14px] font-semibold text-neutral-80 mb-3">Cover Letter Examples</h4>
        <MegaLink label="Nursing" href="/cover-letter-builder" />
        <MegaLink label="Administrative Assistant" href="/cover-letter-builder" />
        <MegaLink label="Internship" href="/cover-letter-builder" />
        <MegaLink label="Graduate" href="/cover-letter-builder" />
        <MegaLink label="Teacher" href="/cover-letter-builder" />
        <Link href="/cover-letter-builder" className="flex items-center gap-1 mt-3 text-[14px] font-semibold text-primary hover:text-primary-dark transition-colors">
          All Examples <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <div className="w-[280px] bg-[#f8f9fb] border-l border-neutral-20 py-6 px-6">
        <Link href="/cover-letter-builder" className="group block">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">{icons.coverletter}</div>
          <span className="text-[16px] font-bold text-neutral-80 group-hover:text-primary transition-colors">Cover Letter Builder</span>
          <p className="text-[13px] text-neutral-50 mt-2 leading-snug">Build professional cover letters in a few simple steps with our AI Cover Letter builder.</p>
          <span className="inline-flex items-center gap-1 mt-3 text-[14px] font-semibold text-primary group-hover:text-primary-dark transition-colors">Get started now <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
        </Link>
      </div>
    </div>
  );
}

function MegaResources() {
  return (
    <div className="flex gap-0">
      <div className="flex-1 py-6 px-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-neutral-80">Resources</h3>
          <Link href="/blog" className="text-[14px] font-semibold text-primary hover:text-primary-dark transition-colors">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          <MegaItem icon={icons.video} label="How to Write a Resume" desc="Step-by-step guide to writing a resume that gets you hired." href="/blog/how-to-write-a-resume" />
          <MegaItem icon={icons.podcast} label="ATS Resume Guide" desc="Learn how to beat applicant tracking systems and land interviews." href="/blog/ats-resume-guide" />
        </div>
      </div>
      <div className="w-[200px] border-l border-neutral-20 py-6 px-6">
        <h4 className="text-[14px] font-semibold text-neutral-80 mb-3">Blog Categories</h4>
        <MegaLink label="Resume Help" href="/blog" />
        <MegaLink label="Cover Letter" href="/blog/how-to-write-a-cover-letter" />
        <MegaLink label="Career" href="/blog" />
        <MegaLink label="Job Interview" href="/blog" />
      </div>
      <div className="w-[280px] bg-[#f8f9fb] border-l border-neutral-20 py-6 px-6">
        <h4 className="text-[14px] font-semibold text-neutral-80 mb-4">Latest</h4>
        <Link href="/blog/how-to-write-a-resume" className="group block">
          <span className="text-[14px] font-semibold text-neutral-80 group-hover:text-primary transition-colors leading-snug block">How to Write a Resume: Expert Guide &amp; Examples (2026)</span>
          <span className="text-[12px] text-neutral-40 mt-1 block">Post &middot; 6 min</span>
        </Link>
      </div>
    </div>
  );
}

const megaMenus: Record<string, () => React.ReactNode> = {
  'Resume Templates': MegaTemplates,
  'Resume Examples': MegaExamples,
  'Cover Letter': MegaCoverLetter,
  'Resources': MegaResources,
};

const navItems = [
  { label: 'Resume Templates', href: '/resume-templates', hasMega: true },
  { label: 'Resume Examples', href: '/resume-examples', hasMega: true },
  { label: 'ATS Checker', href: '/ats-checker', hasMega: false },
  { label: 'Pricing', href: '/pricing', hasMega: false },
  { label: 'FAQ', href: '/#faq', hasMega: false },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        // Near top — always show
        setVisible(true);
      } else if (currentY < lastScrollY) {
        // Scrolling up — reveal
        setVisible(true);
      } else if (currentY > lastScrollY + 4) {
        // Scrolling down — hide
        setVisible(false);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-20 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
            </div>
            <span className="text-[22px] font-bold text-neutral-90 tracking-tight">
              resumly<span className="text-primary">.app</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() => item.hasMega && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] font-medium whitespace-nowrap transition-colors ${
                    openDropdown === item.label ? 'text-primary' : 'text-neutral-70 hover:text-neutral-90'
                  }`}
                >
                  {item.label}
                  {item.hasMega && (
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* CTA — right side */}
          <div className="hidden lg:flex items-center gap-1">
            {user ? (
              <>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push('/');
                    router.refresh();
                  }}
                  className="px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] font-medium whitespace-nowrap text-neutral-70 hover:text-primary transition-colors"
                >
                  Sign out
                </button>
                <span className="w-px h-5 bg-neutral-20 mx-1" />
                <Link
                  href="/dashboard"
                  className="ml-1 px-3 xl:px-4 py-2 text-[13px] xl:text-[14px] font-semibold whitespace-nowrap text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                >
                  My Account
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] font-medium whitespace-nowrap text-neutral-70 hover:text-primary transition-colors">
                  Sign in
                </Link>
                <span className="w-px h-5 bg-neutral-20 mx-1" />
                <Link
                  href="/auth/signup"
                  className="ml-1 px-3 xl:px-4 py-2 text-[13px] xl:text-[14px] font-semibold whitespace-nowrap text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-neutral-60 hover:bg-neutral-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mega-menu panels — full width, below header */}
      {openDropdown && megaMenus[openDropdown] && (
        <div
          className="absolute left-0 right-0 top-full bg-white border-t border-neutral-20 shadow-xl z-50"
          onMouseEnter={() => setOpenDropdown(openDropdown)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <div className="max-w-[1200px] mx-auto">
            {megaMenus[openDropdown]()}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-20 py-4 px-6 space-y-1 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 text-[15px] font-medium text-neutral-70 hover:text-primary rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-2 px-3">
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-[15px] font-medium text-neutral-70" onClick={() => setMobileOpen(false)}>
                  My Account
                </Link>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    setMobileOpen(false);
                    router.push('/');
                    router.refresh();
                  }}
                  className="block py-2 text-[15px] font-medium text-neutral-70 text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-[15px] font-medium text-neutral-70" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2.5 text-center text-[15px] font-semibold text-primary border border-primary rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  My Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
