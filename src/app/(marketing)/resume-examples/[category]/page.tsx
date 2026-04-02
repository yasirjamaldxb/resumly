import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

interface ExampleData {
  title: string;
  description: string;
  keySkills: string[];
  sections: string[];
  tips: string[];
  sampleBullets?: string[];
}

const EXAMPLES: Record<string, ExampleData> = {
  'software-engineer': {
    title: 'Software Engineer',
    description: 'A strong software engineer resume highlights technical skills, project impact, and measurable outcomes. Recruiters spend just 6 seconds on each resume. Make yours count with the right keywords and quantified achievements.',
    keySkills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'SQL', 'Git', 'REST APIs', 'Agile/Scrum', 'TypeScript', 'CI/CD'],
    sections: ['Professional Summary', 'Technical Skills', 'Work Experience', 'Projects', 'Education', 'Certifications'],
    tips: [
      'Quantify achievements: "Reduced page load time by 40%" beats "Improved performance"',
      'List programming languages and frameworks prominently near the top',
      'Include GitHub profile URL and notable open-source contributions',
      'Tailor keywords to each job description for ATS optimization. Use the exact terms from the JD',
      'Use STAR format for bullet points: Action + Task + Result',
      'Include system scale metrics: "Serving 2M daily active users", "Processed 500K requests/day"',
    ],
    sampleBullets: [
      'Architected and deployed microservices infrastructure on AWS, reducing system latency by 45% and supporting 2M+ daily active users',
      'Led a team of 5 engineers to deliver a payment integration feature 2 weeks ahead of schedule, contributing $1.2M in new annual revenue',
      'Refactored legacy codebase from JavaScript to TypeScript, reducing runtime errors by 67% and improving developer productivity by 30%',
      'Built automated CI/CD pipeline using GitHub Actions and Docker, cutting deployment time from 2 hours to 12 minutes',
    ],
  },
  'data-scientist': {
    title: 'Data Scientist',
    description: 'Data scientist resumes must balance technical depth with business impact. Show how your models translated to real outcomes: revenue, efficiency, or risk reduction.',
    keySkills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Tableau', 'Statistics', 'NLP', 'A/B Testing'],
    sections: ['Professional Summary', 'Technical Skills', 'Work Experience', 'Projects', 'Education', 'Publications'],
    tips: [
      'Show business impact alongside technical work: "ML model that saved $3M/year"',
      'Mention specific algorithms and when/why you used them',
      'Highlight model accuracy improvements with baseline comparisons',
      'Include Kaggle competitions, publications, or GitHub repos',
      'List cloud platforms: AWS SageMaker, GCP Vertex AI, Azure ML',
    ],
    sampleBullets: [
      'Built a customer churn prediction model using XGBoost achieving 94% accuracy, preventing $3.2M in annual revenue loss',
      'Designed and implemented an A/B testing framework that reduced experimentation cycle time by 60%',
      'Processed and analyzed 50TB of user behavior data using Spark and Python to identify product optimization opportunities',
    ],
  },
  'product-manager': {
    title: 'Product Manager',
    description: 'Product manager resumes need to show cross-functional leadership, strategic thinking, and measurable product outcomes. Focus on user growth, revenue, and retention metrics.',
    keySkills: ['Product Strategy', 'Agile', 'Roadmapping', 'SQL', 'Jira', 'Figma', 'A/B Testing', 'Market Research', 'Stakeholder Management', 'OKRs', 'User Research'],
    sections: ['Professional Summary', 'Core Competencies', 'Work Experience', 'Education', 'Key Achievements'],
    tips: [
      'Lead with impact metrics: "Grew MAU by 125%", "Launched feature used by 2M users"',
      'Show you can work across engineering, design, and business',
      'Demonstrate data-driven decision making with specific examples',
      'Highlight product launches end-to-end from discovery to delivery',
      'Include go-to-market strategy experience',
    ],
    sampleBullets: [
      'Defined and shipped new onboarding flow that increased user activation by 35% and reduced time-to-value from 5 days to 12 hours',
      'Led cross-functional team of 12 (engineering, design, data) to launch mobile app, achieving 500K downloads in first month',
      'Prioritized product roadmap using RICE scoring framework, resulting in 40% increase in quarterly revenue targets met',
    ],
  },
  'nurse': {
    title: 'Nurse',
    description: 'A nursing resume needs to highlight clinical skills, certifications, and patient care experience. Whether you\'re an RN, LPN, or NP, the right format makes a critical difference in getting through ATS and impressing nurse managers.',
    keySkills: ['Patient Care', 'EMR/EHR (Epic)', 'IV Therapy', 'Medication Administration', 'BLS/ACLS', 'Wound Care', 'Critical Thinking', 'HIPAA Compliance', 'Telemetry', 'Patient Education'],
    sections: ['Licenses & Certifications', 'Professional Summary', 'Clinical Experience', 'Education', 'Skills & Competencies'],
    tips: [
      'Put licenses and certifications at the top. They\'re the first thing recruiters look for',
      'Specify patient ratios, unit types (ICU, ED, Med-Surg), and specialties',
      'Include all certifications with expiration dates: BLS, ACLS, PALS, CEN, etc.',
      'Mention specific EMR systems: Epic, Cerner, Meditech',
      'Highlight any charge nurse, preceptor, or committee leadership experience',
      'Quantify: "Managed care for 5-7 patients per shift in a 40-bed PCU"',
    ],
    sampleBullets: [
      'Delivered comprehensive patient care for 5-6 patients per shift in a 32-bed medical-surgical unit, maintaining 98% patient satisfaction scores',
      'Served as charge nurse for 12+ nurses, coordinating staffing and patient flow during high-census periods',
      'Trained 8 new graduate nurses on EMR documentation, IV therapy, and unit-specific protocols',
    ],
  },
  'teacher': {
    title: 'Teacher',
    description: 'Teaching resumes should highlight classroom management, curriculum development, student outcomes, and any specialized certifications. Show your impact on student achievement with data.',
    keySkills: ['Curriculum Development', 'Classroom Management', 'Differentiated Instruction', 'Google Classroom', 'IEP', 'Assessment Design', 'Parent Communication', 'PBIS', 'Special Education', 'STEM'],
    sections: ['Teaching Certifications', 'Professional Summary', 'Teaching Experience', 'Education', 'Skills & Tools', 'Professional Development'],
    tips: [
      'List your state teaching certification and subject/grade endorsements prominently',
      'Quantify student achievement gains: "Improved average reading scores by 18%"',
      'Mention grade levels and subjects you are certified to teach',
      'Include relevant tech tools: Google Workspace, Canvas, Schoology, IXL',
      'Highlight parent engagement and community involvement',
    ],
    sampleBullets: [
      'Designed and implemented differentiated instruction strategies resulting in 22% improvement in standardized test scores among Title I students',
      'Developed cross-curricular STEM unit adopted school-wide that engaged 450+ students in project-based learning',
      'Maintained 97% average student attendance through positive classroom culture and proactive family communication',
    ],
  },
  'marketing-manager': {
    title: 'Marketing Manager',
    description: 'Marketing manager resumes should demonstrate campaign results, ROI, and strategic thinking. Quantify everything from leads generated to revenue attributed. Recruiters want to see numbers.',
    keySkills: ['Digital Marketing', 'SEO/SEM', 'Google Analytics', 'HubSpot', 'Content Strategy', 'Social Media', 'Email Marketing', 'Paid Advertising', 'A/B Testing', 'CRM', 'Salesforce'],
    sections: ['Professional Summary', 'Core Competencies', 'Work Experience', 'Education', 'Certifications'],
    tips: [
      'Lead every bullet with a metric: "$2M revenue increase", "250% growth in organic traffic"',
      'List marketing tools and platforms prominently (HubSpot, Marketo, Salesforce)',
      'Show breadth across channels: SEO, paid, social, email, events',
      'Highlight team size managed and budget oversight',
      'Include notable campaigns and their ROI or brand impact',
    ],
    sampleBullets: [
      'Grew organic search traffic by 285% in 12 months through strategic SEO content program, generating $1.8M in attributed pipeline',
      'Managed $2.5M annual digital advertising budget across Google, Meta, and LinkedIn, achieving 3.2x average ROAS',
      'Built email marketing program from 0 to 85K subscribers with 42% average open rate, 3x industry benchmark',
    ],
  },
  'project-manager': {
    title: 'Project Manager',
    description: 'Project manager resumes should demonstrate your ability to deliver projects on time, on budget, and with measurable outcomes. Show scope, scale, budget, and team size.',
    keySkills: ['PMP', 'Agile', 'Scrum', 'Waterfall', 'Jira', 'MS Project', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'PMBOK', 'Change Management'],
    sections: ['Professional Summary', 'Core Competencies', 'Project Experience', 'Education & Certifications', 'Technical Skills'],
    tips: [
      'Quantify project scale: budget, team size, timeline, number of stakeholders',
      'Highlight PMP, CAPM, or Agile certifications prominently',
      'Show delivery outcomes: "On time and 12% under budget"',
      'Demonstrate cross-functional leadership and executive communication',
      'Mention specific industries and project types (IT, construction, healthcare)',
    ],
    sampleBullets: [
      'Led $4.2M ERP implementation across 6 departments, delivering on time and 8% under budget with zero critical system failures',
      'Managed portfolio of 12 concurrent projects ($8M total value) using Agile methodology, achieving 94% on-time delivery rate',
      'Reduced project delivery cycle time by 30% by implementing standardized sprint framework adopted across 3 business units',
    ],
  },
  'accountant': {
    title: 'Accountant',
    description: 'Accounting resumes need to highlight your technical expertise, software proficiency, and financial impact. CPAs should list their certification prominently.',
    keySkills: ['CPA', 'GAAP', 'QuickBooks', 'SAP', 'Excel', 'Financial Reporting', 'Tax Preparation', 'Auditing', 'Accounts Payable/Receivable', 'Budget Analysis', 'NetSuite'],
    sections: ['Certifications & Licenses', 'Professional Summary', 'Work Experience', 'Education', 'Technical Skills'],
    tips: [
      'List CPA, CMA, or EA certification immediately after your name or in a prominent location',
      'Quantify the scale of financial work: "Managed $50M annual budget"',
      'List accounting software prominently: QuickBooks, SAP, Oracle, NetSuite',
      'Show experience with both public and corporate accounting if applicable',
      'Highlight any automation or efficiency improvements',
    ],
    sampleBullets: [
      'Prepared and reviewed financial statements for 45+ clients with combined revenues exceeding $200M, ensuring 100% GAAP compliance',
      'Implemented automated reconciliation process reducing month-end close from 7 days to 3 days, saving 40+ hours monthly',
      'Identified $380K in recoverable tax credits through thorough review of prior-year returns',
    ],
  },
  'student': {
    title: 'Student / Entry Level',
    description: 'Building a resume with little work experience is challenging, but absolutely doable. Focus on relevant coursework, projects, internships, and transferable skills. Your education is your strongest asset.',
    keySkills: ['Microsoft Office', 'Communication', 'Time Management', 'Problem Solving', 'Teamwork', 'Research', 'Social Media', 'Customer Service', 'Data Analysis', 'Presentation Skills'],
    sections: ['Education', 'Relevant Experience', 'Projects', 'Skills', 'Activities & Leadership', 'Awards & Honors'],
    tips: [
      'Lead with education. It\'s your primary credential as a student',
      'Include relevant coursework, GPA if 3.5+, Dean\'s List, and academic awards',
      'List part-time jobs, volunteer work, and campus leadership roles',
      'Highlight class projects that demonstrate real skills',
      'Include all internships, even if unpaid or short-term',
      'Your objective/summary should mention your target field and graduation date',
    ],
    sampleBullets: [
      'Completed 3-month software development internship, contributing to 2 production features used by 10,000+ customers',
      'Led 5-person capstone team to build a web application; won Best Project Award among 28 competing teams',
      'Tutored 15 students in introductory programming, with 90% achieving passing grades',
    ],
  },
  'high-school-student': {
    title: 'High School Student',
    description: 'A high school resume focuses on academics, extracurriculars, volunteer work, and part-time jobs. It shows colleges and employers that you\'re responsible, motivated, and ready to contribute.',
    keySkills: ['Customer Service', 'Cash Handling', 'Microsoft Office', 'Social Media', 'Teamwork', 'Communication', 'Time Management', 'Leadership', 'Volunteer Work'],
    sections: ['Education', 'Work Experience', 'Extracurricular Activities', 'Volunteer Work', 'Skills', 'Awards & Honors'],
    tips: [
      'GPA should be included if 3.0 or above',
      'List every extracurricular: sports, clubs, student government, band, theater',
      'Include any leadership positions, however small: team captain, club officer',
      'Babysitting, lawn mowing, and tutoring all count as work experience',
      'Volunteer hours show character, so include them with organization and hours',
      'Keep it to 1 page maximum',
    ],
    sampleBullets: [
      'Served as Student Council Vice President, organizing 5 school-wide events for 800+ students',
      'Maintained 3.9 GPA while working 15 hours/week and participating in varsity soccer',
      'Completed 120 volunteer hours at local food bank, helping distribute meals to 500+ families monthly',
    ],
  },
  'internship': {
    title: 'Internship',
    description: 'An internship resume should highlight your academic achievements, relevant projects, and any previous internship or work experience. Show enthusiasm, a growth mindset, and relevant skills for the role.',
    keySkills: ['Microsoft Office', 'Google Workspace', 'Communication', 'Research', 'Data Analysis', 'Social Media', 'Presentation Skills', 'Problem Solving', 'Adaptability'],
    sections: ['Education', 'Relevant Experience', 'Projects', 'Skills', 'Certifications', 'Activities'],
    tips: [
      'Tailor your resume to each internship application using keywords from the job description',
      'Show relevant coursework and academic projects as proof of skills',
      'Include any previous internships or part-time jobs prominently',
      'Highlight any tools or software you\'ve used in class that are relevant to the role',
      'A strong objective statement helps. Mention the specific company and role',
    ],
    sampleBullets: [
      'Completed marketing analytics project using Google Analytics and Excel, identifying 3 content opportunities that increased blog traffic by 28%',
      'Assisted in organizing company-wide product launch event for 200+ attendees',
      'Developed Python script automating weekly reporting process, saving team 4 hours/week',
    ],
  },
  'ux-designer': {
    title: 'UX Designer',
    description: 'UX designer resumes need to show your design process, tools, and business impact. Include a portfolio link. It\'s as important as the resume itself.',
    keySkills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems', 'HTML/CSS', 'Accessibility (WCAG)', 'Information Architecture'],
    sections: ['Portfolio Link', 'Professional Summary', 'Work Experience', 'Skills & Tools', 'Education', 'Projects'],
    tips: [
      'Always include a link to your portfolio. This is non-negotiable for UX roles',
      'Show measurable UX outcomes: "Reduced task completion time by 35%", "Improved conversion by 22%"',
      'Describe your design process, not just deliverables',
      'Show collaboration with engineers and product managers',
      'Highlight user research methods: interviews, surveys, usability testing',
    ],
    sampleBullets: [
      'Redesigned onboarding flow based on 20 user interviews, reducing drop-off rate by 38% and increasing day-7 retention by 25%',
      'Built and maintained design system with 200+ components, adopted by 12-person product team and reducing design inconsistencies by 80%',
      'Conducted competitive analysis and user research for new mobile feature; delivered designs that achieved 4.8/5 star rating in user testing',
    ],
  },
  'web-developer': {
    title: 'Web Developer',
    description: 'Web developer resumes should highlight your tech stack, notable projects, and performance improvements. Show both front-end and back-end skills if applicable.',
    keySkills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'PHP', 'MySQL', 'WordPress', 'REST APIs', 'Git', 'Responsive Design', 'Performance Optimization'],
    sections: ['Technical Skills', 'Professional Summary', 'Work Experience', 'Projects', 'Education'],
    tips: [
      'List your tech stack prominently at the top',
      'Include links to live projects or GitHub repos',
      'Quantify performance improvements: page load speed, Core Web Vitals scores',
      'Mention CMS experience if relevant (WordPress, Shopify, Webflow)',
      'Show full-stack capability if you have it. It\'s highly valued',
    ],
    sampleBullets: [
      'Built and launched e-commerce platform handling $2M/month in transactions using React, Node.js, and PostgreSQL',
      'Optimized Core Web Vitals score from 54 to 94, reducing bounce rate by 18% and improving organic search rankings',
      'Developed 15+ client websites using WordPress and custom PHP, consistently delivering on time and under budget',
    ],
  },
  'customer-service': {
    title: 'Customer Service',
    description: 'Customer service resumes should highlight your ability to resolve issues, maintain satisfaction scores, and handle high-volume interactions efficiently.',
    keySkills: ['Customer Relations', 'CRM Software', 'Conflict Resolution', 'Active Listening', 'Zendesk', 'Salesforce', 'Call Center', 'Problem Solving', 'Empathy', 'Multi-tasking'],
    sections: ['Professional Summary', 'Work Experience', 'Skills', 'Education'],
    tips: [
      'Lead with customer satisfaction metrics: "Maintained 98% CSAT score"',
      'Quantify call/ticket volume handled: "Resolved 80+ tickets daily"',
      'Highlight any upselling or retention achievements',
      'Mention specific CRM or help desk software: Zendesk, Salesforce, Freshdesk',
      'Show advancement: from rep to team lead, for example',
    ],
    sampleBullets: [
      'Handled 85+ customer inquiries daily via phone, email, and chat while maintaining 97% CSAT score over 2 years',
      'Resolved complex billing disputes, retaining $150K+ in annual subscriptions that were at risk of cancellation',
      'Mentored 6 new customer service representatives, reducing their onboarding time from 4 weeks to 2 weeks',
    ],
  },
  'sales-manager': {
    title: 'Sales Manager',
    description: 'Sales manager resumes are all about numbers. Quota attainment, revenue growth, team performance, and deal size are what recruiters want to see front and center.',
    keySkills: ['Salesforce', 'Sales Strategy', 'Team Leadership', 'Pipeline Management', 'B2B Sales', 'CRM', 'Forecasting', 'Contract Negotiation', 'Account Management', 'Territory Planning'],
    sections: ['Professional Summary', 'Sales Achievements', 'Work Experience', 'Education', 'Skills'],
    tips: [
      'Put your best revenue numbers in the summary or headline. Don\'t bury them',
      'Show quota attainment consistently: "Exceeded quota for 8 consecutive quarters"',
      'List team size managed and total revenue responsibility',
      'Mention average deal size and sales cycle length for context',
      'Include recognition: President\'s Club, Top Performer awards',
    ],
    sampleBullets: [
      'Grew regional sales territory from $3.2M to $7.8M in 24 months, exceeding quota by 145% both years',
      'Built and managed team of 12 AEs, improving team quota attainment from 72% to 118% in 18 months',
      'Negotiated 3 enterprise contracts averaging $850K ARR, including company\'s largest-ever deal at $2.1M',
    ],
  },
  'graphic-designer': {
    title: 'Graphic Designer',
    description: 'Graphic designer resumes must include a portfolio link and demonstrate a range of projects and business outcomes. Show both creative and commercial sensibility.',
    keySkills: ['Adobe Creative Suite', 'Figma', 'Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Branding', 'Typography', 'Print Design', 'Digital Design', 'Video Editing'],
    sections: ['Portfolio Link', 'Professional Summary', 'Work Experience', 'Skills & Tools', 'Education', 'Awards'],
    tips: [
      'Portfolio link is essential. Make it easy to find at the top of your resume',
      'Show diversity of work: print, digital, branding, social media',
      'Quantify impact where possible: "Redesign increased engagement by 40%"',
      'Highlight client or brand names you\'ve worked with',
      'Include any design awards or recognition',
    ],
    sampleBullets: [
      'Rebranded SaaS startup including logo, website, and collateral; new brand contributed to 60% increase in investor meetings secured',
      'Created social media content calendar and visuals for 3 clients, growing combined following by 125K in 6 months',
      'Designed packaging for CPG product launch achieving 98% positive consumer feedback in focus groups',
    ],
  },
  'medical-assistant': {
    title: 'Medical Assistant',
    description: 'Medical assistant resumes should highlight clinical and administrative skills, certifications, and experience with specific procedures and EHR systems.',
    keySkills: ['EHR Systems', 'Vital Signs', 'Phlebotomy', 'Medication Administration', 'Patient Intake', 'HIPAA', 'Medical Billing', 'ICD-10 Coding', 'CPR/BLS', 'Sterile Technique'],
    sections: ['Certifications', 'Professional Summary', 'Clinical Experience', 'Administrative Skills', 'Education'],
    tips: [
      'List CMA (AAMA) or RMA certification prominently',
      'Specify clinical competencies: phlebotomy, EKG, injections, etc.',
      'Mention specific EHR systems used: Epic, Athenahealth, eClinicalWorks',
      'Include both clinical and administrative experience',
      'Quantify patient volume: "Assisted with 30+ patients per day"',
    ],
    sampleBullets: [
      'Assisted 35+ patients daily in busy family medicine practice, performing vitals, EKGs, phlebotomy, and injections',
      'Processed prior authorizations and managed referrals, reducing average approval time from 5 days to 2 days',
      'Trained 3 new medical assistant staff on Epic EMR documentation and patient flow procedures',
    ],
  },
  'financial-analyst': {
    title: 'Financial Analyst',
    description: 'Financial analyst resumes should demonstrate analytical expertise, financial modeling skills, and the business impact of your analysis and recommendations.',
    keySkills: ['Financial Modeling', 'Excel', 'DCF Analysis', 'SQL', 'Bloomberg', 'PowerBI', 'Tableau', 'GAAP', 'FP&A', 'Budget Forecasting', 'Variance Analysis', 'Python'],
    sections: ['Professional Summary', 'Core Competencies', 'Work Experience', 'Education', 'Certifications'],
    tips: [
      'Show scale: "Analyzed $50M investment portfolio", "Built model supporting $200M acquisition"',
      'Highlight CFA progress or CPA if applicable',
      'Demonstrate Excel/modeling advanced capabilities specifically',
      'Show how your analysis influenced decisions',
      'Mention specific financial systems: SAP, Oracle Financials, Workday',
    ],
    sampleBullets: [
      'Built 5-year DCF model for $125M acquisition target; analysis directly informed board decision and deal structure',
      'Developed automated financial reporting dashboard in PowerBI, reducing monthly close reporting time by 65%',
      'Identified $4.2M in cost reduction opportunities through variance analysis across 6 business units',
    ],
  },
  'warehouse-worker': {
    title: 'Warehouse Worker',
    description: 'Warehouse worker resumes should highlight physical capabilities, equipment certifications, accuracy metrics, and safety records. Show reliability and productivity.',
    keySkills: ['Forklift Operator', 'Inventory Management', 'WMS', 'RF Scanner', 'Order Picking', 'Packing & Shipping', 'Safety Compliance', 'OSHA', 'Receiving', 'Heavy Lifting (50+ lbs)'],
    sections: ['Professional Summary', 'Work Experience', 'Equipment & Certifications', 'Skills', 'Education'],
    tips: [
      'List forklift, reach truck, or pallet jack certifications prominently',
      'Quantify accuracy and productivity: "99.8% order accuracy", "150 picks per hour"',
      'Highlight perfect or excellent attendance record',
      'Mention any leadership: team lead, trainer',
      'Include WMS systems used: SAP WM, Manhattan Associates, Oracle WMS',
    ],
    sampleBullets: [
      'Maintained 99.7% order accuracy across 200+ daily picks in a high-volume fulfillment center processing 5,000 orders/day',
      'Operated forklift and reach truck to manage inventory in 150,000 sq ft warehouse with zero safety incidents over 3 years',
      'Cross-trained 5 new warehouse associates, reducing average onboarding time from 3 weeks to 10 days',
    ],
  },
  'hr-manager': {
    title: 'HR Manager',
    description: 'HR manager resumes should demonstrate talent acquisition, employee relations, compliance, and organizational development capabilities. Show your strategic and operational HR impact.',
    keySkills: ['Talent Acquisition', 'HRIS', 'ADP', 'Workday', 'Employee Relations', 'Benefits Administration', 'Performance Management', 'Employment Law', 'Onboarding', 'Culture Building'],
    sections: ['Professional Summary', 'Core HR Competencies', 'Work Experience', 'Education & Certifications', 'Skills'],
    tips: [
      'Include SHRM-CP, SHRM-SCP, or PHR/SPHR certifications prominently',
      'Quantify workforce scale: "Managed HR for 500-person organization"',
      'Show talent acquisition metrics: time-to-fill, offer acceptance rates',
      'Highlight any diversity, equity & inclusion initiatives',
      'Demonstrate employment law expertise (FMLA, ADA, FLSA)',
    ],
    sampleBullets: [
      'Built and managed full-cycle recruiting function, reducing time-to-fill from 62 days to 34 days while improving new hire quality scores by 28%',
      'Implemented Workday HRIS across 800-person company, digitizing 100% of HR processes and reducing administrative time by 45%',
      'Designed manager training program that decreased voluntary turnover by 22% year-over-year',
    ],
  },
  'business-analyst': {
    title: 'Business Analyst',
    description: 'Business analyst resumes should show your ability to bridge business and technology, analyze complex problems, and drive process improvements with measurable results.',
    keySkills: ['Requirements Gathering', 'SQL', 'Process Mapping', 'Jira', 'Confluence', 'Data Analysis', 'Excel', 'Tableau', 'Agile', 'BPMN', 'Stakeholder Management', 'User Stories'],
    sections: ['Professional Summary', 'Core Competencies', 'Work Experience', 'Education', 'Technical Skills'],
    tips: [
      'Show how your analysis led to specific business outcomes',
      'Quantify process improvements: "Reduced processing time by 40%", "Saved $500K annually"',
      'Demonstrate experience with both business and technical stakeholders',
      'List relevant certifications: CBAP, PMP, Agile',
      'Include data tools and visualization experience',
    ],
    sampleBullets: [
      'Led requirements gathering for $2M CRM implementation, reducing scope changes by 65% through thorough stakeholder workshops',
      'Analyzed customer service process and identified automation opportunities saving $380K annually and reducing error rate by 75%',
      'Created KPI dashboard in Tableau used by 50+ executives to monitor business performance in real time',
    ],
  },
  'pharmacist': {
    title: 'Pharmacist',
    description: 'Pharmacist resumes should emphasize clinical knowledge, patient counseling, drug interaction review, and specific practice settings. PharmD and state licensure should be immediately visible.',
    keySkills: ['PharmD', 'Drug Interaction Review', 'Patient Counseling', 'MTM', 'Epic', 'IV Compounding', 'Immunizations', 'Formulary Management', 'Clinical Pharmacy', 'HIPAA'],
    sections: ['Licensure & Credentials', 'Professional Summary', 'Professional Experience', 'Education', 'Clinical Skills'],
    tips: [
      'List PharmD degree and state licensure number/state prominently',
      'Specify practice setting: retail, hospital, clinical, specialty',
      'Include BCPS, BCACP, or other board certifications',
      'Quantify volume: "Verified 200+ prescriptions daily"',
      'Highlight clinical programs: MTM, immunization clinics, anticoagulation',
    ],
    sampleBullets: [
      'Verified and dispensed 220+ prescriptions daily while providing comprehensive patient counseling in a high-volume retail pharmacy',
      'Led anticoagulation clinic managing 150+ patients, achieving 87% time-in-therapeutic-range (industry benchmark: 65%)',
      'Implemented pharmacist-driven hypertension management protocol, achieving 45% reduction in uncontrolled BP among enrolled patients',
    ],
  },
};

