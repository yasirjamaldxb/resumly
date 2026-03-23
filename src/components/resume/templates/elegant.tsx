import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function ElegantTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const contactItems = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  /* Convert hex color to rgba for subtle backgrounds */
  const hexToRgba = (hex: string, alpha: number): string => {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const subtleBg = hexToRgba(s.colorScheme, 0.05);

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.bodyFontSize}px`,
        lineHeight: s.lineHeight,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header with subtle colored background */}
      <div
        style={{
          backgroundColor: subtleBg,
          padding: `${s.paddingTop}px ${s.paddingLeft}px ${s.paddingTop * 0.75}px`,
          textAlign: s.headerAlignment,
        }}
      >
        {p.photo && (
          <div style={{ marginBottom: `${10 * s.scale}px` }}>
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
        {fullName && (
          <h1
            style={{
              fontSize: `${s.headingFontSize * 1.09}px`,
              fontWeight: 600,
              margin: 0,
              color: '#1a1a1a',
              letterSpacing: `${2 * s.scale}px`,
            }}
          >
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              fontSize: `${s.subHeadingFontSize * 0.92}px`,
              textTransform: 'uppercase',
              letterSpacing: `${3 * s.scale}px`,
              color: '#666',
              margin: `${6 * s.scale}px 0 0`,
            }}
          >
            {p.jobTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <p
            style={{
              fontSize: `${s.smallFontSize}px`,
              color: '#666',
              margin: `${12 * s.scale}px 0 0`,
            }}
          >
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && (
                  <span style={{ margin: `0 ${8 * s.scale}px`, color: '#bbb' }}>&bull;</span>
                )}
                {item}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: `${s.paddingTop * 0.75}px ${s.paddingLeft}px ${s.paddingBottom}px` }}>
        {/* Summary */}
        {p.summary && (
          <ElegantSection title="Summary" color={s.colorScheme} styles={s}>
            <p
              style={{
                margin: 0,
                fontSize: `${s.bodyFontSize}px`,
                color: '#444',
                textAlign: 'center',
                lineHeight: s.lineHeight,
                fontStyle: 'italic',
              }}
            >
              {p.summary}
            </p>
          </ElegantSection>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <ElegantSection title="Experience" color={s.colorScheme} styles={s}>
            {workExperience.map((job, i) => (
              <div
                key={job.id}
                style={{
                  marginBottom: i < workExperience.length - 1 ? `${14 * s.scale}px` : 0,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    margin: 0,
                    fontSize: `${s.baseFontSize}px`,
                    color: '#1a1a1a',
                  }}
                >
                  {job.position}
                </p>
                <p
                  style={{
                    margin: `${2 * s.scale}px 0 0`,
                    fontSize: `${s.smallFontSize}px`,
                    color: '#666',
                  }}
                >
                  {job.company}{job.location ? ` \u2014 ${job.location}` : ''}
                  <span style={{ margin: `0 ${6 * s.scale}px`, color: '#ccc' }}>|</span>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
                {job.description && (
                  <p
                    style={{
                      margin: `${6 * s.scale}px 0 0`,
                      fontSize: `${s.bodyFontSize}px`,
                      color: '#444',
                      textAlign: 'left',
                    }}
                  >
                    {job.description}
                  </p>
                )}
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul
                    style={{
                      margin: `${4 * s.scale}px 0 0`,
                      paddingLeft: `${18 * s.scale}px`,
                      textAlign: 'left',
                    }}
                  >
                    {job.bullets.filter(Boolean).map((bullet, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: `${s.bodyFontSize}px`,
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
          </ElegantSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <ElegantSection title="Education" color={s.colorScheme} styles={s}>
            {education.map((edu, i) => (
              <div
                key={edu.id}
                style={{
                  marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <p
                  style={{
                    margin: `${2 * s.scale}px 0 0`,
                    fontSize: `${s.smallFontSize}px`,
                    color: '#666',
                  }}
                >
                  {edu.institution}{edu.location ? ` \u2014 ${edu.location}` : ''}
                  <span style={{ margin: `0 ${6 * s.scale}px`, color: '#ccc' }}>|</span>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                </p>
              </div>
            ))}
          </ElegantSection>
        )}

        {/* Skills as centered tags with thin borders */}
        {skills.length > 0 && (
          <ElegantSection title="Skills" color={s.colorScheme} styles={s}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: `${6 * s.scale}px`,
              }}
            >
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    fontSize: `${s.smallFontSize * 0.95}px`,
                    padding: `${3 * s.scale}px ${10 * s.scale}px`,
                    border: `1px solid ${s.colorScheme}`,
                    borderRadius: `${12 * s.scale}px`,
                    color: '#444',
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </ElegantSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <ElegantSection title="Certifications" color={s.colorScheme} styles={s}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ textAlign: 'center', marginBottom: `${6 * s.scale}px` }}>
                <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px` }}>
                  <span style={{ fontWeight: 600 }}>{cert.name}</span>
                  <span style={{ color: '#666' }}> &mdash; {cert.issuer}</span>
                  {cert.date && <span style={{ color: '#888' }}> ({formatDate(cert.date)})</span>}
                </p>
              </div>
            ))}
          </ElegantSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <ElegantSection title="Projects" color={s.colorScheme} styles={s}>
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                style={{
                  marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                  {proj.name}
                  {proj.url && (
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: `${s.smallFontSize * 0.95}px`,
                        color: s.colorScheme,
                        marginLeft: `${6 * s.scale}px`,
                      }}
                    >
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#444', textAlign: 'left' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </ElegantSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <ElegantSection title="Languages" color={s.colorScheme} styles={s}>
            <p
              style={{
                margin: 0,
                fontSize: `${s.bodyFontSize}px`,
                textAlign: 'center',
                color: '#444',
              }}
            >
              {languages.map((lang, i) => (
                <span key={lang.id}>
                  {i > 0 && (
                    <span style={{ margin: `0 ${8 * s.scale}px`, color: '#ccc' }}>&bull;</span>
                  )}
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                  <span style={{ color: '#666', textTransform: 'capitalize' }}> ({lang.proficiency})</span>
                </span>
              ))}
            </p>
          </ElegantSection>
        )}
      </div>
    </div>
  );
}

function ElegantSection({
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
    <div style={{ marginBottom: `${styles.sectionGap * 1.1}px` }}>
      {/* Decorative section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: `${10 * styles.scale}px`,
          gap: `${10 * styles.scale}px`,
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: `${80 * styles.scale}px`,
            height: `${1 * styles.scale}px`,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
        <h2
          style={{
            fontSize: `${styles.sectionTitleFontSize}px`,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: `${2 * styles.scale}px`,
            margin: 0,
            color: '#1a1a1a',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            maxWidth: `${80 * styles.scale}px`,
            height: `${1 * styles.scale}px`,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
      </div>
      {children}
    </div>
  );
}
