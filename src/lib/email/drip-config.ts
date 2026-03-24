// Drip campaign configuration
// Each email has a delay (hours after signup), subject line options, and behavioral conditions

export interface DripEmail {
  number: number;
  delayHours: number; // hours after signup to send
  subjects: string[]; // A/B test options (pick randomly)
  skipIf?: 'completed_resume' | 'downloaded_pdf';
}

export const DRIP_SEQUENCE: DripEmail[] = [
  {
    number: 1,
    delayHours: 0, // immediately on signup
    subjects: [
      'Welcome to Resumly — your resume in minutes',
      'Your free resume builder is ready',
      '3 minutes to a professional resume',
    ],
  },
  {
    number: 2,
    delayHours: 24, // 1 day
    subjects: [
      'Your resume is waiting — finish in 5 min',
      "Don't leave your resume half-finished",
      'Pick up where you left off',
    ],
    skipIf: 'completed_resume',
  },
  {
    number: 3,
    delayHours: 72, // 3 days
    subjects: [
      '5 resume mistakes that cost interviews',
      'What recruiters actually look for',
      'The #1 mistake on 90% of resumes',
    ],
  },
  {
    number: 4,
    delayHours: 120, // 5 days
    subjects: [
      'Which resume style matches your industry?',
      'Find your perfect resume template',
      '10 professional templates — pick yours',
    ],
  },
  {
    number: 5,
    delayHours: 168, // 7 days
    subjects: [
      'Your resume is ready to download',
      'One click to a job-ready PDF',
      "You're closer than you think",
    ],
    skipIf: 'downloaded_pdf',
  },
  {
    number: 6,
    delayHours: 240, // 10 days
    subjects: [
      'How job seekers are landing interviews',
      'From applying to hired — real tips',
      'People are getting hired with resumes like yours',
    ],
  },
  {
    number: 7,
    delayHours: 336, // 14 days
    subjects: [
      'Know someone who needs a resume?',
      'Help a friend land their next job',
      'Quick favor? (takes 10 seconds)',
    ],
  },
];

export function getEmailConfig(emailNumber: number): DripEmail | undefined {
  return DRIP_SEQUENCE.find((e) => e.number === emailNumber);
}

export function pickSubject(email: DripEmail): string {
  return email.subjects[Math.floor(Math.random() * email.subjects.length)];
}
