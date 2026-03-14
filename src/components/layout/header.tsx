'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  { label: 'Cover Letter', href: '/cover-letter-builder' },
  { label: 'ATS Checker', href: '/ats-checker' },
  {
    label: 'Resources',
    href: '/blog',
    dropdown: [
      { label: 'How to Write a Resume', href: '/blog/how-to-write-a-resume' },
      { label: 'ATS Resume Guide', href: '/blog/ats-resume-guide' },
      { label: 'Resume Tips 2025', href: '/blog/resume-tips' },
      { label: 'AI Resume Builder', href: '/ai-resume-builder' },
      { label: 'All Guides →', href: '/blog' },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              resumly<span className="text-blue-600">.app</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.label}
                  {link.dropdown && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {link.dropdown && openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Sign in
            </Link>
            <Button size="md" asChild>
              <Link href="/resume-builder">Build My Resume</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/auth/login" className="block px-3 py-2 text-sm font-medium text-gray-700">
                Sign in
              </Link>
              <Button size="md" className="mx-3" asChild>
                <Link href="/resume-builder">Build My Resume</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
