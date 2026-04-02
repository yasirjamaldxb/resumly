// Comprehensive role database with associated skills, tools, and keywords
// Used for: role selector dropdown, skill suggestions, AI context enrichment

export interface RoleDefinition {
  title: string;
  category: string;
  skills: string[];       // Core competencies
  tools: string[];        // Software/platforms commonly used
  keywords: string[];     // ATS keywords hiring managers search for
  certifications?: string[]; // Relevant certs
}

export const ROLE_CATEGORIES = [
  'Software Engineering',
  'Data & Analytics',
  'Design & UX',
  'Product & Project Management',
  'Marketing & Content',
  'Sales & Business Development',
  'Finance & Accounting',
  'Human Resources',
  'Operations & Supply Chain',
  'Healthcare & Medical',
  'Education & Training',
  'Legal & Compliance',
  'Customer Service & Support',
  'Engineering & Manufacturing',
  'Media & Communications',
  'Administrative & Executive',
  'Consulting & Strategy',
  'Cybersecurity & IT',
  'Real Estate & Construction',
  'Research & Science',
] as const;

export const ROLES: RoleDefinition[] = [
  // ─── Software Engineering ───────────────────────────────
  {
    title: 'Software Engineer',
    category: 'Software Engineering',
    skills: ['Full-Stack Development', 'System Design', 'API Development', 'Code Review', 'Agile Methodologies', 'Testing & QA', 'CI/CD', 'Microservices', 'Database Design', 'Performance Optimization'],
    tools: ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Git', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'Kubernetes'],
    keywords: ['software development', 'scalable systems', 'clean code', 'object-oriented programming', 'REST APIs', 'cloud infrastructure'],
  },
  {
    title: 'Frontend Developer',
    category: 'Software Engineering',
    skills: ['Responsive Design', 'Component Architecture', 'State Management', 'Performance Optimization', 'Accessibility (WCAG)', 'Cross-Browser Compatibility', 'UI Animation', 'SEO'],
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Angular', 'Figma', 'Webpack', 'Vite', 'Jest', 'Storybook', 'Chrome DevTools'],
    keywords: ['frontend development', 'user interface', 'single-page application', 'progressive web app', 'web performance'],
  },
  {
    title: 'Backend Developer',
    category: 'Software Engineering',
    skills: ['API Design', 'Database Architecture', 'Authentication & Authorization', 'Caching Strategies', 'Message Queues', 'Microservices', 'Data Modeling', 'Security Best Practices'],
    tools: ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'RabbitMQ', 'Kafka', 'GraphQL'],
    keywords: ['backend development', 'server-side', 'distributed systems', 'database optimization', 'API architecture'],
  },
  {
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    skills: ['Frontend Development', 'Backend Development', 'Database Design', 'API Integration', 'DevOps', 'System Architecture', 'Agile Development', 'Testing'],
    tools: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'Next.js', 'Express', 'Prisma'],
    keywords: ['full-stack', 'end-to-end development', 'web application', 'scalable architecture'],
  },
  {
    title: 'Mobile Developer',
    category: 'Software Engineering',
    skills: ['Native App Development', 'Cross-Platform Development', 'UI/UX Mobile Patterns', 'App Store Optimization', 'Push Notifications', 'Offline Storage', 'Performance Tuning'],
    tools: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Xcode', 'Android Studio', 'Firebase', 'Expo', 'TestFlight', 'Fastlane'],
    keywords: ['mobile development', 'iOS', 'Android', 'mobile-first', 'app development'],
  },
  {
    title: 'DevOps Engineer',
    category: 'Software Engineering',
    skills: ['CI/CD Pipelines', 'Infrastructure as Code', 'Container Orchestration', 'Monitoring & Alerting', 'Cloud Architecture', 'Security Hardening', 'Incident Response', 'Cost Optimization'],
    tools: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'Azure', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana', 'Ansible', 'Datadog'],
    keywords: ['DevOps', 'site reliability', 'infrastructure automation', 'deployment pipeline', 'cloud-native'],
    certifications: ['AWS Solutions Architect', 'CKA (Certified Kubernetes Administrator)', 'Azure DevOps Engineer'],
  },
  {
    title: 'QA Engineer',
    category: 'Software Engineering',
    skills: ['Test Automation', 'Manual Testing', 'Test Planning', 'Bug Tracking', 'Performance Testing', 'Security Testing', 'API Testing', 'Regression Testing'],
    tools: ['Selenium', 'Cypress', 'Jest', 'Playwright', 'Postman', 'JMeter', 'JIRA', 'TestRail', 'BrowserStack', 'Appium'],
    keywords: ['quality assurance', 'test automation', 'software testing', 'test coverage', 'defect management'],
  },
  {
    title: 'Machine Learning Engineer',
    category: 'Software Engineering',
    skills: ['Model Training', 'Feature Engineering', 'MLOps', 'Deep Learning', 'NLP', 'Computer Vision', 'A/B Testing', 'Data Pipeline Design'],
    tools: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter', 'MLflow', 'Hugging Face', 'AWS SageMaker', 'Docker', 'Spark'],
    keywords: ['machine learning', 'artificial intelligence', 'model deployment', 'neural networks', 'predictive modeling'],
  },
  {
    title: 'Cloud Engineer',
    category: 'Software Engineering',
    skills: ['Cloud Architecture', 'Migration Planning', 'Cost Optimization', 'Serverless Computing', 'Networking', 'Security & Compliance', 'Disaster Recovery'],
    tools: ['AWS', 'GCP', 'Azure', 'Terraform', 'CloudFormation', 'Lambda', 'S3', 'EC2', 'CloudFront', 'IAM'],
    keywords: ['cloud computing', 'cloud migration', 'multi-cloud', 'serverless', 'cloud security'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional', 'Azure Solutions Architect'],
  },
  {
    title: 'Embedded Systems Engineer',
    category: 'Software Engineering',
    skills: ['Firmware Development', 'RTOS', 'Hardware-Software Integration', 'Low-Level Programming', 'Debugging', 'Protocol Design', 'Power Optimization'],
    tools: ['C', 'C++', 'Assembly', 'JTAG', 'Oscilloscope', 'FreeRTOS', 'ARM', 'Arduino', 'Raspberry Pi', 'MATLAB'],
    keywords: ['embedded systems', 'firmware', 'IoT', 'real-time systems', 'microcontroller'],
  },
  {
    title: 'Blockchain Developer',
    category: 'Software Engineering',
    skills: ['Smart Contract Development', 'DeFi Protocols', 'Cryptography', 'Consensus Mechanisms', 'Token Standards', 'Web3 Integration', 'Security Auditing'],
    tools: ['Solidity', 'Ethereum', 'Hardhat', 'Web3.js', 'Ethers.js', 'Rust', 'IPFS', 'MetaMask', 'Foundry', 'TheGraph'],
    keywords: ['blockchain', 'decentralized', 'smart contracts', 'Web3', 'DeFi'],
  },

  // ─── Data & Analytics ──────────────────────────────────
  {
    title: 'Data Scientist',
    category: 'Data & Analytics',
    skills: ['Statistical Analysis', 'Machine Learning', 'Data Visualization', 'Hypothesis Testing', 'Feature Engineering', 'A/B Testing', 'Predictive Modeling', 'Communication of Insights'],
    tools: ['Python', 'R', 'SQL', 'Jupyter', 'Pandas', 'Scikit-learn', 'Tableau', 'TensorFlow', 'Spark', 'BigQuery'],
    keywords: ['data science', 'machine learning', 'statistical modeling', 'data-driven insights', 'predictive analytics'],
  },
  {
    title: 'Data Analyst',
    category: 'Data & Analytics',
    skills: ['Data Analysis', 'Statistical Analysis', 'Data Visualization', 'Report Building', 'SQL Querying', 'Dashboard Creation', 'Trend Analysis', 'Stakeholder Communication'],
    tools: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Python', 'Google Analytics', 'Looker', 'BigQuery', 'dbt', 'Metabase'],
    keywords: ['data analysis', 'business intelligence', 'reporting', 'KPI tracking', 'data-driven decisions'],
  },
  {
    title: 'Data Engineer',
    category: 'Data & Analytics',
    skills: ['ETL Pipeline Design', 'Data Warehousing', 'Data Modeling', 'Stream Processing', 'Data Quality', 'Schema Design', 'Performance Tuning', 'Data Governance'],
    tools: ['Python', 'SQL', 'Apache Spark', 'Airflow', 'Kafka', 'Snowflake', 'BigQuery', 'dbt', 'AWS Glue', 'Redshift'],
    keywords: ['data engineering', 'data pipeline', 'ETL', 'data warehouse', 'big data'],
  },
  {
    title: 'Business Intelligence Analyst',
    category: 'Data & Analytics',
    skills: ['Dashboard Design', 'KPI Definition', 'Data Storytelling', 'Self-Service Analytics', 'Data Modeling', 'Report Automation', 'Stakeholder Management'],
    tools: ['Tableau', 'Power BI', 'Looker', 'SQL', 'Excel', 'Google Data Studio', 'Snowflake', 'dbt', 'Metabase'],
    keywords: ['business intelligence', 'BI', 'data visualization', 'analytics', 'executive reporting'],
  },
  {
    title: 'Database Administrator',
    category: 'Data & Analytics',
    skills: ['Database Design', 'Performance Tuning', 'Backup & Recovery', 'Security Management', 'High Availability', 'Migration Planning', 'Query Optimization'],
    tools: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'MongoDB', 'Redis', 'AWS RDS', 'pgAdmin', 'DataGrip'],
    keywords: ['database administration', 'DBA', 'data integrity', 'database performance', 'replication'],
  },

  // ─── Design & UX ───────────────────────────────────────
  {
    title: 'UX Designer',
    category: 'Design & UX',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Information Architecture', 'Interaction Design', 'Design Systems', 'Accessibility'],
    tools: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Miro', 'UserTesting', 'Hotjar', 'Maze', 'Optimal Workshop', 'Axure'],
    keywords: ['user experience', 'UX design', 'human-centered design', 'user research', 'usability'],
  },
  {
    title: 'UI Designer',
    category: 'Design & UX',
    skills: ['Visual Design', 'Typography', 'Color Theory', 'Icon Design', 'Design Systems', 'Responsive Design', 'Motion Design', 'Brand Consistency'],
    tools: ['Figma', 'Sketch', 'Adobe XD', 'Illustrator', 'Photoshop', 'Principle', 'Zeplin', 'Abstract', 'Storybook'],
    keywords: ['user interface', 'UI design', 'visual design', 'design systems', 'pixel-perfect'],
  },
  {
    title: 'Product Designer',
    category: 'Design & UX',
    skills: ['End-to-End Design', 'User Research', 'Prototyping', 'Design Thinking', 'Cross-Functional Collaboration', 'Design Systems', 'Data-Informed Design', 'Workshop Facilitation'],
    tools: ['Figma', 'Sketch', 'Framer', 'Miro', 'Notion', 'Amplitude', 'Mixpanel', 'Maze', 'Loom', 'FigJam'],
    keywords: ['product design', 'design thinking', 'user-centered', 'product strategy', 'design leadership'],
  },
  {
    title: 'Graphic Designer',
    category: 'Design & UX',
    skills: ['Brand Identity', 'Print Design', 'Layout Design', 'Typography', 'Illustration', 'Photo Editing', 'Packaging Design', 'Marketing Collateral'],
    tools: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Canva', 'Figma', 'After Effects', 'Lightroom', 'Procreate'],
    keywords: ['graphic design', 'visual communication', 'branding', 'creative design', 'print production'],
  },
  {
    title: 'Motion Designer',
    category: 'Design & UX',
    skills: ['Animation', 'Video Editing', 'Storyboarding', 'Visual Effects', '2D/3D Animation', 'Sound Design', 'Micro-Interactions'],
    tools: ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Blender', 'Lottie', 'Rive', 'DaVinci Resolve', 'Figma'],
    keywords: ['motion design', 'animation', 'video production', 'motion graphics', 'visual storytelling'],
  },
  {
    title: 'UX Researcher',
    category: 'Design & UX',
    skills: ['Qualitative Research', 'Quantitative Research', 'Survey Design', 'Interview Techniques', 'Competitive Analysis', 'Persona Development', 'Journey Mapping', 'Insight Synthesis'],
    tools: ['UserTesting', 'Dovetail', 'Optimal Workshop', 'Hotjar', 'SurveyMonkey', 'Lookback', 'Miro', 'Notion', 'Airtable'],
    keywords: ['UX research', 'user research', 'usability testing', 'research insights', 'user behavior'],
  },

  // ─── Product & Project Management ──────────────────────
  {
    title: 'Product Manager',
    category: 'Product & Project Management',
    skills: ['Product Strategy', 'Roadmap Planning', 'User Story Writing', 'Prioritization Frameworks', 'Stakeholder Management', 'Market Research', 'Data Analysis', 'Go-to-Market Strategy', 'A/B Testing'],
    tools: ['JIRA', 'Confluence', 'Notion', 'Figma', 'Amplitude', 'Mixpanel', 'Linear', 'ProductBoard', 'Miro', 'Slack'],
    keywords: ['product management', 'product strategy', 'product-led growth', 'OKRs', 'cross-functional leadership'],
  },
  {
    title: 'Project Manager',
    category: 'Product & Project Management',
    skills: ['Project Planning', 'Risk Management', 'Budget Management', 'Resource Allocation', 'Stakeholder Communication', 'Agile/Scrum', 'Waterfall', 'Timeline Management', 'Vendor Management'],
    tools: ['JIRA', 'Asana', 'Monday.com', 'MS Project', 'Trello', 'Confluence', 'Smartsheet', 'Gantt Charts', 'Slack'],
    keywords: ['project management', 'PMP', 'project delivery', 'scope management', 'milestone tracking'],
    certifications: ['PMP', 'PRINCE2', 'Certified Scrum Master (CSM)', 'PMI-ACP'],
  },
  {
    title: 'Scrum Master',
    category: 'Product & Project Management',
    skills: ['Agile Coaching', 'Sprint Planning', 'Retrospectives', 'Impediment Removal', 'Team Facilitation', 'Continuous Improvement', 'Kanban', 'Servant Leadership'],
    tools: ['JIRA', 'Confluence', 'Miro', 'Trello', 'Linear', 'Retrium', 'Slack', 'Zoom'],
    keywords: ['Scrum', 'Agile', 'sprint planning', 'velocity tracking', 'team coaching'],
    certifications: ['CSM', 'PSM', 'SAFe Scrum Master', 'A-CSM'],
  },
  {
    title: 'Technical Program Manager',
    category: 'Product & Project Management',
    skills: ['Program Management', 'Cross-Team Coordination', 'Technical Architecture Understanding', 'Release Management', 'Risk Assessment', 'Executive Communication', 'Process Improvement'],
    tools: ['JIRA', 'Confluence', 'Google Sheets', 'Asana', 'Smartsheet', 'Datadog', 'PagerDuty', 'Slack'],
    keywords: ['technical program management', 'TPM', 'release coordination', 'cross-functional programs', 'technical leadership'],
  },
  {
    title: 'Business Analyst',
    category: 'Product & Project Management',
    skills: ['Requirements Gathering', 'Process Mapping', 'Gap Analysis', 'Stakeholder Interviews', 'Use Case Modeling', 'Data Analysis', 'Change Management', 'UAT Coordination'],
    tools: ['JIRA', 'Confluence', 'Visio', 'Lucidchart', 'Excel', 'SQL', 'Power BI', 'Balsamiq', 'Miro'],
    keywords: ['business analysis', 'requirements documentation', 'process improvement', 'business requirements', 'functional specification'],
  },

  // ─── Marketing & Content ───────────────────────────────
  {
    title: 'Marketing Manager',
    category: 'Marketing & Content',
    skills: ['Campaign Strategy', 'Brand Management', 'Digital Marketing', 'Content Strategy', 'Marketing Analytics', 'Budget Management', 'Team Leadership', 'Market Research'],
    tools: ['HubSpot', 'Google Analytics', 'Mailchimp', 'Hootsuite', 'SEMrush', 'Canva', 'Salesforce', 'Meta Ads Manager', 'Google Ads'],
    keywords: ['marketing strategy', 'brand awareness', 'lead generation', 'marketing campaigns', 'ROI optimization'],
  },
  {
    title: 'Digital Marketing Specialist',
    category: 'Marketing & Content',
    skills: ['SEO', 'SEM', 'Social Media Marketing', 'Email Marketing', 'Content Marketing', 'PPC Campaigns', 'Conversion Optimization', 'Marketing Automation'],
    tools: ['Google Analytics', 'Google Ads', 'Meta Ads', 'SEMrush', 'Ahrefs', 'Mailchimp', 'HubSpot', 'Hootsuite', 'Canva', 'UTM Builder'],
    keywords: ['digital marketing', 'SEO', 'PPC', 'social media', 'conversion rate', 'ROAS'],
  },
  {
    title: 'Content Writer',
    category: 'Marketing & Content',
    skills: ['Copywriting', 'SEO Writing', 'Content Strategy', 'Editing & Proofreading', 'Research', 'Brand Voice', 'Storytelling', 'Blog Writing'],
    tools: ['WordPress', 'Google Docs', 'Grammarly', 'Hemingway', 'Ahrefs', 'SEMrush', 'Canva', 'Notion', 'Surfer SEO'],
    keywords: ['content writing', 'copywriting', 'content strategy', 'editorial', 'SEO content'],
  },
  {
    title: 'Social Media Manager',
    category: 'Marketing & Content',
    skills: ['Social Strategy', 'Community Management', 'Content Creation', 'Influencer Partnerships', 'Paid Social', 'Analytics & Reporting', 'Crisis Management', 'Trend Analysis'],
    tools: ['Hootsuite', 'Buffer', 'Sprout Social', 'Canva', 'Meta Business Suite', 'TikTok Ads', 'Later', 'Brandwatch'],
    keywords: ['social media management', 'community engagement', 'content calendar', 'social analytics', 'influencer marketing'],
  },
  {
    title: 'SEO Specialist',
    category: 'Marketing & Content',
    skills: ['Technical SEO', 'On-Page Optimization', 'Link Building', 'Keyword Research', 'Content Strategy', 'Local SEO', 'Site Audits', 'Competitor Analysis'],
    tools: ['Ahrefs', 'SEMrush', 'Google Search Console', 'Screaming Frog', 'Moz', 'Surfer SEO', 'Google Analytics', 'Schema Markup'],
    keywords: ['search engine optimization', 'organic traffic', 'keyword ranking', 'technical SEO', 'link building'],
  },
  {
    title: 'Growth Marketing Manager',
    category: 'Marketing & Content',
    skills: ['Growth Strategy', 'Funnel Optimization', 'A/B Testing', 'User Acquisition', 'Retention Marketing', 'Product-Led Growth', 'Attribution Modeling', 'Experimentation'],
    tools: ['Amplitude', 'Mixpanel', 'Optimizely', 'Google Analytics', 'HubSpot', 'Braze', 'Segment', 'Looker'],
    keywords: ['growth marketing', 'growth hacking', 'user acquisition', 'funnel optimization', 'retention'],
  },

  // ─── Sales & Business Development ──────────────────────
  {
    title: 'Sales Manager',
    category: 'Sales & Business Development',
    skills: ['Sales Strategy', 'Team Leadership', 'Pipeline Management', 'Forecasting', 'Client Relationship Management', 'Negotiation', 'Revenue Growth', 'Coaching & Mentoring'],
    tools: ['Salesforce', 'HubSpot CRM', 'LinkedIn Sales Navigator', 'Gong', 'Outreach', 'Zoom', 'Slack', 'Excel'],
    keywords: ['sales management', 'revenue growth', 'quota attainment', 'sales pipeline', 'team leadership'],
  },
  {
    title: 'Account Executive',
    category: 'Sales & Business Development',
    skills: ['Consultative Selling', 'Pipeline Generation', 'Discovery Calls', 'Demo Presentations', 'Contract Negotiation', 'Closing', 'Account Planning', 'Cold Outreach'],
    tools: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator', 'Gong', 'Outreach', 'ZoomInfo', 'Calendly', 'DocuSign'],
    keywords: ['account executive', 'B2B sales', 'enterprise sales', 'deal closing', 'SaaS sales'],
  },
  {
    title: 'Business Development Representative',
    category: 'Sales & Business Development',
    skills: ['Prospecting', 'Cold Calling', 'Email Outreach', 'Lead Qualification', 'CRM Management', 'Objection Handling', 'Meeting Scheduling', 'Market Research'],
    tools: ['Salesforce', 'Outreach', 'LinkedIn Sales Navigator', 'ZoomInfo', 'Apollo', 'HubSpot', 'Lusha', 'Calendly'],
    keywords: ['business development', 'lead generation', 'prospecting', 'outbound sales', 'SDR/BDR'],
  },
  {
    title: 'Customer Success Manager',
    category: 'Sales & Business Development',
    skills: ['Onboarding', 'Retention Strategy', 'Upselling', 'Health Scoring', 'Quarterly Business Reviews', 'Churn Prevention', 'Relationship Building', 'Product Adoption'],
    tools: ['Gainsight', 'ChurnZero', 'Salesforce', 'Zendesk', 'Intercom', 'Loom', 'Notion', 'Slack'],
    keywords: ['customer success', 'NRR', 'churn reduction', 'customer retention', 'expansion revenue'],
  },

  // ─── Finance & Accounting ─────────────────────────────
  {
    title: 'Accountant',
    category: 'Finance & Accounting',
    skills: ['Financial Reporting', 'General Ledger', 'Tax Preparation', 'Reconciliation', 'GAAP/IFRS Compliance', 'Budgeting', 'Audit Preparation', 'Month-End Close'],
    tools: ['QuickBooks', 'SAP', 'Oracle', 'Excel', 'NetSuite', 'Xero', 'Sage', 'BlackLine', 'Workday'],
    keywords: ['accounting', 'financial statements', 'tax compliance', 'audit', 'accounts payable/receivable'],
    certifications: ['CPA', 'CMA', 'ACCA'],
  },
  {
    title: 'Financial Analyst',
    category: 'Finance & Accounting',
    skills: ['Financial Modeling', 'Forecasting', 'Variance Analysis', 'Valuation', 'P&L Management', 'Investment Analysis', 'Scenario Planning', 'Presentation to Executives'],
    tools: ['Excel', 'Bloomberg', 'Power BI', 'Tableau', 'SAP', 'Oracle', 'Python', 'SQL', 'Capital IQ'],
    keywords: ['financial analysis', 'financial modeling', 'FP&A', 'budget management', 'revenue forecasting'],
    certifications: ['CFA', 'CPA', 'FRM'],
  },
  {
    title: 'Controller',
    category: 'Finance & Accounting',
    skills: ['Financial Controls', 'SOX Compliance', 'Team Management', 'Financial Reporting', 'ERP Management', 'Audit Management', 'Revenue Recognition', 'Process Improvement'],
    tools: ['NetSuite', 'SAP', 'Oracle', 'Workday', 'BlackLine', 'FloQast', 'Excel', 'Adaptive Planning'],
    keywords: ['controller', 'internal controls', 'financial compliance', 'month-end close', 'financial leadership'],
  },

  // ─── Human Resources ──────────────────────────────────
  {
    title: 'HR Manager',
    category: 'Human Resources',
    skills: ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'Compensation & Benefits', 'HR Policy Development', 'Training & Development', 'Compliance', 'Diversity & Inclusion'],
    tools: ['Workday', 'BambooHR', 'ADP', 'Greenhouse', 'Lever', 'LinkedIn Recruiter', 'Lattice', 'Culture Amp', 'Slack'],
    keywords: ['human resources', 'HR management', 'talent management', 'employee engagement', 'organizational development'],
    certifications: ['SHRM-CP', 'SHRM-SCP', 'PHR', 'SPHR'],
  },
  {
    title: 'Recruiter',
    category: 'Human Resources',
    skills: ['Sourcing', 'Screening', 'Interviewing', 'Candidate Experience', 'Pipeline Management', 'Employer Branding', 'Offer Negotiation', 'Diversity Recruiting'],
    tools: ['LinkedIn Recruiter', 'Greenhouse', 'Lever', 'Workday', 'ATS', 'Gem', 'Calendly', 'HireEZ', 'SeekOut'],
    keywords: ['recruiting', 'talent acquisition', 'sourcing', 'candidate pipeline', 'hiring'],
  },
  {
    title: 'Learning & Development Specialist',
    category: 'Human Resources',
    skills: ['Training Design', 'E-Learning Development', 'Needs Assessment', 'Facilitation', 'Performance Consulting', 'Mentorship Programs', 'ROI Measurement'],
    tools: ['Articulate 360', 'LMS', 'Cornerstone', 'Zoom', 'Miro', 'Canva', 'Google Workspace', 'Notion'],
    keywords: ['learning and development', 'L&D', 'training', 'professional development', 'upskilling'],
  },

  // ─── Operations & Supply Chain ────────────────────────
  {
    title: 'Operations Manager',
    category: 'Operations & Supply Chain',
    skills: ['Process Optimization', 'Team Management', 'KPI Tracking', 'Vendor Management', 'Budget Oversight', 'Quality Assurance', 'Lean/Six Sigma', 'Strategic Planning'],
    tools: ['SAP', 'Oracle', 'Monday.com', 'Asana', 'Excel', 'Tableau', 'Slack', 'Zendesk', 'Power BI'],
    keywords: ['operations management', 'process improvement', 'operational efficiency', 'team leadership', 'cost reduction'],
    certifications: ['Six Sigma Green/Black Belt', 'PMP', 'Lean Certification'],
  },
  {
    title: 'Supply Chain Manager',
    category: 'Operations & Supply Chain',
    skills: ['Supply Chain Optimization', 'Logistics Management', 'Procurement', 'Inventory Control', 'Demand Planning', 'Supplier Relationship Management', 'Risk Management'],
    tools: ['SAP', 'Oracle SCM', 'Blue Yonder', 'Manhattan Associates', 'Excel', 'Tableau', 'Kinaxis', 'Coupa'],
    keywords: ['supply chain', 'logistics', 'procurement', 'inventory management', 'demand forecasting'],
    certifications: ['CSCP', 'CPIM', 'CPSM'],
  },

  // ─── Healthcare & Medical ─────────────────────────────
  {
    title: 'Registered Nurse',
    category: 'Healthcare & Medical',
    skills: ['Patient Assessment', 'Medication Administration', 'Care Planning', 'IV Therapy', 'Electronic Health Records', 'Patient Education', 'Wound Care', 'Team Collaboration'],
    tools: ['Epic', 'Cerner', 'Meditech', 'CPOE Systems', 'Pyxis', 'Omnicell', 'Vital Sign Monitors'],
    keywords: ['nursing', 'patient care', 'clinical assessment', 'healthcare', 'bedside manner'],
    certifications: ['RN License', 'BLS', 'ACLS', 'PALS', 'CCRN'],
  },
  {
    title: 'Physician',
    category: 'Healthcare & Medical',
    skills: ['Diagnosis', 'Treatment Planning', 'Patient Communication', 'Medical Decision-Making', 'Clinical Research', 'Team Leadership', 'Electronic Health Records'],
    tools: ['Epic', 'Cerner', 'UpToDate', 'DynaMed', 'PACS', 'EHR Systems'],
    keywords: ['physician', 'medical practice', 'clinical care', 'patient outcomes', 'evidence-based medicine'],
    certifications: ['Board Certification', 'Medical License', 'DEA Registration'],
  },
  {
    title: 'Medical Technologist',
    category: 'Healthcare & Medical',
    skills: ['Laboratory Testing', 'Quality Control', 'Specimen Analysis', 'Equipment Maintenance', 'Result Interpretation', 'Regulatory Compliance', 'Blood Banking'],
    tools: ['Laboratory Information Systems', 'Microscopy', 'Automated Analyzers', 'Flow Cytometry', 'PCR Equipment'],
    keywords: ['medical technology', 'clinical laboratory', 'diagnostics', 'lab testing', 'quality control'],
    certifications: ['MLS(ASCP)', 'MT(AMT)', 'CLIA'],
  },
  {
    title: 'Pharmacist',
    category: 'Healthcare & Medical',
    skills: ['Medication Management', 'Drug Interaction Assessment', 'Patient Counseling', 'Prescription Verification', 'Compounding', 'Inventory Management', 'Regulatory Compliance'],
    tools: ['Pharmacy Management Systems', 'Epic', 'Cerner', 'DrFirst', 'Pyxis', 'Omnicell'],
    keywords: ['pharmacy', 'medication therapy', 'drug safety', 'clinical pharmacy', 'patient counseling'],
    certifications: ['PharmD', 'BCPS', 'State Pharmacy License'],
  },

  // ─── Education & Training ─────────────────────────────
  {
    title: 'Teacher',
    category: 'Education & Training',
    skills: ['Lesson Planning', 'Classroom Management', 'Differentiated Instruction', 'Assessment Design', 'Parent Communication', 'Curriculum Development', 'Student Engagement', 'Special Education'],
    tools: ['Google Classroom', 'Canvas', 'Blackboard', 'Zoom', 'Kahoot', 'Nearpod', 'Seesaw', 'PowerPoint', 'Smart Board'],
    keywords: ['teaching', 'education', 'student achievement', 'curriculum', 'instruction'],
    certifications: ['State Teaching License', 'TESOL', 'National Board Certification'],
  },
  {
    title: 'Instructional Designer',
    category: 'Education & Training',
    skills: ['Curriculum Design', 'E-Learning Development', 'Needs Analysis', 'Assessment Creation', 'Learning Theory', 'Storyboarding', 'Multimedia Production', 'LMS Administration'],
    tools: ['Articulate Storyline', 'Rise 360', 'Adobe Captivate', 'Camtasia', 'Canvas', 'Moodle', 'Canva', 'H5P'],
    keywords: ['instructional design', 'e-learning', 'curriculum development', 'learning experience', 'ADDIE model'],
  },
  {
    title: 'Professor',
    category: 'Education & Training',
    skills: ['Research', 'Lecturing', 'Grant Writing', 'Student Mentoring', 'Peer Review', 'Publication', 'Committee Service', 'Curriculum Design'],
    tools: ['LaTeX', 'SPSS', 'R', 'Python', 'Blackboard', 'Canvas', 'Zoom', 'Mendeley', 'Google Scholar'],
    keywords: ['academia', 'research', 'higher education', 'publication', 'teaching excellence'],
  },

  // ─── Legal & Compliance ───────────────────────────────
  {
    title: 'Lawyer',
    category: 'Legal & Compliance',
    skills: ['Legal Research', 'Contract Drafting', 'Litigation', 'Client Counseling', 'Negotiation', 'Regulatory Compliance', 'Due Diligence', 'Legal Writing'],
    tools: ['Westlaw', 'LexisNexis', 'Clio', 'DocuSign', 'Bloomberg Law', 'Microsoft Office', 'NetDocuments'],
    keywords: ['legal practice', 'litigation', 'corporate law', 'contract law', 'legal counsel'],
    certifications: ['Bar Admission', 'JD'],
  },
  {
    title: 'Compliance Officer',
    category: 'Legal & Compliance',
    skills: ['Regulatory Compliance', 'Risk Assessment', 'Policy Development', 'Internal Auditing', 'Training Delivery', 'Reporting', 'AML/KYC', 'Data Privacy'],
    tools: ['SAP GRC', 'LogicGate', 'NAVEX', 'OneTrust', 'Excel', 'SharePoint', 'Archer'],
    keywords: ['compliance', 'regulatory', 'risk management', 'audit', 'governance'],
    certifications: ['CCEP', 'CRCM', 'CAMS'],
  },
  {
    title: 'Paralegal',
    category: 'Legal & Compliance',
    skills: ['Legal Research', 'Document Preparation', 'Case Management', 'Filing', 'Client Communication', 'Discovery', 'Contract Review', 'Scheduling'],
    tools: ['Westlaw', 'LexisNexis', 'Clio', 'PracticePanther', 'Microsoft Office', 'NetDocuments', 'e-Filing Systems'],
    keywords: ['paralegal', 'legal support', 'case management', 'legal documentation', 'litigation support'],
    certifications: ['Certified Paralegal (CP)', 'ABA Approved'],
  },

  // ─── Customer Service & Support ───────────────────────
  {
    title: 'Customer Service Representative',
    category: 'Customer Service & Support',
    skills: ['Communication', 'Problem-Solving', 'Conflict Resolution', 'Product Knowledge', 'Multi-Channel Support', 'CRM Management', 'First-Contact Resolution', 'Empathy'],
    tools: ['Zendesk', 'Freshdesk', 'Intercom', 'Salesforce Service Cloud', 'LiveChat', 'Slack', 'JIRA', 'Confluence'],
    keywords: ['customer service', 'customer support', 'customer satisfaction', 'CSAT', 'help desk'],
  },
  {
    title: 'Technical Support Engineer',
    category: 'Customer Service & Support',
    skills: ['Troubleshooting', 'Technical Documentation', 'Escalation Management', 'Root Cause Analysis', 'API Support', 'Customer Communication', 'Knowledge Base Management'],
    tools: ['Zendesk', 'JIRA', 'Confluence', 'Postman', 'Datadog', 'PagerDuty', 'Slack', 'Terminal/CLI'],
    keywords: ['technical support', 'troubleshooting', 'customer engineering', 'support engineering', 'issue resolution'],
  },

  // ─── Engineering & Manufacturing ──────────────────────
  {
    title: 'Mechanical Engineer',
    category: 'Engineering & Manufacturing',
    skills: ['CAD Design', 'FEA Analysis', 'Prototyping', 'GD&T', 'Material Selection', 'Manufacturing Processes', 'Product Testing', 'Project Management'],
    tools: ['SolidWorks', 'AutoCAD', 'CATIA', 'ANSYS', 'MATLAB', 'Creo', '3D Printing', 'CNC Programming'],
    keywords: ['mechanical engineering', 'product design', 'manufacturing', 'CAD', 'engineering analysis'],
    certifications: ['PE License', 'Six Sigma', 'FE Exam'],
  },
  {
    title: 'Civil Engineer',
    category: 'Engineering & Manufacturing',
    skills: ['Structural Design', 'Site Planning', 'Surveying', 'Environmental Compliance', 'Cost Estimation', 'Project Management', 'Building Codes', 'Geotechnical Analysis'],
    tools: ['AutoCAD', 'Civil 3D', 'Revit', 'STAAD Pro', 'SAP2000', 'GIS', 'Primavera', 'Bluebeam'],
    keywords: ['civil engineering', 'structural design', 'construction', 'infrastructure', 'site development'],
    certifications: ['PE License', 'FE Exam', 'LEED'],
  },
  {
    title: 'Electrical Engineer',
    category: 'Engineering & Manufacturing',
    skills: ['Circuit Design', 'PCB Layout', 'Power Systems', 'Signal Processing', 'Control Systems', 'Embedded Systems', 'Testing & Validation', 'Technical Documentation'],
    tools: ['MATLAB', 'Simulink', 'Altium', 'Eagle', 'LTSpice', 'LabVIEW', 'AutoCAD Electrical', 'Oscilloscope'],
    keywords: ['electrical engineering', 'circuit design', 'power systems', 'electronics', 'embedded'],
    certifications: ['PE License', 'FE Exam'],
  },
  {
    title: 'Industrial Engineer',
    category: 'Engineering & Manufacturing',
    skills: ['Process Optimization', 'Lean Manufacturing', 'Quality Control', 'Ergonomics', 'Capacity Planning', 'Time Studies', 'Statistical Process Control', 'Cost Reduction'],
    tools: ['Minitab', 'AutoCAD', 'SAP', 'Arena Simulation', 'Excel', 'Visio', 'Power BI', 'Six Sigma Tools'],
    keywords: ['industrial engineering', 'process improvement', 'lean manufacturing', 'operations research', 'efficiency'],
    certifications: ['Six Sigma', 'PE License', 'Lean Certification'],
  },

  // ─── Media & Communications ───────────────────────────
  {
    title: 'Public Relations Specialist',
    category: 'Media & Communications',
    skills: ['Media Relations', 'Press Release Writing', 'Crisis Communication', 'Event Planning', 'Brand Management', 'Social Media', 'Stakeholder Engagement', 'Storytelling'],
    tools: ['Cision', 'Meltwater', 'Muck Rack', 'Canva', 'Hootsuite', 'Mailchimp', 'Google Analytics', 'WordPress'],
    keywords: ['public relations', 'media outreach', 'brand reputation', 'press coverage', 'communications strategy'],
  },
  {
    title: 'Journalist',
    category: 'Media & Communications',
    skills: ['Investigative Reporting', 'Interviewing', 'Fact-Checking', 'Deadline Management', 'Multimedia Storytelling', 'Source Development', 'Editing', 'AP Style'],
    tools: ['WordPress', 'CMS', 'Audio Recording', 'Video Editing', 'Google Docs', 'Social Media', 'Wire Services'],
    keywords: ['journalism', 'reporting', 'editorial', 'news writing', 'media'],
  },
  {
    title: 'Video Producer',
    category: 'Media & Communications',
    skills: ['Video Production', 'Directing', 'Scriptwriting', 'Post-Production', 'Color Grading', 'Sound Design', 'Budget Management', 'Team Coordination'],
    tools: ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects', 'Cinema Cameras', 'Lighting Kits', 'Drones'],
    keywords: ['video production', 'content creation', 'post-production', 'cinematography', 'multimedia'],
  },

  // ─── Administrative & Executive ───────────────────────
  {
    title: 'Executive Assistant',
    category: 'Administrative & Executive',
    skills: ['Calendar Management', 'Travel Coordination', 'Meeting Preparation', 'Confidentiality', 'Communication', 'Project Coordination', 'Expense Management', 'Gatekeeping'],
    tools: ['Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Concur', 'Asana', 'Notion', 'Calendly'],
    keywords: ['executive assistant', 'administrative support', 'C-suite', 'executive operations', 'office management'],
  },
  {
    title: 'Office Manager',
    category: 'Administrative & Executive',
    skills: ['Office Operations', 'Vendor Management', 'Budget Management', 'Event Planning', 'Facilities Management', 'HR Coordination', 'Inventory Management', 'Communication'],
    tools: ['Microsoft Office', 'Google Workspace', 'QuickBooks', 'Slack', 'Asana', 'Envoy', 'FedEx/UPS'],
    keywords: ['office management', 'administrative operations', 'facilities', 'office coordination', 'vendor management'],
  },
  {
    title: 'Chief Executive Officer',
    category: 'Administrative & Executive',
    skills: ['Strategic Leadership', 'Board Relations', 'Fundraising', 'P&L Management', 'Organizational Design', 'Executive Hiring', 'Vision Setting', 'Stakeholder Management'],
    tools: ['Excel', 'PowerPoint', 'Slack', 'Notion', 'Board Portal', 'Financial Models', 'CRM'],
    keywords: ['CEO', 'executive leadership', 'business strategy', 'organizational growth', 'corporate governance'],
  },
  {
    title: 'Chief Technology Officer',
    category: 'Administrative & Executive',
    skills: ['Technology Strategy', 'Team Building', 'Architecture Decisions', 'Vendor Evaluation', 'Budget Planning', 'Innovation', 'Security Oversight', 'Stakeholder Communication'],
    tools: ['Cloud Platforms', 'CI/CD', 'Monitoring Tools', 'Collaboration Tools', 'Architecture Diagrams'],
    keywords: ['CTO', 'technology leadership', 'engineering management', 'digital transformation', 'tech strategy'],
  },
  {
    title: 'Chief Financial Officer',
    category: 'Administrative & Executive',
    skills: ['Financial Strategy', 'Fundraising', 'M&A', 'Risk Management', 'Investor Relations', 'Financial Reporting', 'Treasury', 'Tax Planning'],
    tools: ['Excel', 'NetSuite', 'SAP', 'Bloomberg', 'Board Portal', 'Financial Models', 'Power BI'],
    keywords: ['CFO', 'financial leadership', 'corporate finance', 'capital allocation', 'financial strategy'],
    certifications: ['CPA', 'CFA', 'MBA'],
  },

  // ─── Consulting & Strategy ────────────────────────────
  {
    title: 'Management Consultant',
    category: 'Consulting & Strategy',
    skills: ['Strategic Analysis', 'Problem-Solving', 'Client Management', 'Framework Application', 'Data Analysis', 'Presentation Design', 'Workshop Facilitation', 'Change Management'],
    tools: ['PowerPoint', 'Excel', 'Tableau', 'Miro', 'Notion', 'JIRA', 'Google Workspace', 'Think-Cell'],
    keywords: ['management consulting', 'strategy consulting', 'business transformation', 'operational improvement', 'client advisory'],
  },
  {
    title: 'Strategy Analyst',
    category: 'Consulting & Strategy',
    skills: ['Market Research', 'Competitive Analysis', 'Financial Modeling', 'Business Case Development', 'Data Synthesis', 'Executive Presentations', 'Scenario Planning'],
    tools: ['Excel', 'PowerPoint', 'Tableau', 'Bloomberg', 'Capital IQ', 'PitchBook', 'Google Workspace'],
    keywords: ['strategy', 'market analysis', 'competitive intelligence', 'business strategy', 'growth planning'],
  },

  // ─── Cybersecurity & IT ───────────────────────────────
  {
    title: 'Cybersecurity Analyst',
    category: 'Cybersecurity & IT',
    skills: ['Threat Detection', 'Incident Response', 'Vulnerability Assessment', 'SIEM Management', 'Network Security', 'Compliance', 'Penetration Testing', 'Security Monitoring'],
    tools: ['Splunk', 'CrowdStrike', 'Nessus', 'Wireshark', 'Metasploit', 'Burp Suite', 'OSINT Tools', 'Kali Linux', 'Snort'],
    keywords: ['cybersecurity', 'information security', 'threat analysis', 'incident response', 'security operations'],
    certifications: ['CISSP', 'CEH', 'CompTIA Security+', 'OSCP', 'CISM'],
  },
  {
    title: 'Systems Administrator',
    category: 'Cybersecurity & IT',
    skills: ['Server Management', 'Network Administration', 'Active Directory', 'Backup & Recovery', 'Patch Management', 'User Support', 'Automation', 'Documentation'],
    tools: ['Windows Server', 'Linux', 'VMware', 'Active Directory', 'PowerShell', 'Bash', 'Nagios', 'Ansible'],
    keywords: ['systems administration', 'IT infrastructure', 'server management', 'network administration', 'IT support'],
    certifications: ['CompTIA A+', 'CompTIA Network+', 'MCSA', 'RHCSA'],
  },
  {
    title: 'IT Support Specialist',
    category: 'Cybersecurity & IT',
    skills: ['Help Desk Support', 'Hardware Troubleshooting', 'Software Installation', 'Network Setup', 'User Training', 'Ticket Management', 'Remote Support'],
    tools: ['ServiceNow', 'JIRA Service Desk', 'Active Directory', 'TeamViewer', 'Remote Desktop', 'Windows', 'macOS'],
    keywords: ['IT support', 'help desk', 'technical support', 'troubleshooting', 'end-user support'],
    certifications: ['CompTIA A+', 'ITIL Foundation', 'HDI Support Center Analyst'],
  },
  {
    title: 'Network Engineer',
    category: 'Cybersecurity & IT',
    skills: ['Network Design', 'Routing & Switching', 'Firewall Configuration', 'VPN Setup', 'Network Monitoring', 'Troubleshooting', 'Wireless Networking', 'Load Balancing'],
    tools: ['Cisco IOS', 'Juniper', 'Palo Alto', 'Wireshark', 'SolarWinds', 'Fortinet', 'AWS VPC', 'Meraki'],
    keywords: ['network engineering', 'network architecture', 'routing', 'switching', 'network security'],
    certifications: ['CCNA', 'CCNP', 'JNCIA', 'CompTIA Network+'],
  },

  // ─── Real Estate & Construction ───────────────────────
  {
    title: 'Real Estate Agent',
    category: 'Real Estate & Construction',
    skills: ['Property Marketing', 'Client Relations', 'Negotiation', 'Market Analysis', 'Contract Management', 'Open Houses', 'Lead Generation', 'CRM Management'],
    tools: ['MLS', 'Zillow', 'Realtor.com', 'CRM', 'DocuSign', 'Canva', 'Social Media', 'BombBomb'],
    keywords: ['real estate', 'property sales', 'buyer representation', 'listing agent', 'real estate transactions'],
    certifications: ['Real Estate License', 'Realtor designation', 'ABR', 'CRS'],
  },
  {
    title: 'Construction Manager',
    category: 'Real Estate & Construction',
    skills: ['Project Planning', 'Budget Management', 'Subcontractor Management', 'Safety Compliance', 'Quality Control', 'Scheduling', 'Blueprint Reading', 'Client Communication'],
    tools: ['Procore', 'Bluebeam', 'AutoCAD', 'Primavera', 'MS Project', 'PlanGrid', 'BuilderTREND'],
    keywords: ['construction management', 'project delivery', 'site management', 'building construction', 'general contractor'],
    certifications: ['PMP', 'OSHA 30', 'LEED AP', 'CCM'],
  },
  {
    title: 'Architect',
    category: 'Real Estate & Construction',
    skills: ['Architectural Design', 'Building Codes', 'Client Presentations', 'Sustainable Design', 'Space Planning', 'Construction Documentation', '3D Modeling', 'Project Management'],
    tools: ['Revit', 'AutoCAD', 'SketchUp', 'Rhino', 'V-Ray', 'Lumion', 'Enscape', 'Adobe Creative Suite'],
    keywords: ['architecture', 'building design', 'sustainable architecture', 'construction drawings', 'design development'],
    certifications: ['Licensed Architect', 'LEED AP', 'NCARB', 'AIA'],
  },

  // ─── Research & Science ───────────────────────────────
  {
    title: 'Research Scientist',
    category: 'Research & Science',
    skills: ['Experimental Design', 'Data Analysis', 'Scientific Writing', 'Grant Writing', 'Peer Review', 'Lab Management', 'Statistical Analysis', 'Collaboration'],
    tools: ['Python', 'R', 'MATLAB', 'SPSS', 'GraphPad Prism', 'LaTeX', 'ImageJ', 'Flow Cytometry', 'PCR'],
    keywords: ['research', 'scientific discovery', 'peer-reviewed publications', 'experimental methodology', 'grant funding'],
  },
  {
    title: 'Environmental Scientist',
    category: 'Research & Science',
    skills: ['Environmental Assessment', 'Data Collection', 'Regulatory Compliance', 'GIS Mapping', 'Water Quality Testing', 'Impact Assessment', 'Report Writing', 'Field Research'],
    tools: ['ArcGIS', 'QGIS', 'R', 'Python', 'GPS Equipment', 'Water Testing Kits', 'AutoCAD', 'Excel'],
    keywords: ['environmental science', 'sustainability', 'environmental impact', 'conservation', 'environmental compliance'],
  },
  {
    title: 'Biomedical Engineer',
    category: 'Research & Science',
    skills: ['Medical Device Design', 'Biomechanics', 'Tissue Engineering', 'Regulatory Affairs', 'Clinical Trials', 'Signal Processing', 'Quality Systems', 'Biocompatibility'],
    tools: ['MATLAB', 'SolidWorks', 'COMSOL', 'LabVIEW', 'Python', 'CAD Software', '3D Printing', 'Statistical Software'],
    keywords: ['biomedical engineering', 'medical devices', 'FDA regulations', 'clinical engineering', 'biotechnology'],
    certifications: ['PE License', 'RAC', 'CQE'],
  },
];

