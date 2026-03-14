import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function CompactTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const contactItems = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: `${10 * scale}px`,
        lineHeight: 1.4,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
        borderTop: `${3 * scale}px solid ${data.colorScheme}`,
        padding: `${20 * scale}px ${28 * scale}px`,
      }}
    >
      {/* Header: name left, contact right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: `${10 * scale}px`,
          paddingBottom: `${8 * scale}px`,
          borderBottom: `1px solid #e0e0e0`,
        }}
      >
        <div>
          {fullName && (
            <h1
              style={{
                fontSize: `${20 * scale}px`,
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
                fontSize: `${10 * scale}px`,
                color: '#555',
                margin: `${2 * scale}px 0 0`,
              }}
            >
              {p.jobTitle}
            </p>
          )}
        </div>
        {contactItems.length > 0 && (
          <div
            style={{
              textAlign: 'right',
              fontSize: `${9 * scale}px`,
              color: '#555',
              lineHeight: 1.5,
              flexShrink: 0,
              maxWidth: `${320 * scale}px`,
            }}
          >
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && <span style={{ margin: `0 ${4 * scale}px`, color: '#ccc' }}>|</span>}
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ marginBottom: `${8 * scale}px` }}>
          <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#333', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: data.colorScheme }}>Summary: </span>
            {p.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <CompactSection title="Experience" color={data.colorScheme} scale={scale}>
          {workExperience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${8 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${10 * scale}px` }}>
                  {job.position}
                  <span style={{ fontWeight: 400, color: '#555' }}>
                    {' '}— {job.company}{job.location ? `, ${job.location}` : ''}
                  </span>
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${9 * scale}px`,
                    color: '#666',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: `${8 * scale}px`,
                  }}
                >
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#333' }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul
                  style={{
                    margin: `${2 * scale}px 0 0`,
                    paddingLeft: `${14 * scale}px`,
                  }}
                >
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: `${10 * scale}px`,
                        color: '#333',
                        marginBottom: `${1 * scale}px`,
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
        <CompactSection title="Education" color={data.colorScheme} scale={scale}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${6 * scale}px` : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontSize: `${10 * scale}px` }}>
                  <span style={{ fontWeight: 700 }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </span>
                  <span style={{ color: '#555' }}>
                    {' '}— {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                  </span>
                  {edu.gpa && (
                    <span style={{ color: '#666' }}> (GPA: {edu.gpa})</span>
                  )}
                </p>
                <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: `${8 * scale}px` }}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
            </div>
          ))}
        </CompactSection>
      )}

      {/* Skills - two column layout */}
      {skills.length > 0 && (
        <CompactSection title="Skills" color={data.colorScheme} scale={scale}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${2 * scale}px ${16 * scale}px`,
              fontSize: `${10 * scale}px`,
            }}
          >
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  width: `calc(50% - ${8 * scale}px)`,
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
        <CompactSection title="Certifications" color={data.colorScheme} scale={scale}>
          {certifications.map((cert) => (
            <p key={cert.id} style={{ margin: `0 0 ${3 * scale}px`, fontSize: `${10 * scale}px` }}>
              <span style={{ fontWeight: 600 }}>{cert.name}</span>
              <span style={{ color: '#555' }}> — {cert.issuer}</span>
              {cert.date && <span style={{ color: '#666' }}> ({formatDate(cert.date)})</span>}
            </p>
          ))}
        </CompactSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <CompactSection title="Projects" color={data.colorScheme} scale={scale}>
          {projects.map((proj, i) => (
            <div key={proj.id} style={{ marginBottom: i < projects.length - 1 ? `${6 * scale}px` : 0 }}>
              <p style={{ margin: 0, fontSize: `${10 * scale}px` }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ color: data.colorScheme, marginLeft: `${6 * scale}px`, fontSize: `${9 * scale}px` }}>{proj.url}</span>}
              </p>
              {proj.description && (
                <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#444' }}>{proj.description}</p>
              )}
            </div>
          ))}
        </CompactSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <CompactSection title="Languages" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#333' }}>
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
  scale,
  children,
}: {
  title: string;
  color: string;
  scale: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${8 * scale}px` }}>
      <p
        style={{
          fontSize: `${10 * scale}px`,
          fontWeight: 700,
          color: color,
          margin: `0 0 ${4 * scale}px`,
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
