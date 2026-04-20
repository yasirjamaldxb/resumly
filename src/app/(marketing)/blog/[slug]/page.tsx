import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS } from '../page';
import {
  ArticleSchema,
  BreadcrumbListSchema,
  FAQPageSchema,
} from '@/components/seo/schema';

const BLOG_CONTENT: Record<string, { intro: string; sections: { heading: string; content: string }[] }> = {
  'how-to-write-a-resume': {
    intro: 'Writing a resume in 2026 is both art and science. Hiring managers spend just 6-7 seconds on an initial scan, while ATS systems reject 75% of resumes before human eyes ever see them. This guide covers everything you need to create a resume that passes both tests.',
    sections: [
      {
        heading: 'Choose the right resume format',
        content: 'The three main resume formats are chronological (most common, lists work history newest to oldest), functional (skills-based, better for career changers), and combination (hybrid of both). For most people, the chronological or combination format works best. Hiring managers and ATS systems are most familiar with chronological resumes.',
      },
      {
        heading: 'Essential resume sections',
        content: 'Every resume needs these core sections: Contact Information (name, phone, email, LinkedIn, location), Professional Summary (3-5 sentences), Work Experience (most recent first), Education, and Skills. Optional sections include Certifications, Projects, Publications, and Languages.',
      },
      {
        heading: 'How to write your professional summary',
        content: 'Your professional summary is prime real estate, the first thing recruiters read. It should be 3-5 sentences that: state your job title and years of experience, highlight your top 2-3 relevant skills or achievements, and include keywords from your target job description. Avoid phrases like "hard-working" or "team player". These are meaningless without evidence.',
      },
      {
        heading: 'Writing effective work experience bullet points',
        content: 'Each bullet point should follow the formula: Action Verb + Task + Quantified Result. For example: "Increased website conversion rate by 23% through A/B testing of landing pages." Start every bullet with a strong action verb: Led, Built, Designed, Achieved, Generated, Reduced, Improved. Always quantify results with numbers, percentages, or dollar amounts.',
      },
      {
        heading: 'Optimizing for ATS (Applicant Tracking Systems)',
        content: 'Over 99% of Fortune 500 companies use ATS to filter resumes. To pass ATS screening: use standard section headings, avoid tables and graphics, use the exact keywords from the job description, submit as a text-based PDF, and use standard fonts like Arial, Calibri, or Times New Roman at 10-12pt.',
      },
      {
        heading: 'How long should your resume be?',
        content: 'The right resume length depends on your experience: 0-10 years: 1 page maximum. 10+ years: 2 pages maximum. Academic/research roles: CV format, no page limit. Focus on relevance. Cut anything older than 15 years or unrelated to your target role.',
      },
    ],
  },
  'ats-resume-guide': {
    intro: 'Applicant Tracking Systems (ATS) are used by 99% of Fortune 500 companies to automatically filter resumes. If your resume isn\'t formatted correctly, it will be rejected before a human ever reads it, no matter how qualified you are.',
    sections: [
      {
        heading: 'What is an ATS and how does it work?',
        content: 'An ATS scans your resume for specific keywords, education requirements, years of experience, and formatting. It parses your resume into a structured database, then ranks candidates based on how well their resumes match the job description. Low-ranking resumes never reach human reviewers.',
      },
      {
        heading: 'ATS formatting rules',
        content: 'To ensure ATS can parse your resume: use standard fonts (Arial, Calibri, Times New Roman), avoid tables, text boxes, columns, headers/footers, and graphics, use standard section headings ("Work Experience" not "Where I\'ve Been"), submit as PDF with embedded text (never a scanned image), and keep file size under 2MB.',
      },
      {
        heading: 'ATS keywords: the most important factor',
        content: 'The #1 way to pass ATS is keyword matching. Read the job description carefully and use the exact same terms they use. If they say "project management" use that phrase, not "managing projects." If they list "Salesforce" as a requirement, make sure that exact word appears in your skills section.',
      },
      {
        heading: 'Common ATS mistakes to avoid',
        content: 'Top ATS-killing mistakes: using a non-standard file format (Word doc is safer than you think, but only with simple formatting), using headers/footers for contact info (ATS often can\'t read them), using abbreviations without spelling them out first (write "Search Engine Optimization (SEO)"), and submitting a designed/graphic resume without also providing a plain-text version.',
      },
      {
        heading: 'How to check your ATS score',
        content: 'Resumly provides a real-time ATS score as you build your resume. Our score checks contact information completeness, keyword density, section structure, formatting compatibility, and skills match. Aim for 85%+ before downloading and submitting your resume.',
      },
    ],
  },
  'resume-summary-examples': {
    intro: 'Your resume summary is the first thing recruiters read, and it often determines whether they continue reviewing your application. A strong summary distills your professional identity, key skills, and career achievements into a concise paragraph that immediately communicates your value. This guide provides real resume summary examples across industries and experience levels to help you craft one that earns interviews.',
    sections: [
      {
        heading: 'What is a resume summary and when should you use one?',
        content: 'A resume summary is a 2-4 sentence overview at the top of your resume that highlights your most relevant qualifications for the role you are targeting. It replaces the outdated "objective statement" and is most effective when you have at least two years of professional experience. If you are a recent graduate or changing careers with limited relevant experience, a resume objective or skills-based opening may work better. The summary should be tailored to each job you apply for, incorporating keywords from the job description while showcasing your strongest selling points.',
      },
      {
        heading: 'How to structure a resume summary',
        content: 'An effective resume summary follows a simple formula: lead with your professional title and years of experience, follow with two or three of your most impressive and relevant accomplishments or skills, and close with what you bring to the target role. Keep it between 30 and 60 words. Avoid first-person pronouns like "I" and generic filler phrases like "results-driven professional" unless you back them up with specifics. Every word should earn its place. If a sentence could apply to any candidate in your field, it is too vague.',
      },
      {
        heading: 'Resume summary examples by experience level',
        content: 'For an entry-level marketing role, a strong summary might read: "Digital marketing coordinator with 2 years of experience managing social media campaigns for B2B SaaS companies. Grew organic LinkedIn engagement by 140% and managed a monthly ad budget of $15,000 across Google and Meta platforms." For a mid-career project manager: "PMP-certified project manager with 8 years of experience leading cross-functional teams in financial services. Delivered 30+ projects on time and under budget, managing portfolios valued at up to $5M." For a senior executive: "VP of Operations with 15 years of experience scaling manufacturing operations across three countries. Led a plant consolidation initiative that reduced overhead costs by $12M annually while improving production output by 18%."',
      },
      {
        heading: 'Resume summary examples by industry',
        content: 'For software engineering: "Full-stack engineer with 5 years of experience building and deploying web applications using React, Node.js, and PostgreSQL. Reduced API response times by 60% through architectural improvements and contributed to an open-source framework with 2,000+ GitHub stars." For healthcare: "Registered Nurse with 7 years of experience in emergency and critical care settings. Maintained a 98% patient satisfaction rating while managing a caseload of 6-8 patients per shift in a Level I trauma center." For sales: "Enterprise account executive with 6 years of experience selling SaaS solutions to Fortune 500 companies. Consistently exceeded annual quota by 120%+ and closed the company\'s largest deal at $2.4M ARR." Tailor each summary to mirror the language in the job posting you are applying for.',
      },
      {
        heading: 'Common resume summary mistakes to avoid',
        content: 'The most common mistake is writing a generic summary that could belong to anyone. Phrases like "passionate professional seeking a challenging opportunity" tell the reader nothing about your actual qualifications. Other pitfalls include making the summary too long (anything over four sentences loses its impact), listing soft skills without evidence (say "led a team of 12" instead of "strong leadership skills"), and copying the same summary for every application. Each time you apply, review the job description and adjust your summary to reflect the specific requirements and keywords mentioned.',
      },
      {
        heading: 'Using Resumly to write your summary',
        content: 'When building your resume with Resumly, the summary section includes guidance prompts that help you identify the right details to include. Start by selecting your target job title, then focus on the accomplishments and skills most relevant to that role. Resumly\'s ATS checker will flag if your summary is missing critical keywords from common job descriptions in your field, helping you optimize before you submit.',
      },
    ],
  },
  'resume-skills': {
    intro: 'The skills section of your resume is one of the most scrutinized parts of your application, both by hiring managers and by Applicant Tracking Systems. Listing the right mix of hard and soft skills can mean the difference between landing an interview and being filtered out. This guide covers how to identify, organize, and present your skills for maximum impact.',
    sections: [
      {
        heading: 'Hard skills vs. soft skills: what to include',
        content: 'Hard skills are teachable, measurable abilities like programming languages, data analysis, financial modeling, or operating specific equipment. Soft skills are interpersonal qualities like communication, leadership, problem-solving, and adaptability. Most hiring managers want to see both, but hard skills carry more weight in ATS screening because they are easier to match against job requirements. Your skills section should lean heavily toward hard skills, while soft skills are better demonstrated through your work experience bullet points rather than simply listed.',
      },
      {
        heading: 'How to identify the right skills for each application',
        content: 'Start with the job description. It is your blueprint. Read through the requirements and preferred qualifications sections and list every skill mentioned. Then cross-reference this list against your own abilities, certifying which ones you genuinely possess. Prioritize skills that appear multiple times in the posting or are listed as required rather than preferred. Also review several similar job postings from different companies to identify industry-standard skills that may not appear in a single listing but are broadly expected in your field.',
      },
      {
        heading: 'Top technical skills by industry in 2026',
        content: 'In technology, the most in-demand skills include Python, JavaScript/TypeScript, cloud platforms (AWS, Azure, GCP), SQL, Docker and Kubernetes, and machine learning frameworks. In marketing, employers look for SEO/SEM, Google Analytics, CRM platforms (HubSpot, Salesforce), content management systems, and marketing automation tools. In finance, valued skills include financial modeling, Excel (advanced functions and VBA), Bloomberg Terminal, SQL, and regulatory compliance knowledge. In healthcare, certifications like BLS/ACLS, electronic health record systems (Epic, Cerner), HIPAA compliance, and specialized clinical skills are essential. Always list the specific tools and platforms you know rather than broad categories.',
      },
      {
        heading: 'How to organize your skills section',
        content: 'Group your skills into logical categories for readability. A software developer might use categories like "Languages," "Frameworks & Libraries," "Databases," and "DevOps Tools." A marketing professional might group by "Analytics," "Content & SEO," "Advertising Platforms," and "Design Tools." List your strongest and most relevant skills first within each category. Avoid rating your skills with bars, charts, or percentages. These are subjective, take up space, and most ATS systems cannot read them. If you want to indicate proficiency, use clear labels like "Proficient" or "Working knowledge."',
      },
      {
        heading: 'Skills to avoid listing on your resume',
        content: 'Remove any skill that is expected of virtually every professional in 2026. Microsoft Word, email, basic internet research, and typing are assumed competencies and listing them can make you look inexperienced. Also avoid listing skills you cannot actually perform well. Interviewers will test your claims. Outdated technologies should be removed unless the specific job requires them. And never list subjective traits as skills: "hard worker," "fast learner," and "detail-oriented" are not skills. They are self-assessments that carry no weight without supporting evidence in your experience section.',
      },
      {
        heading: 'Making your skills ATS-friendly',
        content: 'ATS software matches your resume against the job description using keyword matching. To pass this filter, use the exact phrasing from the job posting. If the listing says "Adobe Creative Suite," do not abbreviate it to "Adobe CS." Spell out acronyms the first time you use them, then include the acronym in parentheses: "Search Engine Optimization (SEO)." Place your skills section near the top of your resume so the ATS encounters them early. Resumly\'s builder automatically checks your skills against common ATS requirements and suggests relevant keywords you may have missed.',
      },
    ],
  },
  'how-to-write-a-cover-letter': {
    intro: 'A well-written cover letter can set you apart when your resume alone does not tell the full story. While not every employer requires one, submitting a thoughtful cover letter shows initiative and gives you space to explain why you are a strong fit for the specific role. This guide walks you through writing a cover letter that is concise, relevant, and compelling.',
    sections: [
      {
        heading: 'When you need a cover letter (and when you can skip it)',
        content: 'Always submit a cover letter when the job posting explicitly requests one, when you are applying through email or a company website that provides an upload field for it, or when you are making a career change and need to explain the transition. You can generally skip a cover letter when applying through platforms like LinkedIn Easy Apply where there is no option to attach one, or when the posting specifically says not to include one. When in doubt, include it. A cover letter rarely hurts your candidacy but a missing one occasionally does.',
      },
      {
        heading: 'Cover letter structure and format',
        content: 'A strong cover letter follows a clear four-paragraph structure. The opening paragraph states which position you are applying for and includes one sentence that grabs attention, such as a notable achievement, a connection to the company, or a specific reason you are excited about the role. The second paragraph covers your most relevant experience and accomplishments, drawing direct connections to the job requirements. The third paragraph explains why this particular company appeals to you and what you would bring to their team. The closing paragraph includes a call to action, thanking the reader and expressing interest in discussing the role further. Keep the entire letter under 400 words.',
      },
      {
        heading: 'Writing an opening that gets attention',
        content: 'The worst way to start a cover letter is "I am writing to apply for the position of..." because it wastes valuable space stating the obvious. Instead, lead with something specific: "When I led the migration of our payment system to a microservices architecture, I reduced transaction processing time by 40%, and I am eager to bring that same approach to the Platform Engineer role at [Company]." Another effective approach is to reference a genuine connection: a referral from a current employee, a company initiative you admire, or a product you actually use. The goal is to make the hiring manager want to keep reading.',
      },
      {
        heading: 'Connecting your experience to the job requirements',
        content: 'The body of your cover letter should not repeat your resume. It should expand on it. Pick two or three requirements from the job posting and match them to specific experiences from your career, providing context that your resume bullet points cannot capture. Explain the situation, what you did, and what resulted. This is also the place to address any potential concerns a hiring manager might have, such as gaps in employment, relocation, or a transition from a different industry. Frame these as strengths: "My five years in hospitality management gave me the client-facing and operational skills that translate directly to the account management role."',
      },
      {
        heading: 'Cover letter mistakes that cost you interviews',
        content: 'The most damaging cover letter mistake is sending a generic, untailored letter. Hiring managers can immediately tell when a letter was written for any job rather than their specific opening. Other common mistakes include making the letter about what you want ("I am looking for an opportunity to grow...") instead of what you offer, exceeding one page, including salary requirements unless asked, using an unprofessional email address in your header, and addressing it to "To Whom It May Concern" when the hiring manager\'s name is publicly available on LinkedIn or the company website.',
      },
      {
        heading: 'Cover letter tips for specific situations',
        content: 'If you are a career changer, lead with transferable skills and explain your motivation for switching fields in concrete terms. If you have employment gaps, address them briefly and positively. Focus on what you did during the gap (freelancing, coursework, volunteering) and pivot quickly to your qualifications. If you are applying to a startup, keep the tone slightly less formal and emphasize adaptability and ownership. For executive roles, focus on strategic impact and leadership outcomes rather than tactical responsibilities. Regardless of your situation, always proofread carefully. A single typo in a cover letter carries more weight than one on a resume because the letter is meant to demonstrate your communication skills.',
      },
    ],
  },
  'resume-action-words': {
    intro: 'The verbs you use on your resume shape how hiring managers perceive your contributions. Weak, passive language like "responsible for" and "helped with" diminishes your accomplishments, while strong action verbs convey leadership, initiative, and measurable impact. This guide provides categorized action words you can use to make every bullet point on your resume more powerful.',
    sections: [
      {
        heading: 'Why action verbs matter on a resume',
        content: 'Every bullet point in your work experience section should begin with a strong action verb. This is not just a style preference. It directly affects how your accomplishments are perceived. Compare "Was responsible for managing a team of 10 engineers" with "Led a team of 10 engineers to deliver a $2M platform migration ahead of schedule." The second version communicates the same role but demonstrates leadership and results. Action verbs also help with ATS optimization, as many systems weight the verbs used in experience descriptions when ranking candidates.',
      },
      {
        heading: 'Action words for leadership and management',
        content: 'When describing leadership roles, use verbs that convey authority and decision-making: Directed, Orchestrated, Spearheaded, Championed, Oversaw, Governed, Steered, Mentored, Mobilized, Delegated, Supervised, Coordinated, Helmed, Guided, Appointed, Recruited, Cultivated, Empowered, Unified, and Forged. Choose the verb that most accurately reflects your level of involvement. "Spearheaded" implies you initiated something, while "Coordinated" suggests you organized an existing effort. Precision matters. Overstating your role can backfire in interviews when you are asked to elaborate.',
      },
      {
        heading: 'Action words for achievements and results',
        content: 'To highlight measurable accomplishments, reach for verbs that emphasize outcomes: Achieved, Exceeded, Surpassed, Delivered, Generated, Increased, Boosted, Improved, Maximized, Accelerated, Gained, Earned, Expanded, Strengthened, Elevated, Amplified, Doubled, Tripled, Outperformed, and Attained. Always pair these verbs with specific numbers. "Increased quarterly revenue by 28% through a restructured sales pipeline" is far more impactful than "Increased revenue." If you do not have exact figures, use reasonable estimates and indicate them with "approximately" or a tilde.',
      },
      {
        heading: 'Action words for technical and analytical work',
        content: 'For roles involving technical expertise, analysis, or problem-solving, use: Engineered, Architected, Developed, Programmed, Debugged, Automated, Optimized, Analyzed, Diagnosed, Investigated, Evaluated, Modeled, Computed, Forecasted, Quantified, Configured, Integrated, Migrated, Deployed, and Refactored. These verbs signal hands-on technical capability. In technical resumes especially, specificity is key. "Architected a distributed caching layer using Redis that reduced database load by 45%" tells the reader exactly what you did and what technology you used.',
      },
      {
        heading: 'Action words for communication and collaboration',
        content: 'For roles that involve working across teams, client management, or communication: Negotiated, Presented, Authored, Collaborated, Facilitated, Mediated, Persuaded, Advocated, Briefed, Consulted, Liaised, Partnered, Influenced, Articulated, Corresponded, Convinced, Moderated, Proposed, Recommended, and Communicated. These are particularly important for roles in sales, marketing, HR, project management, and any client-facing position. Pair them with context: "Negotiated contract renewals with 15 enterprise accounts, retaining 93% of annual recurring revenue."',
      },
      {
        heading: 'Action words for creativity and innovation',
        content: 'If your work involves creating new things, designing solutions, or driving innovation: Designed, Created, Conceptualized, Pioneered, Launched, Innovated, Invented, Revamped, Transformed, Introduced, Established, Founded, Initiated, Devised, Imagined, Prototyped, Built, Crafted, Produced, and Originated. These verbs work well for roles in design, product development, marketing, and entrepreneurship. Avoid using "Created" or "Built" for everything. Vary your verbs across bullet points to keep each one distinct and engaging. When building your resume in Resumly, review your bullet points to ensure you are not repeating the same action verb more than once on the entire document.',
      },
    ],
  },
  'cv-vs-resume': {
    intro: 'The terms "CV" and "resume" are often used interchangeably, but they serve different purposes depending on your industry, career stage, and geographic location. Understanding the distinction can prevent you from submitting the wrong document and potentially derailing your application. This guide clarifies when to use each one and how they differ.',
    sections: [
      {
        heading: 'The fundamental difference',
        content: 'A resume is a concise, targeted document, typically one to two pages, that summarizes your relevant work experience, skills, and education for a specific job. A curriculum vitae (CV) is a comprehensive document that covers your entire academic and professional history, including publications, research, grants, teaching experience, and conference presentations. In the United States and Canada, resumes are the standard for most private-sector jobs, while CVs are reserved for academic, research, and medical positions. In Europe, the Middle East, Africa, and Asia, "CV" is the common term for what Americans call a resume.',
      },
      {
        heading: 'When to use a resume',
        content: 'Use a resume when applying to most private-sector jobs in the United States and Canada, including roles in technology, business, marketing, finance, engineering, and operations. Resumes should be tailored for each application, highlighting only the experience and skills relevant to the target position. Keep it to one page if you have fewer than 10 years of experience, and no more than two pages for senior professionals. The goal of a resume is to earn an interview, not to document everything you have ever done.',
      },
      {
        heading: 'When to use a CV',
        content: 'Use a CV when applying for academic positions (professor, researcher, postdoctoral fellow), medical roles (physician, surgeon, medical researcher), scientific research positions, grants and fellowships, or any position that explicitly requests a CV. CVs are also standard for most job applications outside North America. Unlike resumes, CVs grow longer as your career progresses. A senior academic might have a CV that runs 10 or more pages. There is no page limit, and completeness is valued over brevity.',
      },
      {
        heading: 'Key structural differences',
        content: 'A resume typically includes a professional summary, work experience, skills, and education. A CV includes all of those plus additional sections such as: Publications, Research Experience, Teaching Experience, Grants and Fellowships, Conference Presentations, Professional Memberships, Academic Honors, Dissertations, and References. Resumes use bullet points to describe accomplishments concisely, while CVs may include more detailed descriptions of research projects and academic contributions. Resumes are optimized for ATS scanning; CVs prioritize thoroughness and academic formatting conventions.',
      },
      {
        heading: 'International considerations',
        content: 'If you are applying for jobs outside North America, research the local conventions before submitting your application. In the UK, Ireland, and New Zealand, "CV" refers to a short document similar to an American resume, usually two pages. In Germany, CVs often include a professional photo, date of birth, and nationality, though this is changing. In many Asian countries, a CV with a photo is standard. In Australia, both terms are used, and the expected document is typically two to three pages. When in doubt, follow the instructions in the job posting or ask the recruiter which format they prefer.',
      },
      {
        heading: 'Converting between a CV and resume',
        content: 'If you have a CV and need to create a resume, start by identifying the most relevant experiences for your target role and cutting everything else. Remove publications, conferences, and teaching experience unless directly relevant. Condense descriptions into achievement-focused bullet points and add a professional summary at the top. If you need to expand a resume into a CV, add sections for publications, research, and academic service, and provide more detail on each role. Resumly\'s builder supports both formats. You can start with a resume template and add academic sections as needed, or build a comprehensive CV and export a condensed version for industry applications.',
      },
    ],
  },
  'resume-with-no-experience': {
    intro: 'Writing a resume when you have little or no professional experience can feel daunting, but everyone starts somewhere. The key is to reframe what counts as experience and present your education, projects, volunteer work, and transferable skills in a way that demonstrates value to employers. This guide shows you exactly how to build a compelling resume from scratch.',
    sections: [
      {
        heading: 'Redefining what counts as experience',
        content: 'When employers say they want "experience," they are really asking whether you can do the job. Formal employment is only one way to demonstrate that. Class projects, capstone work, internships (even unpaid ones), freelance or gig work, volunteer roles, extracurricular leadership, personal projects, and open-source contributions all count. A student who organized a campus event for 500 attendees has demonstrated project management, budgeting, and coordination skills. Someone who built a personal website has shown technical ability and initiative. The goal is to present these experiences using the same professional formatting and achievement-oriented language used for traditional employment.',
      },
      {
        heading: 'Choosing the right resume format',
        content: 'When you lack work history, the standard chronological resume format works against you because it highlights what you do not have. Instead, consider a functional or combination format. A functional resume organizes your resume around skill categories rather than job titles, allowing you to group relevant abilities from various sources. A combination format leads with a skills section and follows with a brief experience section. Both formats shift the reader\'s attention to what you can do rather than where you have worked. However, be aware that some ATS systems and recruiters prefer chronological formats, so if the job posting specifies a preference, follow it.',
      },
      {
        heading: 'Building a strong education section',
        content: 'When you have limited work experience, your education section becomes a primary selling point. List your degree, institution, and graduation date (or expected date). Include your GPA if it is 3.5 or above. Add relevant coursework that aligns with the job you are targeting. A marketing position would benefit from seeing courses like Consumer Behavior, Digital Marketing, and Market Research. List academic honors, dean\'s list recognition, scholarships, and relevant certifications. If you completed a thesis or capstone project, include a brief description with results or scope, treating it like a work experience entry.',
      },
      {
        heading: 'Turning projects and volunteer work into resume entries',
        content: 'Format your projects and volunteer work exactly like professional experience entries: include a title, the organization (or "Personal Project"), dates, and bullet points describing what you did and what you accomplished. Use the same action-verb-plus-result formula. For example: "Designed and developed a budget tracking web application using React and Firebase, attracting 200 users in the first month" or "Coordinated a food drive that collected 2,000 pounds of donations by recruiting and managing a team of 15 volunteers." Quantify wherever possible. Numbers give your contributions weight and credibility.',
      },
      {
        heading: 'Writing a resume objective instead of a summary',
        content: 'Since you do not yet have a track record to summarize, use a resume objective instead of a professional summary. A resume objective states who you are, what relevant skills or education you bring, and what type of role you are seeking. Keep it to two sentences. A strong example: "Recent Computer Science graduate with hands-on experience in Python and JavaScript through academic projects and a summer internship. Seeking a junior developer role where I can contribute to full-stack development while growing my skills in cloud infrastructure." Avoid vague objectives like "Seeking a challenging position". They communicate nothing useful.',
      },
      {
        heading: 'Entry-level resume tips that make a difference',
        content: 'Tailor your resume for each application, even as a new graduate. Match your skills and language to the job posting. Use a clean, professional template. This is not the time for creative design unless you are applying to a design role. Include a LinkedIn profile URL and make sure your profile is complete and consistent with your resume. Remove high school information once you are in college or have graduated. Never include references on the resume itself; "References available upon request" is assumed and wastes space. Proofread meticulously. When you have limited experience, presentation and attention to detail matter even more. Resumly\'s templates are designed to make entry-level resumes look polished and professional without requiring extensive work history to fill the page.',
      },
    ],
  },
  'resume-tips': {
    intro: 'Even small improvements to your resume can significantly increase your chances of landing an interview. Whether you are writing your first resume or updating one you have used for years, these practical tips cover formatting, content, and strategy to help you create a document that stands out to both hiring managers and ATS software.',
    sections: [
      {
        heading: 'Formatting tips that improve readability',
        content: 'Use a clean, single-column layout with clearly defined sections and consistent formatting throughout. Set margins between 0.5 and 1 inch on all sides. Use a professional, readable font like Calibri, Arial, or Garamond at 10-12 point size. Bold your section headings and job titles, but avoid underlining (it can cause ATS parsing errors). Use standard bullet points, not checkmarks, arrows, or other symbols. Leave adequate white space between sections so the resume does not feel cramped. Left-align all text; centered text is harder to scan quickly and can confuse ATS parsers.',
      },
      {
        heading: 'Content tips for stronger bullet points',
        content: 'Every bullet point under your work experience should communicate a specific contribution, not just a duty. Start each bullet with a strong action verb and include a measurable result whenever possible. Limit each role to 4-6 bullet points, focusing on your most impressive and relevant achievements. Remove filler phrases like "duties included" and "responsible for". They add words without adding value. If you managed people, state how many. If you handled a budget, state the amount. If you improved a process, state the percentage improvement. Concrete details make your resume memorable and credible.',
      },
      {
        heading: 'Tailoring your resume for each application',
        content: 'Sending the same resume to every job is one of the most common mistakes job seekers make. Each application should receive a version of your resume that mirrors the language and priorities of the job description. This does not mean rewriting from scratch. Maintain a master resume with all your experience, then create tailored versions by reordering bullet points, adjusting your summary, and emphasizing the skills most relevant to each position. Pay special attention to the keywords used in the posting and make sure they appear in your resume, ideally in context rather than just in a skills list.',
      },
      {
        heading: 'What to leave off your resume',
        content: 'Remove anything that does not strengthen your candidacy. This includes: an objective statement (unless you are entry-level), references or "references available upon request," a headshot or photo (in the US), your full street address (city and state are sufficient), outdated skills like Microsoft Office basics, jobs from more than 15 years ago unless they are highly relevant, hobbies and interests unless they directly relate to the role, and any personal information like age, marital status, or nationality. Every line on your resume should help convince the reader that you are qualified for the specific role.',
      },
      {
        heading: 'Proofreading and final checks',
        content: 'Typos and grammatical errors are among the top reasons hiring managers reject resumes. After writing your resume, step away for at least a few hours before proofreading it. Read it aloud to catch awkward phrasing. Check that all dates are accurate and formatted consistently (choose either "Jan 2023" or "January 2023" and stick with it). Verify that your contact information is correct. A wrong phone number or outdated email will cost you interviews. Have someone else review it as well; fresh eyes catch errors you will miss. Finally, save and submit as a PDF to ensure formatting is preserved across devices.',
      },
      {
        heading: 'Keeping your resume current',
        content: 'Do not wait until you are job hunting to update your resume. Make it a habit to add new accomplishments, skills, certifications, and projects as they happen. Set a calendar reminder to review your resume every quarter. This practice ensures you never forget significant achievements and reduces the stress of a last-minute resume overhaul when an opportunity arises. Keep a running document of quantified accomplishments (revenue generated, costs saved, projects completed, people managed) so you always have fresh material to draw from. Resumly lets you maintain multiple versions of your resume, making it easy to keep a master copy updated while creating role-specific versions when you need them.',
      },
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://resumly.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = BLOG_CONTENT[slug];

  return (
    <>
      <Header />
      <main>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{post.category}</span>
          </nav>

          <header className="mb-10">
            <span className="inline-block text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>By Resumly Careers Team</span>
            </div>
          </header>

          {/* CTA box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Ready to put this into practice?</p>
              <p className="text-sm text-gray-600 mt-1">Build your ATS-optimized resume in minutes with Resumly.</p>
            </div>
            <Button asChild className="flex-shrink-0">
              <Link href="/#hero-input">Build My Resume →</Link>
            </Button>
          </div>

          {/* Article content */}
          {content ? (
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">{content.intro}</p>
              {content.sections.map((section, i) => (
                <div key={i} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl font-medium">This comprehensive guide covers everything you need to know about {post.title.toLowerCase()}.</p>
              <p>Our team of career experts and former recruiters has put together this guide to help you navigate your job search with confidence. Check back soon for the full article.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 bg-blue-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Apply what you learned</h2>
            <p className="text-blue-100 mb-6">Build an ATS-optimized resume with AI. Everything from this guide is built right in.</p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold" size="lg" asChild>
              <Link href="/#hero-input">Build My Resume →</Link>
            </Button>
          </div>

          {/* Related posts */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6">More Resume Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 4).map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors"
                >
                  <p className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors">{related.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{related.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Structured data — BlogPosting + Breadcrumb + FAQ (when content exists) */}
        <ArticleSchema
          type="BlogPosting"
          headline={post.title}
          description={post.description}
          url={`https://resumly.app/blog/${slug}`}
          datePublished={post.date}
          dateModified={post.date}
          authorName="Resumly Careers Team"
          wordCount={
            content
              ? content.intro.split(/\s+/).length +
                content.sections.reduce((n, s) => n + s.content.split(/\s+/).length, 0)
              : undefined
          }
        />
        <BreadcrumbListSchema
          items={[
            { name: 'Home', url: 'https://resumly.app' },
            { name: 'Blog', url: 'https://resumly.app/blog' },
            { name: post.title, url: `https://resumly.app/blog/${slug}` },
          ]}
        />
        {content && (
          <FAQPageSchema
            items={content.sections.slice(0, 6).map((s) => ({
              question: s.heading.endsWith('?') ? s.heading : `${s.heading}?`,
              answer: s.content,
            }))}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