function getExampleData(slug: string): ExampleData {
  if (EXAMPLES[slug]) return EXAMPLES[slug];
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title,
    description: `A strong ${title} resume highlights your most relevant experience, skills, and achievements for the role. Here's how to create a resume that gets past ATS filters and impresses hiring managers in 2026.`,
    keySkills: ['Communication', 'Problem Solving', 'Time Management', 'Teamwork', 'Leadership', 'Microsoft Office', 'Attention to Detail', 'Customer Service'],
    sections: ['Professional Summary', 'Work Experience', 'Education', 'Skills'],
    tips: [
      'Tailor your resume to the specific job description using keywords from the posting',
      'Quantify achievements with numbers, percentages, and dollar amounts',
      'Start every bullet point with a strong action verb',
      'Keep it to 1-2 pages maximum. Recruiters spend 6-7 seconds on first review',
      'Proofread carefully. Typos are an immediate disqualifier for most hiring managers',
    ],
  };
}

const RELATED_EXAMPLES: Record<string, string[]> = {
  'software-engineer': ['web-developer', 'data-scientist', 'ux-designer', 'product-manager'],
  'nurse': ['medical-assistant', 'pharmacist', 'teacher', 'customer-service'],
  'marketing-manager': ['sales-manager', 'graphic-designer', 'product-manager', 'business-analyst'],
  'accountant': ['financial-analyst', 'business-analyst', 'hr-manager', 'project-manager'],
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = getExampleData(category);
  return {
    title: `${data.title} Resume Example & Writing Tips for 2026`,
    description: `See a real ${data.title} resume example for 2026 with expert writing tips. Learn exactly what to include, what keywords to use, and how to pass ATS. Build yours free in minutes.`,
    alternates: { canonical: `https://resumly.app/resume-examples/${category}` },
    openGraph: {
      title: `${data.title} Resume Example 2026 | Resumly`,
      description: `Expert-written ${data.title} resume example with ATS-optimized keywords and tips.`,
    },
  };
}

