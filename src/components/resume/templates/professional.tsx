import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function ProfessionalTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const contactParts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  const headerAlign = s.headerAlignment;
  const headerTextAlign = headerAlign;
  const headerJustify = headerAlign === 'center' ? 'center' : headerAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.baseFontSize}px`,
        lineHeight: s.lineHeight,
        color: '#2d2d2d',
        backgroundColor: '#ffffff',
        padding: `${s.paddingTop * 1.1}px ${s.paddingLeft * 1.2}px ${s.paddingBottom * 1.1}px`,
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: headerJustify, gap: `${16 * s.scale}px`, marginBottom: `${s.sectionGap}px` }}>
        {p.photo && (
          <img
            src={p.photo}
            alt=""
            style={{
              width: `${65 * s.scale}px`,
              height: `${65 * s.scale}px`,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `${2 * s.scale}px solid ${s.colorScheme}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ textAlign: headerTextAlign }}>
          {fullName && (
            <h1
              style={{
                fontSize: `${s.headingFontSize * 1.18}px`,
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
                letterSpacing: '0.02em',
              }}
            >
              {fullName}
            </h1>
          )}
          {p.jobTitle && (
            <p
              style={{
                fontSize: `${s.subHeadingFontSize * 0.92}px`,
                color: '#555',
                margin: `${4 * s.scale}px 0 0`,
                fontStyle: 'italic',
              }}
            >
              {p.jobTitle}
            </p>
          )}
          {contactParts.length > 0 && (
            <p
              style={{
                fontSize: `${s.smallFontSize}px`,
                color: '#666',
                margin: `${8 * s.scale}px 0 0`,
              }}
            >
              {contactParts.join(' | ')}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <Section title="PROFESSIONAL SUMMARY" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
            {p.summary}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="WORK EXPERIENCE" color={s.colorScheme} styles={s}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${14 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                    {job.position}
                  </p>
                  <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', fontStyle: 'italic' }}>
                    {job.company}{job.location ? `, ${job.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${6 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333', paddingLeft: `${12 * s.scale}px`, lineHeight: s.lineHeight }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: `${4 * s.scale}px 0 0`, paddingLeft: `${24 * s.scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ fontSize: `${s.bodyFontSize}px`, color: '#333', marginBottom: `${2 * s.scale}px`, lineHeight: s.lineHeight }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="EDUCATION" color={s.colorScheme} styles={s}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', fontStyle: 'italic' }}>
                    {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && (
                <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#555', paddingLeft: `${12 * s.scale}px` }}>
                  GPA: {edu.gpa}
                </p>
              )}
              {edu.achievements && (
                <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#555', paddingLeft: `${12 * s.scale}px` }}>
                  {edu.achievements}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="SKILLS" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
            {skills.map((sk) => sk.name).join(', ')}
          </p>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="CERTIFICATIONS" color={s.colorScheme} styles={s}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: `${6 * s.scale}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.bodyFontSize}px` }}>{cert.name}</p>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666' }}>{formatDate(cert.date)}</p>
              </div>
              <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#555', fontStyle: 'italic' }}>
                {cert.issuer}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="PROJECTS" color={s.colorScheme} styles={s}>
          {projects.map((project, i) => (
            <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>{project.name}</p>
                {(project.startDate || project.endDate) && (
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                  </p>
                )}
              </div>
              {project.url && (
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: s.colorScheme }}>{project.url}</p>
              )}
              {project.description && (
                <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333', paddingLeft: `${12 * s.scale}px`, lineHeight: s.lineHeight }}>
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="LANGUAGES" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>
            {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, color, styles, children }: { title: string; color: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap}px` }}>
      <h2
        style={{
          fontSize: `${styles.sectionTitleFontSize * 1.1}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#1a1a1a',
          margin: `0 0 ${8 * styles.scale}px`,
          paddingBottom: `${6 * styles.scale}px`,
          borderBottom: `2px solid ${color}`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
