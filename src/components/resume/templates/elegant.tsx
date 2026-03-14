import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ElegantTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const contactItems = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  /* Convert hex color to rgba for subtle backgrounds */
  const hexToRgba = (hex: string, alpha: number): string => {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const subtleBg = hexToRgba(data.colorScheme, 0.05);

  return (
    <div
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: `${10.5 * scale}px`,
        lineHeight: 1.6,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header with subtle colored background */}
      <div
        style={{
          backgroundColor: subtleBg,
          padding: `${32 * scale}px ${40 * scale}px ${24 * scale}px`,
          textAlign: 'center',
        }}
      >
        {fullName && (
          <h1
            style={{
              fontSize: `${24 * scale}px`,
              fontWeight: 600,
              margin: 0,
              color: '#1a1a1a',
              letterSpacing: `${2 * scale}px`,
            }}
          >
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              fontSize: `${12 * scale}px`,
              textTransform: 'uppercase',
              letterSpacing: `${3 * scale}px`,
              color: '#666',
              margin: `${6 * scale}px 0 0`,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {p.jobTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <p
            style={{
              fontSize: `${10 * scale}px`,
              color: '#666',
              margin: `${12 * scale}px 0 0`,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && (
                  <span style={{ margin: `0 ${8 * scale}px`, color: '#bbb' }}>&bull;</span>
                )}
                {item}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: `${24 * scale}px ${40 * scale}px ${32 * scale}px` }}>
        {/* Summary */}
        {p.summary && (
          <ElegantSection title="Summary" color={data.colorScheme} scale={scale}>
            <p
              style={{
                margin: 0,
                fontSize: `${10.5 * scale}px`,
                color: '#444',
                textAlign: 'center',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              {p.summary}
            </p>
          </ElegantSection>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <ElegantSection title="Experience" color={data.colorScheme} scale={scale}>
            {workExperience.map((job, i) => (
              <div
                key={job.id}
                style={{
                  marginBottom: i < workExperience.length - 1 ? `${14 * scale}px` : 0,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    margin: 0,
                    fontSize: `${11 * scale}px`,
                    color: '#1a1a1a',
                  }}
                >
                  {job.position}
                </p>
                <p
                  style={{
                    margin: `${2 * scale}px 0 0`,
                    fontSize: `${10 * scale}px`,
                    color: '#666',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {job.company}{job.location ? ` — ${job.location}` : ''}
                  <span style={{ margin: `0 ${6 * scale}px`, color: '#ccc' }}>|</span>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
                {job.description && (
                  <p
                    style={{
                      margin: `${6 * scale}px 0 0`,
                      fontSize: `${10.5 * scale}px`,
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
                      margin: `${4 * scale}px 0 0`,
                      paddingLeft: `${18 * scale}px`,
                      textAlign: 'left',
                    }}
                  >
                    {job.bullets.filter(Boolean).map((bullet, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: `${10.5 * scale}px`,
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
          </ElegantSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <ElegantSection title="Education" color={data.colorScheme} scale={scale}>
            {education.map((edu, i) => (
              <div
                key={edu.id}
                style={{
                  marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <p
                  style={{
                    margin: `${2 * scale}px 0 0`,
                    fontSize: `${10 * scale}px`,
                    color: '#666',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {edu.institution}{edu.location ? ` — ${edu.location}` : ''}
                  <span style={{ margin: `0 ${6 * scale}px`, color: '#ccc' }}>|</span>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                </p>
              </div>
            ))}
          </ElegantSection>
        )}

        {/* Skills as centered tags with thin borders */}
        {skills.length > 0 && (
          <ElegantSection title="Skills" color={data.colorScheme} scale={scale}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: `${6 * scale}px`,
              }}
            >
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    fontSize: `${9.5 * scale}px`,
                    padding: `${3 * scale}px ${10 * scale}px`,
                    border: `1px solid ${data.colorScheme}`,
                    borderRadius: `${12 * scale}px`,
                    color: '#444',
                    fontFamily: 'Arial, sans-serif',
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
          <ElegantSection title="Certifications" color={data.colorScheme} scale={scale}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ textAlign: 'center', marginBottom: `${6 * scale}px` }}>
                <p style={{ margin: 0, fontSize: `${10.5 * scale}px` }}>
                  <span style={{ fontWeight: 600 }}>{cert.name}</span>
                  <span style={{ color: '#666' }}> — {cert.issuer}</span>
                  {cert.date && <span style={{ color: '#888' }}> ({formatDate(cert.date)})</span>}
                </p>
              </div>
            ))}
          </ElegantSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <ElegantSection title="Projects" color={data.colorScheme} scale={scale}>
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                style={{
                  marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                  {proj.name}
                  {proj.url && (
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: `${9.5 * scale}px`,
                        color: data.colorScheme,
                        marginLeft: `${6 * scale}px`,
                      }}
                    >
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#444', textAlign: 'left' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </ElegantSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <ElegantSection title="Languages" color={data.colorScheme} scale={scale}>
            <p
              style={{
                margin: 0,
                fontSize: `${10.5 * scale}px`,
                textAlign: 'center',
                color: '#444',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {languages.map((lang, i) => (
                <span key={lang.id}>
                  {i > 0 && (
                    <span style={{ margin: `0 ${8 * scale}px`, color: '#ccc' }}>&bull;</span>
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
  scale,
  children,
}: {
  title: string;
  color: string;
  scale: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${18 * scale}px` }}>
      {/* Decorative section header: ——— TITLE ——— */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: `${10 * scale}px`,
          gap: `${10 * scale}px`,
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: `${80 * scale}px`,
            height: `${1 * scale}px`,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
        <h2
          style={{
            fontSize: `${11 * scale}px`,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: `${2 * scale}px`,
            margin: 0,
            color: '#1a1a1a',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            maxWidth: `${80 * scale}px`,
            height: `${1 * scale}px`,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
      </div>
      {children}
    </div>
  );
}