export default async function ResumeExamplePage({ params }: Props) {
  const { category } = await params;
  const data = getExampleData(category);
  const related = RELATED_EXAMPLES[category] || [];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resume-examples" className="hover:text-blue-600">Resume Examples</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">{data.title} Resume</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                  {data.title} Resume Example for 2026
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">{data.description}</p>
              </div>
              <div className="flex-shrink-0">
                <Button size="lg" asChild>
                  <Link href={`/builder/new?role=${encodeURIComponent(data.title)}`}>
                    Build My Resume →
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Main content */}
              <div className="lg:col-span-2 space-y-10">

                {/* Sample bullet points */}
                {data.sampleBullets && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Sample {data.title} Resume Bullet Points
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm">
                      These are strong, ATS-optimized bullet points for a {data.title} resume.
                      Customize them with your own achievements and numbers.
                    </p>
                    <div className="space-y-3">
                      {data.sampleBullets.map((bullet, i) => (
                        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                          <p className="text-gray-700 text-sm leading-relaxed">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What to include */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What to include in a {data.title} resume
                  </h2>
                  <div className="space-y-3">
                    {data.sections.map((section, i) => (
                      <div key={section} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="font-semibold text-gray-800">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Writing tips */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {data.title} resume writing tips for 2026
                  </h2>
                  <div className="space-y-3">
                    {data.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS tips for this role */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    ATS tips for {data.title} resumes
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Over 75% of {data.title} resumes are rejected by ATS before a human reads them.
                    To pass ATS screening:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-amber-600">→</span>
                      Use the exact job title from the posting in your resume headline
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">→</span>
                      Mirror keywords from the job description verbatim
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">→</span>
                      Use standard section headings: &quot;Work Experience&quot;, &quot;Education&quot;, &quot;Skills&quot;
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">→</span>
                      Avoid tables, text boxes, headers/footers, and graphics
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">→</span>
                      Submit as PDF with embedded text (not scanned image)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key skills */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Top {data.title} Skills for 2026
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">Include as many relevant ones as apply to you:</p>
                  <div className="flex flex-wrap gap-2">
                    {data.keySkills.map((skill) => (
                      <span key={skill} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Build CTA */}
                <div className="bg-blue-600 text-white rounded-2xl p-5 text-center">
                  <p className="font-bold text-lg mb-2">Build your {data.title} resume</p>
                  <p className="text-blue-100 text-sm mb-4">
                    Use our AI to auto-fill skills and generate bullet points for your role
                  </p>
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold" asChild>
                    <Link href={`/builder/new?role=${encodeURIComponent(data.title)}`}>
                      Build for Free
                    </Link>
                  </Button>
                </div>

                {/* ATS score badge */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">99</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">ATS Score</p>
                      <p className="text-xs text-gray-500">With our ATS Pro template</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Our ATS Pro template uses clean formatting designed to work with major ATS systems including Workday, Greenhouse, and Lever.</p>
                </div>
              </div>
            </div>

            {/* Related examples */}
            {related.length > 0 && (
              <div className="mt-16 border-t border-gray-100 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resume Examples</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {related.map((slug) => {
                    const relData = getExampleData(slug);
                    return (
                      <Link
                        key={slug}
                        href={`/resume-examples/${slug}`}
                        className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        <p className="font-semibold text-gray-800 text-sm hover:text-blue-600">{relData.title} Resume</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${data.title} Resume Example for 2026`,
            description: data.description,
            author: { '@type': 'Organization', name: 'Resumly' },
            publisher: { '@type': 'Organization', name: 'Resumly', url: 'https://resumly.app' },
            datePublished: '2026-01-01',
            dateModified: new Date().toISOString().split('T')[0],
          }),
        }}
      />
    </>
  );
}
