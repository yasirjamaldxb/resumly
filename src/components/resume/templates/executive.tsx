import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ExecutiveTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const contactParts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: `${10.5 * scale}px`,
        lineHeight: 1.5,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        display: 'flex',
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: `${6 * scale}px`,
          flexShrink: 0,
          backgroundColor: data.colorScheme,
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: `${32 * scale}px ${36 * scale}px`,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: `${12 * scale}px` }}>
          {fullName && (
            <h1
              style={{
                fontSize: `${26 * scale}px`,
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
                fontSize: `${13 * scale}px`,
                color: data.colorScheme,
                fontWeight: 600,
                margin: `${4 * scale}px 0 0`,
              }}
            >
              {p.jobTitle}
            </p>
          )}
          {contactParts.length > 0 && (
            <p
              style={{
                fontSize: `${9.5 * scale}px`,
                color: '#666',
                margin: `${8 * scale}px 0 0`,
              }}
            >
              {contactParts.join('  |  ')}
            </p>
          )}
        </div>

        {/* Horizontal rule */}
        <hr
          style={{
            border: 'none',
            borderTop: `2px solid ${data.colorScheme}`,
            margin: `0 0 ${18 * scale}px`,
          }}
        />

        {/* Summary */}
        {p.summary && (
          <Section title="Executive Summary" color={data.colorScheme} scale={scale}>
            <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.7 }}>
              {p.summary}
            </p>
          </Section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <Section title="Professional Experience" color={data.colorScheme} scale={scale}>
            {workExperience.map((job, i) => (
              <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${16 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11.5 * scale}px`, color: '#1a1a1a' }}>
                    {job.position}
                  </p>
                  <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                  </p>
                </div>
                <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#555', fontWeight: 500 }}>
                  {job.company}{job.location ? `, ${job.location}` : ''}
                </p>
                {job.description && (
                  <p style={{ margin: `${6 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.6 }}>
                    {job.description}
                  </p>
                )}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: `${4 * scale}px 0 0`, paddingLeft: `${18 * scale}px` }}>
                    {job.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx} style={{ fontSize: `${10.5 * scale}px`, color: '#333', marginBottom: `${3 * scale}px`, lineHeight: 1.6 }}>
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
          <Section title="Education" color={data.colorScheme} scale={scale}>
            {education.map((edu, i) => (
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#555' }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.gpa && (
                  <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#666' }}>GPA: {edu.gpa}</p>
                )}
                {edu.achievements && (
                  <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#444', lineHeight: 1.6 }}>
                    {edu.achievements}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Skills - 2-column grid with colored bullet dots */}
        {skills.length > 0 && (
          <Section title="Core Competencies" color={data.colorScheme} scale={scale}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: `${4 * scale}px ${24 * scale}px`,
              }}
            >
              {skills.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: `${6 * scale}px` }}>
                  <div
                    style={{
                      width: `${6 * scale}px`,
                      height: `${6 * scale}px`,
                      borderRadius: '50%',
                      backgroundColor: data.colorScheme,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: `${10.5 * scale}px`, color: '#333' }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" color={data.colorScheme} scale={scale}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${6 * scale}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: `${10.5 * scale}px` }}>{cert.name}</p>
                  <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#777' }}>{formatDate(cert.date)}</p>
                </div>
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#666' }}>{cert.issuer}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Key Projects" color={data.colorScheme} scale={scale}>
            {projects.map((project, i) => (
              <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>{project.name}</p>
                  {(project.startDate || project.endDate) && (
                    <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#777', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                    </p>
                  )}
                </div>
                {project.url && (
                  <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${9.5 * scale}px`, color: data.colorScheme }}>{project.url}</p>
                )}
                {project.description && (
                  <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages" color={data.colorScheme} scale={scale}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${16 * scale}px` }}>
              {languages.map((lang) => (
                <div key={lang.id} style={{ fontSize: `${10.5 * scale}px` }}>
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                  <span style={{ color: '#666', marginLeft: `${4 * scale}px` }}>({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, scale, children }: { title: string; color: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${18 * scale}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * scale}px`, marginBottom: `${8 * scale}px` }}>
        <div
          style={{
            width: `${8 * scale}px`,
            height: `${8 * scale}px`,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontSize: `${13 * scale}px`,
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
