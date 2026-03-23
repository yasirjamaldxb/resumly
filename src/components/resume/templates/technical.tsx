import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function TechnicalTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const sidebarWidth = 210 * s.scale;
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
        fontFamily: s.fontFamily,
        fontSize: `${s.smallFontSize}px`,
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
      {/* LEFT Sidebar */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          flexShrink: 0,
          backgroundColor: sidebarBg,
          color: '#ffffff',
          padding: `${s.paddingTop}px ${s.paddingLeft * 0.5}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Photo */}
        {p.photo && (
          <div style={{ textAlign: 'center', marginBottom: `${12 * s.scale}px` }}>
            <img
              src={p.photo}
              alt=""
              style={{
                width: `${80 * s.scale}px`,
                height: `${80 * s.scale}px`,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `${3 * s.scale}px solid white`,
              }}
            />
          </div>
        )}

        {/* Name */}
        {fullName && (
          <h1
            style={{
              fontSize: `${(s.baseFontSize + 7)}px`,
              fontWeight: 700,
              margin: `0 0 ${4 * s.scale}px`,
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
              fontSize: `${s.smallFontSize}px`,
              color: s.colorScheme,
              margin: `0 0 ${s.sectionGap}px`,
              fontWeight: 600,
            }}
          >
            {p.jobTitle}
          </p>
        )}

        {/* Contact */}
        {contactItems.length > 0 && (
          <SidebarSection title="Contact" styles={s} color={s.colorScheme}>
            {contactItems.map((item, idx) => (
              <div key={idx} style={{ marginBottom: `${4 * s.scale}px` }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${s.smallFontSize * 0.8}px`,
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
                    fontSize: `${s.smallFontSize * 0.95}px`,
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
          <SidebarSection title="Technical Skills" styles={s} color={s.colorScheme}>
            {skills.map((skill) => (
              <p
                key={skill.id}
                style={{
                  margin: `0 0 ${3 * s.scale}px`,
                  fontSize: `${s.smallFontSize * 0.95}px`,
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
          <SidebarSection title="Languages" styles={s} color={s.colorScheme}>
            {languages.map((lang) => (
              <p
                key={lang.id}
                style={{
                  margin: `0 0 ${4 * s.scale}px`,
                  fontSize: `${s.smallFontSize * 0.95}px`,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <span style={{ fontWeight: 600 }}>{lang.name}</span>
                <span style={{ opacity: 0.6, textTransform: 'capitalize' }}> &mdash; {lang.proficiency}</span>
              </p>
            ))}
          </SidebarSection>
        )}
      </div>

      {/* RIGHT Main Content */}
      <div
        style={{
          flex: 1,
          padding: `${s.paddingTop}px ${s.paddingRight}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Summary */}
        {p.summary && (
          <MainSection title="Summary" color={s.colorScheme} styles={s}>
            <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
              {p.summary}
            </p>
          </MainSection>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" color={s.colorScheme} styles={s}>
            {workExperience.map((job, i) => (
              <div
                key={job.id}
                style={{
                  marginBottom: i < workExperience.length - 1 ? `${12 * s.scale}px` : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.bodyFontSize}px` }}>
                    {job.position}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: `${s.smallFontSize * 0.9}px`,
                      color: '#888',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      marginLeft: `${8 * s.scale}px`,
                    }}
                  >
                    {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    margin: `${1 * s.scale}px 0 ${4 * s.scale}px`,
                    fontSize: `${s.smallFontSize * 0.95}px`,
                    color: s.colorScheme,
                    fontWeight: 600,
                  }}
                >
                  {job.company}{job.location ? ` | ${job.location}` : ''}
                </p>
                {job.description && (
                  <p style={{ margin: `0 0 ${3 * s.scale}px`, fontSize: `${s.smallFontSize}px`, color: '#444' }}>
                    {job.description}
                  </p>
                )}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: `${2 * s.scale}px 0 0`, paddingLeft: `${14 * s.scale}px` }}>
                    {job.bullets.filter(Boolean).map((bullet, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: `${s.smallFontSize}px`,
                          color: '#444',
                          marginBottom: `${2 * s.scale}px`,
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
          <MainSection title="Education" color={s.colorScheme} styles={s}>
            {education.map((edu, i) => (
              <div
                key={edu.id}
                style={{
                  marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.bodyFontSize}px` }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: `${s.smallFontSize * 0.9}px`,
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
                    margin: `${2 * s.scale}px 0 0`,
                    fontSize: `${s.smallFontSize * 0.95}px`,
                    color: s.colorScheme,
                  }}
                >
                  {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
                </p>
                {edu.gpa && (
                  <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.9}px`, color: '#666' }}>
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects - prominent for tech roles */}
        {projects.length > 0 && (
          <MainSection title="Projects" color={s.colorScheme} styles={s}>
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                style={{
                  marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.bodyFontSize}px` }}>
                    {proj.name}
                  </p>
                  {proj.url && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: `${s.smallFontSize * 0.9}px`,
                        color: s.colorScheme,
                        flexShrink: 0,
                        marginLeft: `${8 * s.scale}px`,
                      }}
                    >
                      {proj.url}
                    </p>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.9}px`, color: '#888' }}>
                    {proj.startDate ? formatDate(proj.startDate) : ''}
                    {proj.startDate && proj.endDate ? ' – ' : ''}
                    {proj.endDate ? formatDate(proj.endDate) : ''}
                  </p>
                )}
                {proj.description && (
                  <p style={{ margin: `${3 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: '#444' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <MainSection title="Certifications" color={s.colorScheme} styles={s}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${6 * s.scale}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: `${s.smallFontSize}px` }}>
                    {cert.name}
                  </p>
                  {cert.date && (
                    <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#888' }}>
                      {formatDate(cert.date)}
                    </p>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#666' }}>{cert.issuer}</p>
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
  styles,
  color,
  children,
}: {
  title: string;
  styles: TemplateStyles;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 1.1}px` }}>
      <h2
        style={{
          fontSize: `${styles.smallFontSize * 0.9}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: `0 0 ${8 * styles.scale}px`,
          color: 'rgba(255,255,255,0.6)',
          paddingBottom: `${4 * styles.scale}px`,
          borderBottom: '1px solid rgba(255,255,255,0.15)',
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
  styles,
  children,
}: {
  title: string;
  color: string;
  styles: TemplateStyles;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap}px` }}>
      <h2
        style={{
          fontSize: `${styles.bodyFontSize}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: `0 0 ${8 * styles.scale}px`,
          color: '#1a1a1a',
          fontFamily: '"Courier New", Courier, monospace',
        }}
      >
        {title}
        <div
          style={{
            width: `${40 * styles.scale}px`,
            height: `${2 * styles.scale}px`,
            backgroundColor: color,
            marginTop: `${4 * styles.scale}px`,
          }}
        />
      </h2>
      {children}
    </div>
  );
}
