import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ATSProTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: `${11 * scale}px`,
        lineHeight: 1.5,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: `${28 * scale}px ${32 * scale}px`,
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${data.colorScheme}`, paddingBottom: `${12 * scale}px`, marginBottom: `${16 * scale}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${14 * scale}px` }}>
          {p.photo && (
            <img
              src={p.photo}
              alt=""
              style={{
                width: `${60 * scale}px`,
                height: `${60 * scale}px`,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          )}
          <div>
        {fullName && (
          <h1 style={{ fontSize: `${22 * scale}px`, fontWeight: 700, margin: 0, color: '#1a1a1a', letterSpacing: '-0.3px' }}>
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p style={{ fontSize: `${13 * scale}px`, color: data.colorScheme, fontWeight: 600, margin: `${2 * scale}px 0 ${8 * scale}px` }}>
            {p.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${4 * scale}px ${16 * scale}px`, fontSize: `${10 * scale}px`, color: '#555' }}>
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
        <Section title="Professional Summary" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.6 }}>{p.summary}</p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="Work Experience" color={data.colorScheme} scale={scale}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${12 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>{job.position}</p>
                  <p style={{ margin: 0, color: data.colorScheme, fontSize: `${10.5 * scale}px`, fontWeight: 600 }}>
                    {job.company}{job.location ? ` • ${job.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333' }}>{job.description}</p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: `${4 * scale}px 0 0`, paddingLeft: `${16 * scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ fontSize: `${10.5 * scale}px`, color: '#333', marginBottom: `${2 * scale}px` }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ margin: 0, color: data.colorScheme, fontSize: `${10.5 * scale}px` }}>
                    {edu.institution}{edu.location ? ` • ${edu.location}` : ''}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && (
                <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#555' }}>GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills" color={data.colorScheme} scale={scale}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${6 * scale}px` }}>
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  fontSize: `${10 * scale}px`,
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: `${2 * scale}px ${8 * scale}px`,
                  borderRadius: `${4 * scale}px`,
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
        <Section title="Certifications" color={data.colorScheme} scale={scale}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${6 * scale}px` }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: `${10.5 * scale}px` }}>{cert.name}</p>
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666' }}>{cert.issuer}</p>
              </div>
              <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#666' }}>{formatDate(cert.date)}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects" color={data.colorScheme} scale={scale}>
          {projects.map((project, i) => (
            <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>{project.name}</p>
                {project.url && (
                  <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: data.colorScheme }}>{project.url}</p>
                )}
              </div>
              {project.description && (
                <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333' }}>{project.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="Languages" color={data.colorScheme} scale={scale}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${12 * scale}px` }}>
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
  );
}

function Section({ title, color, scale, children }: { title: string; color: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${16 * scale}px` }}>
      <h2
        style={{
          fontSize: `${11 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: color,
          margin: `0 0 ${8 * scale}px`,
          paddingBottom: `${4 * scale}px`,
          borderBottom: `1px solid #e5e7eb`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
