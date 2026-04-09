const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yfgtdhmpmaqzloewrujv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI'
);

const USER_ID = 'b3c9886f-99ec-4a21-bf4c-85b14ee68bf4';

const TEMPLATE_DATA = [
  {
    template_id: 'ats-pro',
    title: 'ATS Pro — Marcus Johnson',
    resume_data: {
      personalDetails: { firstName: 'Marcus', lastName: 'Johnson', jobTitle: 'Senior Software Engineer', email: 'marcus.johnson@gmail.com', phone: '+1 (650) 334-7821', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/marcusjohnson', website: '' },
      summary: 'Full-stack software engineer with 9+ years building scalable distributed systems at Google and Cloudflare. Expert in Go, TypeScript, Kubernetes, and cloud-native architectures. Led teams of 12+ delivering products to 50M+ users with 99.99% uptime.',
      workExperience: [
        { company: 'Google', title: 'Staff Software Engineer', location: 'Mountain View, CA', startDate: 'Jan 2020', endDate: 'Present', current: true, bullets: ['Architected microservices platform handling 2B daily requests on GCP, reducing latency by 41%', 'Led 12-person team to deliver Search infrastructure improvements serving 4B+ users', 'Implemented ML-powered caching layer reducing infrastructure costs by $3.2M annually', 'Mentored 8 junior engineers, 3 of whom were promoted to senior within 18 months'] },
        { company: 'Cloudflare', title: 'Senior Software Engineer', location: 'San Francisco, CA', startDate: 'Mar 2016', endDate: 'Dec 2019', current: false, bullets: ['Built edge caching system serving 100TB/day, improving cache-hit ratio from 72% to 94%', 'Designed zero-downtime deployment pipeline adopted by 1,200+ internal engineers', 'Rewrote core routing engine in Go, achieving 3x throughput improvement'] },
        { company: 'Stripe', title: 'Software Engineer', location: 'San Francisco, CA', startDate: 'Jun 2014', endDate: 'Feb 2016', current: false, bullets: ['Developed payment processing APIs handling $2B+ in annual transactions', 'Built real-time fraud detection system reducing chargebacks by 34%'] },
      ],
      education: [{ institution: 'MIT', degree: 'B.Sc.', field: 'Computer Science', startDate: 'Sep 2010', endDate: 'Jun 2014', gpa: '3.9' }],
      skills: [{ category: 'Languages', skills: 'Go, TypeScript, Python, Rust' }, { category: 'Infrastructure', skills: 'Kubernetes, Docker, Terraform, AWS, GCP' }, { category: 'Databases', skills: 'PostgreSQL, Redis, Cassandra, BigQuery' }],
      certifications: [{ name: 'Google Cloud Professional Architect', issuer: 'Google', date: '2022' }, { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: '2021' }],
      languages: [], projects: [],
    }
  },
  {
    template_id: 'modern',
    title: 'Modern — Priya Sharma',
    resume_data: {
      personalDetails: { firstName: 'Priya', lastName: 'Sharma', jobTitle: 'Lead Product Designer', email: 'priya.sharma@design.io', phone: '+44 7911 234 567', location: 'London, UK', linkedin: 'linkedin.com/in/priyasharma', website: 'priyasharma.design' },
      summary: 'Award-winning product designer with 7 years crafting intuitive digital experiences for fintech and consumer apps. Led design at Figma and Monzo, shipping features to 10M+ users. Expertise in design systems, user research, and accessibility-first design.',
      workExperience: [
        { company: 'Figma', title: 'Lead Product Designer', location: 'London, UK', startDate: 'Feb 2021', endDate: 'Present', current: true, bullets: ['Designed FigJam whiteboarding features adopted by 400+ enterprise clients including Google and Microsoft', 'Rebuilt design system component library reducing designer onboarding time by 60%', 'Led Config 2023 keynote feature demos presented to 2M+ livestream viewers', 'Increased user engagement by 28% through redesigned collaboration tools'] },
        { company: 'Monzo', title: 'Senior Product Designer', location: 'London, UK', startDate: 'Apr 2018', endDate: 'Jan 2021', current: false, bullets: ['Redesigned payments flow increasing conversion rate by 28%, generating £14M additional annual revenue', 'Created Monzo accessibility guidelines adopted as company-wide standard, improving WCAG compliance to AA', 'Conducted 200+ user interviews informing product roadmap priorities for 5M+ customers'] },
        { company: 'Revolut', title: 'Product Designer', location: 'London, UK', startDate: 'Sep 2016', endDate: 'Mar 2018', current: false, bullets: ['Designed crypto trading interface used by 800K+ users across 35 countries', 'Built Revolut for Business onboarding flow reducing drop-off rate by 44%'] },
      ],
      education: [{ institution: 'Royal College of Art', degree: 'M.A.', field: 'Interaction Design', startDate: 'Sep 2014', endDate: 'Jun 2016', gpa: '' }],
      skills: [{ category: 'Design Tools', skills: 'Figma, Framer, Principle, After Effects' }, { category: 'Research', skills: 'User Interviews, Usability Testing, A/B Testing' }, { category: 'Code', skills: 'HTML, CSS, React (basics)' }],
      certifications: [], languages: [{ language: 'English', proficiency: 'Native' }, { language: 'Hindi', proficiency: 'Fluent' }, { language: 'French', proficiency: 'Intermediate' }], projects: [],
    }
  },
  {
    template_id: 'professional',
    title: 'Professional — James Okafor',
    resume_data: {
      personalDetails: { firstName: 'James', lastName: 'Okafor', jobTitle: 'Vice President, Investment Banking', email: 'james.okafor@finance.com', phone: '+1 (212) 445-9020', location: 'New York, NY', linkedin: 'linkedin.com/in/jamesokafor', website: '' },
      summary: 'VP at Goldman Sachs with 11 years structuring cross-border M&A transactions totalling $4.2B in enterprise value. CFA Charterholder and Series 7/63 licensed. Led IPO advisory for 3 tech unicorns including Databricks. Expert in LBO modelling, DCF analysis, and cross-border transactions across TMT and healthcare sectors.',
      workExperience: [
        { company: 'Goldman Sachs', title: 'Vice President, Investment Banking', location: 'New York, NY', startDate: 'Aug 2019', endDate: 'Present', current: true, bullets: ['Executed $1.8B acquisition of enterprise SaaS firm; managed 14-person deal team across 3 time zones', 'Advised on Databricks Series H and IPO preparation; coordinated roadshow yielding $1.6B raise at $43B valuation', 'Originated 6 new client mandates generating $28M in advisory fees in FY2023', 'Managed and mentored team of 4 associates and 6 analysts'] },
        { company: 'Morgan Stanley', title: 'Associate, M&A Advisory', location: 'New York, NY', startDate: 'Jun 2015', endDate: 'Jul 2019', current: false, bullets: ['Built 50+ financial models for TMT sector M&A transactions across North America and EMEA', 'Led due diligence on $620M healthcare merger; identified $45M synergy opportunities', 'Ranked #1 in analyst cohort; fast-tracked to Associate in 2 years (vs 3-year standard)'] },
        { company: 'PwC', title: 'Analyst, Deals Advisory', location: 'London, UK', startDate: 'Sep 2013', endDate: 'May 2015', current: false, bullets: ['Performed financial due diligence on 12 mid-market transactions totalling £800M', 'Built integrated financial models for 3 cross-border European acquisitions'] },
      ],
      education: [{ institution: 'Wharton School, University of Pennsylvania', degree: 'MBA', field: 'Finance', startDate: 'Sep 2013', endDate: 'May 2015', gpa: '3.8' }, { institution: 'London School of Economics', degree: 'B.Sc.', field: 'Economics (First Class Honours)', startDate: 'Sep 2010', endDate: 'Jun 2013', gpa: '3.9' }],
      skills: [{ category: 'Finance', skills: 'LBO Modelling, DCF, M&A, IPO Advisory, Capital Markets' }, { category: 'Tools', skills: 'Bloomberg, Capital IQ, FactSet, Excel (Advanced), PowerPoint' }],
      certifications: [{ name: 'CFA Charterholder', issuer: 'CFA Institute', date: '2018' }, { name: 'Series 7 & 63 Licensed', issuer: 'FINRA', date: '2016' }],
      languages: [{ language: 'English', proficiency: 'Native' }, { language: 'French', proficiency: 'Conversational' }], projects: [],
    }
  },
  {
    template_id: 'minimal',
    title: 'Minimal — Lena Fischer',
    resume_data: {
      personalDetails: { firstName: 'Lena', lastName: 'Fischer', jobTitle: 'Marketing Director', email: 'lena.fischer@studio.de', phone: '+49 30 9921 4480', location: 'Berlin, Germany', linkedin: 'linkedin.com/in/lenafischer', website: 'lenafischer.co' },
      summary: 'Brand strategist and marketing director with 8 years growing DTC and lifestyle brands across Europe and APAC. Built Zalando\'s influencer programme from zero to €22M attributed revenue. Data-driven creative with expertise in performance marketing, brand positioning, and cross-channel growth.',
      workExperience: [
        { company: 'Zalando', title: 'Marketing Director', location: 'Berlin, Germany', startDate: 'Mar 2020', endDate: 'Present', current: true, bullets: ['Grew influencer channel from 0 to 8M followers generating €22M annual attributed revenue', 'Managed €40M paid media budget across Google, Meta, TikTok and Pinterest; achieved 340% ROAS', 'Led team of 18 across brand, performance, and social marketing functions', 'Launched Zalando Plus loyalty programme to 2.1M subscribers in 6 months'] },
        { company: 'Henkel', title: 'Brand Manager, Schwarzkopf', location: 'Düsseldorf, Germany', startDate: 'Jan 2016', endDate: 'Feb 2020', current: false, bullets: ['Relaunched Schwarzkopf Professional in 12 European markets; brand awareness +34% in 18 months', 'Managed €15M annual brand budget; delivered 22% above target on brand health metrics', 'Won Henkel Global Marketing Excellence Award 2019 for EMEA campaign strategy'] },
        { company: 'Ogilvy', title: 'Senior Brand Strategist', location: 'Frankfurt, Germany', startDate: 'Jun 2014', endDate: 'Dec 2015', current: false, bullets: ['Developed brand strategy for 5 FMCG clients with combined revenue of €2.4B', 'Pitched and won €8M Unilever retainer for Central Europe markets'] },
      ],
      education: [{ institution: 'HEC Paris', degree: 'M.Sc.', field: 'International Marketing', startDate: 'Sep 2012', endDate: 'Jun 2014', gpa: '' }],
      skills: [{ category: 'Marketing', skills: 'Brand Strategy, Performance Marketing, Influencer, CRM, SEO' }, { category: 'Analytics', skills: 'Google Analytics, Tableau, SQL (basics), Mixpanel' }],
      certifications: [{ name: 'Google Analytics 4 Certified', issuer: 'Google', date: '2023' }],
      languages: [{ language: 'German', proficiency: 'Native' }, { language: 'English', proficiency: 'Fluent' }, { language: 'French', proficiency: 'Fluent' }], projects: [],
    }
  },
  {
    template_id: 'executive',
    title: 'Executive — Victoria Hayes',
    resume_data: {
      personalDetails: { firstName: 'Victoria', lastName: 'Hayes', jobTitle: 'Chief Operating Officer', email: 'victoria@hayesconsulting.com', phone: '+1 (617) 553-0042', location: 'Boston, MA', linkedin: 'linkedin.com/in/victoriahayes', website: '' },
      summary: 'C-suite executive with 20 years scaling global operations at Fortune 100 companies. As COO at Wayfair, scaled company from $1.2B to $4.7B in revenue while reducing operational costs by $180M. Board member at 2 public companies and advisor to 4 Series B+ startups. Expert in P&L management, supply chain transformation, and organizational design.',
      workExperience: [
        { company: 'Wayfair', title: 'Chief Operating Officer', location: 'Boston, MA', startDate: 'Jan 2018', endDate: 'Present', current: true, bullets: ['Scaled operations from 4,000 to 18,000 employees across 14 global offices during 4x revenue growth', 'Led $180M cost transformation programme improving EBITDA margin by 8 percentage points', 'Launched same-day delivery network in 22 US cities, increasing NPS from 42 to 73', 'Established global supplier network of 12,000+ vendors with 98.2% on-time delivery rate'] },
        { company: 'Amazon Logistics', title: 'SVP, Operations', location: 'Seattle, WA', startDate: 'Mar 2012', endDate: 'Dec 2017', current: false, bullets: ['Built Prime Now same-day fulfilment network across 60 US markets from concept to $1.8B run-rate revenue', 'Oversaw $2.4B capital deployment for robotics, automation, and facility expansion', 'Led 45,000-person operations organisation with $6.2B annual budget'] },
        { company: 'McKinsey & Company', title: 'Partner, Operations Practice', location: 'New York, NY', startDate: 'Jul 2004', endDate: 'Feb 2012', current: false, bullets: ['Led operations transformation programmes for 12 Fortune 500 clients across retail and logistics', 'Built and led 60-person operations practice for North America'] },
      ],
      education: [{ institution: 'Harvard Business School', degree: 'MBA', field: 'General Management', startDate: 'Sep 2002', endDate: 'May 2004', gpa: '' }, { institution: 'Yale University', degree: 'B.A.', field: 'Economics (Summa Cum Laude)', startDate: 'Sep 1998', endDate: 'Jun 2002', gpa: '3.97' }],
      skills: [{ category: 'Leadership', skills: 'P&L Management, Organisational Design, M&A Integration, Board Governance' }, { category: 'Operations', skills: 'Supply Chain, Logistics, Process Transformation, Lean Six Sigma' }],
      certifications: [], languages: [], projects: [],
    }
  },
  {
    template_id: 'compact',
    title: 'Compact — Diego Ramirez',
    resume_data: {
      personalDetails: { firstName: 'Diego', lastName: 'Ramirez', jobTitle: 'Principal Machine Learning Engineer', email: 'diego.r@ml.co', phone: '+1 (512) 334-0091', location: 'Austin, TX', linkedin: 'linkedin.com/in/diegoramirez', website: 'diegoramirez.ai' },
      summary: 'ML engineer with 7+ years building production AI systems at Meta and Uber. Specialise in recommendation systems, real-time inference, and MLOps. Published 3 papers at NeurIPS and KDD. Passionate about scaling ML from research to 100M+ user products.',
      workExperience: [
        { company: 'Meta AI', title: 'Principal ML Engineer', location: 'Austin, TX', startDate: 'Apr 2022', endDate: 'Present', current: true, bullets: ['Built next-gen recommendation engine serving 3B users; +18% engagement, +$400M estimated annual revenue', 'Reduced model inference latency from 120ms to 28ms through quantisation and kernel fusion', 'Led MLOps platform migration enabling 200+ data scientists to deploy models 4x faster'] },
        { company: 'Uber', title: 'Senior Data Scientist', location: 'San Francisco, CA', startDate: 'Jul 2019', endDate: 'Mar 2022', current: false, bullets: ['Rebuilt surge pricing ML model saving $22M in annual driver incentive costs', 'Developed ETA prediction model improving accuracy by 31% across 70+ cities globally'] },
        { company: 'Netflix', title: 'Data Scientist', location: 'Los Gatos, CA', startDate: 'Sep 2017', endDate: 'Jun 2019', current: false, bullets: ['Built personalised thumbnail selection model deployed to 200M+ subscribers; +5% click-through rate'] },
      ],
      education: [{ institution: 'Carnegie Mellon University', degree: 'M.Sc.', field: 'Machine Learning', startDate: 'Aug 2015', endDate: 'May 2017', gpa: '4.0' }, { institution: 'UT Austin', degree: 'B.Sc.', field: 'Statistics & Computer Science', startDate: 'Aug 2011', endDate: 'May 2015', gpa: '3.95' }],
      skills: [{ category: 'ML/AI', skills: 'PyTorch, TensorFlow, JAX, Scikit-learn, XGBoost' }, { category: 'Data', skills: 'Spark, Kafka, Airflow, DBT, Redshift' }, { category: 'MLOps', skills: 'Kubeflow, MLflow, SageMaker, Ray, Docker, Kubernetes' }],
      certifications: [{ name: '"Efficient Transformers at Scale" — NeurIPS 2023', issuer: 'Publication', date: '2023' }, { name: '"Real-time Fraud Detection with GNNs" — KDD 2021', issuer: 'Publication', date: '2021' }],
      languages: [], projects: [],
    }
  },
  {
    template_id: 'elegant',
    title: 'Elegant — Isabelle Laurent',
    resume_data: {
      personalDetails: { firstName: 'Isabelle', lastName: 'Laurent', jobTitle: 'Global Creative Director', email: 'isabelle@laurentcreative.fr', phone: '+33 6 80 44 92 11', location: 'Paris, France', linkedin: 'linkedin.com/in/isabellelaurent', website: 'isabellelaurent.com' },
      summary: 'Visionary creative director with 12 years defining the visual identities of the world\'s most coveted luxury and lifestyle brands. Led creative at LVMH and Chanel, directing global campaigns reaching 90M+ impressions. Three-time Cannes Lions winner. Known for bridging digital innovation with timeless brand aesthetics.',
      workExperience: [
        { company: 'LVMH', title: 'Global Creative Director', location: 'Paris, France', startDate: 'Jan 2020', endDate: 'Present', current: true, bullets: ['Led digital rebrand of Louis Vuitton\'s global visual identity; contributed to €180M increase in e-commerce revenue', 'Art-directed 40+ campaigns across print, OOH, film, and digital for 6 LVMH maisons', 'Built and led 22-person creative studio across Paris and New York', 'Won Cannes Lions Gold for Louis Vuitton "Série" editorial campaign 2022'] },
        { company: 'Chanel', title: 'Art Director', location: 'Paris, France', startDate: 'Sep 2015', endDate: 'Dec 2019', current: false, bullets: ['Directed N°5 Centenary campaign; 90M+ global impressions, 3 Cannes Lions, D&AD Silver', 'Led visual identity evolution across print, digital and in-store for Ready-to-Wear collections', 'Collaborated with Karl Lagerfeld on 4 runway campaign concepts'] },
        { company: 'Pentagram', title: 'Senior Designer', location: 'London, UK', startDate: 'Jun 2012', endDate: 'Aug 2015', current: false, bullets: ['Rebranded 3 global luxury clients; projects featured in Wallpaper* and Eye Magazine', 'Developed typography systems and identity guidelines for 8 international brands'] },
      ],
      education: [{ institution: 'École des Arts Décoratifs, Paris', degree: 'M.F.A.', field: 'Graphic Design & Visual Communication', startDate: 'Sep 2010', endDate: 'Jun 2012', gpa: '' }, { institution: 'Central Saint Martins, London', degree: 'B.A.', field: 'Graphic Design (First Class)', startDate: 'Sep 2007', endDate: 'Jun 2010', gpa: '' }],
      skills: [{ category: 'Creative', skills: 'Brand Identity, Art Direction, Typography, Editorial Design, Motion' }, { category: 'Tools', skills: 'Adobe Creative Suite, Figma, Cinema 4D, Keynote' }],
      certifications: [], languages: [{ language: 'French', proficiency: 'Native' }, { language: 'English', proficiency: 'Fluent' }, { language: 'Italian', proficiency: 'Conversational' }], projects: [],
    }
  },
  {
    template_id: 'technical',
    title: 'Technical — Arjun Patel',
    resume_data: {
      personalDetails: { firstName: 'Arjun', lastName: 'Patel', jobTitle: 'Principal DevOps / Platform Engineer', email: 'arjun@devops.io', phone: '+1 (206) 773-4421', location: 'Seattle, WA', linkedin: 'linkedin.com/in/arjunpatel', website: 'github.com/arjunpatel-dev' },
      summary: 'Principal platform engineer with 9 years designing and operating large-scale infrastructure at Microsoft and Spotify. Expert in Kubernetes, Terraform, and platform engineering. Built zero-downtime deployment systems used by 1,200+ engineers. SRE background with 99.995% uptime track record.',
      workExperience: [
        { company: 'Microsoft Azure', title: 'Principal Platform Engineer', location: 'Seattle, WA', startDate: 'Jun 2021', endDate: 'Present', current: true, bullets: ['Migrated 400+ microservices to AKS multi-region clusters; reduced infrastructure cost by 60% (~$8M/year)', 'Built internal developer platform serving 1,200+ engineers; reduced deployment time from 45min to 4min', 'Designed GitOps pipeline with ArgoCD and Flux achieving 100% auditable deployments', 'Led SRE on-call rotation maintaining 99.99% SLA for Azure Kubernetes Service product'] },
        { company: 'Spotify', title: 'SRE Tech Lead', location: 'Stockholm, Sweden', startDate: 'Aug 2017', endDate: 'May 2021', current: false, bullets: ['Achieved 99.995% platform uptime for 400M+ user streaming service globally', 'Built observability platform ingesting 4TB/day of metrics, logs and traces using Prometheus/Grafana/Tempo', 'Led incident response for 3 major outages, each resolved in under 20 minutes'] },
        { company: 'Flipkart', title: 'Senior Infrastructure Engineer', location: 'Bangalore, India', startDate: 'Jul 2015', endDate: 'Jul 2017', current: false, bullets: ['Scaled infrastructure to handle 1.5B page views during Big Billion Days sales event (10x normal load)', 'Automated server provisioning reducing time-to-deploy from 3 days to 2 hours'] },
      ],
      education: [{ institution: 'IIT Bombay', degree: 'B.Tech.', field: 'Computer Science & Engineering', startDate: 'Jul 2011', endDate: 'May 2015', gpa: '9.2/10' }],
      skills: [{ category: 'Orchestration', skills: 'Kubernetes (CKA), Helm, ArgoCD, Flux, Istio, Linkerd' }, { category: 'Cloud & IaC', skills: 'AWS, Azure, GCP, Terraform, Pulumi, Ansible' }, { category: 'Observability', skills: 'Prometheus, Grafana, Tempo, OpenTelemetry, Datadog, PagerDuty' }, { category: 'Languages', skills: 'Go, Python, Bash, TypeScript' }],
      certifications: [{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: '2022' }, { name: 'AWS Solutions Architect Professional', issuer: 'Amazon', date: '2021' }, { name: 'Google SRE Book Practitioner', issuer: 'Google', date: '2020' }],
      languages: [], projects: [],
    }
  },
  {
    template_id: 'classic',
    title: 'Classic — Eleanor Wright',
    resume_data: {
      personalDetails: { firstName: 'Eleanor', lastName: 'Wright', jobTitle: 'Senior Financial Analyst & CFA Charterholder', email: 'eleanor.wright@cpa.com', phone: '+1 (617) 882-3391', location: 'Boston, MA', linkedin: 'linkedin.com/in/eleanorwright', website: '' },
      summary: 'CPA and CFA Charterholder with 10 years in financial analysis, FP&A, and M&A due diligence at Fidelity Investments and PwC. Managed $1.4B equity portfolio outperforming benchmark by 320bps. Expertise in financial modelling, valuation, and strategic financial planning for financial services clients.',
      workExperience: [
        { company: 'Fidelity Investments', title: 'Senior Financial Analyst', location: 'Boston, MA', startDate: 'Feb 2019', endDate: 'Present', current: true, bullets: ['Manage $1.4B large-cap equity portfolio; outperformed Russell 1000 benchmark by 320bps in 2023', 'Led financial due diligence on 8 M&A transactions totalling $620M in enterprise value', 'Built integrated DCF and LBO models for 15 public and private company valuations', 'Presented quarterly investment recommendations to senior portfolio management committee'] },
        { company: 'PwC', title: 'Senior Associate, Audit & Advisory', location: 'New York, NY', startDate: 'Sep 2014', endDate: 'Jan 2019', current: false, bullets: ['Audited financial statements for 12 S&P 500 companies in financial services sector with $50B+ combined assets', 'Led audit team of 6 for $8.2B insurance company; identified $12M material misstatement', 'Ranked in top 10% of senior associate cohort; received early promotion to Senior Associate in year 2'] },
        { company: 'Bank of America Merrill Lynch', title: 'Financial Analyst', location: 'New York, NY', startDate: 'Jul 2013', endDate: 'Aug 2014', current: false, bullets: ['Supported equity research coverage of 14 US regional banking institutions', 'Built earnings models for quarterly estimates; average forecast error of 2.1%'] },
      ],
      education: [{ institution: 'Boston University', degree: 'B.Sc.', field: 'Accounting (Magna Cum Laude)', startDate: 'Sep 2009', endDate: 'May 2013', gpa: '3.92' }],
      skills: [{ category: 'Finance', skills: 'DCF, LBO, M&A Due Diligence, Portfolio Management, Financial Modelling' }, { category: 'Tools', skills: 'Bloomberg Terminal, Capital IQ, FactSet, Excel (Advanced), Power BI' }],
      certifications: [{ name: 'CFA Charterholder', issuer: 'CFA Institute', date: '2018' }, { name: 'Certified Public Accountant (CPA)', issuer: 'AICPA — Massachusetts', date: '2016' }, { name: 'Series 7 & 66 Licensed', issuer: 'FINRA', date: '2014' }],
      languages: [], projects: [],
    }
  },
  {
    template_id: 'creative',
    title: 'Creative — Zoe Thompson',
    resume_data: {
      personalDetails: { firstName: 'Zoe', lastName: 'Thompson', jobTitle: 'Executive Creative Director', email: 'zoe@zoethompson.co', phone: '+1 (310) 882-0033', location: 'Los Angeles, CA', linkedin: 'linkedin.com/in/zoethompson', website: 'zoethompson.co' },
      summary: 'Executive creative director with 10 years defining bold brand identities and culture-defining campaigns for global clients at Wieden+Kennedy and Pentagram. D&AD Yellow Pencil winner. Led Nike "Never Done" campaign generating 2.4B impressions. Expertise in brand strategy, motion design, and 360° campaign execution.',
      workExperience: [
        { company: 'Wieden+Kennedy', title: 'Executive Creative Director', location: 'Los Angeles, CA', startDate: 'Mar 2021', endDate: 'Present', current: true, bullets: ['Led Nike "Never Done" global campaign across 40 markets; 2.4B impressions, D&AD Yellow Pencil 2023', 'Directed Spotify Wrapped visual identity 2022 & 2023; campaign reached 456M users in 184 markets', 'Built and led creative team of 28 across art direction, copy, motion, and experience design', 'Won One Show Gold (2022) and Cannes Lions Silver (2021) for Old Spice and KFC campaigns'] },
        { company: 'Pentagram', title: 'Creative Director', location: 'New York, NY', startDate: 'Jan 2017', endDate: 'Feb 2021', current: false, bullets: ['Rebranded 4 Fortune 500 companies including Warner Music Group; projects in Wallpaper* and Eye Magazine', 'Developed visual identity systems for 3 cultural institutions including MoMA PS1', 'Led brand identity for 2 tech unicorn IPOs, designing investor presentation decks used in $2B+ roadshows'] },
        { company: 'IDEO', title: 'Senior Designer', location: 'San Francisco, CA', startDate: 'Aug 2014', endDate: 'Dec 2016', current: false, bullets: ['Designed brand and product experiences for Apple, Airbnb, and Patagonia', 'Created motion design system for Google Material Design 2.0'] },
      ],
      education: [{ institution: 'Rhode Island School of Design (RISD)', degree: 'B.F.A.', field: 'Graphic Design', startDate: 'Sep 2010', endDate: 'May 2014', gpa: '3.9' }],
      skills: [{ category: 'Creative', skills: 'Brand Identity, Art Direction, Motion Design, Typography, 3D / Blender' }, { category: 'Tools', skills: 'Adobe Creative Suite, Figma, Cinema 4D, After Effects, DaVinci Resolve' }],
      certifications: [], languages: [], projects: [],
    }
  },
];

async function main() {
  const { data: login } = await supabase.auth.signInWithPassword({ email: 'yj.digitall@gmail.com', password: 'Resumly2024!' });
  console.log('Logged in as:', login.user.email);

  const ids = {};
  for (const t of TEMPLATE_DATA) {
    // Delete any existing template screenshots resume
    await supabase.from('resumes').delete().eq('user_id', USER_ID).eq('title', t.title);

    const { data, error } = await supabase.from('resumes').insert({
      user_id: USER_ID,
      title: t.title,
      template_id: t.template_id,
      resume_data: t.resume_data,
      ats_score: 92,
      is_public: false,
    }).select('id').single();

    if (error) { console.error(`❌ ${t.template_id}:`, error.message); continue; }
    ids[t.template_id] = data.id;
    console.log(`✅ Created ${t.template_id}: ${data.id}`);
  }

  console.log('\n📋 Resume IDs:');
  console.log(JSON.stringify(ids, null, 2));
}

main().catch(console.error);
