// Pricing plan configuration and limits

export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface PlanLimits {
  maxApplications: number; // per month for starter, total for free
  maxResumes: number;
  maxOptimizations: number;
  coverLetters: boolean;
  interviewPrep: boolean;
  bundleDownload: boolean;
  dailyAlerts: boolean;
  weeklyReport: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    maxApplications: 3,
    maxResumes: 5,
    maxOptimizations: 3,
    coverLetters: true,
    interviewPrep: false,
    bundleDownload: false,
    dailyAlerts: false,
    weeklyReport: false,
  },
  starter: {
    maxApplications: 10, // per month
    maxResumes: 20,
    maxOptimizations: 10,
    coverLetters: true,
    interviewPrep: false,
    bundleDownload: false,
    dailyAlerts: true,
    weeklyReport: false,
  },
  pro: {
    maxApplications: Infinity,
    maxResumes: Infinity,
    maxOptimizations: Infinity,
    coverLetters: true,
    interviewPrep: true,
    bundleDownload: true,
    dailyAlerts: true,
    weeklyReport: true,
  },
  enterprise: {
    maxApplications: Infinity,
    maxResumes: Infinity,
    maxOptimizations: Infinity,
    coverLetters: true,
    interviewPrep: true,
    bundleDownload: true,
    dailyAlerts: true,
    weeklyReport: true,
  },
};

export const PLAN_PRICES = {
  starter: { monthly: 4.99, yearly: 39.99 },
  pro: { monthly: 9.99, yearly: 79.99 },
} as const;
