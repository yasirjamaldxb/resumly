// E2E Sales Manager persona test against production
// Exercises the full funnel via API calls with timing

const PROD = 'https://resumly.app';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = `persona-sales-${Date.now()}@resumlytest.dev`;
const password = 'PersonaTest!2026';

const JOB_TEXT = `Senior Sales Manager

Orbital Analytics is a Series B SaaS company building the leading analytics
platform for e-commerce brands. We're hiring a Senior Sales Manager to lead
our mid-market sales team and grow ARR in the US.

Location: Remote (US)
Salary: $140,000 - $180,000 + commission

What you'll do:
- Manage a team of 6 Account Executives
- Own a $5M annual quota, drive pipeline generation
- Partner with marketing on ABM campaigns
- Forecast in Salesforce and report to the VP of Sales
- Negotiate enterprise contracts with procurement and legal

What we're looking for:
- 5+ years of B2B SaaS sales experience, 2+ as a manager
- Proven track record of closing 6-figure deals
- Salesforce power user, HubSpot familiarity a plus
- Excellent communication, negotiation, and forecasting skills
- Experience with MEDDIC or Sandler methodology preferred
- Bachelor's degree required
`;

const SAMPLE_RESUME = {
  personalDetails: {
    firstName: 'Alex',
    lastName: 'Sandoval',
    email,
    phone: '+1-415-555-0199',
    location: 'Austin, TX',
    jobTitle: 'Sales Manager',
    summary:
      'Sales leader with 7 years of B2B SaaS experience managing AE teams, closing six-figure deals, and exceeding quota across the mid-market segment.',
  },
  workExperience: [
    {
      id: 'w1',
      position: 'Sales Manager',
      company: 'Cloudvault Inc',
      startDate: 'Jan 2022',
      endDate: '',
      location: 'Austin, TX',
      bullets: [
        'Led team of 5 AEs and exceeded $4.2M ARR quota by 118% in FY24',
        'Built outbound pipeline strategy that grew SQLs 60% YoY',
        'Closed 12 enterprise deals averaging $215K ACV using MEDDIC',
      ],
    },
    {
      id: 'w2',
      position: 'Senior Account Executive',
      company: 'Nimbus CRM',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      location: 'Austin, TX',
      bullets: [
        'Closed $3.1M in net new ARR across 32 mid-market accounts',
        "President's Club winner 2020 and 2021",
        'Mentored 4 junior AEs on discovery and negotiation',
      ],
    },
  ],
  education: [
    {
      id: 'e1',
      degree: 'BBA, Marketing',
      institution: 'University of Texas at Austin',
      startDate: '2013',
      endDate: '2017',
      field: '',
    },
  ],
  skills: [
    { id: 's1', name: 'Salesforce', level: 'expert' },
    { id: 's2', name: 'Forecasting', level: 'expert' },
    { id: 's3', name: 'Pipeline Management', level: 'expert' },
    { id: 's4', name: 'MEDDIC', level: 'advanced' },
    { id: 's5', name: 'Team Leadership', level: 'expert' },
  ],
  certifications: [],
  languages: [],
  projects: [],
  templateId: 'professional',
  colorScheme: '#2563eb',
};

const bugs = [];
const timings = {};

function logBug(id, description) {
  bugs.push({ id, description });
  console.log(`  🐞 BUG [${id}] ${description}`);
}

function tick(label) {
  const now = Date.now();
  timings[label] = now;
  return now;
}

