const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yfgtdhmpmaqzloewrujv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI'
);

// IDs from create-template-resumes script
const RESUME_IDS = {
  'ats-pro':      '21f48519-41de-4dab-bc69-14231266c8a7',
  'modern':       '50be17d1-e38e-4c8e-aa21-e2235710e49c',
  'professional': 'd45bf3dd-7ce1-4ee5-bf6a-c529d9e6c748',
  'minimal':      '2d01342a-62e9-44aa-aead-48443f03fe0d',
  'executive':    '4d9d04c6-6d8a-458c-b5e3-69a931da6522',
  'compact':      '426ac32e-e24a-4173-a4a2-86876183d5a0',
  'elegant':      'b0263243-4949-46e9-9ab6-cb1c3d2f2381',
  'technical':    '1a9c7efc-cff4-4a5b-b6df-14ed3a238c6c',
  'classic':      '7ee32dfb-d544-485c-8159-f8572d096226',
  'creative':     '06dfa463-49ad-4541-bd33-3bcfdcbaf2f5',
};

const UPDATES = {
  'ats-pro': {
    workExperience: [
      { company: 'Google', title: 'Staff Software Engineer', location: 'Mountain View, CA', startDate: 'Jan 2020', endDate: 'Present', current: true, bullets: [
        'Architected microservices platform handling 2B daily requests on GCP, reducing latency by 41%',
        'Led 12-person cross-functional team to ship Search infrastructure improvements serving 4B+ users',
        'Implemented ML-powered caching layer that reduced infrastructure costs by $3.2M annually',
        'Mentored 8 junior engineers across 3 time zones, 3 promoted to senior within 18 months',
        'Designed observability platform ingesting 6TB/day of metrics, cutting incident MTTR by 55%',
        'Drove adoption of internal platform tools across 60+ engineering teams globally',
      ]},
      { company: 'Cloudflare', title: 'Senior Software Engineer', location: 'San Francisco, CA', startDate: 'Mar 2016', endDate: 'Dec 2019', current: false, bullets: [
        'Built edge caching system serving 100TB/day, improving cache-hit ratio from 72% to 94%',
        'Designed zero-downtime deployment pipeline adopted by 1,200+ internal engineers',
        'Rewrote core routing engine in Go, achieving 3x throughput improvement at peak load',
        'Reduced p99 request latency by 38ms across 200+ global PoPs through kernel-level optimisation',
        'Contributed 4 RFCs to internal engineering standards adopted company-wide',
      ]},
      { company: 'Stripe', title: 'Software Engineer', location: 'San Francisco, CA', startDate: 'Jun 2014', endDate: 'Feb 2016', current: false, bullets: [
        'Developed payment processing APIs handling $2B+ in annual transactions with 99.999% uptime',
        'Built real-time fraud detection system reducing chargebacks by 34% within 6 months',
        'Migrated legacy billing system to event-driven architecture, cutting processing time by 72%',
      ]},
    ],
    skills: [
      { category: 'Languages', skills: 'Go, TypeScript, Python, Rust, Java' },
      { category: 'Infrastructure', skills: 'Kubernetes, Docker, Terraform, AWS, GCP, Azure' },
      { category: 'Databases', skills: 'PostgreSQL, Redis, Cassandra, BigQuery, Spanner' },
      { category: 'Observability', skills: 'Prometheus, Grafana, Datadog, OpenTelemetry, PagerDuty' },
    ],
    certifications: [
      { name: 'Google Cloud Professional Architect', issuer: 'Google', date: '2023' },
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: '2022' },
      { name: 'AWS Solutions Architect — Professional', issuer: 'Amazon Web Services', date: '2021' },
    ],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'Mandarin', proficiency: 'Conversational' }],
  },

  'modern': {
    workExperience: [
      { company: 'Figma', title: 'Lead Product Designer', location: 'London, UK', startDate: 'Feb 2021', endDate: 'Present', current: true, bullets: [
        'Designed FigJam whiteboarding features adopted by 400+ enterprise clients including Google and Microsoft',
        'Rebuilt design system component library, reducing designer onboarding time by 60%',
        'Led Config 2023 keynote feature demos presented to 2M+ livestream viewers globally',
        'Increased user engagement by 28% through redesigned real-time collaboration tools',
        'Established design critique culture across 8 product squads, improving design quality scores',
        'Ran quarterly UX research programme with 150+ participants per cycle to inform roadmap',
      ]},
      { company: 'Monzo', title: 'Senior Product Designer', location: 'London, UK', startDate: 'Apr 2018', endDate: 'Jan 2021', current: false, bullets: [
        'Redesigned payments flow, increasing conversion by 28% and generating £14M additional annual revenue',
        'Created Monzo accessibility guidelines adopted as company-wide standard, achieving WCAG AA compliance',
        'Conducted 200+ user interviews that directly informed product roadmap for 5M+ customers',
        'Shipped Monzo Plus upgrade flow, converting 18% of eligible users within the first quarter',
        'Mentored 3 mid-level designers; 2 promoted to Senior within 12 months of coaching',
      ]},
      { company: 'Revolut', title: 'Product Designer', location: 'London, UK', startDate: 'Sep 2016', endDate: 'Mar 2018', current: false, bullets: [
        'Designed crypto trading interface adopted by 800K+ users across 35 countries',
        'Built Revolut for Business onboarding flow, reducing drop-off rate by 44%',
        'Collaborated with engineering to ship 12 features in 6 months on a fast-paced agile team',
      ]},
    ],
    skills: [
      { category: 'Design Tools', skills: 'Figma, Framer, Principle, After Effects, Lottie' },
      { category: 'Research', skills: 'User Interviews, Usability Testing, A/B Testing, Surveys' },
      { category: 'Systems', skills: 'Design Systems, Tokens, Accessibility (WCAG), Motion Design' },
      { category: 'Code', skills: 'HTML, CSS, React (basics), Storybook' },
    ],
    certifications: [{ name: 'Nielsen Norman Group UX Certification', issuer: 'NN/g', date: '2022' }],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'Hindi', proficiency: 'Fluent' }, { language: 'French', proficiency: 'Intermediate' }],
  },

  'professional': {
    workExperience: [
      { company: 'Goldman Sachs', title: 'Vice President, Investment Banking', location: 'New York, NY', startDate: 'Aug 2019', endDate: 'Present', current: true, bullets: [
        'Executed $1.8B acquisition of enterprise SaaS firm; managed 14-person deal team across 3 time zones',
        'Advised Databricks on Series H and IPO preparation; co-ordinated roadshow yielding $1.6B at $43B valuation',
        'Originated 6 new client mandates in FY2023, generating $28M in advisory fees',
        'Managed team of 4 associates and 6 analysts; 2 associates promoted to VP within 18 months',
        'Built and maintained C-suite relationships at 12 TMT and healthcare accounts',
        'Led cross-border diligence on €420M European healthcare carve-out across 5 jurisdictions',
      ]},
      { company: 'Morgan Stanley', title: 'Associate, M&A Advisory', location: 'New York, NY', startDate: 'Jun 2015', endDate: 'Jul 2019', current: false, bullets: [
        'Built 50+ financial models for TMT sector M&A transactions across North America and EMEA',
        'Led due diligence on $620M healthcare merger; surfaced $45M synergy opportunities adopted by client',
        'Ranked #1 in analyst cohort; fast-tracked to Associate in 2 years versus 3-year standard track',
        'Presented buy-side recommendations to boards of 3 Fortune 500 companies',
      ]},
      { company: 'PwC', title: 'Analyst, Deals Advisory', location: 'London, UK', startDate: 'Sep 2013', endDate: 'May 2015', current: false, bullets: [
        'Performed financial due diligence on 12 mid-market transactions totalling £800M in enterprise value',
        'Built integrated financial models for 3 cross-border European acquisitions',
      ]},
    ],
    skills: [
      { category: 'Finance', skills: 'LBO Modelling, DCF, M&A, IPO Advisory, Capital Markets, Leveraged Finance' },
      { category: 'Tools', skills: 'Bloomberg, Capital IQ, FactSet, Excel (Advanced), VBA, PowerPoint' },
      { category: 'Domains', skills: 'TMT, Healthcare, SaaS, PE-backed transactions, SPAC advisory' },
    ],
    certifications: [
      { name: 'CFA Charterholder', issuer: 'CFA Institute', date: '2018' },
      { name: 'Series 7 & Series 63 Licensed', issuer: 'FINRA', date: '2016' },
    ],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'French', proficiency: 'Conversational' }],
  },

  'minimal': {
    workExperience: [
      { company: 'Zalando', title: 'Marketing Director', location: 'Berlin, Germany', startDate: 'Mar 2020', endDate: 'Present', current: true, bullets: [
        'Scaled influencer channel from 0 to 8M followers, generating €22M annual attributed revenue',
        'Managed €40M paid media budget across Google, Meta, TikTok and Pinterest at 340% ROAS',
        'Led team of 18 across brand, performance, and social marketing functions across 4 markets',
        'Launched Zalando Plus loyalty programme to 2.1M subscribers in 6 months ahead of schedule',
        'Oversaw brand refresh campaign reaching 34M unique users across 12 European markets',
        'Implemented marketing attribution model increasing budget efficiency by 22% in 2023',
      ]},
      { company: 'Henkel', title: 'Brand Manager, Schwarzkopf', location: 'Düsseldorf, Germany', startDate: 'Jan 2016', endDate: 'Feb 2020', current: false, bullets: [
        'Relaunched Schwarzkopf Professional in 12 European markets; brand awareness +34% in 18 months',
        'Managed €15M annual brand budget; delivered 22% above target on brand health metrics',
        'Won Henkel Global Marketing Excellence Award 2019 for EMEA campaign strategy',
        'Directed collaboration with 3 celebrity ambassadors, driving 14M earned media impressions',
      ]},
      { company: 'Ogilvy', title: 'Senior Brand Strategist', location: 'Frankfurt, Germany', startDate: 'Jun 2014', endDate: 'Dec 2015', current: false, bullets: [
        'Developed brand strategy for 5 FMCG clients with combined €2.4B revenue',
        'Pitched and won €8M Unilever retainer for Central Europe markets',
      ]},
    ],
    skills: [
      { category: 'Marketing', skills: 'Brand Strategy, Performance Marketing, Influencer, CRM, SEO/SEM' },
      { category: 'Analytics', skills: 'Google Analytics 4, Tableau, SQL (intermediate), Mixpanel, Adjust' },
      { category: 'Platforms', skills: 'Meta Ads, Google Ads, TikTok for Business, Pinterest Ads, LinkedIn' },
    ],
    certifications: [
      { name: 'Google Analytics 4 Certified', issuer: 'Google', date: '2023' },
      { name: 'Meta Blueprint Certified Digital Marketing Associate', issuer: 'Meta', date: '2022' },
    ],
    languages: [{ language: 'German', proficiency: 'Native' }, { language: 'English', proficiency: 'Fluent' }, { language: 'French', proficiency: 'Fluent' }],
  },

  'executive': {
    workExperience: [
      { company: 'Wayfair', title: 'Chief Operating Officer', location: 'Boston, MA', startDate: 'Jan 2018', endDate: 'Present', current: true, bullets: [
        'Scaled operations from 4,000 to 18,000 employees across 14 global offices during 4x revenue growth',
        'Led $180M cost transformation programme improving EBITDA margin by 8 percentage points',
        'Launched same-day delivery network across 22 US cities, increasing NPS from 42 to 73',
        'Established global supplier network of 12,000+ vendors achieving 98.2% on-time delivery rate',
        'Chaired executive risk committee overseeing $800M capital allocation across 5 strategic initiatives',
        'Drove digital operations transformation, automating 40% of manual warehouse workflows',
      ]},
      { company: 'Amazon Logistics', title: 'SVP, Operations', location: 'Seattle, WA', startDate: 'Mar 2012', endDate: 'Dec 2017', current: false, bullets: [
        'Built Prime Now same-day fulfilment network across 60 US markets from concept to $1.8B run-rate',
        'Oversaw $2.4B capital deployment for robotics, automation and facility expansion',
        'Led 45,000-person operations organisation with $6.2B annual operating budget',
        'Reduced fulfilment cost-per-unit by 19% over 3 years through process re-engineering',
        'Launched international operations in Canada, Germany and Japan simultaneously',
      ]},
      { company: 'McKinsey & Company', title: 'Partner, Operations Practice', location: 'New York, NY', startDate: 'Jul 2004', endDate: 'Feb 2012', current: false, bullets: [
        'Led operations transformation programmes for 12 Fortune 500 clients across retail and logistics',
        'Built and led 60-person North America operations practice',
      ]},
    ],
    skills: [
      { category: 'Leadership', skills: 'P&L Management, Organisational Design, M&A Integration, Board Governance' },
      { category: 'Operations', skills: 'Supply Chain, Logistics, Lean Six Sigma, Process Transformation' },
      { category: 'Finance', skills: 'Capital Allocation, EBITDA Optimisation, Cost Transformation, Investor Relations' },
    ],
    certifications: [],
    languages: [],
  },

  'compact': {
    workExperience: [
      { company: 'Meta AI', title: 'Principal ML Engineer', location: 'Austin, TX', startDate: 'Apr 2022', endDate: 'Present', current: true, bullets: [
        'Built next-gen recommendation engine serving 3B users; +18% engagement, +$400M estimated annual revenue',
        'Reduced model inference latency from 120ms to 28ms via quantisation and kernel fusion',
        'Led MLOps platform migration enabling 200+ data scientists to deploy models 4x faster',
        'Shipped personalised content ranking model increasing Watch Time by 9% across Instagram Reels',
        'Filed 3 patents in real-time inference optimisation reviewed by Meta\'s central patent board',
        'Mentored 6 senior data scientists; 2 promoted to Staff Scientist within 18 months',
      ]},
      { company: 'Uber', title: 'Senior Data Scientist', location: 'San Francisco, CA', startDate: 'Jul 2019', endDate: 'Mar 2022', current: false, bullets: [
        'Rebuilt surge pricing ML model saving $22M in annual driver incentive costs',
        'Developed ETA prediction model improving accuracy by 31% across 70+ cities globally',
        'Created driver-demand forecasting system reducing empty miles driven by 12%',
        'Ran A/B testing framework supporting 40+ concurrent experiments across product teams',
      ]},
      { company: 'Netflix', title: 'Data Scientist', location: 'Los Gatos, CA', startDate: 'Sep 2017', endDate: 'Jun 2019', current: false, bullets: [
        'Built personalised thumbnail selection model deployed to 200M+ subscribers; +5% CTR',
        'Improved content recommendation diversity score by 18% using multi-objective optimisation',
      ]},
    ],
    skills: [
      { category: 'ML/AI', skills: 'PyTorch, TensorFlow, JAX, Scikit-learn, XGBoost, LightGBM' },
      { category: 'Data', skills: 'Spark, Kafka, Airflow, dbt, Redshift, BigQuery, Flink' },
      { category: 'MLOps', skills: 'Kubeflow, MLflow, SageMaker, Ray, Seldon, Docker, Kubernetes' },
      { category: 'Languages', skills: 'Python (expert), SQL, Scala, Go (proficient)' },
    ],
    certifications: [
      { name: '"Efficient Transformers at Scale" — NeurIPS 2023', issuer: 'Publication', date: '2023' },
      { name: '"Real-time Fraud Detection with GNNs" — KDD 2021', issuer: 'Publication', date: '2021' },
      { name: '"Personalisation at Billion-User Scale" — RecSys 2022', issuer: 'Publication', date: '2022' },
    ],
    languages: [],
  },

  'elegant': {
    workExperience: [
      { company: 'LVMH', title: 'Global Creative Director', location: 'Paris, France', startDate: 'Jan 2020', endDate: 'Present', current: true, bullets: [
        'Led digital rebrand of Louis Vuitton\'s global visual identity, contributing to €180M e-commerce revenue lift',
        'Art-directed 40+ campaigns across print, OOH, film and digital for 6 LVMH maisons simultaneously',
        'Built and led 22-person creative studio across Paris, New York and Tokyo',
        'Won Cannes Lions Gold for Louis Vuitton "Série" editorial campaign, 2022',
        'Oversaw €12M annual creative production budget across 4 product lines and 30+ markets',
        'Established brand-consistency framework adopted across all LVMH Maison creative teams',
      ]},
      { company: 'Chanel', title: 'Art Director', location: 'Paris, France', startDate: 'Sep 2015', endDate: 'Dec 2019', current: false, bullets: [
        'Directed N°5 Centenary campaign: 90M+ global impressions, 3 Cannes Lions, D&AD Silver',
        'Led visual identity evolution across print, digital and in-store for Ready-to-Wear collections',
        'Collaborated with Karl Lagerfeld on 4 runway campaign concepts from brief to global release',
        'Developed art direction guidelines for 8 regional teams across Europe and Asia-Pacific',
      ]},
      { company: 'Pentagram', title: 'Senior Designer', location: 'London, UK', startDate: 'Jun 2012', endDate: 'Aug 2015', current: false, bullets: [
        'Rebranded 3 global luxury clients; projects featured in Wallpaper* and Eye Magazine',
        'Developed typography systems and identity guidelines for 8 international brands',
      ]},
    ],
    skills: [
      { category: 'Creative', skills: 'Brand Identity, Art Direction, Typography, Editorial Design, Motion' },
      { category: 'Tools', skills: 'Adobe Creative Suite, Figma, Cinema 4D, Keynote, Capture One' },
      { category: 'Production', skills: 'Campaign Management, Photographic Direction, Vendor Briefing' },
    ],
    certifications: [],
    languages: [{ language: 'French', proficiency: 'Native' }, { language: 'English', proficiency: 'Fluent' }, { language: 'Italian', proficiency: 'Conversational' }],
  },

  'technical': {
    workExperience: [
      { company: 'Microsoft Azure', title: 'Principal Platform Engineer', location: 'Seattle, WA', startDate: 'Jun 2021', endDate: 'Present', current: true, bullets: [
        'Migrated 400+ microservices to AKS multi-region clusters, reducing infra cost by 60% (~$8M/year)',
        'Built internal developer platform serving 1,200+ engineers; cut deployment time from 45 min to 4 min',
        'Designed GitOps pipeline with ArgoCD and Flux achieving 100% auditable, reproducible deployments',
        'Led SRE on-call rotation maintaining 99.99% SLA for Azure Kubernetes Service product',
        'Authored 6 internal RFCs on platform architecture adopted across 12 Azure product teams',
        'Reduced mean time to recovery (MTTR) from 48 min to 9 min via improved observability tooling',
      ]},
      { company: 'Spotify', title: 'SRE Tech Lead', location: 'Stockholm, Sweden', startDate: 'Aug 2017', endDate: 'May 2021', current: false, bullets: [
        'Achieved 99.995% platform uptime for 400M+ user streaming service globally across 150+ countries',
        'Built observability platform ingesting 4TB/day of metrics, logs and traces using Prometheus/Grafana/Tempo',
        'Led incident response for 3 major outages, each resolved in under 20 minutes',
        'Reduced alert noise by 78% by implementing intelligent alerting with ML-based anomaly detection',
      ]},
      { company: 'Flipkart', title: 'Senior Infrastructure Engineer', location: 'Bangalore, India', startDate: 'Jul 2015', endDate: 'Jul 2017', current: false, bullets: [
        'Scaled infrastructure to handle 1.5B page views during Big Billion Days (10x normal peak load)',
        'Automated server provisioning reducing time-to-deploy from 3 days to 2 hours using Ansible',
      ]},
    ],
    skills: [
      { category: 'Orchestration', skills: 'Kubernetes (CKA), Helm, ArgoCD, Flux, Istio, Linkerd, Keda' },
      { category: 'Cloud & IaC', skills: 'AWS, Azure, GCP, Terraform, Pulumi, Ansible, Crossplane' },
      { category: 'Observability', skills: 'Prometheus, Grafana, Tempo, OpenTelemetry, Datadog, PagerDuty' },
      { category: 'Languages', skills: 'Go, Python, Bash, TypeScript, Rust (learning)' },
    ],
    certifications: [
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: '2022' },
      { name: 'AWS Solutions Architect — Professional', issuer: 'Amazon Web Services', date: '2021' },
      { name: 'Google Professional Cloud DevOps Engineer', issuer: 'Google Cloud', date: '2020' },
    ],
    languages: [],
  },

  'classic': {
    workExperience: [
      { company: 'Fidelity Investments', title: 'Senior Financial Analyst', location: 'Boston, MA', startDate: 'Feb 2019', endDate: 'Present', current: true, bullets: [
        'Manage $1.4B large-cap equity portfolio; outperformed Russell 1000 benchmark by 320bps in 2023',
        'Led financial due diligence on 8 M&A transactions totalling $620M in enterprise value',
        'Built integrated DCF and LBO models for 15 public and private company valuations',
        'Presented quarterly investment recommendations to senior portfolio management committee',
        'Collaborated with risk team to implement portfolio stress-testing framework for tail-risk scenarios',
        'Published 3 equity research reports downloaded 4,000+ times by institutional investors',
      ]},
      { company: 'PwC', title: 'Senior Associate, Audit & Advisory', location: 'New York, NY', startDate: 'Sep 2014', endDate: 'Jan 2019', current: false, bullets: [
        'Audited financial statements for 12 S&P 500 companies in financial services with $50B+ combined assets',
        'Led audit team of 6 for $8.2B insurance company; identified $12M material misstatement',
        'Ranked in top 10% of senior associate cohort; promoted early to Senior Associate in year 2',
        'Trained and supervised 4 first-year associates across 2 concurrent engagement teams',
      ]},
      { company: 'Bank of America Merrill Lynch', title: 'Financial Analyst', location: 'New York, NY', startDate: 'Jul 2013', endDate: 'Aug 2014', current: false, bullets: [
        'Supported equity research coverage of 14 US regional banking institutions',
        'Built earnings models for quarterly estimates; average forecast error of 2.1%',
      ]},
    ],
    skills: [
      { category: 'Finance', skills: 'DCF, LBO, M&A Due Diligence, Portfolio Management, Equity Research' },
      { category: 'Tools', skills: 'Bloomberg Terminal, Capital IQ, FactSet, Excel (Advanced), Power BI' },
      { category: 'Domains', skills: 'Financial Services, Insurance, Asset Management, Banking' },
    ],
    certifications: [
      { name: 'CFA Charterholder', issuer: 'CFA Institute', date: '2018' },
      { name: 'Certified Public Accountant (CPA)', issuer: 'AICPA — Massachusetts', date: '2016' },
      { name: 'Series 7 & 66 Licensed', issuer: 'FINRA', date: '2014' },
    ],
    languages: [],
  },

  'creative': {
    workExperience: [
      { company: 'Wieden+Kennedy', title: 'Executive Creative Director', location: 'Los Angeles, CA', startDate: 'Mar 2021', endDate: 'Present', current: true, bullets: [
        'Led Nike "Never Done" global campaign across 40 markets; 2.4B impressions, D&AD Yellow Pencil 2023',
        'Directed Spotify Wrapped visual identity for 2022 & 2023; reached 456M users in 184 markets',
        'Built creative team of 28 across art direction, copy, motion and experience design from 12 people',
        'Won One Show Gold (2022) and Cannes Lions Silver (2021) for Old Spice and KFC campaigns',
        'Developed creative standards playbook adopted by 3 agency network offices globally',
        'Mentored 6 junior creatives; 2 promoted to Senior ACD within 2 years',
      ]},
      { company: 'Pentagram', title: 'Creative Director', location: 'New York, NY', startDate: 'Jan 2017', endDate: 'Feb 2021', current: false, bullets: [
        'Rebranded 4 Fortune 500 companies including Warner Music Group; featured in Wallpaper* and Eye Magazine',
        'Developed visual identity systems for 3 cultural institutions including MoMA PS1',
        'Led brand identity for 2 tech unicorn IPOs, designing investor materials used in $2B+ roadshows',
        'Managed 3 senior designers and 4 designers in fast-paced multi-client studio environment',
      ]},
      { company: 'IDEO', title: 'Senior Designer', location: 'San Francisco, CA', startDate: 'Aug 2014', endDate: 'Dec 2016', current: false, bullets: [
        'Designed brand and product experiences for Apple, Airbnb and Patagonia',
        'Created motion design system for Google Material Design 2.0 adopted across Android ecosystem',
      ]},
    ],
    skills: [
      { category: 'Creative', skills: 'Brand Identity, Art Direction, Motion Design, Typography, 3D / Blender' },
      { category: 'Tools', skills: 'Adobe Creative Suite, Figma, Cinema 4D, After Effects, DaVinci Resolve' },
      { category: 'Strategy', skills: 'Brand Strategy, Campaign Planning, Pitch Deck, Narrative Design' },
    ],
    certifications: [],
    languages: [],
  },
};

async function main() {
  for (const [templateId, updates] of Object.entries(UPDATES)) {
    const resumeId = RESUME_IDS[templateId];
    if (!resumeId) { console.error(`No ID for ${templateId}`); continue; }

    // Get current resume data
    const { data: resume, error: fetchErr } = await supabase
      .from('resumes')
      .select('resume_data')
      .eq('id', resumeId)
      .single();

    if (fetchErr || !resume) { console.error(`Failed to fetch ${templateId}:`, fetchErr?.message); continue; }

    // Merge updates
    const updatedData = {
      ...resume.resume_data,
      ...updates,
    };

    const { error: updateErr } = await supabase
      .from('resumes')
      .update({ resume_data: updatedData })
      .eq('id', resumeId);

    if (updateErr) {
      console.error(`❌ Failed to update ${templateId}:`, updateErr.message);
    } else {
      console.log(`✅ Updated ${templateId} (${resumeId})`);
    }
  }
  console.log('\n🎉 All done!');
}

main().catch(console.error);
