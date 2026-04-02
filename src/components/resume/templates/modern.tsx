import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function ModernTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;
  const sidebarWidth = 220 * s.scale;

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
      {/* Sidebar */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          flexShrink: 0,
          backgroundColor: s.colorScheme,
          color: '#ffffff',
          padding: `${s.paddingTop}px ${s.paddingLeft * 0.5}px ${s.paddingBottom}px`,
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

        {/* Name/Title */}
        {fullName && (
          <h1 style={{ fontSize: `${(s.baseFontSize + 6) * 1}px`, fontWeight: 700, margin: `0 0 ${4 * s.scale}px`, lineHeight: 1.3 }}>
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p style={{ fontSize: `${s.baseFontSize}px`, opacity: 0.85, margin: `0 0 ${s.sectionGap}px` }}>{p.jobTitle}</p>
        )}

        {/* Contact */}
        <SideSection title="Contact" styles={s}>
          {[
            { icon: '\u2709', value: p.email },
            { icon: '\ud83d\udcde', value: p.phone },
            { icon: '\ud83d\udccd', value: p.location },
            { icon: '\ud83d\udd17', value: p.linkedIn },
            { icon: '\ud83c\udf10', value: p.website },
          ].filter(i => i.value).map((item, idx) => (
            <p key={idx} style={{ margin: `0 0 ${4 * s.scale}px`, fontSize: `${s.smallFontSize * 0.95}px`, wordBreak: 'break-word', opacity: 0.9 }}>
              {item.value}
            </p>
          ))}
        </SideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SideSection title="Skills" styles={s}>
            {skills.map((skill) => (
              <div key={skill.id} style={{ marginBottom: `${6 * s.scale}px` }}>
                <p style={{ margin: `0 0 ${2 * s.scale}px`, fontSize: `${s.smallFontSize}px` }}>{skill.name}</p>
                <div style={{ height: `${5 * s.scale}px`, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: `${3 * s.scale}px` }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      borderRadius: `${3 * s.scale}px`,
                      width: skill.level === 'expert' ? '100%' : skill.level === 'advanced' ? '80%' : skill.level === 'intermediate' ? '60%' : skill.level === 'beginner' ? '40%' : '20%',
                    }}
                  />
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection title="Languages" styles={s}>
            {languages.map((lang) => (
              <p key={lang.id} style={{ margin: `0 0 ${4 * s.scale}px`, fontSize: `${s.smallFontSize}px` }}>
                <strong>{lang.name}</strong>, <span style={{ opacity: 0.8, textTransform: 'capitalize' }}>{lang.proficiency}</span>
              </p>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px` }}>
        {/* Summary */}
        {p.summary && (
          <MainSection title="About Me" color={s.colorScheme} styles={s}>
            <p style={{ margin: 0, color: '#444', lineHeight: s.lineHeight }}>{p.summary}</p>
          </MainSection>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" color={s.colorScheme} styles={s}>
            {workExperience.map((job, i) => (
              <div key={job.id} style={{ marginBottom: i < workExperience.length - 1 ? `${14 * s.scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>{job.position}</p>
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#888' }}>
                    {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                  </p>
                </div>
                <p style={{ margin: `${1 * s.scale}px 0 ${4 * s.scale}px`, color: s.colorScheme, fontSize: `${s.smallFontSize}px`, fontWeight: 600 }}>
                  {job.company}{job.location ? `, ${job.location}` : ''}
                </p>
                {job.description && <p style={{ margin: `0 0 ${4 * s.scale}px`, color: '#444' }}>{job.description}</p>}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: `${16 * s.scale}px` }}>
                    {job.bullets.filter(Boolean).map((b, idx) => (
                      <li key={idx} style={{ color: '#444', marginBottom: `${2 * s.scale}px` }}>{b}</li>
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
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </p>
                  <p style={{ margin: 0, fontSize: `${s.smallFontSize * 0.95}px`, color: '#888' }}>
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
                <p style={{ margin: `${2 * s.scale}px 0 0`, color: s.colorScheme, fontSize: `${s.smallFontSize}px` }}>
                  {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                </p>
              </div>
            ))}
          </MainSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <MainSection title="Certifications" color={s.colorScheme} styles={s}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${6 * s.scale}px` }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{cert.name}</p>
                <p style={{ margin: 0, color: '#666', fontSize: `${s.smallFontSize}px` }}>{cert.issuer} · {formatDate(cert.date)}</p>
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" color={s.colorScheme} styles={s}>
            {projects.map((proj, i) => (
              <div key={proj.id} style={{ marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0 }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{proj.name}</p>
                {proj.description && <p style={{ margin: `${3 * s.scale}px 0 0`, color: '#444' }}>{proj.description}</p>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, styles, children }: { title: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap}px` }}>
      <h2
        style={{
          fontSize: `${styles.smallFontSize * 0.95}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: `0 0 ${8 * styles.scale}px`,
          opacity: 0.75,
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          paddingBottom: `${4 * styles.scale}px`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function MainSection({ title, color, styles, children }: { title: string; color: string; styles: TemplateStyles; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 1.1}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * styles.scale}px`, marginBottom: `${10 * styles.scale}px` }}>
        <div style={{ width: `${4 * styles.scale}px`, height: `${20 * styles.scale}px`, backgroundColor: color, borderRadius: `${2 * styles.scale}px`, flexShrink: 0 }} />
        <h2 style={{ fontSize: `${styles.subHeadingFontSize}px`, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
