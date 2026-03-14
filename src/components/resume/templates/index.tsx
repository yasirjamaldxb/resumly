'use client';

import { ResumeData } from '@/types/resume';
import { ATSProTemplate } from './ats-pro';
import { ModernTemplate } from './modern';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ResumeTemplate({ data, scale = 1 }: Props) {
  switch (data.templateId) {
    case 'modern':
      return <ModernTemplate data={data} scale={scale} />;
    case 'professional':
      return <ATSProTemplate data={data} scale={scale} />;
    case 'minimal':
      return <ATSProTemplate data={data} scale={scale} />;
    case 'executive':
      return <ModernTemplate data={data} scale={scale} />;
    case 'creative':
      return <ModernTemplate data={data} scale={scale} />;
    case 'ats-pro':
    default:
      return <ATSProTemplate data={data} scale={scale} />;
  }
}

export { ATSProTemplate, ModernTemplate };
