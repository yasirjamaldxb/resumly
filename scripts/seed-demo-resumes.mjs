import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yfgtdhmpmaqzloewrujv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Find the user by email
const { data: users, error: userError } = await supabase.auth.admin.listUsers();
if (userError) { console.error('Error listing users:', userError); process.exit(1); }

const user = users.users.find(u => u.email === 'yj.digitall@gmail.com');
if (!user) { console.error('User yj.digitall@gmail.com not found'); process.exit(1); }

console.log(`Found user: ${user.id} (${user.email})`);

const templateConfigs = [
  { id: 'ats-pro', name: 'ATS Pro', color: '#2563eb' },
  { id: 'modern', name: 'Modern', color: '#7c3aed' },
  { id: 'professional', name: 'Professional', color: '#1e3a5f' },
  { id: 'minimal', name: 'Minimal', color: '#0d9488' },
  { id: 'executive', name: 'Executive', color: '#16a34a' },
  { id: 'creative', name: 'Creative', color: '#ea580c' },
  { id: 'compact', name: 'Compact', color: '#2563eb' },
  { id: 'elegant', name: 'Elegant', color: '#8b5cf6' },
  { id: 'technical', name: 'Technical', color: '#2d3748' },
  { id: 'classic', name: 'Classic', color: '#374151' },
];