async function step(label, fn) {
  const start = Date.now();
  try {
    const result = await fn();
    const ms = Date.now() - start;
    timings[label] = ms;
    console.log(`✓ ${label} — ${(ms / 1000).toFixed(1)}s`);
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    timings[label] = ms;
    console.log(`✗ ${label} — ${(ms / 1000).toFixed(1)}s — ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║  E2E Sales Manager Persona Test (PRODUCTION) ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
  console.log(`User: ${email}`);
  console.log(`Production: ${PROD}\n`);

  const totalStart = Date.now();

  // ─── Step 1: Create user via Supabase admin ───
  const user = await step('Create test user (admin)', async () => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: 'Alex Sandoval' },
      }),
    });
    if (!res.ok) throw new Error(`create user ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const userId = user.id;

  // ─── Step 2: Sign in with password ───
  const session = await step('Sign in (password grant)', async () => {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
    );
    if (!res.ok) throw new Error(`signin ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  // Build cookies that match the Supabase SSR cookie format
  const projectRef = new URL(SUPABASE_URL).host.split('.')[0];
  const cookieValue = `base64-${Buffer.from(
    JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: 'bearer',
      user: session.user,
    }),
  ).toString('base64')}`;
  const cookie = `sb-${projectRef}-auth-token=${cookieValue}`;

  const commonHeaders = {
    Cookie: cookie,
    'Content-Type': 'application/json',
  };

  // ─── Step 3: Parse job text ───
  const parsedJob = await step('Parse job text → /api/jobs/parse', async () => {
    const res = await fetch(`${PROD}/api/jobs/parse`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ text: JOB_TEXT }),
    });
    if (!res.ok) throw new Error(`parse ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const job = parsedJob.data || parsedJob.job || parsedJob;
  console.log(`   title: "${job.title}"  company: "${job.company}"  location: "${job.location}"`);
  console.log(`   skills: ${(job.skills || []).slice(0, 10).join(', ')}`);

  // Verify BUG #2 (title) and BUG #3 (location)
  if (!job.title || /is a|looking for|series/i.test(job.title)) {
    logBug('BUG#2', `Title still not clean: "${job.title}"`);
  }
  if (!job.location || /location/i.test(job.location)) {
    logBug('BUG#3', `Location not clean: "${job.location}"`);
  }
  // Verify BUG #5 (hallucinated SQL)
  const hasSQL = (job.skills || []).some((s) => /^sql$/i.test(s));
  if (hasSQL) {
    logBug('BUG#5', `SQL hallucinated for a Sales role: skills=${JSON.stringify(job.skills)}`);
  }
  // Verify casing
  const badCasing = (job.skills || []).filter((s) => /^[a-z]/.test(s));
  if (badCasing.length > 0) {
    logBug('BUG#5-case', `Lowercase leading chars in skills: ${badCasing.join(', ')}`);
  }

  // ─── Step 4: Save the job ───
  const saved = await step('Save job → /api/jobs/save', async () => {
    const res = await fetch(`${PROD}/api/jobs/save`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error(`save ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const jobId = saved.jobId || saved.id || saved.data?.id;
  console.log(`   jobId: ${jobId}`);

  // ─── Step 5: Optimize resume ───
  const optimization = await step('Optimize resume → /api/ai/optimize', async () => {
    const res = await fetch(`${PROD}/api/ai/optimize`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        resumeData: SAMPLE_RESUME,
        jobData: job,
        userProfile: { target_role: 'Sales Manager', job_level: 'senior', industry: 'technology' },
        rejectedSkills: [],
      }),
    });
    if (!res.ok) throw new Error(`optimize ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const opt = optimization.optimization || optimization;
  console.log(
    `   matchScore: ${opt.matchScore || 'n/a'}  skills: ${(opt.skills || []).slice(0, 8).join(', ')}`,
  );

  // Merge optimization into resume
  const optimizedResume = { ...SAMPLE_RESUME };
  if (opt.summary) optimizedResume.personalDetails.summary = opt.summary;
  if (opt.skills?.length) {
    optimizedResume.skills = opt.skills.map((name, i) => ({
      id: `opt-s-${i}`,
      name,
      level: 'intermediate',
    }));
  }

  // ─── Step 6: Save the resume ───
  const savedResume = await step('Save resume → /api/resume/save', async () => {
    const res = await fetch(`${PROD}/api/resume/save`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        ...optimizedResume,
        templateId: 'professional',
        jobId,
        title: `Resume for ${job.title}`,
      }),
    });
    if (!res.ok) throw new Error(`save resume ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const resumeId = savedResume.id;
  console.log(`   resumeId: ${resumeId}`);

  // ─── Step 7: Create application ───
  await step('Create application → /api/applications', async () => {
    const res = await fetch(`${PROD}/api/applications`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ job_id: jobId, resume_id: resumeId, status: 'draft' }),
    });
    if (!res.ok) throw new Error(`application ${res.status}: ${await res.text()}`);
    return await res.json();
  });

  // ─── Step 8: Download resume PDF ───
  const pdfBytes = await step('Download resume PDF → /api/resume/generate-pdf', async () => {
    const res = await fetch(`${PROD}/api/resume/generate-pdf`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        resumeData: optimizedResume,
        templateId: 'professional',
        colorScheme: '#2563eb',
      }),
    });
    if (!res.ok) throw new Error(`pdf ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 5000) throw new Error(`pdf too small: ${buf.byteLength} bytes`);
    return buf;
  });
  console.log(`   PDF size: ${(pdfBytes.byteLength / 1024).toFixed(1)} KB`);

  // ─── Step 9: Generate cover letter ───
  const clResult = await step('Generate cover letter → /api/ai/cover-letter', async () => {
    const res = await fetch(`${PROD}/api/ai/cover-letter`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        yourName: `${optimizedResume.personalDetails.firstName} ${optimizedResume.personalDetails.lastName}`,
        yourEmail: optimizedResume.personalDetails.email,
        yourPhone: optimizedResume.personalDetails.phone,
        yourLocation: optimizedResume.personalDetails.location,
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        tone: 'professional',
        resumeData: {
          jobTitle: optimizedResume.personalDetails.jobTitle,
          summary: optimizedResume.personalDetails.summary,
          skills: optimizedResume.skills.map((s) => s.name),
          experience: optimizedResume.workExperience.map((w) => ({
            position: w.position,
            company: w.company,
            duration: `${w.startDate} - ${w.endDate || 'Present'}`,
            bullets: w.bullets.slice(0, 3),
          })),
          education: optimizedResume.education.map((e) => ({
            degree: e.degree,
            institution: e.institution,
          })),
        },
        jobRequirements: job.requirements || [],
        jobSkills: job.skills || [],
        jobKeywords: job.keywords || [],
        userProfile: { target_role: 'Sales Manager', job_level: 'senior', industry: 'technology' },
      }),
    });
    if (!res.ok) throw new Error(`cover-letter ${res.status}: ${await res.text()}`);
    return await res.json();
  });
  const clText = (clResult.text || clResult.coverLetter || '').trim();
  console.log(`   Cover letter length: ${clText.length} chars, ${clText.split(/\s+/).length} words`);
  if (!clText) logBug('CL-EMPTY', 'Cover letter returned empty');

  // ─── Step 10: "Download" cover letter (text blob generated client-side) ───
  // The funnel downloads the cover letter as a plain text file, not a PDF.
  await step('Save cover letter as text blob', async () => {
    if (!clText || clText.length < 100) throw new Error(`cover letter text too short: ${clText.length}`);
    return clText.length;
  });
  console.log(`   Cover letter blob size: ${clText.length} chars`);

  // ─── Cleanup: delete test user ───
  await step('Cleanup → delete test user', async () => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    return res.ok;
  });

  const totalMs = Date.now() - totalStart;

  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║  RESULTS                                     ║`);
  console.log(`╚══════════════════════════════════════════════╝`);
  console.log(`Total time: ${(totalMs / 1000).toFixed(1)}s`);
  console.log(`Bugs found this run: ${bugs.length}`);
  if (bugs.length) console.log(bugs.map((b) => `  - ${b.id}: ${b.description}`).join('\n'));
  console.log(`\nStep timings:`);
  for (const [label, ms] of Object.entries(timings)) {
    if (typeof ms === 'number') console.log(`  ${(ms / 1000).toFixed(1)}s  ${label}`);
  }
}

main().catch((err) => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
