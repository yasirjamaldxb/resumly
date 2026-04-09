import { createClient } from '@supabase/supabase-js';
import { ATSProTemplate } from '@/components/resume/templates/ats-pro';
import { ModernTemplate } from '@/components/resume/templates/modern';
import { ProfessionalTemplate } from '@/components/resume/templates/professional';
import { MinimalTemplate } from '@/components/resume/templates/minimal';
import { ExecutiveTemplate } from '@/components/resume/templates/executive';
import { CreativeTemplate } from '@/components/resume/templates/creative';
import { CompactTemplate } from '@/components/resume/templates/compact';
import { ElegantTemplate } from '@/components/resume/templates/elegant';
import { TechnicalTemplate } from '@/components/resume/templates/technical';
import { ClassicTemplate } from '@/components/resume/templates/classic';
import { getTemplateStyles } from '@/lib/template-utils';
import { notFound } from 'next/navigation';

const templateMap: Record<string, any> = {
  'ats-pro': ATSProTemplate,
  'modern': ModernTemplate,
  'professional': ProfessionalTemplate,
  'minimal': MinimalTemplate,
  'executive': ExecutiveTemplate,
  'creative': CreativeTemplate,
  'compact': CompactTemplate,
  'elegant': ElegantTemplate,
  'technical': TechnicalTemplate,
  'classic': ClassicTemplate,
};

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !resume) return notFound();

  const resumeData = {
    ...resume.resume_data,
    templateId: resume.template_id,
    colorScheme: resume.color_scheme || 'default',
    fontFamily: resume.resume_data?.fontFamily || 'inter',
    // Use generous spacing so content fills the full A4 page for screenshots
    layoutSettings: {
      fontSize: 'large',
      lineHeight: 1.75,
      pageFormat: 'a4',
      headerAlignment: resume.resume_data?.layoutSettings?.headerAlignment || 'left',
      dateAlignment: 'right',
      dateFormat: 'MM/YYYY',
      margins: {
        topBottom: 44,
        leftRight: 48,
        betweenSections: 18,
      },
    },
  };

  const styles = getTemplateStyles(resumeData, 1);
  const TemplateComponent = templateMap[resume.template_id] || ATSProTemplate;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: ${styles.pageWidth}px;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        `}</style>
      </head>
      <body>
        <div style={{ width: styles.pageWidth, fontFamily: styles.fontFamily }}>
          <TemplateComponent data={resumeData} styles={styles} />
        </div>
      </body>
    </html>
  );
}
