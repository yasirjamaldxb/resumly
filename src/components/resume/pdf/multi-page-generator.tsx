import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 700 },
  ],
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

// ─── MULTI-PAGE ATS-FRIENDLY TEMPLATE ───────────────────────────

function ATSProMultiPagePDF({ data }: { data: ResumeData }) {
  const c = data.colorScheme;
  const p = data.personalDetails;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  // Split content into pages
  const experience = data.workExperience;
  const education = data.education;
  const certifications = data.certifications;
  const projects = data.projects;
  const languages = data.languages;
  const skills = data.skills;

  // Calculate how much content fits on first page with header + summary
  const hasHeaderContent = fullName || p.jobTitle || (p.email || p.phone || p.location);
  const hasSummary = p.summary && p.summary.length > 50;

  // Distribute content across pages
  let page1Experience: typeof experience = [];
  let page2Experience: typeof experience = [];
  let page2Education: typeof education = [];
  let page3Content: any = { education: [], projects: [], certs: [], languages: [] };

  if (hasSummary && experience.length <= 2) {
    page1Experience = experience;
  } else if (experience.length <= 3) {
    page1Experience = experience;
  } else {
    page1Experience = experience.slice(0, 2);
    page2Experience = experience.slice(2);
  }

  if (page2Experience.length > 0) {
    page2Education = education.slice(0, 2);
    page3Content = {
      education: education.slice(2),
      projects: projects,
      certs: certifications,
      languages: languages,
    };
  } else {
    page2Education = education;
    page3Content = {
      projects: projects.slice(0, 3),
      certs: certifications,
      languages: languages,
    };
  }

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10.5,
      color: '#1a1a1a',
      padding: '28 32',
      lineHeight: 1.5,
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: c,
      paddingBottom: 10,
      marginBottom: 14,
    },
    name: { fontSize: 22, fontWeight: 700, color: '#1a1a1a', letterSpacing: -0.3 },
    jobTitle: { fontSize: 13, color: c, fontWeight: 700, marginTop: 2, marginBottom: 6 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, fontSize: 9.5, color: '#555', marginTop: 6 },
    sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: c, marginBottom: 7, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    section: { marginBottom: 14 },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    bold: { fontWeight: 700, fontSize: 11 },
    company: { color: c, fontSize: 10.5, fontWeight: 700 },
    dateText: { fontSize: 9.5, color: '#666' },
    bodyText: { fontSize: 10.5, color: '#333', lineHeight: 1.6 },
    bullet: { fontSize: 10.5, color: '#333', marginBottom: 2, paddingLeft: 12 },
    photoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
    skillTag: { fontSize: 9.5, backgroundColor: '#f3f4f6', color: '#374151', padding: '2 8', borderRadius: 3, borderWidth: 1, borderColor: '#e5e7eb' },
  });

  const HeaderSection = () => (
    <View style={styles.header}>
      <View style={p.photo ? styles.photoRow : {}}>
        {p.photo && (
          <Image src={p.photo} style={{ width: 60, height: 60, borderRadius: 30, objectFit: 'cover' }} />
        )}
        <View>
          {fullName ? <Text style={styles.name}>{fullName}</Text> : null}
          {p.jobTitle ? <Text style={styles.jobTitle}>{p.jobTitle}</Text> : null}
        </View>
      </View>
      <View style={styles.contactRow}>
        {p.email ? <Text>{p.email}</Text> : null}
        {p.phone ? <Text>{p.phone}</Text> : null}
        {p.location ? <Text>{p.location}</Text> : null}
        {p.linkedIn ? <Text>{p.linkedIn}</Text> : null}
        {p.website ? <Text>{p.website}</Text> : null}
      </View>
    </View>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <Document>
      {/* Page 1: Header + Summary + First Work Experience + Skills */}
      <Page size="A4" style={styles.page}>
        <HeaderSection />

        {p.summary ? (
          <View style={styles.section}>
            <SectionTitle title="Professional Summary" />
            <Text style={styles.bodyText}>{p.summary}</Text>
          </View>
        ) : null}

        {page1Experience.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle title="Work Experience" />
            {page1Experience.map((job) => (
              <View key={job.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.bold}>{job.position}</Text>
                    <Text style={styles.company}>{job.company}{job.location ? ` \u2022 ${job.location}` : ''}</Text>
                  </View>
                  <Text style={styles.dateText}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
                </View>
                {job.description ? <Text style={[styles.bodyText, { marginTop: 3 }]}>{job.description}</Text> : null}
                {job.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={styles.bullet}>{'\u2022'} {b}</Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle title="Skills" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {skills.map((sk) => (
                <Text key={sk.id} style={styles.skillTag}>{sk.name}</Text>
              ))}
            </View>
          </View>
        ) : null}
      </Page>

      {/* Page 2: Remaining work experience + education */}
      {(page2Experience.length > 0 || page2Education.length > 0) ? (
        <Page size="A4" style={styles.page}>
          {page2Experience.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle title="Work Experience (continued)" />
              {page2Experience.map((job) => (
                <View key={job.id} style={{ marginBottom: 10 }}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.bold}>{job.position}</Text>
                      <Text style={styles.company}>{job.company}{job.location ? ` \u2022 ${job.location}` : ''}</Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
                  </View>
                  {job.description ? <Text style={[styles.bodyText, { marginTop: 3 }]}>{job.description}</Text> : null}
                  {job.bullets.filter(Boolean).map((b, i) => (
                    <Text key={i} style={styles.bullet}>{'\u2022'} {b}</Text>
                  ))}
                </View>
              ))}
            </View>
          ) : null}

          {page2Education.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle title="Education" />
              {page2Education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 8 }}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.bold}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                      <Text style={[styles.company, { fontWeight: 400 }]}>{edu.institution}{edu.location ? ` \u2022 ${edu.location}` : ''}</Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
                  </View>
                  {edu.gpa ? <Text style={{ fontSize: 9.5, color: '#555', marginTop: 2 }}>GPA: {edu.gpa}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </Page>
      ) : null}

      {/* Page 3: Additional education, projects, certifications, languages */}
      {(page3Content.education.length > 0 || page3Content.projects.length > 0 || page3Content.certs.length > 0 || page3Content.languages.length > 0) ? (
        <Page size="A4" style={styles.page}>
          {page3Content.education.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle title="Education (continued)" />
              {page3Content.education.map((edu: any) => (
                <View key={edu.id} style={{ marginBottom: 8 }}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.bold}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                      <Text style={[styles.company, { fontWeight: 400 }]}>{edu.institution}{edu.location ? ` \u2022 ${edu.location}` : ''}</Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {page3Content.certs.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle title="Certifications" />
              {page3Content.certs.map((cert: any) => (
                <View key={cert.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <View>
                    <Text style={{ fontWeight: 700, fontSize: 10.5 }}>{cert.name}</Text>
                    <Text style={{ fontSize: 9.5, color: '#666' }}>{cert.issuer}</Text>
                  </View>
                  <Text style={styles.dateText}>{formatDate(cert.date)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {page3Content.projects.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle title="Projects" />
              {page3Content.projects.map((proj: any) => (
                <View key={proj.id} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.bold}>{proj.name}</Text>
                    {proj.url ? <Text style={{ fontSize: 9.5, color: c }}>{proj.url}</Text> : null}
                  </View>
                  {proj.description ? <Text style={[styles.bodyText, { marginTop: 2 }]}>{proj.description}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {page3Content.languages.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle title="Languages" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                {page3Content.languages.map((lang: any) => (
                  <Text key={lang.id} style={{ fontSize: 10.5 }}>
                    <Text style={{ fontWeight: 700 }}>{lang.name}</Text> ({lang.proficiency})
                  </Text>
                ))}
              </View>
            </View>
          ) : null}
        </Page>
      ) : null}
    </Document>
  );
}

// ─── MODERN TWO-COLUMN MULTI-PAGE ──────────────────────────────

function ModernMultiPagePDF({ data }: { data: ResumeData }) {
  const c = data.colorScheme;
  const p = data.personalDetails;
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const sidebarWidth = 210;

  const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a', flexDirection: 'row', lineHeight: 1.5 },
    sidebar: { width: sidebarWidth, backgroundColor: c, color: '#ffffff', padding: '24 16' },
    main: { flex: 1, padding: '24 24' },
    name: { fontSize: 17, fontWeight: 700, lineHeight: 1.3, marginBottom: 3 },
    jobTitle: { fontSize: 11, opacity: 0.85, marginBottom: 14 },
    sideTitle: { fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.75, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.3)', paddingBottom: 3, marginBottom: 7 },
    sideSec: { marginBottom: 14 },
    mainTitle: { fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
    mainSec: { marginBottom: 16 },
    bar: { width: 4, height: 18, backgroundColor: c, borderRadius: 2, marginRight: 8 },
    bold: { fontWeight: 700, fontSize: 11 },
    dateText: { fontSize: 9, color: '#888' },
  });

  // Similar pagination logic as ATS Pro
  const experience = data.workExperience.slice(0, 3);
  const education = data.education.slice(0, 2);
  const skills = data.skills;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {p.photo ? (
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Image src={p.photo} style={{ width: 75, height: 75, borderRadius: 37, objectFit: 'cover', borderWidth: 3, borderColor: 'white' }} />
            </View>
          ) : null}
          {fullName ? <Text style={styles.name}>{fullName}</Text> : null}
          {p.jobTitle ? <Text style={styles.jobTitle}>{p.jobTitle}</Text> : null}

          {/* Contact */}
          <View style={styles.sideSec}>
            <Text style={styles.sideTitle}>Contact</Text>
            {p.email ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.email}</Text> : null}
            {p.phone ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.phone}</Text> : null}
            {p.location ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.location}</Text> : null}
          </View>

          {/* Skills */}
          {skills.length > 0 ? (
            <View style={styles.sideSec}>
              <Text style={styles.sideTitle}>Skills</Text>
              {skills.slice(0, 10).map((sk) => (
                <Text key={sk.id} style={{ fontSize: 9.5, marginBottom: 4 }}>{sk.name}</Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.main}>
          {p.summary ? (
            <View style={styles.mainSec}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={styles.bar} />
                <Text style={styles.mainTitle}>About Me</Text>
              </View>
              <Text style={{ color: '#444', lineHeight: 1.7 }}>{p.summary}</Text>
            </View>
          ) : null}

          {experience.length > 0 ? (
            <View style={styles.mainSec}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={styles.bar} />
                <Text style={styles.mainTitle}>Experience</Text>
              </View>
              {experience.map((job) => (
                <View key={job.id} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.bold}>{job.position}</Text>
                    <Text style={styles.dateText}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
                  </View>
                  <Text style={{ color: c, fontSize: 10, fontWeight: 700, marginTop: 1, marginBottom: 3 }}>{job.company}{job.location ? `, ${job.location}` : ''}</Text>
                  {job.bullets.filter(Boolean).slice(0, 3).map((b, i) => (
                    <Text key={i} style={{ color: '#444', marginBottom: 1, paddingLeft: 10 }}>{'\u2022'} {b}</Text>
                  ))}
                </View>
              ))}
            </View>
          ) : null}

          {education.length > 0 ? (
            <View style={styles.mainSec}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={styles.bar} />
                <Text style={styles.mainTitle}>Education</Text>
              </View>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.bold}>{edu.degree}{edu.field ? ` \u2014 ${edu.field}` : ''}</Text>
                    <Text style={styles.dateText}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
                  </View>
                  <Text style={{ color: c, fontSize: 10 }}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}

// ─── EXPORT ──────────────────────────────────────────────────

export async function generateMultiPagePDF(data: ResumeData): Promise<Blob> {
  let Document_;
  if (data.templateId === 'modern') {
    Document_ = <ModernMultiPagePDF data={data} />;
  } else {
    Document_ = <ATSProMultiPagePDF data={data} />;
  }
  const blob = await pdf(Document_).toBlob();
  return blob;
}

export async function downloadMultiPagePDF(data: ResumeData) {
  const blob = await generateMultiPagePDF(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const firstName = data.personalDetails.firstName || 'resume';
  const lastName = data.personalDetails.lastName || '';
  a.download = `${firstName}-${lastName}-resume.pdf`.replace(/\s+/g, '-').replace(/-+/g, '-');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
