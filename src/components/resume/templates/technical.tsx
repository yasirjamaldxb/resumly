import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function TechnicalTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const sidebarWidth = 210 * scale;
  const sidebarBg = '#2d3748';

  const contactItems = [
    { label: 'Email', value: p.email },
    { label: 'Phone', value: p.phone },
    { label: 'Location', value: p.location },
    { label: 'LinkedIn', value: p.linkedIn },
    { label: 'Website', value: p.website },
  ].filter((item) => item.value);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: `${10 * scale}px`,
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
      {/* LEFT Sidebar */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          flexShrink: 0,
          backgroundColor: sidebarBg,
          color: '#ffffff',
          padding: `${24 * scale}px ${16 * scale}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Name */}
        {fullName && (
          <h1
            style={{
              fontSize: `${18 * scale}px`,
              fontWeight: 700,
              margin: `0 0 ${4 * scale}px`,
              lineHeight: 1.2,
              color: '#ffffff',
            }}
          >
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              fontSize: `${10 * scale}px`,
              color: data.colorScheme,
              margin: `0 0 ${16 * scale}px`,
              fontWeight: 600,
            }}
          >
            {p.jobTitle}
          </p>
        )}

        {/* Contact */}
        {contactItems.length > 0 && (
          <SidebarSection title="Contact" scale={scale} color={data.colorScheme}>
            {contactItems.map((item, idx) => (
              <div key={idx} style={{ marginBottom: `${4 * scale}px` }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${8 * scale}px`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${9.5 * scale}px`,
                    color: 'rgba(255,255,255,0.9)',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Technical Skills */}
        {skills.length > 0 && (
          <SidebarSection title="Technical Skills" scale={scale} color={data.colorScheme}>
            {skills.map((skill) => (
              <p
                key={skill.id}
                style={{
                  margin: `0 0 ${3 * scale}px`,
                  fontSize: `${9.5 * scale}px`,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                {skill.name}
              </p>
            ))}
          </SidebarSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SidebarSection title="Languages" scale={scale} color={data.colorScheme}>
            {languages.map((lang) => (
              <p
                key={lang.id}
                style={{
                  margin: `0 0 ${4 * scale}px`,
                  fontSize: `${9.5 * scale}px`,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <span style={{ fontWeight: 600 }}>{lang.name}</span>
                <span style={{ opacity: 0.6, textTransform: 'capitalize' }}> — {lang.proficiency}</span>
              </p>
            ))}
          </SidebarSection>
        )}
      </div>

      {/* RIGHT Main Content */}
      <div
        style={{
          flex: 1,
          padding: `${24 * scale}px ${24 * scale}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Summary */}
        {p.summary && (
          <MainSection title="Summary" color={data.colorScheme} scale={scale}>
            <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#444', lineHeight: 1.6 }}>
              {p.summary}
            </p>
          </MainSection>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" color={data.colorScheme} scale={scale}>
            {workExperience.map((job, i) => (
              <div
                key={job.id}
                style={{
                  marginBottom: i < workExperience.length - 1 ? `${12 * scale}px` : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${10.5 * scale}px` }}>
                    {job.position}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: `${9 * scale}px`,
                      color: '#888',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      marginLeft: `${8 * scale}px`,
                    }}
                  >
                    {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    margin: `${1 * scale}px 0 ${4 * scale}px`,
                    fontSize: `${9.5 * scale}px`,
                    color: data.colorScheme,
                    fontWeight: 600,
                  }}
                >
                  {job.company}{job.location ? ` | ${job.location}` : ''}
                </p>
                {job.description && (
                  <p style={{ margin: `0 0 ${3 * scale}px`, fontSize: `${10 * scale}px`, color: '#444' }}>
                    {job.description}
                  </p>
                )}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: `${2 * scale}px 0 0`, paddingLeft: `${14 * scale}px` }}>
                    {job.bullets.filter(Boolean).map((bullet, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: `${10 * scale}px`,
                          color: '#444',
                          marginBottom: `${2 * scale}px`,
                        }}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education" color={data.colorScheme} scale={scale}>
            {education.map((edu, i) => (
              <div
                key={edu.id}
                style={{
                  marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${10.5 * scale}px` }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: `${9 * scale}px`,
                      color: '#888',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    margin: `${2 * scale}px 0 0`,
                    fontSize: `${9.5 * scale}px`,
                    color: data.colorScheme,
                  }}
                >
                  {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
                </p>
                {edu.gpa && (
                  <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${9 * scale}px`, color: '#666' }}>
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects - prominent for tech roles */}
        {projects.length > 0 && (
          <MainSection title="Projects" color={data.colorScheme} scale={scale}>
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                style={{
                  marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${10.5 * scale}px` }}>
                    {proj.name}
                  </p>
                  {proj.url && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: `${9 * scale}px`,
                        color: data.colorScheme,
                        flexShrink: 0,
                        marginLeft: `${8 * scale}px`,
                      }}
                    >
                      {proj.url}
                    </p>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${9 * scale}px`, color: '#888' }}>
                    {proj.startDate ? formatDate(proj.startDate) : ''}
                    {proj.startDate && proj.endDate ? ' – ' : ''}
                    {proj.endDate ? formatDate(proj.endDate) : ''}
                  </p>
                )}
                {proj.description && (
                  <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: '#444' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <MainSection title="Certifications" color={data.colorScheme} scale={scale}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${6 * scale}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: `${10 * scale}px` }}>
                    {cert.name}
                  </p>
                  {cert.date && (
                    <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#888' }}>
                      {formatDate(cert.date)}
                    </p>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#666' }}>{cert.issuer}</p>
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  scale,
  color,
  children,
}: {
  title: string;
  scale: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${18 * scale}px` }}>
      <h2
        style={{
          fontSize: `${9 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: `0 0 ${8 * scale}px`,
          color: 'rgba(255,255,255,0.6)',
          paddingBottom: `${4 * scale}px`,
          borderBottom: `1px solid rgba(255,255,255,0.15)`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function MainSection({
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
    <div style={{ marginBottom: `${16 * scale}px` }}>
      <h2
        style={{
          fontSize: `${10.5 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: `0 0 ${8 * scale}px`,
          color: '#1a1a1a',
          fontFamily: '"Courier New", Courier, monospace',
        }}
      >
        {title}
        <div
          style={{
            width: `${40 * scale}px`,
            height: `${2 * scale}px`,
            backgroundColor: color,
            marginTop: `${4 * scale}px`,
          }}
        />
      </h2>
      {children}
    </div>
  );
}