const demoProfiles = [
  {
    firstName: 'Sarah', lastName: 'Mitchell', jobTitle: 'Senior Software Engineer',
    email: 'sarah.mitchell@email.com', phone: '+1 (415) 555-0192', location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/sarahmitchell', website: 'sarahmitchell.dev',
    summary: 'Full-stack software engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Led teams of 5-10 engineers to deliver high-impact products used by millions. Passionate about clean code, performance optimization, and mentoring junior developers.',
    experience: [
      { company: 'Stripe', position: 'Senior Software Engineer', location: 'San Francisco, CA', start: '2021-03', end: '', current: true, desc: 'Lead engineer on the Payments API team, responsible for processing $500B+ in annual transactions.', bullets: ['Architected microservices migration reducing latency by 40% across payment processing pipeline', 'Led team of 8 engineers to deliver real-time fraud detection system, blocking $50M+ in fraudulent transactions', 'Implemented comprehensive API versioning strategy adopted as company-wide standard'] },
      { company: 'Airbnb', position: 'Software Engineer', location: 'San Francisco, CA', start: '2018-06', end: '2021-02', current: false, desc: 'Core member of the Search & Discovery team.', bullets: ['Built personalized search ranking algorithm improving booking conversion by 15%', 'Developed React component library used across 20+ teams, reducing development time by 30%', 'Optimized database queries reducing page load time from 3.2s to 0.8s'] },
    ],
    education: [{ institution: 'Stanford University', degree: 'M.S.', field: 'Computer Science', location: 'Stanford, CA', start: '2014-09', end: '2016-06' }, { institution: 'UC Berkeley', degree: 'B.S.', field: 'Computer Science', location: 'Berkeley, CA', start: '2010-09', end: '2014-06' }],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'GraphQL', 'Docker', 'Kubernetes', 'System Design'],
    certs: [{ name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2023-05' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Spanish', prof: 'professional' }],
    projects: [{ name: 'OpenAPI Generator', desc: 'Open-source tool generating TypeScript SDKs from OpenAPI specs. 2,500+ GitHub stars.' }],
  },
  {
    firstName: 'James', lastName: 'Rodriguez', jobTitle: 'Marketing Director',
    email: 'james.rodriguez@email.com', phone: '+1 (212) 555-0347', location: 'New York, NY',
    linkedIn: 'linkedin.com/in/jamesrodriguez', website: 'jamesrodriguez.co',
    summary: 'Results-driven marketing director with 10+ years of experience in digital marketing, brand strategy, and growth marketing. Proven track record of building high-performing teams and executing campaigns that drive measurable ROI. Expert in SEO, paid media, content marketing, and marketing analytics.',
    experience: [
      { company: 'HubSpot', position: 'Marketing Director', location: 'New York, NY', start: '2020-01', end: '', current: true, desc: 'Leading a team of 15 marketers across content, demand generation, and brand.', bullets: ['Grew organic traffic from 2M to 8M monthly visitors through comprehensive SEO strategy', 'Managed $5M annual marketing budget with 340% ROI on paid campaigns', 'Launched brand refresh campaign resulting in 45% increase in brand awareness metrics'] },
      { company: 'Shopify', position: 'Senior Marketing Manager', location: 'New York, NY', start: '2017-03', end: '2019-12', current: false, desc: 'Managed demand generation and content marketing for the enterprise segment.', bullets: ['Developed content strategy generating 10,000+ qualified leads per quarter', 'Built and managed marketing automation workflows increasing conversion by 28%', 'Launched partner marketing program contributing $12M in pipeline revenue'] },
    ],
    education: [{ institution: 'NYU Stern School of Business', degree: 'MBA', field: 'Marketing', location: 'New York, NY', start: '2013-09', end: '2015-06' }, { institution: 'University of Michigan', degree: 'B.A.', field: 'Communications', location: 'Ann Arbor, MI', start: '2009-09', end: '2013-05' }],
    skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Marketing Analytics', 'Team Leadership', 'Brand Strategy', 'HubSpot', 'Google Analytics', 'Paid Media', 'CRM Management'],
    certs: [{ name: 'Google Analytics Certification', issuer: 'Google', date: '2023-01' }, { name: 'HubSpot Inbound Marketing', issuer: 'HubSpot Academy', date: '2022-08' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Portuguese', prof: 'professional' }],
    projects: [{ name: 'MarketingMetrics.io', desc: 'Built a SaaS dashboard for marketing teams to track KPIs across multiple channels. 500+ active users.' }],
  },
  {
    firstName: 'Emily', lastName: 'Chen', jobTitle: 'UX/UI Designer',
    email: 'emily.chen@email.com', phone: '+1 (206) 555-0128', location: 'Seattle, WA',
    linkedIn: 'linkedin.com/in/emilychen-ux', website: 'emilychen.design',
    summary: 'Creative UX/UI designer with 6+ years of experience crafting intuitive digital experiences for web and mobile. Skilled in user research, prototyping, and design systems. Passionate about accessibility and inclusive design. Portfolio includes work for Fortune 500 companies and high-growth startups.',
    experience: [
      { company: 'Microsoft', position: 'Senior UX Designer', location: 'Seattle, WA', start: '2021-09', end: '', current: true, desc: 'Design lead for Microsoft Teams features impacting 300M+ users.', bullets: ['Redesigned Teams meeting experience improving user satisfaction scores by 32%', 'Created and maintained design system with 200+ components used across 5 product teams', 'Conducted 50+ user research sessions informing product strategy for FY2024'] },
      { company: 'Amazon', position: 'UX Designer', location: 'Seattle, WA', start: '2019-01', end: '2021-08', current: false, desc: 'Designed checkout and payment experiences for Amazon.com.', bullets: ['Simplified checkout flow reducing cart abandonment by 18%', 'Designed mobile-first payment experience processing $2B+ monthly', 'Led accessibility audit achieving WCAG 2.1 AA compliance across checkout'] },
    ],
    education: [{ institution: 'Rhode Island School of Design', degree: 'MFA', field: 'Graphic Design', location: 'Providence, RI', start: '2016-09', end: '2018-06' }, { institution: 'University of Washington', degree: 'B.A.', field: 'Visual Communication Design', location: 'Seattle, WA', start: '2012-09', end: '2016-06' }],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems', 'Accessibility', 'HTML/CSS', 'Interaction Design', 'Wireframing'],
    certs: [{ name: 'Google UX Design Certificate', issuer: 'Google', date: '2022-03' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Mandarin', prof: 'full' }],
    projects: [{ name: 'DesignTokens CLI', desc: 'Open-source tool for converting Figma design tokens to CSS custom properties. Used by 1,200+ designers.' }],
  },
  {
    firstName: 'Michael', lastName: 'Thompson', jobTitle: 'Financial Analyst',
    email: 'michael.thompson@email.com', phone: '+1 (312) 555-0465', location: 'Chicago, IL',
    linkedIn: 'linkedin.com/in/michaelthompson-fin', website: '',
    summary: 'Detail-oriented financial analyst with 7+ years of experience in corporate finance, financial modeling, and strategic planning. Skilled in building complex financial models, conducting market analysis, and presenting insights to C-suite executives. CFA charterholder with expertise in valuation and risk assessment.',
    experience: [
      { company: 'Goldman Sachs', position: 'Vice President, Financial Analysis', location: 'Chicago, IL', start: '2020-06', end: '', current: true, desc: 'Lead financial analysis for the Technology Banking group.', bullets: ['Built financial models for 15+ M&A transactions totaling $8B+ in deal value', 'Developed automated reporting dashboard reducing monthly close time by 3 days', 'Presented quarterly financial reviews to senior leadership covering $500M P&L'] },
      { company: 'Deloitte', position: 'Senior Financial Analyst', location: 'Chicago, IL', start: '2017-09', end: '2020-05', current: false, desc: 'Provided financial advisory services to Fortune 500 clients.', bullets: ['Conducted due diligence analysis for 10+ acquisition targets across technology sector', 'Created discounted cash flow models identifying $200M+ in value optimization opportunities', 'Managed team of 4 analysts delivering monthly financial reports to 8 client accounts'] },
    ],
    education: [{ institution: 'University of Chicago Booth', degree: 'MBA', field: 'Finance', location: 'Chicago, IL', start: '2015-09', end: '2017-06' }, { institution: 'University of Illinois', degree: 'B.S.', field: 'Accounting', location: 'Champaign, IL', start: '2011-08', end: '2015-05' }],
    skills: ['Financial Modeling', 'Excel', 'Bloomberg Terminal', 'SQL', 'Python', 'Tableau', 'Valuation', 'Risk Analysis', 'M&A', 'Financial Reporting'],
    certs: [{ name: 'CFA Charterholder', issuer: 'CFA Institute', date: '2019-09' }, { name: 'Financial Modeling & Valuation Analyst', issuer: 'CFI', date: '2018-03' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'French', prof: 'limited' }],
    projects: [{ name: 'FinModel Pro', desc: 'Excel template library for financial modeling with 50+ pre-built models. Downloaded 5,000+ times.' }],
  },
  {
    firstName: 'Priya', lastName: 'Sharma', jobTitle: 'Data Scientist',
    email: 'priya.sharma@email.com', phone: '+1 (650) 555-0298', location: 'Palo Alto, CA',
    linkedIn: 'linkedin.com/in/priyasharma-ds', website: 'priyasharma.ai',
    summary: 'Data scientist with 5+ years of experience applying machine learning and statistical analysis to solve complex business problems. Proficient in Python, TensorFlow, and big data technologies. Published researcher with 3 papers in top-tier ML conferences. Passionate about making AI more interpretable and ethical.',
    experience: [
      { company: 'Google', position: 'Senior Data Scientist', location: 'Mountain View, CA', start: '2022-01', end: '', current: true, desc: 'Applied ML research for Google Search ranking improvements.', bullets: ['Developed NLP model improving search relevance by 12% for 1B+ daily queries', 'Built real-time anomaly detection pipeline processing 10TB+ daily data streams', 'Led cross-functional team of 6 to deploy recommendation engine increasing user engagement by 20%'] },
      { company: 'Netflix', position: 'Data Scientist', location: 'Los Gatos, CA', start: '2019-07', end: '2021-12', current: false, desc: 'Personalization and recommendation systems team.', bullets: ['Improved content recommendation algorithm increasing watch time by 8%', 'Built A/B testing framework used across 15+ product teams for experiment analysis', 'Created churn prediction model with 92% accuracy, enabling targeted retention campaigns'] },
    ],
    education: [{ institution: 'MIT', degree: 'M.S.', field: 'Machine Learning', location: 'Cambridge, MA', start: '2017-09', end: '2019-06' }, { institution: 'IIT Delhi', degree: 'B.Tech', field: 'Computer Science', location: 'New Delhi, India', start: '2013-07', end: '2017-06' }],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Spark', 'Scikit-learn', 'Deep Learning', 'NLP', 'A/B Testing', 'Data Visualization'],
    certs: [{ name: 'TensorFlow Developer Certificate', issuer: 'Google', date: '2022-06' }],
    languages: [{ name: 'English', prof: 'full' }, { name: 'Hindi', prof: 'native' }],
    projects: [{ name: 'InterpretML Dashboard', desc: 'Open-source tool for visualizing machine learning model interpretability. 3,800+ GitHub stars.' }],
  },
  {
    firstName: 'David', lastName: 'Park', jobTitle: 'Product Manager',
    email: 'david.park@email.com', phone: '+1 (415) 555-0731', location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/davidpark-pm', website: '',
    summary: 'Strategic product manager with 7+ years of experience launching products from 0-to-1 and scaling them to millions of users. Strong technical background with ability to bridge engineering and business teams. Track record of driving 30%+ revenue growth through data-driven product decisions.',
    experience: [
      { company: 'Slack', position: 'Senior Product Manager', location: 'San Francisco, CA', start: '2021-04', end: '', current: true, desc: 'Leading product strategy for Slack Connect and external collaboration features.', bullets: ['Launched Slack Connect for Enterprise, driving $40M ARR in first year', 'Defined and executed product roadmap increasing daily active users by 25%', 'Managed cross-functional team of 12 engineers, 3 designers, and 2 data scientists'] },
      { company: 'Dropbox', position: 'Product Manager', location: 'San Francisco, CA', start: '2018-08', end: '2021-03', current: false, desc: 'Owned the file sharing and collaboration product line.', bullets: ['Redesigned sharing permissions reducing support tickets by 35%', 'Launched Smart Sync feature adopted by 2M+ users within 6 months', 'Increased team plan conversion by 22% through onboarding flow optimization'] },
    ],
    education: [{ institution: 'Carnegie Mellon University', degree: 'M.S.', field: 'Product Management', location: 'Pittsburgh, PA', start: '2016-08', end: '2018-05' }, { institution: 'Cornell University', degree: 'B.S.', field: 'Information Science', location: 'Ithaca, NY', start: '2012-09', end: '2016-05' }],
    skills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'SQL', 'A/B Testing', 'Roadmap Planning', 'Stakeholder Management', 'JIRA', 'Analytics', 'Competitive Analysis'],
    certs: [{ name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', date: '2021-02' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Korean', prof: 'professional' }],
    projects: [{ name: 'PMToolkit', desc: 'Free resource library for product managers with frameworks, templates, and case studies. 15K+ monthly visitors.' }],
  },
  {
    firstName: 'Rachel', lastName: 'Williams', jobTitle: 'Registered Nurse',
    email: 'rachel.williams@email.com', phone: '+1 (617) 555-0584', location: 'Boston, MA',
    linkedIn: 'linkedin.com/in/rachelwilliams-rn', website: '',
    summary: 'Compassionate and dedicated registered nurse with 9+ years of experience in critical care and emergency medicine. Skilled in patient assessment, care planning, and interdisciplinary collaboration. Certified in ACLS, PALS, and trauma nursing. Committed to evidence-based practice and continuous improvement in patient outcomes.',
    experience: [
      { company: 'Massachusetts General Hospital', position: 'Charge Nurse, ICU', location: 'Boston, MA', start: '2020-03', end: '', current: true, desc: 'Lead nurse in the 30-bed Medical ICU, managing a team of 12 nurses.', bullets: ['Coordinate care for 6-8 critically ill patients per shift with 98% patient satisfaction score', 'Implemented evidence-based sepsis screening protocol reducing mortality by 15%', 'Mentor and precept 10+ new graduate nurses annually through orientation program'] },
      { company: 'Brigham and Women\'s Hospital', position: 'Staff Nurse, Emergency Department', location: 'Boston, MA', start: '2016-06', end: '2020-02', current: false, desc: 'Emergency department nurse in a Level I trauma center seeing 60,000+ patients annually.', bullets: ['Triaged and assessed 20+ patients per shift in high-volume emergency setting', 'Led rapid response team for cardiac emergencies with 95% survival-to-discharge rate', 'Developed patient education materials reducing 30-day readmission rates by 12%'] },
    ],
    education: [{ institution: 'Boston College', degree: 'BSN', field: 'Nursing', location: 'Chestnut Hill, MA', start: '2012-09', end: '2016-05' }],
    skills: ['Patient Assessment', 'Critical Care', 'IV Therapy', 'Ventilator Management', 'EHR Systems', 'Team Leadership', 'Emergency Response', 'Patient Education', 'Medication Administration', 'Care Planning'],
    certs: [{ name: 'CCRN (Critical Care Registered Nurse)', issuer: 'AACN', date: '2021-04' }, { name: 'ACLS Certification', issuer: 'American Heart Association', date: '2023-06' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Spanish', prof: 'limited' }],
    projects: [],
  },
  {
    firstName: 'Alex', lastName: 'Turner', jobTitle: 'DevOps Engineer',
    email: 'alex.turner@email.com', phone: '+1 (503) 555-0876', location: 'Portland, OR',
    linkedIn: 'linkedin.com/in/alexturner-devops', website: 'alexturner.dev',
    summary: 'DevOps engineer with 6+ years of experience building and maintaining cloud infrastructure at scale. Expert in CI/CD pipelines, container orchestration, and infrastructure as code. Reduced deployment time by 80% and infrastructure costs by 40% through automation and optimization. Strong advocate for DevOps culture and SRE practices.',
    experience: [
      { company: 'Datadog', position: 'Senior DevOps Engineer', location: 'Portland, OR (Remote)', start: '2021-08', end: '', current: true, desc: 'Platform engineering team responsible for production infrastructure serving 20,000+ customers.', bullets: ['Built GitOps-based deployment pipeline reducing deploy time from 45 min to 8 min', 'Managed Kubernetes clusters across 3 cloud providers handling 500K+ requests/second', 'Implemented infrastructure as code with Terraform managing 2,000+ cloud resources'] },
      { company: 'Nike', position: 'DevOps Engineer', location: 'Portland, OR', start: '2018-11', end: '2021-07', current: false, desc: 'Digital commerce platform engineering team.', bullets: ['Migrated legacy applications to Kubernetes reducing infrastructure costs by 40%', 'Built centralized logging and monitoring stack processing 5TB+ daily log data', 'Designed disaster recovery strategy achieving 99.99% uptime SLA'] },
    ],
    education: [{ institution: 'Oregon State University', degree: 'B.S.', field: 'Computer Science', location: 'Corvallis, OR', start: '2014-09', end: '2018-06' }],
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'CI/CD', 'Linux', 'Python', 'Prometheus', 'Helm'],
    certs: [{ name: 'AWS DevOps Engineer Professional', issuer: 'Amazon Web Services', date: '2022-09' }, { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2021-11' }],
    languages: [{ name: 'English', prof: 'native' }],
    projects: [{ name: 'K8s Cost Optimizer', desc: 'Open-source Kubernetes cost optimization tool that recommends right-sizing. 1,500+ GitHub stars.' }],
  },
  {
    firstName: 'Lisa', lastName: 'Anderson', jobTitle: 'Human Resources Manager',
    email: 'lisa.anderson@email.com', phone: '+1 (214) 555-0193', location: 'Dallas, TX',
    linkedIn: 'linkedin.com/in/lisaanderson-hr', website: '',
    summary: 'Strategic HR manager with 8+ years of experience in talent acquisition, employee engagement, and organizational development. Proven ability to build high-performing teams and create inclusive workplace cultures. SHRM-SCP certified with expertise in compensation planning, performance management, and employment law compliance.',
    experience: [
      { company: 'Salesforce', position: 'Senior HR Business Partner', location: 'Dallas, TX', start: '2020-09', end: '', current: true, desc: 'HR partner for the 500-person Sales & Customer Success organization.', bullets: ['Reduced voluntary turnover from 22% to 14% through comprehensive retention strategy', 'Led diversity and inclusion initiative increasing underrepresented hiring by 35%', 'Designed performance review process adopted across 3 business units (1,200+ employees)'] },
      { company: 'Texas Instruments', position: 'HR Manager', location: 'Dallas, TX', start: '2017-01', end: '2020-08', current: false, desc: 'Managed HR operations for 300-person engineering division.', bullets: ['Implemented competency-based interview framework improving quality of hire by 25%', 'Managed annual compensation review process for $45M payroll budget', 'Built employee onboarding program reducing time-to-productivity by 30%'] },
    ],
    education: [{ institution: 'University of Texas at Austin', degree: 'M.A.', field: 'Human Resource Management', location: 'Austin, TX', start: '2014-09', end: '2016-05' }, { institution: 'Texas A&M University', degree: 'B.B.A.', field: 'Management', location: 'College Station, TX', start: '2010-09', end: '2014-05' }],
    skills: ['Talent Acquisition', 'Employee Relations', 'HRIS Systems', 'Performance Management', 'Compensation & Benefits', 'Employment Law', 'DEI Strategy', 'Organizational Development', 'Workday', 'Conflict Resolution'],
    certs: [{ name: 'SHRM-SCP', issuer: 'SHRM', date: '2020-06' }, { name: 'Certified Compensation Professional', issuer: 'WorldatWork', date: '2019-11' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Spanish', prof: 'professional' }],
    projects: [],
  },
  {
    firstName: 'Omar', lastName: 'Hassan', jobTitle: 'Civil Engineer',
    email: 'omar.hassan@email.com', phone: '+1 (713) 555-0412', location: 'Houston, TX',
    linkedIn: 'linkedin.com/in/omarhassan-pe', website: '',
    summary: 'Licensed Professional Engineer with 10+ years of experience in structural engineering, project management, and construction oversight. Managed $200M+ in infrastructure projects from design through completion. Expert in AutoCAD, Revit, and STAAD Pro. Strong track record of delivering projects on time and under budget while maintaining highest safety standards.',
    experience: [
      { company: 'AECOM', position: 'Senior Structural Engineer', location: 'Houston, TX', start: '2019-04', end: '', current: true, desc: 'Lead structural engineer for commercial and infrastructure projects.', bullets: ['Led structural design for $80M mixed-use development spanning 450,000 sq ft', 'Managed team of 6 engineers delivering 12+ projects annually with zero safety incidents', 'Implemented BIM workflows reducing design conflicts by 60% and rework costs by $2M'] },
      { company: 'Bechtel', position: 'Structural Engineer', location: 'Houston, TX', start: '2015-06', end: '2019-03', current: false, desc: 'Structural engineering for petrochemical and industrial facilities.', bullets: ['Designed steel and concrete structures for $500M petrochemical plant expansion', 'Performed seismic analysis and retrofitting for 20+ existing industrial structures', 'Reduced material costs by 15% through value engineering and design optimization'] },
    ],
    education: [{ institution: 'Rice University', degree: 'M.S.', field: 'Structural Engineering', location: 'Houston, TX', start: '2013-08', end: '2015-05' }, { institution: 'University of Texas at Austin', degree: 'B.S.', field: 'Civil Engineering', location: 'Austin, TX', start: '2009-08', end: '2013-05' }],
    skills: ['Structural Analysis', 'AutoCAD', 'Revit', 'STAAD Pro', 'ETABS', 'Project Management', 'Building Codes', 'Seismic Design', 'BIM', 'Construction Oversight'],
    certs: [{ name: 'Professional Engineer (PE)', issuer: 'Texas Board of PE', date: '2017-10' }, { name: 'LEED AP', issuer: 'USGBC', date: '2019-05' }],
    languages: [{ name: 'English', prof: 'native' }, { name: 'Arabic', prof: 'full' }],
    projects: [{ name: 'Houston Metro Bridge Assessment', desc: 'Led structural assessment and rehabilitation design for 15 aging metro bridges, extending service life by 25+ years.' }],
  },
];

let idCounter = 1;
for (let i = 0; i < templateConfigs.length; i++) {
  const t = templateConfigs[i];
  const p = demoProfiles[i];

  const resumeData = {
    title: `${p.firstName} ${p.lastName} - ${t.name} Template`,
    templateId: t.id,
    colorScheme: t.color,
    fontFamily: 'inter',
    personalDetails: {
      firstName: p.firstName,
      lastName: p.lastName,
      jobTitle: p.jobTitle,
      email: p.email,
      phone: p.phone,
      location: p.location,
      linkedIn: p.linkedIn,
      website: p.website,
      summary: p.summary,
    },
    workExperience: p.experience.map((exp, idx) => ({
      id: `exp-${i}-${idx}`,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: exp.start,
      endDate: exp.end,
      current: exp.current,
      description: exp.desc,
      bullets: exp.bullets,
    })),
    education: p.education.map((edu, idx) => ({
      id: `edu-${i}-${idx}`,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      location: edu.location,
      startDate: edu.start,
      endDate: edu.end,
      current: false,
      gpa: '',
      achievements: '',
    })),
    skills: p.skills.map((s, idx) => ({
      id: `skill-${i}-${idx}`,
      name: s,
      level: idx < 3 ? 'expert' : idx < 6 ? 'advanced' : 'intermediate',
    })),
    certifications: p.certs.map((c, idx) => ({
      id: `cert-${i}-${idx}`,
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      url: '',
    })),
    languages: p.languages.map((l, idx) => ({
      id: `lang-${i}-${idx}`,
      name: l.name,
      proficiency: l.prof,
    })),
    projects: p.projects.map((pr, idx) => ({
      id: `proj-${i}-${idx}`,
      name: pr.name,
      description: pr.desc,
      url: '',
    })),
  };

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: resumeData.title,
      template_id: t.id,
      color_scheme: t.color,
      resume_data: resumeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(`Error creating resume ${t.name}:`, error.message);
  } else {
    console.log(`✅ Created: ${resumeData.title} (ID: ${data.id})`);
  }
}

console.log('\nDone! All 10 demo resumes created.');
