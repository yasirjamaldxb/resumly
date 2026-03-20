'use client';

import { ResumeData } from '@/types/resume';
import { ATSProTemplate } from './ats-pro';
import { ModernTemplate } from './modern';
import { ProfessionalTemplate } from './professional';
import { MinimalTemplate } from './minimal';
import { ExecutiveTemplate } from './executive';
import { CreativeTemplate } from './creative';
import { CompactTemplate } from './compact';
import { ElegantTemplate } from './elegant';
import { TechnicalTemplate } from './technical';
import { ClassicTemplate } from './classic';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ResumeTemplate({ data, scale = 1 }: Props) {
  switch (data.templateId) {
    case 'modern':
      return <ModernTemplate data={data} scale={scale} />;
    case 'professional':
      return <ProfessionalTemplate data={data} scale={scale} />;
    case 'minimal':
      return <MinimalTemplate data={data} scale={scale} />;
    case 'executive':
      return <ExecutiveTemplate data={data} scale={scale} />;
    case 'creative':
      return <CreativeTemplate data={data} scale={scale} />;
    case 'compact':
      return <CompactTemplate data={data} scale={scale} />;
    case 'elegant':
      return <ElegantTemplate data={data} scale={scale} />;
    case 'technical':
      return <TechnicalTemplate data={data} scale={scale} />;
    case 'classic':
      return <ClassicTemplate data={data} scale={scale} />;
    case 'ats-pro':
    default:
      return <ATSProTemplate data={data} scale={scale} />;
  }
}

export { ATSProTemplate, ModernTemplate, ProfessionalTemplate, MinimalTemplate, ExecutiveTemplate, CreativeTemplate, CompactTemplate, ElegantTemplate, TechnicalTemplate, ClassicTemplate };
