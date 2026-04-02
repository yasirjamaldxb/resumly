import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function CompactTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const contactItems = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  // Compact uses ~70% of normal padding for tighter layout
  const compactPaddingTop = s.paddingTop * 0.6;
  const compactPaddingLeft = s.paddingLeft * 0.85;

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.smallFontSize}px`,
        lineHeight: s.lineHeight * 0.95,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
        borderTop: `${3 * s.scale}px solid ${s.colorScheme}`,
        padding: `${compactPaddingTop}px ${compactPaddingLeft}px ${s.paddingBottom * 0.6}px`,
      }}
    >
      {/* Header: name left, contact right */}
      <div
        style={{
          display: 'flex',
          justifyContent: s.headerAlignment === 'center' ? 'center' : s.headerAlignment === 'right' ? 'flex-end' : 'space-between',
          alignItems: 'flex-start',
          marginBottom: `${10 * s.scale}px`,
          paddingBottom: `${8 * s.scale}px`,
          borderBottom: `1px solid #e0e0e0`,
          flexDirection: s.headerAlignment === 'center' ? 'column' : 'row',
          ...(s.headerAlignment === 'center' ? { alignItems: 'center' } : {}),
        }}
      >
        <div style={{ textAlign: s.headerAlignment }}>
          {fullName && (
            <h1
              style={{
                fontSize: `${s.headingFontSize * 0.91}px`,
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
                lineHeight: 1.2,
              }}
            >
              {fullName}
            </h1>
          )}
          {p.jobTitle && (
            <p
              style={{
                fontSize: `${s.smallFontSize}px`,
                color: '#555',
                margin: `${2 * s.scale}px 0 0`,
              }}
            >
              {p.jobTitle}
            </p>
          )}
        </div>
        {contactItems.length > 0 && (
          <div
            style={{
              textAlign: s.headerAlignment === 'center' ? 'center' : 'right',
              fontSize: `${s.smallFontSize * 0.9}px`,
              color: '#555',
              lineHeight: s.lineHeight,
              flexShrink: 0,
              maxWidth: `${320 * s.scale}px`,
              ...(s.headerAlignment === 'center' ? { marginTop: `${4 * s.scale}px` } : {}),
            }}
          >
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && <span style={{ margin: `0 ${4 * s.scale}px`, color: '#ccc' }}>|</span>}
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ marginBottom: `${s.sectionGap * 0.5}px` }}>
          <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
            <span style={{ fontWeight: 700, color: s.colorScheme }}>Summary: </span>
            {p.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <CompactSection title="Experience" color={s.colorScheme} styles={s}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${8 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.smallFontSize}px` }}>
                  {job.position}
                  <span style={{ fontWeight: 400, color: '#555' }}>
                    {' '}&mdash; {job.company}{job.location ? `, ${job.location}` : ''}
                  </span>
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${s.smallFontSize * 0.9}px`,
                    color: '#666',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: `${8 * s.scale}px`,
                  }}
                >
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#333' }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul
                  style={{
                    margin: `${2 * s.scale}px 0 0`,
                    paddingLeft: `${14 * s.scale}px`,
                  }}
                >
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: `${s.smallFontSize}px`,
                        color: '#333',
                        marginBottom: `${1 * s.scale}px`,
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CompactSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <CompactSection title="Education" color={s.colorScheme} styles={s}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${6 * s.scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px` }}>
                  <span style={{ fontWeight: 700 }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </span>
                  <span style={{ color: '#555' }}>
                    {' '}&mdash; {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                  </span>
                  {edu.gpa && (
                    <span style={{ color: '#666' }}> (GPA: {edu.gpa})</span>
                  )}
                </p>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: `${8 * s.scale}px` }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
            </div>
          ))}
        </CompactSection>
      )}

      {/* Skills - two column layout */}
      {skills.length > 0 && (
        <CompactSection title="Skills" color={s.colorScheme} styles={s}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${2 * s.scale}px ${16 * s.scale}px`,
              fontSize: `${s.smallFontSize}px`,
            }}
          >
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  width: `calc(50% - ${8 * s.scale}px)`,
                  boxSizing: 'border-box',
                  color: '#333',
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </CompactSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <CompactSection title="Certifications" color={s.colorScheme} styles={s}>
          {certifications.map((cert) => (
            <p key={cert.id} style={{ margin: `0 0 ${3 * s.scale}px`, fontSize: `${s.smallFontSize}px` }}>
              <span style={{ fontWeight: 600 }}>{cert.name}</span>
              <span style={{ color: '#555' }}> &mdash; {cert.issuer}</span>
              {cert.date && <span style={{ color: '#666' }}> ({formatDate(cert.date)})</span>}
            </p>
          ))}
        </CompactSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <CompactSection title="Projects" color={s.colorScheme} styles={s}>
          {projects.map((proj, i) => (
            <div key={proj.id} style={{ marginBottom: i < projects.length - 1 ? `${6 * s.scale}px` : 0 }}>
              <p style={{ margin: 0, fontSize: `${s.smallFontSize}px` }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ color: s.colorScheme, marginLeft: `${6 * s.scale}px`, fontSize: `${s.smallFontSize * 0.9}px` }}>{proj.url}</span>}
              </p>
              {proj.description && (
                <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#444' }}>{proj.description}</p>
              )}
            </div>
          ))}
        </CompactSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <CompactSection title="Languages" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#333' }}>
            {languages.map((lang, i) => (
              <span key={lang.id}>
                {i > 0 && ', '}
                <span style={{ fontWeight: 600 }}>{lang.name}</span>
                <span style={{ color: '#666' }}> ({lang.proficiency})</span>
              </span>
            ))}
          </p>
        </CompactSection>
      )}
    </div>
  );
}

function CompactSection({
  title,
  color,
  styles,
  children,
}: {
  title: string;
  color: string;
  styles: TemplateStyles;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 0.5}px` }}>
      <p
        style={{
          fontSize: `${styles.smallFontSize}px`,
          fontWeight: 700,
          color: color,
          margin: `0 0 ${4 * styles.scale}px`,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}:
      </p>
      {children}
    </div>
  );
}
