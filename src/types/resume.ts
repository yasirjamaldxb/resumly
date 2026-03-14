export interface PersonalDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  achievements?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'elementary' | 'limited' | 'professional' | 'full' | 'native';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeData {
  id?: string;
  userId?: string;
  title: string;
  templateId: string;
  colorScheme: string;
  fontFamily: string;
  personalDetails: PersonalDetails;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ats' | 'modern' | 'classic' | 'creative' | 'minimal';
  preview: string;
  atsScore: number;
  popular?: boolean;
}

export const TEMPLATE_LIST: Template[] = [
  {
    id: 'ats-pro',
    name: 'ATS Pro',
    description: 'Maximized for ATS systems. Clean, simple, highly readable.',
    category: 'ats',
    preview: '/templates/ats-pro.png',
    atsScore: 99,
    popular: true,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean modern design with a professional sidebar accent.',
    category: 'modern',
    preview: '/templates/modern.png',
    atsScore: 92,
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional layout trusted by Fortune 500 recruiters.',
    category: 'classic',
    preview: '/templates/professional.png',
    atsScore: 96,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Elegant minimalism. Let your content speak for itself.',
    category: 'minimal',
    preview: '/templates/minimal.png',
    atsScore: 94,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold and authoritative for senior leadership roles.',
    category: 'modern',
    preview: '/templates/executive.png',
    atsScore: 90,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Contemporary design with sidebar for creative industries.',
    category: 'creative',
    preview: '/templates/creative.png',
    atsScore: 85,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Maximum content density. Perfect for experienced professionals.',
    category: 'ats',
    preview: '/templates/compact.png',
    atsScore: 97,
    popular: true,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined, sophisticated design with centered layout.',
    category: 'classic',
    preview: '/templates/elegant.png',
    atsScore: 91,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for engineers, developers, and IT professionals.',
    category: 'modern',
    preview: '/templates/technical.png',
    atsScore: 88,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless Harvard-style format. Maximum ATS compatibility.',
    category: 'classic',
    preview: '/templates/classic.png',
    atsScore: 98,
  },
];

export const emptyResume = (): ResumeData => ({
  title: 'My Resume',
  templateId: 'ats-pro',
  colorScheme: '#2563eb',
  fontFamily: 'inter',
  personalDetails: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  projects: [],
});
