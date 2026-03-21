import { Document, Page, Text, View, Image, Link, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

// Register standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 700 },
  ],
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Handle YYYY-MM, YYYYMM, or just YYYY
  const cleaned = dateStr.replace(/[^0-9]/g, '');
  if (cleaned.length >= 6) {
    const year = cleaned.slice(0, 4);
    const month = parseInt(cleaned.slice(4, 6)) - 1;
    return `${months[month] || ''} ${year}`.trim();
  }
  if (cleaned.length === 4) return cleaned; // Just year
  return dateStr;
}

// ─── SHARED HELPERS ─────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lightenColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`;
}

// ─── TEMPLATE: ATS PRO (Single column, clean) ──────────────────

function ATSProPDF({ data }: { data: ResumeData }) {
  const c = data.colorScheme;
  const p = data.personalDetails;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10.5, color: '#1a1a1a', padding: '28 32', lineHeight: 1.5 },
    header: { borderBottomWidth: 2, borderBottomColor: c, paddingBottom: 10, marginBottom: 14 },
    name: { fontSize: 22, fontWeight: 700, color: '#1a1a1a', letterSpacing: -0.3 },
    jobTitle: { fontSize: 13, color: c, fontWeight: 700, marginTop: 2, marginBottom: 6 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, fontSize: 9.5, color: '#555' },
    sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: c, marginBottom: 7, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    section: { marginBottom: 14 },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    bold: { fontWeight: 700, fontSize: 11 },
    company: { color: c, fontSize: 10.5, fontWeight: 700 },
    dateText: { fontSize: 9.5, color: '#666' },
    bodyText: { fontSize: 10.5, color: '#333', lineHeight: 1.6 },
    bullet: { fontSize: 10.5, color: '#333', marginBottom: 2, paddingLeft: 12 },
    skillTag: { fontSize: 9.5, backgroundColor: '#f3f4f6', color: '#374151', padding: '2 8', borderRadius: 3, borderWidth: 1, borderColor: '#e5e7eb' },
    photoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  });

  return (
    <Page size="A4" style={s.page}>
      {/* Header */}
      <View style={s.header}>
        <View style={p.photo ? s.photoRow : {}}>
          {p.photo && (
            <Image src={p.photo} style={{ width: 60, height: 60, borderRadius: 30, objectFit: 'cover' }} />
          )}
          <View>
            {fullName ? <Text style={s.name}>{fullName}</Text> : null}
            {p.jobTitle ? <Text style={s.jobTitle}>{p.jobTitle}</Text> : null}
          </View>
        </View>
        <View style={s.contactRow}>
          {p.email ? <Text>{p.email}</Text> : null}
          {p.phone ? <Text>{p.phone}</Text> : null}
          {p.location ? <Text>{p.location}</Text> : null}
          {p.linkedIn ? <Text>{p.linkedIn}</Text> : null}
          {p.website ? <Text>{p.website}</Text> : null}
        </View>
      </View>

      {/* Summary */}
      {p.summary ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Professional Summary</Text>
          <Text style={s.bodyText}>{p.summary}</Text>
        </View>
      ) : null}

      {/* Work Experience */}
      {data.workExperience.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Work Experience</Text>
          {data.workExperience.map((job) => (
            <View key={job.id} style={{ marginBottom: 10 }}>
              <View style={s.entryHeader}>
                <View>
                  <Text style={s.bold}>{job.position}</Text>
                  <Text style={s.company}>{job.company}{job.location ? ` \u2022 ${job.location}` : ''}</Text>
                </View>
                <Text style={s.dateText}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
              </View>
              {job.description ? <Text style={[s.bodyText, { marginTop: 3 }]}>{job.description}</Text> : null}
              {job.bullets.filter(Boolean).map((b, i) => (
                <Text key={i} style={s.bullet}>{'\u2022'} {b}</Text>
              ))}
            </View>
          ))}
        </View>
      ) : null}

      {/* Education */}
      {data.education.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 8 }}>
              <View style={s.entryHeader}>
                <View>
                  <Text style={s.bold}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                  <Text style={[s.company, { fontWeight: 400 }]}>{edu.institution}{edu.location ? ` \u2022 ${edu.location}` : ''}</Text>
                </View>
                <Text style={s.dateText}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
              </View>
              {edu.gpa ? <Text style={{ fontSize: 9.5, color: '#555', marginTop: 2 }}>GPA: {edu.gpa}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Skills */}
      {data.skills.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
            {data.skills.map((sk) => (
              <Text key={sk.id} style={s.skillTag}>{sk.name}</Text>
            ))}
          </View>
        </View>
      ) : null}

      {/* Certifications */}
      {data.certifications.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert) => (
            <View key={cert.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 10.5 }}>{cert.name}</Text>
                <Text style={{ fontSize: 9.5, color: '#666' }}>{cert.issuer}</Text>
              </View>
              <Text style={s.dateText}>{formatDate(cert.date)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Projects */}
      {data.projects.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Projects</Text>
          {data.projects.map((proj) => (
            <View key={proj.id} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.bold}>{proj.name}</Text>
                {proj.url ? <Text style={{ fontSize: 9.5, color: c }}>{proj.url}</Text> : null}
              </View>
              {proj.description ? <Text style={[s.bodyText, { marginTop: 2 }]}>{proj.description}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Languages */}
      {data.languages.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Languages</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
            {data.languages.map((lang) => (
              <Text key={lang.id} style={{ fontSize: 10.5 }}>
                <Text style={{ fontWeight: 700 }}>{lang.name}</Text> ({lang.proficiency})
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </Page>
  );
}

// ─── TEMPLATE: MODERN (Two-column sidebar) ──────────────────────

function ModernPDF({ data }: { data: ResumeData }) {
  const c = data.colorScheme;
  const p = data.personalDetails;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a', flexDirection: 'row', lineHeight: 1.5 },
    sidebar: { width: 210, backgroundColor: c, color: '#ffffff', padding: '24 16' },
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

  return (
    <Page size="A4" style={s.page}>
      {/* Sidebar */}
      <View style={s.sidebar}>
        {p.photo ? (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Image src={p.photo} style={{ width: 75, height: 75, borderRadius: 37, objectFit: 'cover', borderWidth: 3, borderColor: 'white' }} />
          </View>
        ) : null}
        {fullName ? <Text style={s.name}>{fullName}</Text> : null}
        {p.jobTitle ? <Text style={s.jobTitle}>{p.jobTitle}</Text> : null}

        <View style={s.sideSec}>
          <Text style={s.sideTitle}>Contact</Text>
          {p.email ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.email}</Text> : null}
          {p.phone ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.phone}</Text> : null}
          {p.location ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.location}</Text> : null}
          {p.linkedIn ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.linkedIn}</Text> : null}
          {p.website ? <Text style={{ fontSize: 9, marginBottom: 3, opacity: 0.9 }}>{p.website}</Text> : null}
        </View>

        {data.skills.length > 0 ? (
          <View style={s.sideSec}>
            <Text style={s.sideTitle}>Skills</Text>
            {data.skills.map((sk) => (
              <Text key={sk.id} style={{ fontSize: 9.5, marginBottom: 4 }}>{sk.name}</Text>
            ))}
          </View>
        ) : null}

        {data.languages.length > 0 ? (
          <View style={s.sideSec}>
            <Text style={s.sideTitle}>Languages</Text>
            {data.languages.map((lang) => (
              <Text key={lang.id} style={{ fontSize: 9.5, marginBottom: 3 }}>
                <Text style={{ fontWeight: 700 }}>{lang.name}</Text> \u2014 {lang.proficiency}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      {/* Main */}
      <View style={s.main}>
        {p.summary ? (
          <View style={s.mainSec}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={s.bar} />
              <Text style={s.mainTitle}>About Me</Text>
            </View>
            <Text style={{ color: '#444', lineHeight: 1.7 }}>{p.summary}</Text>
          </View>
        ) : null}

        {data.workExperience.length > 0 ? (
          <View style={s.mainSec}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={s.bar} />
              <Text style={s.mainTitle}>Experience</Text>
            </View>
            {data.workExperience.map((job) => (
              <View key={job.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={s.bold}>{job.position}</Text>
                  <Text style={s.dateText}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
                </View>
                <Text style={{ color: c, fontSize: 10, fontWeight: 700, marginTop: 1, marginBottom: 3 }}>{job.company}{job.location ? `, ${job.location}` : ''}</Text>
                {job.description ? <Text style={{ color: '#444', marginBottom: 3 }}>{job.description}</Text> : null}
                {job.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={{ color: '#444', marginBottom: 1, paddingLeft: 10 }}>{'\u2022'} {b}</Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {data.education.length > 0 ? (
          <View style={s.mainSec}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={s.bar} />
              <Text style={s.mainTitle}>Education</Text>
            </View>
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={s.bold}>{edu.degree}{edu.field ? ` \u2014 ${edu.field}` : ''}</Text>
                  <Text style={s.dateText}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
                </View>
                <Text style={{ color: c, fontSize: 10, marginTop: 2 }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.certifications.length > 0 ? (
          <View style={s.mainSec}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={s.bar} />
              <Text style={s.mainTitle}>Certifications</Text>
            </View>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 5 }}>
                <Text style={{ fontWeight: 700 }}>{cert.name}</Text>
                <Text style={{ color: '#666', fontSize: 9.5 }}>{cert.issuer} \u00B7 {formatDate(cert.date)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.projects.length > 0 ? (
          <View style={s.mainSec}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={s.bar} />
              <Text style={s.mainTitle}>Projects</Text>
            </View>
            {data.projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 8 }}>
                <Text style={s.bold}>{proj.name}</Text>
                {proj.description ? <Text style={{ color: '#444', marginTop: 2 }}>{proj.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Page>
  );
}

// ─── TEMPLATE: CLASSIC (Single column, serif-feel) ──────────────

function ClassicPDF({ data }: { data: ResumeData }) {
  const c = data.colorScheme;
  const p = data.personalDetails;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10.5, color: '#1a1a1a', padding: '36 40', lineHeight: 1.5 },
    name: { fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 2 },
    jobTitle: { fontSize: 12, textAlign: 'center', color: '#555', marginBottom: 8 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, fontSize: 9.5, color: '#666', marginBottom: 16 },
    divider: { borderBottomWidth: 2, borderBottomColor: c, marginBottom: 14 },
    sectionTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: c, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    section: { marginBottom: 14 },
    bold: { fontWeight: 700, fontSize: 11 },
    dateText: { fontSize: 9.5, color: '#666' },
    bodyText: { fontSize: 10.5, color: '#333', lineHeight: 1.6 },
  });

  return (
    <Page size="A4" style={s.page}>
      {p.photo ? (
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Image src={p.photo} style={{ width: 70, height: 70, borderRadius: 35, objectFit: 'cover' }} />
        </View>
      ) : null}
      {fullName ? <Text style={s.name}>{fullName}</Text> : null}
      {p.jobTitle ? <Text style={s.jobTitle}>{p.jobTitle}</Text> : null}
      <View style={s.contactRow}>
        {p.email ? <Text>{p.email}</Text> : null}
        {p.phone ? <Text>| {p.phone}</Text> : null}
        {p.location ? <Text>| {p.location}</Text> : null}
        {p.linkedIn ? <Text>| {p.linkedIn}</Text> : null}
      </View>
      <View style={s.divider} />

      {p.summary ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Summary</Text>
          <Text style={s.bodyText}>{p.summary}</Text>
        </View>
      ) : null}

      {data.workExperience.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experience</Text>
          {data.workExperience.map((job) => (
            <View key={job.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.bold}>{job.position}</Text>
                <Text style={s.dateText}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
              </View>
              <Text style={{ color: c, fontWeight: 700, fontSize: 10 }}>{job.company}{job.location ? `, ${job.location}` : ''}</Text>
              {job.bullets.filter(Boolean).map((b, i) => (
                <Text key={i} style={{ color: '#333', paddingLeft: 12, marginBottom: 1 }}>{'\u2022'} {b}</Text>
              ))}
            </View>
          ))}
        </View>
      ) : null}

      {data.education.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.bold}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                <Text style={s.dateText}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
              </View>
              <Text style={{ color: '#555', fontSize: 10 }}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {data.skills.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Skills</Text>
          <Text style={s.bodyText}>{data.skills.map(sk => sk.name).join(' \u2022 ')}</Text>
        </View>
      ) : null}

      {data.certifications.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert) => (
            <Text key={cert.id} style={{ marginBottom: 3 }}><Text style={{ fontWeight: 700 }}>{cert.name}</Text> \u2014 {cert.issuer} ({formatDate(cert.date)})</Text>
          ))}
        </View>
      ) : null}

      {data.languages.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Languages</Text>
          <Text style={s.bodyText}>{data.languages.map(l => `${l.name} (${l.proficiency})`).join(' \u2022 ')}</Text>
        </View>
      ) : null}

      {data.projects.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Projects</Text>
          {data.projects.map((proj) => (
            <View key={proj.id} style={{ marginBottom: 6 }}>
              <Text style={s.bold}>{proj.name}</Text>
              {proj.description ? <Text style={{ color: '#444', marginTop: 2 }}>{proj.description}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}
    </Page>
  );
}

// ─── GENERIC SINGLE-COLUMN TEMPLATE ──────────────────────────────
// Used for: Professional, Minimal, Executive, Compact, Elegant, Technical, Creative
// Each has slightly different styling

function GenericPDF({ data, variant }: { data: ResumeData; variant: string }) {
  const c = data.colorScheme;
  const p = data.personalDetails;
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  // Variant-specific config
  const configs: Record<string, {
    headerBg: string; headerColor: string; showPhoto: boolean;
    sectionStyle: 'line' | 'bg' | 'dot' | 'plain';
    nameSize: number; compact: boolean;
  }> = {
    professional: { headerBg: 'transparent', headerColor: '#1a1a1a', showPhoto: true, sectionStyle: 'line', nameSize: 20, compact: false },
    minimal: { headerBg: 'transparent', headerColor: '#1a1a1a', showPhoto: false, sectionStyle: 'plain', nameSize: 24, compact: false },
    executive: { headerBg: c, headerColor: '#ffffff', showPhoto: true, sectionStyle: 'line', nameSize: 22, compact: false },
    compact: { headerBg: 'transparent', headerColor: '#1a1a1a', showPhoto: false, sectionStyle: 'dot', nameSize: 16, compact: true },
    elegant: { headerBg: 'transparent', headerColor: '#1a1a1a', showPhoto: true, sectionStyle: 'bg', nameSize: 22, compact: false },
    technical: { headerBg: '#1a1a2e', headerColor: '#ffffff', showPhoto: false, sectionStyle: 'line', nameSize: 20, compact: false },
    creative: { headerBg: c, headerColor: '#ffffff', showPhoto: true, sectionStyle: 'bg', nameSize: 20, compact: false },
  };

  const cfg = configs[variant] || configs.professional;
  const fs = cfg.compact ? 9 : 10.5;
  const secMb = cfg.compact ? 8 : 14;

  const hasHeaderBg = cfg.headerBg !== 'transparent';

  return (
    <Page size="A4" style={{ fontFamily: 'Helvetica', fontSize: fs, color: '#1a1a1a', lineHeight: 1.5 }}>
      {/* Header */}
      <View style={{
        backgroundColor: hasHeaderBg ? cfg.headerBg : undefined,
        color: cfg.headerColor,
        padding: hasHeaderBg ? '24 32' : '28 32 12',
        ...(hasHeaderBg ? {} : { borderBottomWidth: 2, borderBottomColor: c }),
      }}>
        <View style={cfg.showPhoto && p.photo ? { flexDirection: 'row', alignItems: 'center', gap: 14 } : {}}>
          {cfg.showPhoto && p.photo ? (
            <Image src={p.photo} style={{ width: 60, height: 60, borderRadius: 30, objectFit: 'cover', borderWidth: 2, borderColor: hasHeaderBg ? 'white' : c }} />
          ) : null}
          <View>
            {fullName ? <Text style={{ fontSize: cfg.nameSize, fontWeight: 700, color: cfg.headerColor }}>{fullName}</Text> : null}
            {p.jobTitle ? <Text style={{ fontSize: 12, color: hasHeaderBg ? 'rgba(255,255,255,0.85)' : c, fontWeight: 700, marginTop: 2 }}>{p.jobTitle}</Text> : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, fontSize: 9, marginTop: 8, color: hasHeaderBg ? 'rgba(255,255,255,0.8)' : '#666' }}>
          {p.email ? <Text>{p.email}</Text> : null}
          {p.phone ? <Text>{p.phone}</Text> : null}
          {p.location ? <Text>{p.location}</Text> : null}
          {p.linkedIn ? <Text>{p.linkedIn}</Text> : null}
          {p.website ? <Text>{p.website}</Text> : null}
        </View>
      </View>

      <View style={{ padding: '16 32' }}>
        {/* Summary */}
        {p.summary ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Professional Summary" color={c} style={cfg.sectionStyle} />
            <Text style={{ color: '#333', lineHeight: 1.6 }}>{p.summary}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {data.workExperience.length > 0 ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Work Experience" color={c} style={cfg.sectionStyle} />
            {data.workExperience.map((job) => (
              <View key={job.id} style={{ marginBottom: cfg.compact ? 6 : 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 700, fontSize: fs + 0.5 }}>{job.position}</Text>
                  <Text style={{ fontSize: fs - 1, color: '#666' }}>{formatDate(job.startDate)} \u2013 {job.current ? 'Present' : formatDate(job.endDate)}</Text>
                </View>
                <Text style={{ color: c, fontWeight: 700, fontSize: fs }}>{job.company}{job.location ? ` \u2022 ${job.location}` : ''}</Text>
                {job.description ? <Text style={{ color: '#444', marginTop: 2 }}>{job.description}</Text> : null}
                {job.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={{ color: '#333', paddingLeft: 12, marginBottom: 1 }}>{'\u2022'} {b}</Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {data.education.length > 0 ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Education" color={c} style={cfg.sectionStyle} />
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: cfg.compact ? 4 : 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 700, fontSize: fs + 0.5 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                  <Text style={{ fontSize: fs - 1, color: '#666' }}>{formatDate(edu.startDate)} \u2013 {edu.current ? 'Present' : formatDate(edu.endDate)}</Text>
                </View>
                <Text style={{ color: '#555', fontSize: fs }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
                {edu.gpa ? <Text style={{ fontSize: fs - 1, color: '#555' }}>GPA: {edu.gpa}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills.length > 0 ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Skills" color={c} style={cfg.sectionStyle} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {data.skills.map((sk) => (
                <Text key={sk.id} style={{ fontSize: fs - 1, backgroundColor: lightenColor(c, 200), color: '#333', padding: '2 7', borderRadius: 3 }}>{sk.name}</Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* Certifications */}
        {data.certifications.length > 0 ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Certifications" color={c} style={cfg.sectionStyle} />
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <View>
                  <Text style={{ fontWeight: 700 }}>{cert.name}</Text>
                  <Text style={{ color: '#666', fontSize: fs - 1 }}>{cert.issuer}</Text>
                </View>
                <Text style={{ fontSize: fs - 1, color: '#666' }}>{formatDate(cert.date)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {data.projects.length > 0 ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Projects" color={c} style={cfg.sectionStyle} />
            {data.projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: 700 }}>{proj.name}</Text>
                {proj.description ? <Text style={{ color: '#444', marginTop: 2 }}>{proj.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Languages */}
        {data.languages.length > 0 ? (
          <View style={{ marginBottom: secMb }}>
            <SectionHeader title="Languages" color={c} style={cfg.sectionStyle} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {data.languages.map((lang) => (
                <Text key={lang.id}><Text style={{ fontWeight: 700 }}>{lang.name}</Text> ({lang.proficiency})</Text>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Page>
  );
}

function SectionHeader({ title, color, style }: { title: string; color: string; style: string }) {
  if (style === 'bg') {
    return (
      <View style={{ backgroundColor: lightenColor(color, 210), padding: '4 8', marginBottom: 8, borderRadius: 3 }}>
        <Text style={{ fontSize: 11, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Text>
      </View>
    );
  }
  if (style === 'dot') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
        <Text style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: color }}>{title}</Text>
      </View>
    );
  }
  if (style === 'plain') {
    return (
      <Text style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#333', marginBottom: 6 }}>{title}</Text>
    );
  }
  // Default: line
  return (
    <Text style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: color, marginBottom: 7, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>{title}</Text>
  );
}

// ─── MAIN DOCUMENT ──────────────────────────────────────────────

function ResumePDFDocument({ data }: { data: ResumeData }) {
  return (
    <Document>
      {data.templateId === 'modern' || data.templateId === 'creative' ? (
        data.templateId === 'modern' ? <ModernPDF data={data} /> : <GenericPDF data={data} variant="creative" />
      ) : data.templateId === 'classic' ? (
        <ClassicPDF data={data} />
      ) : data.templateId === 'ats-pro' ? (
        <ATSProPDF data={data} />
      ) : (
        <GenericPDF data={data} variant={data.templateId} />
      )}
    </Document>
  );
}

// ─── EXPORT: Generate and download PDF ──────────────────────────

export async function generateResumePDF(data: ResumeData): Promise<Blob> {
  const blob = await pdf(<ResumePDFDocument data={data} />).toBlob();
  return blob;
}

export async function downloadResumePDF(data: ResumeData) {
  const blob = await generateResumePDF(data);
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
