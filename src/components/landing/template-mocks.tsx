/* -------------------------------------------------------------------------- */
/*  Mini resume mocks — one per template, each a unique person + visual style */
/* -------------------------------------------------------------------------- */

function Section({ title, color = '#2563eb', children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="text-[6px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color }}>{title}</div>
      {children}
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return <li className="text-[6px] text-[#374151] leading-[1.5] pl-1.5 relative before:content-['•'] before:absolute before:left-0">{text}</li>;
}

/* ── 1. ATS PRO — Marcus Johnson, Software Engineer ── */
export function AtsMock() {
  return (
    <div className="w-full h-full bg-white text-[#111] overflow-hidden px-4 pt-4 pb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h1 className="text-[11px] font-bold tracking-tight">Marcus Johnson</h1>
      <p className="text-[6.5px] text-[#2563eb] font-semibold uppercase tracking-wider">Senior Software Engineer</p>
      <p className="text-[5.5px] text-[#64748b] mt-0.5">marcus.j@email.com · +1 (650) 334-7821 · San Francisco, CA</p>
      <div className="border-t border-[#e2e8f0] mt-2 pt-2 space-y-1.5">
        <Section title="Summary">
          <p className="text-[6px] text-[#374151] leading-[1.5]">Full-stack engineer with 9 years building scalable systems at Google and Cloudflare. Expertise in distributed systems, Go, and Kubernetes. Led teams of 12 delivering products used by 50M+ users.</p>
        </Section>
        <Section title="Experience">
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold">Staff Engineer · Google</span><span className="text-[5.5px] text-[#94a3b8]">2020–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Architected microservices handling 2B requests/day on GCP with 99.99% uptime" /><Bullet text="Reduced API latency by 41% by rewriting hot paths in Go + gRPC" /></ul>
          </div>
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold">Senior Engineer · Cloudflare</span><span className="text-[5.5px] text-[#94a3b8]">2016–2020</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Built edge caching layer serving 100TB/day, improving cache-hit ratio to 94%" /><Bullet text="Mentored 6 junior engineers, 3 of whom were promoted to senior" /></ul>
          </div>
        </Section>
        <Section title="Skills">
          <div className="flex flex-wrap gap-0.5">{['Go', 'Kubernetes', 'TypeScript', 'PostgreSQL', 'Redis', 'gRPC', 'Docker', 'AWS'].map(s => <span key={s} className="text-[5.5px] px-1 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded">{s}</span>)}</div>
        </Section>
        <Section title="Education">
          <p className="text-[6.5px] font-semibold">B.Sc. Computer Science · MIT · 2015</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 2. MODERN — Priya Sharma, UX Designer ── */
export function ModernMock() {
  return (
    <div className="w-full h-full bg-white overflow-hidden flex" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-[38%] bg-[#1e293b] text-white px-3 py-4 flex-shrink-0 space-y-3">
        <div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 mb-2 flex items-center justify-center text-[11px] font-bold">PS</div>
          <h1 className="text-[9px] font-bold leading-tight">Priya Sharma</h1>
          <p className="text-[6px] text-violet-300 font-medium mt-0.5">UX / Product Designer</p>
        </div>
        <div className="space-y-0.5">
          {['priya@design.io', 'London, UK', 'linkedin.com/in/priya'].map(c => <p key={c} className="text-[5.5px] text-slate-300">{c}</p>)}
        </div>
        <div>
          <p className="text-[6px] font-bold text-white uppercase tracking-wider mb-1">Skills</p>
          <div className="space-y-1">{['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Framer', 'CSS / HTML'].map(s => (
            <div key={s}>
              <p className="text-[5.5px] text-slate-300 mb-0.5">{s}</p>
              <div className="h-[2px] bg-slate-600 rounded"><div className="h-full bg-violet-400 rounded" style={{ width: ['90%','85%','80%','88%','75%','70%'][['Figma','Prototyping','User Research','Design Systems','Framer','CSS / HTML'].indexOf(s)] }} /></div>
            </div>
          ))}</div>
        </div>
        <div>
          <p className="text-[6px] font-bold text-white uppercase tracking-wider mb-1">Languages</p>
          {['English – Native', 'Hindi – Fluent', 'French – Basic'].map(l => <p key={l} className="text-[5.5px] text-slate-300">{l}</p>)}
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 px-3 py-4 space-y-2">
        <Section title="Profile" color="#7c3aed">
          <p className="text-[6px] text-[#374151] leading-[1.5]">Design leader with 7 years crafting intuitive digital products. Led design at Figma and Monzo, shipping features to 10M+ users. Passionate about accessibility and data-driven design decisions.</p>
        </Section>
        <Section title="Experience" color="#7c3aed">
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold">Lead Designer · Figma</span><span className="text-[5.5px] text-[#94a3b8]">2021–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Designed Config 2023 keynote features seen by 2M+ livestream viewers" /><Bullet text="Built the FigJam component library adopted by 400+ enterprise clients" /></ul>
          </div>
          <div>
            <div className="flex justify-between"><span className="text-[7px] font-bold">Product Designer · Monzo</span><span className="text-[5.5px] text-[#94a3b8]">2018–2021</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Redesigned the payments flow, increasing conversion by 28%" /><Bullet text="Created the Monzo accessibility guidelines adopted company-wide" /></ul>
          </div>
        </Section>
        <Section title="Education" color="#7c3aed">
          <p className="text-[6.5px] font-semibold">M.A. Interaction Design · RCA London · 2017</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 3. PROFESSIONAL — James Okafor, Finance ── */
export function ProfessionalMock() {
  return (
    <div className="w-full h-full bg-white overflow-hidden px-5 pt-4 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="text-center border-b-2 border-[#1e3a5f] pb-2 mb-2">
        <h1 className="text-[13px] font-bold text-[#1e3a5f] tracking-tight">James Okafor</h1>
        <p className="text-[6.5px] text-[#475569] mt-0.5">Investment Banking · Vice President · CFA Charterholder</p>
        <p className="text-[5.5px] text-[#64748b] mt-0.5">james.okafor@finance.com · +1 (212) 445-9020 · New York, NY</p>
      </div>
      <div className="space-y-1.5">
        <Section title="Professional Summary" color="#1e3a5f">
          <p className="text-[6px] text-[#374151] leading-[1.5]">VP at Goldman Sachs with 11 years structuring M&A deals totalling $4.2B. Led IPO advisory for 3 tech unicorns. CFA charterholder and Series 7/63 licensed. Expertise in LBO modelling, DCF analysis, and cross-border transactions.</p>
        </Section>
        <Section title="Professional Experience" color="#1e3a5f">
          <div className="mb-1.5">
            <div className="flex justify-between items-baseline"><span className="text-[7px] font-bold text-[#1e3a5f]">Vice President, Investment Banking</span><span className="text-[5.5px] text-[#94a3b8]">2019 – Present</span></div>
            <p className="text-[6px] italic text-[#64748b]">Goldman Sachs · New York, NY</p>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Executed $1.8B acquisition of SaaS firm; managed 14-person deal team across 3 time zones" /><Bullet text="Advised on Databricks IPO; coordinated roadshow yielding $1.6B raise" /></ul>
          </div>
          <div>
            <div className="flex justify-between items-baseline"><span className="text-[7px] font-bold text-[#1e3a5f]">Associate, M&A Advisory</span><span className="text-[5.5px] text-[#94a3b8]">2015 – 2019</span></div>
            <p className="text-[6px] italic text-[#64748b]">Morgan Stanley · New York, NY</p>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Built 50+ financial models for TMT sector deals across US and EMEA" /><Bullet text="Ranked #1 analyst cohort; fast-tracked to Associate in 2 years" /></ul>
          </div>
        </Section>
        <Section title="Education" color="#1e3a5f">
          <p className="text-[6.5px] font-bold">MBA, Finance · Wharton School, UPenn · 2015</p>
          <p className="text-[6px] text-[#64748b]">B.Sc. Economics (First Class) · London School of Economics · 2013</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 4. MINIMAL — Lena Fischer, Marketing ── */
export function MinimalMock() {
  return (
    <div className="w-full h-full bg-white overflow-hidden px-5 pt-5 pb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h1 className="text-[13px] font-light tracking-[0.05em] text-[#111]">Lena Fischer</h1>
      <p className="text-[6.5px] text-[#6b7280] tracking-widest uppercase mt-0.5">Marketing Director</p>
      <div className="flex gap-3 mt-1 mb-3">
        {['lena@studio.de', 'Berlin, Germany', '+49 30 9921 4480'].map(c => <span key={c} className="text-[5.5px] text-[#9ca3af]">{c}</span>)}
      </div>
      <div className="space-y-2">
        <div className="border-t border-[#f3f4f6] pt-2">
          <p className="text-[5.5px] uppercase tracking-[0.15em] text-[#9ca3af] mb-1">About</p>
          <p className="text-[6px] text-[#374151] leading-[1.6]">Brand strategist with 8 years growing consumer brands across Europe and APAC. Built Zalando's influencer programme from 0 to €22M attributed revenue. Data-led creative with expertise in performance marketing and brand positioning.</p>
        </div>
        <div className="border-t border-[#f3f4f6] pt-2">
          <p className="text-[5.5px] uppercase tracking-[0.15em] text-[#9ca3af] mb-1.5">Experience</p>
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-medium">Marketing Director · Zalando</span><span className="text-[5.5px] text-[#d1d5db]">2020–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Grew Zalando's influencer channel to 8M followers, €22M annual attributed revenue" /><Bullet text="Managed €40M paid media budget across Google, Meta, TikTok, and Pinterest" /></ul>
          </div>
          <div>
            <div className="flex justify-between"><span className="text-[7px] font-medium">Brand Manager · Henkel</span><span className="text-[5.5px] text-[#d1d5db]">2016–2020</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Relaunched Schwarzkopf in 12 markets; brand awareness +34% in 18 months" /></ul>
          </div>
        </div>
        <div className="border-t border-[#f3f4f6] pt-2">
          <p className="text-[5.5px] uppercase tracking-[0.15em] text-[#9ca3af] mb-1">Skills</p>
          <p className="text-[6px] text-[#6b7280]">Brand Strategy · Performance Marketing · Influencer · Analytics · Copywriting · CRM · SEO</p>
        </div>
        <div className="border-t border-[#f3f4f6] pt-2">
          <p className="text-[5.5px] uppercase tracking-[0.15em] text-[#9ca3af] mb-0.5">Education</p>
          <p className="text-[6px] text-[#374151]">M.Sc. International Marketing · HEC Paris · 2016</p>
        </div>
      </div>
    </div>
  );
}

/* ── 5. EXECUTIVE — Victoria Hayes, COO ── */
export function ExecutiveMock() {
  return (
    <div className="w-full h-full overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', background: '#fafaf9' }}>
      <div className="bg-[#0f172a] text-white px-5 py-4">
        <h1 className="text-[13px] font-bold tracking-tight">Victoria Hayes</h1>
        <p className="text-[6.5px] text-amber-300 uppercase tracking-widest font-semibold mt-0.5">Chief Operating Officer</p>
        <div className="flex gap-3 mt-1.5">{['victoria@hayesconsulting.com', 'Boston, MA', '+1 (617) 553-0042'].map(c => <span key={c} className="text-[5.5px] text-slate-400">{c}</span>)}</div>
      </div>
      <div className="px-5 py-3 space-y-2">
        <Section title="Executive Profile" color="#b45309">
          <p className="text-[6px] text-[#374151] leading-[1.5]">C-suite executive with 20 years scaling operations at Fortune 100 companies. As COO at Wayfair, grew revenue from $1.2B to $4.7B while cutting operational costs by $180M. Board member and advisor to 4 Series B+ startups.</p>
        </Section>
        <Section title="Leadership Experience" color="#b45309">
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold">Chief Operating Officer · Wayfair</span><span className="text-[5.5px] text-[#94a3b8]">2018–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Scaled operations from 4,000 to 18,000 employees across 14 global offices" /><Bullet text="Led $180M cost transformation programme; improved EBITDA margin by 8pp" /><Bullet text="Launched same-day delivery in 22 US cities, increasing NPS by 31 points" /></ul>
          </div>
          <div>
            <div className="flex justify-between"><span className="text-[7px] font-bold">SVP Operations · Amazon Logistics</span><span className="text-[5.5px] text-[#94a3b8]">2012–2018</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Built Prime Now fulfilment network across 60 US markets from concept to launch" /><Bullet text="Oversaw $2.4B capital deployment for robotics and automation" /></ul>
          </div>
        </Section>
        <Section title="Education & Board Roles" color="#b45309">
          <p className="text-[6.5px] font-bold">MBA · Harvard Business School · 2004</p>
          <p className="text-[6px] text-[#64748b]">Board Member: Stash Financial · Ro Health · 2 others</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 6. COMPACT — Diego Ramirez, Data Scientist ── */
export function CompactMock() {
  return (
    <div className="w-full h-full bg-white overflow-hidden px-4 pt-3 pb-2" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '6px' }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-[10px] font-bold text-[#111]">Diego Ramirez</h1>
          <p className="text-[6px] text-[#2563eb] font-semibold">Senior Data Scientist · ML Engineer</p>
        </div>
        <div className="text-right text-[5.5px] text-[#94a3b8]"><p>diego.r@ml.co</p><p>Austin, TX</p><p>+1 (512) 334-0091</p></div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-2">
        <div className="space-y-1.5">
          <Section title="Experience" color="#2563eb">
            <div className="mb-1"><div className="flex justify-between"><span className="text-[6.5px] font-bold">ML Engineer · Meta AI</span><span className="text-[5px] text-[#94a3b8]">2022–Now</span></div><ul className="mt-0.5 space-y-0.5"><Bullet text="Built recommendation engine serving 3B users, +18% engagement" /><Bullet text="Reduced model inference latency from 120ms to 28ms" /></ul></div>
            <div className="mb-1"><div className="flex justify-between"><span className="text-[6.5px] font-bold">Data Scientist · Uber</span><span className="text-[5px] text-[#94a3b8]">2019–2022</span></div><ul className="mt-0.5 space-y-0.5"><Bullet text="Surge pricing ML model saved $22M in driver incentive costs" /></ul></div>
          </Section>
          <Section title="Education" color="#2563eb">
            <p className="text-[6px] font-semibold">M.Sc. Machine Learning · Carnegie Mellon · 2019</p>
            <p className="text-[5.5px] text-[#64748b]">B.Sc. Statistics · UT Austin · 2017 · GPA 3.95</p>
          </Section>
        </div>
        <div className="space-y-1.5">
          <Section title="Core Skills" color="#2563eb">
            {['Python', 'PyTorch', 'TensorFlow', 'SQL', 'Spark', 'Airflow', 'AWS SageMaker', 'Docker'].map(s => <p key={s} className="text-[5.5px] py-0.5 px-1 bg-[#eff6ff] rounded mb-0.5 text-[#1d4ed8]">{s}</p>)}
          </Section>
          <Section title="Publications" color="#2563eb">
            <p className="text-[5.5px] text-[#374151] leading-[1.4]">"Efficient Transformers at Scale" — NeurIPS 2023</p>
            <p className="text-[5.5px] text-[#374151] leading-[1.4] mt-0.5">"Real-time Fraud Detection" — KDD 2021</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ── 7. ELEGANT — Isabelle Laurent, Brand Director ── */
export function ElegantMock() {
  return (
    <div className="w-full h-full bg-[#fffdf7] overflow-hidden" style={{ fontFamily: '"Georgia", serif' }}>
      <div className="bg-[#2d1b0e] text-[#f5e6c8] px-5 py-4">
        <h1 className="text-[13px] font-light tracking-[0.08em]">Isabelle Laurent</h1>
        <p className="text-[6px] tracking-[0.2em] uppercase text-[#d4a96a] mt-1">Creative Director · Brand Strategy</p>
        <div className="flex gap-3 mt-1.5">{['isabelle@laurent.fr', 'Paris · New York', '+33 6 80 44 92 11'].map(c => <span key={c} className="text-[5.5px] text-[#c4a882]">{c}</span>)}</div>
      </div>
      <div className="px-5 py-3 space-y-2">
        <Section title="Creative Vision" color="#92400e">
          <p className="text-[6px] text-[#44403c] leading-[1.7] italic">"Design is not just what it looks like — it's how it works." Results-driven creative director with 12 years defining brand identities for luxury and lifestyle brands across Europe and North America.</p>
        </Section>
        <Section title="Selected Experience" color="#92400e">
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold text-[#1c1917]">Creative Director · LVMH</span><span className="text-[5.5px] text-[#a8a29e]">2020–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Led global rebrand of Louis Vuitton's digital identity, increasing online sales by €180M" /><Bullet text="Art-directed 40+ campaigns across print, OOH, and digital for 6 LVMH brands" /></ul>
          </div>
          <div>
            <div className="flex justify-between"><span className="text-[7px] font-bold text-[#1c1917]">Art Director · Chanel Paris</span><span className="text-[5.5px] text-[#a8a29e]">2015–2020</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Developed No.5 centenary campaign; 90M+ global impressions, 3 Cannes Lions" /></ul>
          </div>
        </Section>
        <Section title="Education" color="#92400e">
          <p className="text-[6.5px] font-bold text-[#1c1917]">M.F.A. Graphic Design · École des Arts Décoratifs, Paris · 2013</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 8. TECHNICAL — Arjun Patel, DevOps ── */
export function TechnicalMock() {
  return (
    <div className="w-full h-full bg-[#0d1117] text-[#e6edf3] overflow-hidden px-4 pt-4 pb-2" style={{ fontFamily: '"Courier New", monospace' }}>
      <div className="border border-[#30363d] rounded px-3 py-2 mb-2">
        <p className="text-[5.5px] text-[#8b949e]"># resume.yaml — Arjun Patel</p>
        <h1 className="text-[10px] font-bold text-[#58a6ff] mt-0.5">Arjun Patel</h1>
        <p className="text-[6px] text-[#3fb950]">role: "Principal DevOps Engineer"</p>
        <div className="flex gap-2 mt-1">{['arjun@devops.io', 'Seattle, WA', 'github.com/arjunp'].map(c => <span key={c} className="text-[5px] text-[#8b949e]">{c}</span>)}</div>
      </div>
      <div className="space-y-1.5">
        <Section title="$ experience" color="#58a6ff">
          <div className="mb-1.5 border-l border-[#30363d] pl-2">
            <div className="flex justify-between"><span className="text-[6.5px] font-bold text-[#e6edf3]">Principal DevOps · Microsoft Azure</span><span className="text-[5px] text-[#8b949e]">2021–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><li className="text-[5.5px] text-[#8b949e]">→ Migrated 400+ microservices to AKS; 60% infra cost reduction</li><li className="text-[5.5px] text-[#8b949e]">→ Built zero-downtime deployment pipeline for 1,200+ engineers</li></ul>
          </div>
          <div className="border-l border-[#30363d] pl-2">
            <div className="flex justify-between"><span className="text-[6.5px] font-bold text-[#e6edf3]">SRE Lead · Spotify</span><span className="text-[5px] text-[#8b949e]">2017–2021</span></div>
            <ul className="mt-0.5 space-y-0.5"><li className="text-[5.5px] text-[#8b949e]">→ Achieved 99.995% uptime SLA for 400M+ user platform</li></ul>
          </div>
        </Section>
        <Section title="$ skills --all" color="#58a6ff">
          <div className="flex flex-wrap gap-0.5">{['Kubernetes', 'Terraform', 'Helm', 'ArgoCD', 'Prometheus', 'Go', 'Python', 'AWS', 'Azure', 'GCP', 'Istio', 'Vault'].map(s => <span key={s} className="text-[5px] px-1 py-0.5 border border-[#30363d] rounded text-[#3fb950]">{s}</span>)}</div>
        </Section>
        <Section title="$ education" color="#58a6ff">
          <p className="text-[6px] text-[#8b949e]">B.Tech Computer Science · IIT Bombay · 2017</p>
          <p className="text-[5.5px] text-[#8b949e] mt-0.5">Certs: CKA · AWS SA Pro · Google SRE</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 9. CLASSIC — Eleanor Wright, Financial Analyst ── */
export function ClassicMock() {
  return (
    <div className="w-full h-full bg-white overflow-hidden px-5 pt-4 pb-2" style={{ fontFamily: '"Times New Roman", serif' }}>
      <div className="text-center mb-2">
        <h1 className="text-[14px] font-bold text-[#111] tracking-wide">Eleanor Wright</h1>
        <div className="flex justify-center gap-3 mt-0.5">{['eleanor.w@cpa.com', '(617) 882-3391', 'Boston, MA'].map(c => <span key={c} className="text-[5.5px] text-[#555]">{c}</span>)}</div>
        <div className="border-t-2 border-b border-[#111] mt-1.5 pt-0" />
      </div>
      <div className="space-y-1.5">
        <Section title="OBJECTIVE" color="#111">
          <p className="text-[6px] text-[#333] leading-[1.6]">CPA and CFA Level III candidate with 10 years in financial analysis and FP&A at PwC and Fidelity Investments. Seeking VP Finance role to leverage expertise in financial modelling, M&A due diligence, and strategic planning.</p>
        </Section>
        <Section title="PROFESSIONAL EXPERIENCE" color="#111">
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold underline">Senior Financial Analyst</span><span className="text-[5.5px]">2019 – Present</span></div>
            <p className="text-[6px] italic">Fidelity Investments, Boston, MA</p>
            <ul className="mt-0.5 list-disc pl-3 space-y-0.5"><li className="text-[6px] text-[#333]">Manage $1.4B equity portfolio; outperformed benchmark by 320bps in 2023</li><li className="text-[6px] text-[#333]">Led financial due diligence on 8 acquisitions totalling $620M in enterprise value</li></ul>
          </div>
          <div>
            <div className="flex justify-between"><span className="text-[7px] font-bold underline">Senior Associate, Audit & Advisory</span><span className="text-[5.5px]">2014 – 2019</span></div>
            <p className="text-[6px] italic">PwC, New York, NY</p>
            <ul className="mt-0.5 list-disc pl-3 space-y-0.5"><li className="text-[6px] text-[#333]">Audited financial statements for 12 S&P 500 companies across financial services sector</li></ul>
          </div>
        </Section>
        <Section title="EDUCATION" color="#111">
          <p className="text-[6.5px] font-bold">B.Sc. Accounting (Magna Cum Laude) · Boston University · 2014</p>
        </Section>
        <Section title="CERTIFICATIONS" color="#111">
          <p className="text-[6px] text-[#333]">CPA (Massachusetts) · CFA Level III Candidate · Series 7 &amp; 66</p>
        </Section>
      </div>
    </div>
  );
}

/* ── 10. CREATIVE — Zoe Thompson, Creative Director ── */
export function CreativeMock() {
  return (
    <div className="w-full h-full overflow-hidden flex" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-[40%] flex-shrink-0 px-3 py-4 space-y-2.5" style={{ background: 'linear-gradient(160deg, #f0abfc 0%, #818cf8 50%, #38bdf8 100%)' }}>
        <div>
          <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur mb-2 flex items-center justify-center text-[11px] font-bold text-white">ZT</div>
          <h1 className="text-[9px] font-bold text-white leading-tight">Zoe Thompson</h1>
          <p className="text-[5.5px] text-white/80 mt-0.5 uppercase tracking-wider">Creative Director</p>
        </div>
        <div className="space-y-0.5">
          {['zoe@zoethompson.co', 'Los Angeles, CA', 'zoethompson.co'].map(c => <p key={c} className="text-[5px] text-white/70">{c}</p>)}
        </div>
        <div>
          <p className="text-[5.5px] font-bold text-white uppercase tracking-wider mb-1">Expertise</p>
          {['Brand Identity', 'Motion Design', 'Art Direction', 'Typography', 'Campaign Strategy', '3D / Blender'].map(s => <div key={s} className="flex items-center gap-1 mb-0.5"><div className="w-1 h-1 rounded-full bg-white/60 flex-shrink-0" /><p className="text-[5.5px] text-white/80">{s}</p></div>)}
        </div>
        <div>
          <p className="text-[5.5px] font-bold text-white uppercase tracking-wider mb-1">Awards</p>
          <p className="text-[5px] text-white/70">D&AD Yellow Pencil · 2023</p>
          <p className="text-[5px] text-white/70">One Show Gold · 2022</p>
          <p className="text-[5px] text-white/70">Cannes Lions Silver · 2021</p>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 px-3 py-4 space-y-2">
        <Section title="About" color="#7c3aed">
          <p className="text-[6px] text-[#374151] leading-[1.5]">Award-winning creative director with 10 years defining bold visual identities for global brands. Led creative at Wieden+Kennedy and Pentagram, delivering campaigns seen by hundreds of millions worldwide.</p>
        </Section>
        <Section title="Experience" color="#7c3aed">
          <div className="mb-1.5">
            <div className="flex justify-between"><span className="text-[7px] font-bold">Creative Director · Wieden+Kennedy</span><span className="text-[5.5px] text-[#94a3b8]">2021–Now</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Led Nike 'Never Done' global campaign; 2.4B impressions, D&AD Yellow Pencil" /><Bullet text="Directed brand refresh for Spotify Wrapped 2022 & 2023" /></ul>
          </div>
          <div>
            <div className="flex justify-between"><span className="text-[7px] font-bold">Art Director · Pentagram</span><span className="text-[5.5px] text-[#94a3b8]">2017–2021</span></div>
            <ul className="mt-0.5 space-y-0.5"><Bullet text="Rebranded 3 Fortune 500 companies; projects featured in Eye and Creative Review" /></ul>
          </div>
        </Section>
        <Section title="Education" color="#7c3aed">
          <p className="text-[6.5px] font-semibold">B.F.A. Graphic Design · Rhode Island School of Design · 2014</p>
        </Section>
      </div>
    </div>
  );
}
