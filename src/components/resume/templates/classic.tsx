import { ResumeData } from '@/types/resume';
import { TemplateStyles } from '@/lib/template-utils';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  styles: TemplateStyles;
}

export function ClassicTemplate({ data, styles }: Props) {
  const { personalDetails: p, workExperience, education, skills, certifications, languages, projects } = data;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const s = styles;

  const contactItems = [p.email, p.phone, p.location, p.linkedIn, p.website].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: s.fontFamily,
        fontSize: `${s.baseFontSize}px`,
        lineHeight: s.lineHeight,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: `${s.paddingTop}px ${s.paddingLeft * 1.2}px`,
        maxWidth: `${s.pageWidth}px`,
        minHeight: `${s.pageHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: s.headerAlignment, marginBottom: `${4 * s.scale}px` }}>
        {fullName && (
          <h1
            style={{
              fontSize: `${s.headingFontSize}px`,
              fontWeight: 700,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: `${3 * s.scale}px`,
              color: '#1a1a1a',
            }}
          >
            {fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              fontSize: `${s.baseFontSize}px`,
              color: '#555',
              margin: `${4 * s.scale}px 0 0`,
            }}
          >
            {p.jobTitle}
          </p>
        )}
      </div>

      {/* Horizontal rule below name */}
      <div
        style={{
          borderBottom: `${1 * s.scale}px solid #333`,
          marginBottom: `${8 * s.scale}px`,
        }}
      />

      {/* Contact info centered */}
      {contactItems.length > 0 && (
        <p
          style={{
            textAlign: s.headerAlignment,
            fontSize: `${s.smallFontSize}px`,
            color: '#555',
            margin: `0 0 ${s.sectionGap}px`,
          }}
        >
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {idx > 0 && <span style={{ margin: `0 ${6 * s.scale}px` }}>&middot;</span>}
              {item}
            </span>
          ))}
        </p>
      )}

      {/* Summary */}
      {p.summary && (
        <ClassicSection title="Summary" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.baseFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
            {p.summary}
          </p>
        </ClassicSection>
      )}

      {/* Education BEFORE Experience (traditional academic order) */}
      {education.length > 0 && (
        <ClassicSection title="Education" color={s.colorScheme} styles={s}>
          {education.map((edu, i) => (
            <div
              key={edu.id}
              style={{
                marginBottom: i < education.length - 1 ? `${10 * s.scale}px` : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                    {edu.institution}
                  </p>
                  <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    {edu.location ? ` \u2014 ${edu.location}` : ''}
                    {edu.gpa && <span style={{ color: '#555' }}> | GPA: {edu.gpa}</span>}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${s.smallFontSize}px`,
                    color: '#555',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: `${12 * s.scale}px`,
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
        <ClassicSection title="Experience" color={s.colorScheme} styles={s}>
          {workExperience.map((job, i) => (
            <div
              key={job.id}
              style={{
                marginBottom: i < workExperience.length - 1 ? `${12 * s.scale}px` : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: s.dateAlignment === 'left' ? 'row-reverse' : 'row' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                    {job.position}
                  </p>
                  <p style={{ margin: `${2 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>
                    {job.company}{job.location ? ` \u2014 ${job.location}` : ''}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: `${s.smallFontSize}px`,
                    color: '#555',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: `${12 * s.scale}px`,
                    textAlign: 'right',
                  }}
                >
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
              {job.description && (
                <p style={{ margin: `${4 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>
                  {job.description}
                </p>
              )}
              {job.bullets.filter(Boolean).length > 0 && (
                <ul style={{ margin: `${4 * s.scale}px 0 0`, paddingLeft: `${18 * s.scale}px` }}>
                  {job.bullets.filter(Boolean).map((bullet, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: `${s.bodyFontSize}px`,
                        color: '#333',
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
        </ClassicSection>
      )}

      {/* Skills as simple paragraph */}
      {skills.length > 0 && (
        <ClassicSection title="Skills" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333', lineHeight: s.lineHeight }}>
            {skills.map((skill) => skill.name).join(', ')}
          </p>
        </ClassicSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ClassicSection title="Projects" color={s.colorScheme} styles={s}>
          {projects.map((proj, i) => (
            <div
              key={proj.id}
              style={{
                marginBottom: i < projects.length - 1 ? `${10 * s.scale}px` : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: `${s.baseFontSize}px` }}>
                  {proj.name}
                </p>
                {proj.url && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: `${s.smallFontSize}px`,
                      color: '#555',
                      flexShrink: 0,
                      marginLeft: `${12 * s.scale}px`,
                    }}
                  >
                    {proj.url}
                  </p>
                )}
              </div>
              {proj.description && (
                <p style={{ margin: `${3 * s.scale}px 0 0`, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ClassicSection title="Certifications" color={s.colorScheme} styles={s}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: `${6 * s.scale}px`,
              }}
            >
              <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px` }}>
                <span style={{ fontWeight: 600 }}>{cert.name}</span>
                <span style={{ color: '#555' }}> &mdash; {cert.issuer}</span>
              </p>
              {cert.date && (
                <p style={{ margin: 0, fontSize: `${s.smallFontSize}px`, color: '#555', flexShrink: 0, marginLeft: `${12 * s.scale}px` }}>
                  {formatDate(cert.date)}
                </p>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <ClassicSection title="Languages" color={s.colorScheme} styles={s}>
          <p style={{ margin: 0, fontSize: `${s.bodyFontSize}px`, color: '#333' }}>
            {languages.map((lang, i) => (
              <span key={lang.id}>
                {i > 0 && <span style={{ margin: `0 ${4 * s.scale}px` }}>&middot;</span>}
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
  styles,
  children,
}: {
  title: string;
  color: string;
  styles: TemplateStyles;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: `${styles.sectionGap * 0.88}px` }}>
      <h2
        style={{
          fontSize: `${styles.sectionTitleFontSize}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: `0 0 ${6 * styles.scale}px`,
          color: '#1a1a1a',
          paddingTop: `${3 * styles.scale}px`,
          paddingBottom: `${3 * styles.scale}px`,
          borderTop: `${1.5 * styles.scale}px solid #333`,
          borderBottom: `${1 * styles.scale}px solid ${color}`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
