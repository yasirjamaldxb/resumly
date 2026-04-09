export function ResumeMock() {
  return (
    <div className="w-full h-full bg-white text-[#1a1a2e] font-sans overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="px-7 pt-6 pb-4 border-b-2 border-[#2563eb]">
        <h1 className="text-[18px] font-bold tracking-tight text-[#0f172a]">Sarah Chen</h1>
        <p className="text-[9px] font-semibold text-[#2563eb] uppercase tracking-widest mt-0.5">Senior Product Manager</p>
        <div className="flex flex-wrap gap-x-3 mt-2">
          {[
            { icon: '✉', text: 'sarah.chen@email.com' },
            { icon: '📱', text: '+1 (415) 882-4401' },
            { icon: '📍', text: 'San Francisco, CA' },
            { icon: '🔗', text: 'linkedin.com/in/sarahchen' },
          ].map((item) => (
            <span key={item.text} className="text-[7.5px] text-[#64748b] flex items-center gap-0.5">
              <span className="text-[7px]">{item.icon}</span> {item.text}
            </span>
          ))}
        </div>
      </div>

      <div className="px-7 py-4 space-y-3.5">

        {/* Summary */}
        <div>
          <h2 className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#2563eb] mb-1.5">Professional Summary</h2>
          <p className="text-[7.5px] text-[#374151] leading-[1.6]">
            Results-driven Senior Product Manager with 8+ years driving B2B SaaS growth. Led cross-functional teams of 20+ to ship 0→1 products generating $40M ARR. Expert in Agile, OKRs, roadmap prioritization, and data-informed decision-making. Proven track record at high-growth startups and Fortune 500 companies.
          </p>
        </div>

        {/* Work Experience */}
        <div>
          <h2 className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#2563eb] mb-2">Work Experience</h2>
          <div className="space-y-2.5">

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[8.5px] font-bold text-[#0f172a]">Senior Product Manager</p>
                  <p className="text-[7.5px] text-[#2563eb] font-medium">Stripe · San Francisco, CA</p>
                </div>
                <span className="text-[7px] text-[#94a3b8] whitespace-nowrap">Mar 2021 – Present</span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {[
                  'Led end-to-end product strategy for Stripe Billing, growing MRR by 38% YoY across 12,000+ merchants',
                  'Shipped 6 major feature releases working with 4 engineering squads, reducing time-to-market by 22%',
                  'Defined and tracked 15 KPIs using Amplitude and Looker; improved activation rate from 54% to 79%',
                  'Championed AI-powered fraud detection feature that reduced chargebacks by $2.3M annually',
                ].map((b, i) => (
                  <li key={i} className="text-[7.5px] text-[#374151] leading-[1.5] pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-[#2563eb]">{b}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[8.5px] font-bold text-[#0f172a]">Product Manager</p>
                  <p className="text-[7.5px] text-[#2563eb] font-medium">Notion · New York, NY</p>
                </div>
                <span className="text-[7px] text-[#94a3b8] whitespace-nowrap">Jun 2018 – Feb 2021</span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {[
                  'Owned the Notion API product from 0→1; reached 50,000 developer sign-ups in first 3 months post-launch',
                  'Drove 60% increase in MAU by redesigning the onboarding flow based on 200+ user interviews',
                  'Launched Notion for Teams tier; contributed to Series B narrative that raised $50M at $2B valuation',
                ].map((b, i) => (
                  <li key={i} className="text-[7.5px] text-[#374151] leading-[1.5] pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-[#2563eb]">{b}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[8.5px] font-bold text-[#0f172a]">Associate Product Manager</p>
                  <p className="text-[7.5px] text-[#2563eb] font-medium">Intercom · Dublin, Ireland</p>
                </div>
                <span className="text-[7px] text-[#94a3b8] whitespace-nowrap">Jan 2016 – May 2018</span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {[
                  'Built and shipped Intercom Surveys used by 200+ enterprise clients to collect in-app feedback at scale',
                  'Partnered with design to reduce support ticket volume by 40% through proactive in-app messaging',
                ].map((b, i) => (
                  <li key={i} className="text-[7.5px] text-[#374151] leading-[1.5] pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-[#2563eb]">{b}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#2563eb] mb-1.5">Education</h2>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div>
                <p className="text-[8px] font-bold text-[#0f172a]">MBA, Technology Management</p>
                <p className="text-[7.5px] text-[#64748b]">Stanford Graduate School of Business</p>
              </div>
              <span className="text-[7px] text-[#94a3b8]">2015</span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-[8px] font-bold text-[#0f172a]">B.Sc. Computer Science</p>
                <p className="text-[7.5px] text-[#64748b]">UC Berkeley · GPA 3.9</p>
              </div>
              <span className="text-[7px] text-[#94a3b8]">2013</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#2563eb] mb-1.5">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {['Product Strategy', 'Agile / Scrum', 'OKR Frameworks', 'Roadmap Planning', 'A/B Testing', 'SQL', 'Figma', 'Amplitude', 'Looker', 'User Research', 'Go-to-Market', 'Stakeholder Mgmt', 'API Products', 'Data Analysis'].map(s => (
              <span key={s} className="px-1.5 py-0.5 bg-[#eff6ff] text-[#2563eb] text-[6.5px] font-semibold rounded-sm border border-[#bfdbfe]">{s}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h2 className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#2563eb] mb-1.5">Certifications</h2>
          <div className="space-y-0.5">
            {[
              { name: 'Certified Scrum Product Owner (CSPO)', org: 'Scrum Alliance · 2022' },
              { name: 'Product Analytics Certification', org: 'Amplitude · 2021' },
            ].map(c => (
              <div key={c.name} className="flex justify-between">
                <p className="text-[7.5px] font-medium text-[#0f172a]">{c.name}</p>
                <p className="text-[7px] text-[#94a3b8]">{c.org}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
