'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves through the top of the viewport
    if (e.clientY > 0) return;

    // Only show once per session
    if (sessionStorage.getItem('exit_intent_shown')) return;

    // Don't show on dashboard or builder pages
    const path = window.location.pathname;
    if (
      path.startsWith('/dashboard') ||
      path.startsWith('/funnel') ||
      path.startsWith('/r/') ||
      path.startsWith('/auth')
    ) {
      return;
    }

    sessionStorage.setItem('exit_intent_shown', 'true');
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Small delay before activating to avoid false triggers on page load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/ats-check/collect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit_intent' }),
      });
      setSubmitted(true);
    } catch {
      // Silently fail — don't block UX
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {!submitted ? (
              <>
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1a91f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                </div>

                <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
                  Wait! Your resume is almost ready
                </h2>

                <p className="mb-6 text-center text-sm text-gray-500">
                  Enter your email and we&apos;ll save a spot for you. Build a
                  professional, ATS-friendly resume in under 10 minutes — completely free.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-[#1a91f0] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1580d9] disabled:opacity-60"
                  >
                    {isSubmitting ? 'Saving...' : 'Get my resume started'}
                  </button>
                </form>

                <a
                  href="/#faq"
                  className="mt-4 block text-center text-xs text-gray-400 transition-colors hover:text-gray-600"
                >
                  Or see how it works first &rarr;
                </a>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  You&apos;re all set!
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  We&apos;ve saved your spot. Ready to build your resume?
                </p>
                <a
                  href="/"
                  className="inline-block rounded-lg bg-[#1a91f0] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1580d9]"
                >
                  Start building now
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
