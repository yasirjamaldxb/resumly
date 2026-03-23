import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function ExecutiveTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const contactParts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  const headerAlign = s.headerAlignment;
  const headerJustify = headerAlign === 'center' ? 'center' : headerAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.bodyFontSize}px`,
        lineHeight: s.lineHeight,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        display: 'flex',
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: `${6 * s.scale}px`,
          flexShrink: 0,
          backgroundColor: s.colorScheme,
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: `${s.paddingTop}px ${s.paddingRight}px`,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: `${12 * s.scale}px`, display: 'flex', alignItems: 'center', gap: `${16 * s.scale}px`, justifyContent: headerJustify }}>
          {p.photo && (
            <img
              src={p.photo}
              alt=""
              style={{
                width: `${70 * s.scale}px`,
                height: `${70 * s.scale}px`,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `${3 * s.scale}px solid ${s.colorScheme}`,
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ textAlign: s.headerAlignment }}>
            {fullName && (
              <h1
                style={{
                  fontSize: `${s.headingFontSize * 1.18}px`,
                  fontWeight: 700,
                  margin: 0,
                  color: '#1a1a1a',
                  letterSpacing: '-0.01em',
                }}
              >
                {fullName}
              </h1>
            )}
            {p.jobTitle && (
              <p
                style={{
                  fontSize: `${s.subHeadingFontSize}px`,
                  color: s.colorScheme,
                  fontWeight: 600,
                  margin: `${4 * s.scale}px 0 0`,
                }}
              >
                {p.jobTitle}
              </p>
            )}
            {contactParts.length > 0 && (
              <p
                style={{
                  fontSize: `${s.smallFontSize * 0.95}px`,
                  color: '#666',
                  margin: `${8 * s.scale}px 0 0`,
                }}
              >
                {contactParts.join('  |  ')}
              </p>
            )}
          </div>
        </div>

        {/* Horizontal rule */}
        <hr
          style={{
            border: 'none',
            borderTop: `2px solid ${s.colorScheme}`,
            margin: `0 0 ${s.sectionGap}px`,
          }}
        />

        {/* Summary */}
        {p.summary && (
          <Section title="Executive Summary" color={s.colorScheme} styles={s}>
            <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
              {p.summary}
            </p>
          </Section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <Section title="Professional Experience" color={s.colorScheme} styles={s}>
            {workExperience.map((job, i) => (
              <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${16 * s.scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${(s.baseFontSize + 0.5)}px`, color: '#1a1a1a' }}>
                    {job.position}
                  </p>
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                  </p>
                </div>
                <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#555', fontWeight: 500 }}>
                  {job.company}{job.location ? `, ${job.location}` : ''}
                </p>
                {job.description && (
                  <p style={{ margin: `${6 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
                    {job.description}
                  </p>
                )}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: `${4 * s.scale}px 0 0`, paddingLeft: `${18 * s.scale}px` }}>
                    {job.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx} style={{ fontSize: `${s.bodyFontSize}px`, color: '#333', marginBottom: `${3 * s.scale}px`, lineHeight: s.lineHeight }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#555' }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.gpa && (
                  <p style={{ margin: `${3 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#666' }}>GPA: {edu.gpa}</p>
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

        {/* Skills - 2-column grid with colored bullet dots */}
        {skills.length > 0 && (
          <Section title="Core Competencies" color={s.colorScheme} styles={s}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: `${4 * s.scale}px ${24 * s.scale}px`,
              }}
            >
              {skills.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: `${6 * s.scale}px` }}>
                  <div
                    style={{
                      width: `${6 * s.scale}px`,
                      height: `${6 * s.scale}px`,
                      borderRadius: '50%',
                      backgroundColor: s.colorScheme,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: `${s.bodyFontSize}px`, color: '#333' }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" color={s.colorScheme} styles={s}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${6 * s.scale}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.bodyFontSize}px` }}>{cert.name}</p>
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#777' }}>{formatDate(cert.date)}</p>
                </div>
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#666' }}>{cert.issuer}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Key Projects" color={s.colorScheme} styles={s}>
            {projects.map((project, i) => (
              <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>{project.name}</p>
                  {(project.startDate || project.endDate) && (
                    <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                    </p>
                  )}
                </div>
                {project.url && (
                  <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.95}px`, color: s.colorScheme }}>{project.url}</p>
                )}
                {project.description && (
                  <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages" color={s.colorScheme} styles={s}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${16 * s.scale}px` }}>
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
    </div>
  );
}

function Section({ title, color, styles, children }: { title: string; color: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 1.1}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * styles.scale}px`, marginBottom: `${8 * styles.scale}px` }}>
        <div
          style={{
            width: `${8 * styles.scale}px`,
            height: `${8 * styles.scale}px`,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontSize: `${styles.subHeadingFontSize}px`,
            fontWeight: 700,
            margin: 0,
            color: color,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