// ─── Helper functions ──────────────────────────────────

/** Search roles by title (fuzzy match) */
export function searchRoles(query: string): RoleDefinition[] {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  return ROLES
    .filter(r => r.title.toLowerCase().includes(lower) || r.category.toLowerCase().includes(lower))
    .slice(0, 15);
}

/** Get role by exact title */
export function getRoleByTitle(title: string): RoleDefinition | undefined {
  return ROLES.find(r => r.title.toLowerCase() === title.toLowerCase());
}

/** Get roles by category */
export function getRolesByCategory(category: string): RoleDefinition[] {
  return ROLES.filter(r => r.category === category);
}

/** Get all unique role titles for dropdown */
export function getAllRoleTitles(): string[] {
  return ROLES.map(r => r.title);
}

/** Find closest matching role for a given title (fuzzy) */
export function findClosestRole(title: string): RoleDefinition | undefined {
  if (!title) return undefined;
  const lower = title.toLowerCase();
  // Exact match first
  const exact = ROLES.find(r => r.title.toLowerCase() === lower);
  if (exact) return exact;
  // Contains match
  const contains = ROLES.find(r => lower.includes(r.title.toLowerCase()) || r.title.toLowerCase().includes(lower));
  if (contains) return contains;
  // Keyword match — check if any words match
  const words = lower.split(/[\s,/-]+/).filter(w => w.length > 3);
  let bestMatch: RoleDefinition | undefined;
  let bestScore = 0;
  for (const role of ROLES) {
    const roleWords = role.title.toLowerCase().split(/[\s,/-]+/);
    const score = words.filter(w => roleWords.some(rw => rw.includes(w) || w.includes(rw))).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = role;
    }
  }
  return bestScore > 0 ? bestMatch : undefined;
}
