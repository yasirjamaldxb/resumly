'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const navLinks = [
  {
    label: 'Resume Templates',
    href: '/resume-templates',
    dropdown: [
      { label: 'ATS-Friendly Templates', href: '/resume-templates#ats' },
      { label: 'Modern Templates', href: '/resume-templates#modern' },
      { label: 'Classic Templates', href: '/resume-templates#classic' },
      { label: 'Creative Templates', href: '/resume-templates#creative' },
    ],
  },
  {
    label: 'Resume Examples',
    href: '/resume-examples',
    dropdown: [
      { label: 'Software Engineer', href: '/resume-examples/software-engineer' },
      { label: 'Marketing Manager', href: '/resume-examples/marketing-manager' },
      { label: 'Nurse', href: '/resume-examples/nurse' },
      { label: 'Student Resume', href: '/resume-examples/student' },
      { label: 'View All Examples', href: '/resume-examples' },
    ],
  },
  {
    label: 'Cover Letter',
    href: '/cover-letter-builder',
    dropdown: [
      { label: 'Cover Letter Builder', href: '/cover-letter-builder' },
      { label: 'Cover Letter Guide', href: '/blog/how-to-write-a-cover-letter' },
    ],
  },
  { label: 'FAQ', href: '/#faq' },
  {
    label: 'Resources',
    href: '/blog',
    dropdown: [
      { label: 'How to Write a Resume', href: '/blog/how-to-write-a-resume' },
      { label: 'ATS Resume Guide', href: '/blog/ats-resume-guide' },
      { label: 'AI Resume Builder', href: '/ai-resume-builder' },
      { label: 'All Guides', href: '/blog' },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-20">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
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
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-neutral-70 hover:text-neutral-90 transition-colors"
                >
                  {link.label}
                  {link.dropdown && (
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {link.dropdown && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-neutral-20 py-2 z-50">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-[14px] text-neutral-60 hover:text-primary hover:bg-primary-light transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push('/');
                    router.refresh();
                  }}
                  className="text-[15px] font-medium text-neutral-70 hover:text-primary transition-colors"
                >
                  Sign out
                </button>
                <Button size="md" variant="outline" asChild>
                  <Link href="/dashboard">My Account</Link>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-[15px] font-medium text-neutral-70 hover:text-primary transition-colors">
                  Sign in
                </Link>
                <Button size="md" variant="outline" asChild>
                  <Link href="/auth/signup">My Account</Link>
                </Button>
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-20 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-[15px] font-medium text-neutral-70 hover:text-primary rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
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
                  <Button size="lg" asChild>
                    <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>My Account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
