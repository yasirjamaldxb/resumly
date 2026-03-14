import Link from 'next/link';

const footerLinks = {
  'Resume Builder': [
    { label: 'Free Resume Builder', href: '/resume-builder' },
    { label: 'ATS Resume Checker', href: '/ats-checker' },
    { label: 'Cover Letter Builder', href: '/cover-letter-builder' },
    { label: 'Resume Templates', href: '/resume-templates' },
  ],
  'Resume Examples': [
    { label: 'Software Engineer', href: '/resume-examples/software-engineer' },
    { label: 'Marketing Manager', href: '/resume-examples/marketing-manager' },
    { label: 'Nurse Resume', href: '/resume-examples/nurse' },
    { label: 'Student Resume', href: '/resume-examples/student' },
    { label: 'All Examples', href: '/resume-examples' },
  ],
  'Resources': [
    { label: 'How to Write a Resume', href: '/blog/how-to-write-a-resume' },
    { label: 'Resume Tips 2025', href: '/blog/resume-tips' },
    { label: 'ATS Resume Guide', href: '/blog/ats-resume-guide' },
    { label: 'Cover Letter Tips', href: '/blog/cover-letter-tips' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-white font-bold text-lg">
                resumly<span className="text-blue-400">.app</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Build ATS-friendly resumes that get you hired. Trusted by over 100,000 job seekers.
            </p>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'facebook'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={social}
                >
                  <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Resumly.app. All rights reserved.
          </p>
          <p className="text-sm">
            Built to help you land your dream job. 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}
