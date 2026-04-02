import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function MinimalTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const contactParts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  const headerAlign = s.headerAlignment;
  const headerTextAlign = headerAlign;

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.bodyFontSize}px`,
        lineHeight: s.lineHeight,
        color: '#333',
        backgroundColor: '#ffffff',
        padding: `${s.paddingTop * 1.2}px ${s.paddingLeft * 1.3}px ${s.paddingBottom * 1.2}px`,
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: `${28 * s.scale}px`, textAlign: headerTextAlign }}>
        {fullName && (
          <h1
            style={{
              fontSize: `${s.headingFontSize * 1.27}px`,
              fontWeight: 300,
              margin: 0,
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              fontSize: `${s.subHeadingFontSize}px`,
              fontWeight: 400,
              color: s.colorScheme,
              margin: `${4 * s.scale}px 0 0`,
            }}
          >
            {p.jobTitle}
          </p>
        )}
        {contactParts.length > 0 && (
          <p
            style={{
              fontSize: `${s.smallFontSize * 0.9}px`,
              color: '#888',
              margin: `${8 * s.scale}px 0 0`,
              letterSpacing: '0.02em',
            }}
          >
            {contactParts.join('  \u00b7  ')}
          </p>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <Section title="summary" styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
            {p.summary}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="experience" styles={s}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${14 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.baseFontSize}px`, color: '#1a1a1a' }}>
                  {job.position}
                </p>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#777' }}>
                {job.company}{job.location ? `, ${job.location}` : ''}
              </p>
              {job.description && (
                <p style={{ margin: `${6 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <div style={{ marginTop: `${4 * s.scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <p key={idx} style={{ margin: `${2 * s.scale}px 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
                      {bullet}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="education" styles={s}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.baseFontSize}px`, color: '#1a1a1a' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#777' }}>
                {edu.institution}{edu.location ? `, ${edu.location}` : ''}
              </p>
              {edu.gpa && (
                <p style={{ margin: `${3 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.95}px`, color: '#888' }}>GPA: {edu.gpa}</p>
              )}
              {edu.achievements && (
                <p style={{ margin: `${3 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
                  {edu.achievements}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="skills" styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
            {skills.map((sk) => sk.name).join(', ')}
          </p>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="projects" styles={s}>
          {projects.map((project, i) => (
            <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.baseFontSize}px`, color: '#1a1a1a' }}>
                  {project.name}
                </p>
                {(project.startDate || project.endDate) && (
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                  </p>
                )}
              </div>
              {project.url && (
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.95}px`, color: s.colorScheme }}>{project.url}</p>
              )}
              {project.description && (
                <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="certifications" styles={s}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: `${6 * s.scale}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#1a1a1a' }}>{cert.name}</p>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999' }}>{formatDate(cert.date)}</p>
              </div>
              <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#777' }}>{cert.issuer}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="languages" styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#444' }}>
            {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, styles, children }: { title: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 1.5}px` }}>
      <div
        style={{
          borderTop: '1px solid #e0e0e0',
          paddingTop: `${10 * styles.scale}px`,
          marginBottom: `${8 * styles.scale}px`,
        }}
      >
        <h2
          style={{
            fontSize: `${styles.sectionTitleFontSize * 1.1}px`,
            fontWeight: 600,
            color: '#333',
            margin: 0,
            textTransform: 'lowercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
