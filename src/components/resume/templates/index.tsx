'use client';

import { ResumeData } from '@/types/resume';
import { getTemplateStyles } from '@/lib/template-utils';
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
  const styles = getTemplateStyles(data, scale);

  const template = (() => { switch (data.templateId) {
    case 'modern':
      return <ModernTemplate data={data} styles={styles} />;
    case 'professional':
      return <ProfessionalTemplate data={data} styles={styles} />;
    case 'minimal':
      return <MinimalTemplate data={data} styles={styles} />;
    case 'executive':
      return <ExecutiveTemplate data={data} styles={styles} />;
    case 'creative':
      return <CreativeTemplate data={data} styles={styles} />;
    case 'compact':
      return <CompactTemplate data={data} styles={styles} />;
    case 'elegant':
      return <ElegantTemplate data={data} styles={styles} />;
    case 'technical':
      return <TechnicalTemplate data={data} styles={styles} />;
    case 'classic':
      return <ClassicTemplate data={data} styles={styles} />;
    case 'ats-pro':
    default:
      return <ATSProTemplate data={data} styles={styles} />;
  } })();

  return <div style={{ fontFamily: styles.fontFamily }}>{template}</div>;
}

export { ATSProTemplate, ModernTemplate, ProfessionalTemplate, MinimalTemplate, ExecutiveTemplate, CreativeTemplate, CompactTemplate, ElegantTemplate, TechnicalTemplate, ClassicTemplate };
