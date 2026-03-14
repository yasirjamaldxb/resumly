import Link from 'next/link';

const footerLinks = {
  'AI Resume Builder': [
    { label: 'Free Resume Builder', href: '/resume-builder' },
    { label: 'ATS Resume Checker', href: '/ats-checker' },
    { label: 'Cover Letter Builder', href: '/cover-letter-builder' },
    { label: 'Resume Templates', href: '/resume-templates' },
    { label: 'Cover Letter Examples', href: '/blog/cover-letter-tips' },
    { label: 'Cover Letter Templates', href: '/cover-letter-builder' },
  ],
  'Job Search': [
    { label: 'Software Engineer', href: '/resume-examples/software-engineer' },
    { label: 'Marketing Manager', href: '/resume-examples/marketing-manager' },
    { label: 'Nurse Resume', href: '/resume-examples/nurse' },
    { label: 'Student Resume', href: '/resume-examples/student' },
    { label: 'All Examples', href: '/resume-examples' },
  ],
  'About Us': [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Sponsorship Program', href: '/about' },
    { label: 'Affiliates', href: '/about' },
  ],
  'Help': [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Right of Withdrawal', href: '/terms' },
    { label: 'Do Not Sell My Data', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-90 text-neutral-40">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                </svg>
              </div>
              <span className="text-[20px] font-bold text-white tracking-tight">
                resumly<span className="text-primary">.app</span>
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed mb-5 text-neutral-40">
              Build ATS-friendly resumes that get you hired. Free and trusted by millions.
            </p>
            <div className="flex gap-3">
              {['T', 'in', 'f', 'ig'].map((s) => (
                <div key={s} className="w-8 h-8 bg-neutral-80 rounded-lg flex items-center justify-center text-[12px] text-neutral-40 hover:bg-primary hover:text-white transition-colors cursor-pointer font-semibold">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-[14px] mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[14px] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-neutral-50">
            &copy; {new Date().getFullYear()} Resumly.app. All rights reserved.
          </p>
          <p className="text-[13px] text-neutral-50">
            Free Privacy-Friendly Resume Builder
          </p>
        </div>
      </div>
    </footer>
  );
}
