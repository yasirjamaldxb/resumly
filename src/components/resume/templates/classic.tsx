import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ClassicTemplate({ data, scale = 1 }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const contactItems = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: `${11 * scale}px`,
        lineHeight: 1.5,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: `${32 * scale}px ${40 * scale}px`,
        maxWidth: `${794 * scale}px`,
        minHeight: `${1123 * scale}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: `${4 * scale}px` }}>
        {fullName && (
          <h1
            style={{
              fontSize: `${22 * scale}px`,
              fontWeight: 700,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: `${3 * scale}px`,
              color: '#1a1a1a',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              fontSize: `${11 * scale}px`,
              color: '#555',
              margin: `${4 * scale}px 0 0`,
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            {p.jobTitle}
          </p>
        )}
      </div>

      {/* Horizontal rule below name */}
      <div
        style={{
          borderBottom: `${1 * scale}px solid #333`,
          marginBottom: `${8 * scale}px`,
        }}
      />

      {/* Contact info centered */}
      {contactItems.length > 0 && (
        <p
          style={{
            textAlign: 'center',
            fontSize: `${10 * scale}px`,
            color: '#555',
            margin: `0 0 ${16 * scale}px`,
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {idx > 0 && <span style={{ margin: `0 ${6 * scale}px` }}>&middot;</span>}
              {item}
            </span>
          ))}
        </p>
      )}

      {/* Summary */}
      {p.summary && (
        <ClassicSection title="Summary" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${11 * scale}px`, color: '#333', lineHeight: 1.6 }}>
            {p.summary}
          </p>
        </ClassicSection>
      )}

      {/* Education BEFORE Experience (traditional academic order) */}
      {education.length > 0 && (
        <ClassicSection title="Education" color={data.colorScheme} scale={scale}>
          {education.map((edu, i) => (
            <div
              key={edu.id}
              style={{
                marginBottom: i < education.length - 1 ? `${10 * scale}px` : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                    {edu.institution}
                  </p>
                  <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    {edu.location ? ` — ${edu.location}` : ''}
                    {edu.gpa && <span style={{ color: '#555' }}> | GPA: {edu.gpa}</span>}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${10 * scale}px`,
                    color: '#555',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: `${12 * scale}px`,
                    textAlign: 'right',
                  }}
                >
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <ClassicSection title="Experience" color={data.colorScheme} scale={scale}>
          {workExperience.map((job, i) => (
            <div
              key={job.id}
              style={{
                marginBottom: i < workExperience.length - 1 ? `${12 * scale}px` : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                    {job.position}
                  </p>
                  <p style={{ margin: `${2 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333' }}>
                    {job.company}{job.location ? ` — ${job.location}` : ''}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${10 * scale}px`,
                    color: '#555',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: `${12 * scale}px`,
                    textAlign: 'right',
                  }}
                >
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${4 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333' }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: `${4 * scale}px 0 0`, paddingLeft: `${18 * scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: `${10.5 * scale}px`,
                        color: '#333',
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
        </ClassicSection>
      )}

      {/* Skills as simple paragraph */}
      {skills.length > 0 && (
        <ClassicSection title="Skills" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333', lineHeight: 1.6 }}>
            {skills.map((skill) => skill.name).join(', ')}
          </p>
        </ClassicSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ClassicSection title="Projects" color={data.colorScheme} scale={scale}>
          {projects.map((proj, i) => (
            <div
              key={proj.id}
              style={{
                marginBottom: i < projects.length - 1 ? `${10 * scale}px` : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${11 * scale}px` }}>
                  {proj.name}
                </p>
                {proj.url && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: `${10 * scale}px`,
                      color: '#555',
                      flexShrink: 0,
                      marginLeft: `${12 * scale}px`,
                    }}
                  >
                    {proj.url}
                  </p>
                )}
              </div>
              {proj.description && (
                <p style={{ margin: `${3 * scale}px 0 0`, fontSize: `${10.5 * scale}px`, color: '#333' }}>
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ClassicSection title="Certifications" color={data.colorScheme} scale={scale}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: `${6 * scale}px`,
              }}
            >
              <p style={{ margin: 0, fontSize: `${10.5 * scale}px` }}>
                <span style={{ fontWeight: 600 }}>{cert.name}</span>
                <span style={{ color: '#555' }}> — {cert.issuer}</span>
              </p>
              {cert.date && (
                <p style={{ margin: 0, fontSize: `${10 * scale}px`, color: '#555', flexShrink: 0, marginLeft: `${12 * scale}px` }}>
                  {formatDate(cert.date)}
                </p>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <ClassicSection title="Languages" color={data.colorScheme} scale={scale}>
          <p style={{ margin: 0, fontSize: `${10.5 * scale}px`, color: '#333' }}>
            {languages.map((lang, i) => (
              <span key={lang.id}>
                {i > 0 && <span style={{ margin: `0 ${4 * scale}px` }}>&middot;</span>}
                <span style={{ fontWeight: 600 }}>{lang.name}</span>
                <span style={{ color: '#555', textTransform: 'capitalize' }}> ({lang.proficiency})</span>
              </span>
            ))}
          </p>
        </ClassicSection>
      )}
    </div>
  );
}

function ClassicSection({
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
    <div style={{ marginBottom: `${14 * scale}px` }}>
      <h2
        style={{
          fontSize: `${11 * scale}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: `0 0 ${6 * scale}px`,
          color: '#1a1a1a',
          fontFamily: 'Arial, Helvetica, sans-serif',
          paddingTop: `${3 * scale}px`,
          paddingBottom: `${3 * scale}px`,
          borderTop: `${1.5 * scale}px solid #333`,
          borderBottom: `${1 * scale}px solid ${color}`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
