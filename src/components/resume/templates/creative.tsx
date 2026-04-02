import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function CreativeTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;
  const sidebarWidth = 200 * s.scale;

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
      {/* Main content - LEFT */}
      <div
        style={{
          flex: 1,
          padding: `${s.paddingTop}px ${s.paddingRight * 0.7}px ${s.paddingBottom}px ${s.paddingLeft}px`,
        }}
      >
        {/* Name and title */}
        <div style={{ marginBottom: `${22 * s.scale}px`, textAlign: s.headerAlignment }}>
          {fullName && (
            <h1
              style={{
                fontSize: `${s.headingFontSize * 1.09}px`,
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
                display: 'inline-block',
                borderBottom: `3px solid ${s.colorScheme}`,
                paddingBottom: `${4 * s.scale}px`,
                lineHeight: 1.3,
              }}
            >
              {fullName}
            </h1>
          )}
          {p.jobTitle && (
            <p
              style={{
                fontSize: `${s.subHeadingFontSize}px`,
                color: '#555',
                margin: `${6 * s.scale}px 0 0`,
                fontWeight: 500,
              }}
            >
              {p.jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        {p.summary && (
          <MainSection title="About" color={s.colorScheme} styles={s}>
            <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
              {p.summary}
            </p>
          </MainSection>
        )}

        {/* Work Experience - with timeline dots */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" color={s.colorScheme} styles={s}>
            {workExperience.map((job, i) => (
              <div
                key={job.id}
                style={{
                  display: 'flex',
                  gap: `${10 * s.scale}px`,
                  marginBottom: i < workExperience.length - 1 ? `${14 * s.scale}px` : 0,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: `${4 * s.scale}px`,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: `${8 * s.scale}px`,
                      height: `${8 * s.scale}px`,
                      borderRadius: '50%',
                      backgroundColor: s.colorScheme,
                    }}
                  />
                  {i < workExperience.length - 1 && (
                    <div
                      style={{
                        width: `${1 * s.scale}px`,
                        flex: 1,
                        backgroundColor: '#ddd',
                        marginTop: `${4 * s.scale}px`,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px`, color: '#1a1a1a' }}>
                      {job.position}
                    </p>
                    <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                    </p>
                  </div>
                  <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: s.colorScheme, fontWeight: 600 }}>
                    {job.company}{job.location ? `, ${job.location}` : ''}
                  </p>
                  {job.description && (
                    <p style={{ margin: `${5 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
                      {job.description}
                    </p>
                  )}
                  {job.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: `${4 * s.scale}px 0 0`, paddingLeft: `${16 * s.scale}px` }}>
                      {job.bullets.filter(Boolean).map((bullet, idx) => (
                        <li key={idx} style={{ fontSize: `${s.bodyFontSize}px`, color: '#444', marginBottom: `${2 * s.scale}px`, lineHeight: s.lineHeight }}>
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
          <MainSection title="Education" color={s.colorScheme} styles={s}>
            {education.map((edu, i) => (
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.smallFontSize}px`, color: s.colorScheme, fontWeight: 500 }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" color={s.colorScheme} styles={s}>
            {projects.map((project, i) => (
              <div key={project.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>{project.name}</p>
                  {(project.startDate || project.endDate) && (
                    <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.9}px`, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {project.startDate ? formatDate(project.startDate) : ''}{project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
                    </p>
                  )}
                </div>
                {project.url && (
                  <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.95}px`, color: s.colorScheme }}>{project.url}</p>
                )}
                {project.description && (
                  <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', lineHeight: s.lineHeight }}>
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
          padding: `${s.paddingTop}px ${s.paddingLeft * 0.55}px ${s.paddingBottom}px`,
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
                border: `${3 * s.scale}px solid ${s.colorScheme}`,
              }}
            />
          </div>
        )}

        {/* Contact */}
        {contactItems.length > 0 && (
          <SidebarSection title="Contact" color={s.colorScheme} styles={s}>
            {contactItems.map((item, idx) => (
              <div key={idx} style={{ marginBottom: `${6 * s.scale}px` }}>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.85}px`, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {item.label}
                </p>
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.95}px`, color: '#333', wordBreak: 'break-word' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Skills with colored dots */}
        {skills.length > 0 && (
          <SidebarSection title="Skills" color={s.colorScheme} styles={s}>
            {skills.map((skill) => (
              <div
                key={skill.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: `${6 * s.scale}px`,
                  marginBottom: `${5 * s.scale}px`,
                }}
              >
                <div
                  style={{
                    width: `${5 * s.scale}px`,
                    height: `${5 * s.scale}px`,
                    borderRadius: '50%',
                    backgroundColor: s.colorScheme,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: `${s.smallFontSize * 0.95}px`, color: '#333' }}>{skill.name}</span>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SidebarSection title="Languages" color={s.colorScheme} styles={s}>
            {languages.map((lang) => (
              <div key={lang.id} style={{ marginBottom: `${5 * s.scale}px` }}>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#333', fontWeight: 600 }}>{lang.name}</p>
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.9}px`, color: '#777', textTransform: 'capitalize' }}>
                  {lang.proficiency}
                </p>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SidebarSection title="Certifications" color={s.colorScheme} styles={s}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${8 * s.scale}px` }}>
                <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#333', fontWeight: 600 }}>{cert.name}</p>
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.9}px`, color: '#777' }}>
                  {cert.issuer}
                </p>
                <p style={{ margin: `${1 * s.scale}px 0 0`, fontSize: `${s.smallFontSize * 0.85}px`, color: '#999' }}>
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

function MainSection({ title, color, styles, children }: { title: string; color: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 1.1}px` }}>
      <h2
        style={{
          fontSize: `${styles.subHeadingFontSize}px`,
          fontWeight: 700,
          margin: `0 0 ${8 * styles.scale}px`,
          color: '#1a1a1a',
          borderLeft: `3px solid ${color}`,
          paddingLeft: `${8 * styles.scale}px`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function SidebarSection({ title, color, styles, children }: { title: string; color: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 1.1}px` }}>
      <h2
        style={{
          fontSize: `${styles.smallFontSize}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: color,
          margin: `0 0 ${8 * styles.scale}px`,
          paddingBottom: `${4 * styles.scale}px`,
          borderBottom: `1px solid #e0e0e0`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
