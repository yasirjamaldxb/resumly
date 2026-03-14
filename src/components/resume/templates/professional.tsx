import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ProfessionalTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const contactParts = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: `${11 * scale}px`,
        lineHeight: 1.5,
        color: '#2d2d2d',
        backgroundColor: '#ffffff',
        padding: `${36 * scale}px ${40 * scale}px`,
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: `${16 * scale}px` }}>
        {fullName && (
          <h1
            style={{
              fontSize: `${26 * scale}px`,
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
              fontSize: `${12 * scale}px`,
              color: '#555',
              margin: `${4 * scale}px 0 0`,
              fontStyle: 'italic',
            }}
          >
            {p.jobTitle}
          </p>
        )}
        {contactParts.length > 0 && (
          <p
            style={{
              fontSize: `${10 * scale}px`,
              color: '#666',
              margin: `${8 * scale}px 0 0`,
            }}
          >
            {contactParts.join(' | ')}
          </p>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <Section title="PROFESSIONAL SUMMARY" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.7 }}>
            {p.summary}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="WORK EXPERIENCE" color={data.colorScheme} scale={scale}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${14 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px`, fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {job.position}
                  </p>
                  <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', fontStyle: 'italic' }}>
                    {job.company}{job.location ? `, ${job.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${6 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333', paddingLeft: `${12 * scale}px`, lineHeight: 1.6 }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: `${4 * scale}px 0 0`, paddingLeft: `${24 * scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ fontSize: `${10.5 * scale}px`, color: '#333', marginBottom: `${2 * scale}px`, lineHeight: 1.6 }}>
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
        <Section title="EDUCATION" color={data.colorScheme} scale={scale}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', fontStyle: 'italic' }}>
                    {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && (
                <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#555', paddingLeft: `${12 * scale}px` }}>
                  GPA: {edu.gpa}
                </p>
              )}
              {edu.achievements && (
                <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#555', paddingLeft: `${12 * scale}px` }}>
                  {edu.achievements}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="SKILLS" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.7 }}>
            {skills.map((s) => s.name).join(', ')}
          </p>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="CERTIFICATIONS" color={data.colorScheme} scale={scale}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: `${6 * scale}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${10.5 * scale}px` }}>{cert.name}</p>
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666' }}>{formatDate(cert.date)}</p>
              </div>
              <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#555', fontStyle: 'italic' }}>
                {cert.issuer}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="PROJECTS" color={data.colorScheme} scale={scale}>
          {projects.map((project, i) => (
            <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>{project.name}</p>
                {(project.startDate || project.endDate) && (
                  <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                  </p>
                )}
              </div>
              {project.url && (
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: data.colorScheme }}>{project.url}</p>
              )}
              {project.description && (
                <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333', paddingLeft: `${12 * scale}px`, lineHeight: 1.6 }}>
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="LANGUAGES" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333' }}>
            {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, color, scale, children }: { title: string; color: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${16 * scale}px` }}>
      <h2
        style={{
          fontSize: `${12 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#1a1a1a',
          margin: `0 0 ${8 * scale}px`,
          paddingBottom: `${6 * scale}px`,
          borderBottom: `2px solid ${color}`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
