import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ModernTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const sidebarWidth = 220 * scale;

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
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
      {/* Sidebar */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          flexShrink: 0,
          backgroundColor: data.colorScheme,
          color: '#ffffff',
          padding: `${24 * scale}px ${16 * scale}px`,
        }}
      >
        {/* Name/Title */}
        {fullName && (
          <h1 style={{ fontSize: `${17 * scale}px`, fontWeight: 700, margin: `0 0 ${4 * scale}px`, lineHeight: 1.3 }}>
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p style={{ fontSize: `${11 * scale}px`, opacity: 0.85, margin: `0 0 ${16 * scale}px` }}>{p.jobTitle}</p>
        )}

        {/* Contact */}
        <SideSection title="Contact" scale={scale}>
          {[
            { icon: '✉', value: p.email },
            { icon: '📞', value: p.phone },
            { icon: '📍', value: p.location },
            { icon: '🔗', value: p.linkedIn },
            { icon: '🌐', value: p.website },
          ].filter(i => i.value).map((item, idx) => (
            <p key={idx} style={{ margin: `0 0 ${4 * scale}px`, fontSize: `${9.5 * scale}px`, wordBreak: 'break-word', opacity: 0.9 }}>
              {item.value}
            </p>
          ))}
        </SideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SideSection title="Skills" scale={scale}>
            {skills.map((skill) => (
              <div key={skill.id} style={{ marginBottom: `${6 * scale}px` }}>
                <p style={{ margin: `0 0 ${2 * scale}px`, fontSize: `${10 * scale}px` }}>{skill.name}</p>
                <div style={{ height: `${5 * scale}px`, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: `${3 * scale}px` }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      borderRadius: `${3 * scale}px`,
                      width: skill.level === 'expert' ? '100%' : skill.level === 'advanced' ? '80%' : skill.level === 'intermediate' ? '60%' : '40%',
                    }}
                  />
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection title="Languages" scale={scale}>
            {languages.map((lang) => (
              <p key={lang.id} style={{ margin: `0 0 ${4 * scale}px`, fontSize: `${10 * scale}px` }}>
                <strong>{lang.name}</strong> — <span style={{ opacity: 0.8, textTransform: 'capitalize' }}>{lang.proficiency}</span>
              </p>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${24 * scale}px ${24 * scale}px` }}>
        {/* Summary */}
        {p.summary && (
          <MainSection title="About Me" color={data.colorScheme} scale={scale}>
            <p style={{ margin: 0, color: '#444', lineHeight: 1.7 }}>{p.summary}</p>
          </MainSection>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" color={data.colorScheme} scale={scale}>
            {workExperience.map((job, i) => (
              <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${14 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>{job.position}</p>
                  <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#888' }}>
                    {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                  </p>
                </div>
                <p style={{ margin: `${1 * scale}px 0 ${4 * scale}px`, color: data.colorScheme, fontSize: `${10 * scale}px`, fontWeight: 600 }}>
                  {job.company}{job.location ? `, ${job.location}` : ''}
                </p>
                {job.description && <p style={{ margin: `0 0 ${4 * scale}px`, color: '#444' }}>{job.description}</p>}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: `${16 * scale}px` }}>
                    {job.bullets.filter(Boolean).map((b, idx) => (
                      <li key={idx} style={{ color: '#444', marginBottom: `${2 * scale}px` }}>{b}</li>
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
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                  </p>
                  <p style={{ margin: 0, fontSize: `${9.5 * scale}px`, color: '#888' }}>
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
                <p style={{ margin: `${2 * scale}px 0 0`, color: data.colorScheme, fontSize: `${10 * scale}px` }}>
                  {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                </p>
              </div>
            ))}
          </MainSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <MainSection title="Certifications" color={data.colorScheme} scale={scale}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${6 * scale}px` }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{cert.name}</p>
                <p style={{ margin: 0, color: '#666', fontSize: `${10 * scale}px` }}>{cert.issuer} · {formatDate(cert.date)}</p>
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" color={data.colorScheme} scale={scale}>
            {projects.map((proj, i) => (
              <div key={proj.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0 }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{proj.name}</p>
                {proj.description && <p style={{ margin: `${3 * scale}px 0 0`, color: '#444' }}>{proj.description}</p>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, scale, children }: { title: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${16 * scale}px` }}>
      <h2
        style={{
          fontSize: `${10 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: `0 0 ${8 * scale}px`,
          opacity: 0.75,
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          paddingBottom: `${4 * scale}px`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function MainSection({ title, color, scale, children }: { title: string; color: string; scale: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${18 * scale}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * scale}px`, marginBottom: `${10 * scale}px` }}>
        <div style={{ width: `${4 * scale}px`, height: `${20 * scale}px`, backgroundColor: color, borderRadius: `${2 * scale}px`, flexShrink: 0 }} />
        <h2 style={{ fontSize: `${13 * scale}px`, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
