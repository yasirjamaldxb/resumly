import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function CreativeTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const sidebarWidth = 200 * scale;

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
      {/* Main content - LEFT */}
      <div
        style={{
          flex: 1,
          padding: `${30 * scale}px ${24 * scale}px ${30 * scale}px ${32 * scale}px`,
        }}
      >
        {/* Name and title */}
        <div style={{ marginBottom: `${22 * scale}px` }}>
          {fullName && (
            <h1
              style={{
                fontSize: `${24 * scale}px`,
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
                display: 'inline-block',
                borderBottom: `3px solid ${data.colorScheme}`,
                paddingBottom: `${4 * scale}px`,
                lineHeight: 1.3,
              }}
            >
              {fullName}
            </h1>
          )}
          {p.jobTitle && (
            <p
              style={{
                fontSize: `${13 * scale}px`,
                color: '#555',
                margin: `${6 * scale}px 0 0`,
                fontWeight: 500,
              }}
            >
              {p.jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        {p.summary && (
          <MainSection title="About" color={data.colorScheme} scale={scale}>
            <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.7 }}>
              {p.summary}
            </p>
          </MainSection>
        )}

        {/* Work Experience - with timeline dots */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" color={data.colorScheme} scale={scale}>
            {workExperience.map((job, i) => (
              <div
                key={job.id}
                style={{
                  display: 'flex',
                  gap: `${10 * scale}px`,
                  marginBottom: i < workExperience.length - 1 ? `${14 * scale}px` : 0,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: `${4 * scale}px`,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: `${8 * scale}px`,
                      height: `${8 * scale}px`,
                      borderRadius: '50%',
                      backgroundColor: data.colorScheme,
                    }}
                  />
                  {i < workExperience.length - 1 && (
                    <div
                      style={{
                        width: `${1 * scale}px`,
                        flex: 1,
                        backgroundColor: '#ddd',
                        marginTop: `${4 * scale}px`,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px`, color: '#1a1a1a' }}>
                      {job.position}
                    </p>
                    <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                    </p>
                  </div>
                  <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: data.colorScheme, fontWeight: 600 }}>
                    {job.company}{job.location ? `, ${job.location}` : ''}
                  </p>
                  {job.description && (
                    <p style={{ margin: `${5 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.6 }}>
                      {job.description}
                    </p>
                  )}
                  {job.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: `${4 * scale}px 0 0`, paddingLeft: `${16 * scale}px` }}>
                      {job.bullets.filter(Boolean).map((bullet, idx) => (
                        <li key={idx} style={{ fontSize: `${10.5 * scale}px`, color: '#444', marginBottom: `${2 * scale}px`, lineHeight: 1.6 }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education" color={data.colorScheme} scale={scale}>
            {education.map((edu, i) => (
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10 * scale}px`, color: data.colorScheme, fontWeight: 500 }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: `${9 * scale}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" color={data.colorScheme} scale={scale}>
            {projects.map((project, i) => (
              <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>{project.name}</p>
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
                  <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}
      </div>

      {/* Sidebar - RIGHT */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          flexShrink: 0,
          backgroundColor: '#f8f9fa',
          padding: `${30 * scale}px ${18 * scale}px`,
        }}
      >
        {/* Contact */}
        {contactItems.length > 0 && (
          <SidebarSection title="Contact" color={data.colorScheme} scale={scale}>
            {contactItems.map((item, idx) => (
              <div key={idx} style={{ marginBottom: `${6 * scale}px` }}>
                <p style={{ margin: 0, fontSize: `${8.5 * scale}px`, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {item.label}
                </p>
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${9.5 * scale}px`, color: '#333', wordBreak: 'break-word' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Skills with colored dots */}
        {skills.length > 0 && (
          <SidebarSection title="Skills" color={data.colorScheme} scale={scale}>
            {skills.map((skill) => (
              <div
                key={skill.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: `${6 * scale}px`,
                  marginBottom: `${5 * scale}px`,
                }}
              >
                <div
                  style={{
                    width: `${5 * scale}px`,
                    height: `${5 * scale}px`,
                    borderRadius: '50%',
                    backgroundColor: data.colorScheme,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: `${9.5 * scale}px`, color: '#333' }}>{skill.name}</span>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SidebarSection title="Languages" color={data.colorScheme} scale={scale}>
            {languages.map((lang) => (
              <div key={lang.id} style={{ marginBottom: `${5 * scale}px` }}>
                <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#333', fontWeight: 600 }}>{lang.name}</p>
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${9 * scale}px`, color: '#777', textTransform: 'capitalize' }}>
                  {lang.proficiency}
                </p>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SidebarSection title="Certifications" color={data.colorScheme} scale={scale}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${8 * scale}px` }}>
                <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#333', fontWeight: 600 }}>{cert.name}</p>
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${9 * scale}px`, color: '#777' }}>
                  {cert.issuer}
                </p>
                <p style={{ margin: `${1 * scale}px 0 0`, fontSize: `${8.5 * scale}px`, color: '#999' }}>
                  {formatDate(cert.date)}
                </p>
              </div>
            ))}
          </SidebarSection>
        )}
      </div>
    </div>
  );
}

function MainSection({ title, color, scale, children }: { title: string; color: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${18 * scale}px` }}>
      <h2
        style={{
          fontSize: `${13 * scale}px`,
          fontWeight: 700,
          margin: `0 0 ${8 * scale}px`,
          color: '#1a1a1a',
          borderLeft: `3px solid ${color}`,
          paddingLeft: `${8 * scale}px`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function SidebarSection({ title, color, scale, children }: { title: string; color: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${18 * scale}px` }}>
      <h2
        style={{
          fontSize: `${10 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: color,
          margin: `0 0 ${8 * scale}px`,
          paddingBottom: `${4 * scale}px`,
          borderBottom: `1px solid #e0e0e0`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
