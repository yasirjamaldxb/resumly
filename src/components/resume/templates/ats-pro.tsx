import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function ATSProTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const headerAlign = s.headerAlignment;
  const headerTextAlign = headerAlign;
  const headerJustify = headerAlign === 'center' ? 'center' : headerAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.baseFontSize}px`,
        lineHeight: s.lineHeight,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: `${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px`,
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${s.colorScheme}`, paddingBottom: `${12 * s.scale}px`, marginBottom: `${s.sectionGap}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${14 * s.scale}px`, justifyContent: headerJustify }}>
          {p.photo && (
            <img
              src={p.photo}
              alt=""
              style={{
                width: `${60 * s.scale}px`,
                height: `${60 * s.scale}px`,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ textAlign: headerTextAlign }}>
        {fullName && (
          <h1 style={{ fontSize: `${s.headingFontSize}px`, fontWeight: 700, margin: 0, color: '#1a1a1a', letterSpacing: '-0.3px' }}>
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p style={{ fontSize: `${s.subHeadingFontSize}px`, color: s.colorScheme, fontWeight: 600, margin: `${2 * s.scale}px 0 ${8 * s.scale}px` }}>
            {p.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${4 * s.scale}px ${16 * s.scale}px`, fontSize: `${s.smallFontSize}px`, color: '#555', justifyContent: headerJustify }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedIn && <span>{p.linkedIn}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <Section title="Professional Summary" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>{p.summary}</p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="Work Experience" color={s.colorScheme} styles={s}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${12 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>{job.position}</p>
                  <p style={{ margin: 0, color: s.colorScheme, fontSize: `${s.bodyFontSize}px`, fontWeight: 600 }}>
                    {job.company}{job.location ? ` • ${job.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>{job.description}</p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: `${4 * s.scale}px 0 0`, paddingLeft: `${16 * s.scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ fontSize: `${s.bodyFontSize}px`, color: '#333', marginBottom: `${2 * s.scale}px` }}>
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
        <Section title="Education" color={s.colorScheme} styles={s}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ margin: 0, color: s.colorScheme, fontSize: `${s.bodyFontSize}px` }}>
                    {edu.institution}{edu.location ? ` • ${edu.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && (
                <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#555' }}>GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills" color={s.colorScheme} styles={s}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${6 * s.scale}px` }}>
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  fontSize: `${s.smallFontSize}px`,
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: `${2 * s.scale}px ${8 * s.scale}px`,
                  borderRadius: `${4 * s.scale}px`,
                  border: '1px solid #e5e7eb',
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications" color={s.colorScheme} styles={s}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${6 * s.scale}px` }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.bodyFontSize}px` }}>{cert.name}</p>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666' }}>{cert.issuer}</p>
              </div>
              <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#666' }}>{formatDate(cert.date)}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects" color={s.colorScheme} styles={s}>
          {projects.map((project, i) => (
            <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>{project.name}</p>
                {project.url && (
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: s.colorScheme }}>{project.url}</p>
                )}
              </div>
              {project.description && (
                <p style={{ margin: `${3 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>{project.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="Languages" color={s.colorScheme} styles={s}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${12 * s.scale}px` }}>
            {languages.map((lang) => (
              <div key={lang.id} style={{ fontSize: `${s.bodyFontSize}px` }}>
                <span style={{ fontWeight: 600 }}>{lang.name}</span>
                <span style={{ color: '#666', marginLeft: `${4 * s.scale}px` }}>({lang.proficiency})</span>
              </div>
            ))}
          </div>
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
          fontSize: `${styles.sectionTitleFontSize}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: color,
          margin: `0 0 ${8 * styles.scale}px`,
          paddingBottom: `${4 * styles.scale}px`,
          borderBottom: `1px solid #e5e7eb`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
