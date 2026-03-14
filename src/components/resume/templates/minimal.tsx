import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function MinimalTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const contactParts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: `${10.5 * scale}px`,
        lineHeight: 1.5,
        color: '#333',
        backgroundColor: '#ffffff',
        padding: `${40 * scale}px ${44 * scale}px`,
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: `${28 * scale}px` }}>
        {fullName && (
          <h1
            style={{
              fontSize: `${28 * scale}px`,
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
              fontSize: `${13 * scale}px`,
              fontWeight: 400,
              color: data.colorScheme,
              margin: `${4 * scale}px 0 0`,
            }}
          >
            {p.jobTitle}
          </p>
        )}
        {contactParts.length > 0 && (
          <p
            style={{
              fontSize: `${9 * scale}px`,
              color: '#888',
              margin: `${8 * scale}px 0 0`,
              letterSpacing: '0.02em',
            }}
          >
            {contactParts.join('  ·  ')}
          </p>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <Section title="summary" scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.7 }}>
            {p.summary}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="experience" scale={scale}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${14 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${11 * scale}px`, color: '#1a1a1a' }}>
                  {job.position}
                </p>
                <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#777' }}>
                {job.company}{job.location ? `, ${job.location}` : ''}
              </p>
              {job.description && (
                <p style={{ margin: `${6 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.7 }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <div style={{ marginTop: `${4 * scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <p key={idx} style={{ margin: `${2 * scale}px 0`, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.7 }}>
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
        <Section title="education" scale={scale}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${11 * scale}px`, color: '#1a1a1a' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#777' }}>
                {edu.institution}{edu.location ? `, ${edu.location}` : ''}
              </p>
              {edu.gpa && (
                <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${9.5 * scale}px`, color: '#888' }}>GPA: {edu.gpa}</p>
              )}
              {edu.achievements && (
                <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#444', lineHeight: 1.7 }}>
                  {edu.achievements}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="skills" scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.8 }}>
            {skills.map((s) => s.name).join(', ')}
          </p>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="projects" scale={scale}>
          {projects.map((project, i) => (
            <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${11 * scale}px`, color: '#1a1a1a' }}>
                  {project.name}
                </p>
                {(project.startDate || project.endDate) && (
                  <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                  </p>
                )}
              </div>
              {project.url && (
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${9.5 * scale}px`, color: data.colorScheme }}>{project.url}</p>
              )}
              {project.description && (
                <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.7 }}>
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="certifications" scale={scale}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: `${6 * scale}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${10.5 * scale}px`, color: '#1a1a1a' }}>{cert.name}</p>
                <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#999' }}>{formatDate(cert.date)}</p>
              </div>
              <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#777' }}>{cert.issuer}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="languages" scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#444' }}>
            {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, scale, children }: { title: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${24 * scale}px` }}>
      <div
        style={{
          borderTop: '1px solid #e0e0e0',
          paddingTop: `${10 * scale}px`,
          marginBottom: `${8 * scale}px`,
        }}
      >
        <h2
          style={{
            fontSize: `${12 * scale}px`,
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
