'use client';

import { useState, useEffect, useCallback } from 'react';

interface DashboardData {
  overview: {
    totalUsers: number;
    newUsers: number;
    totalResumes: number;
    recentResumes: number;
    totalEmailLeads: number;
    recentEmailLeads: number;
    totalErrors: number;
    pdfDownloads: number;
    pdfErrors: number;
    atsChecks: number;
    aiSuggestions: number;
  };
  funnel: {
    signups: number;
    resumesCreated: number;
    resumesSaved: number;
    pdfDownloads: number;
    atsChecks: number;
    emailCaptures: number;
  };
  templatePopularity: Record<string, number>;
  eventCounts: Record<string, number>;
  dailySignups: Record<string, number>;
  dailyResumes: Record<string, number>;
  dailyEventsByType: Record<string, Record<string, number>>;
  atsScores: {
    average: number;
    distribution: { excellent: number; good: number; needsWork: number; poor: number };
    total: number;
  };
  completionStats: Record<string, number>;
  recentErrors: Array<{
    id: string;
    endpoint: string;
    error_message: string;
    error_code: string | null;
    user_id: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
  }>;
  aiCosts: {
    totalCost: number;
    totalCalls: number;
    totalTokens: number;
    byEndpoint: Record<string, { cost: number; calls: number }>;
    topUsers: Array<{ userId: string; cost: number; calls: number; tokens: number }>;
    dailyCost: Record<string, number>;
    topAiProfiles: Array<{ id: string; ai_optimizations_used: number; subscription_tier: string; created_at: string }>;
  };
  range: number;
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30');
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'errors' | 'ats' | 'resumes' | 'ai-costs'>('overview');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-neutral-400 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-red-400 text-sm">Failed to load dashboard data.</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'funnel' as const, label: 'Funnel' },
    { id: 'resumes' as const, label: 'Resumes' },
    { id: 'ats' as const, label: 'ATS Checker' },
    { id: 'ai-costs' as const, label: `AI Costs ($${data.aiCosts?.totalCost?.toFixed(2) || '0.00'})` },
    { id: 'errors' as const, label: `Errors (${data.overview.totalErrors})` },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold tracking-tight">Resumly Dashboard</h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Live</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-neutral-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'funnel' && <FunnelTab data={data} />}
        {activeTab === 'resumes' && <ResumesTab data={data} />}
        {activeTab === 'ats' && <ATSTab data={data} />}
        {activeTab === 'ai-costs' && <AICostsTab data={data} />}
        {activeTab === 'errors' && <ErrorsTab data={data} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════

function OverviewTab({ data }: { data: DashboardData }) {
  const o = data.overview;

  const cards = [
    { label: 'Total Users', value: o.totalUsers, sub: `+${o.newUsers} this period`, color: 'blue' },
    { label: 'Total Resumes', value: o.totalResumes, sub: `+${o.recentResumes} this period`, color: 'purple' },
    { label: 'PDF Downloads', value: o.pdfDownloads, sub: o.pdfErrors > 0 ? `${o.pdfErrors} failed` : 'No errors', color: 'green' },
    { label: 'ATS Checks', value: o.atsChecks, sub: `${o.aiSuggestions} AI suggestions`, color: 'amber' },
    { label: 'Email Leads', value: o.totalEmailLeads, sub: `+${o.recentEmailLeads} this period`, color: 'pink' },
    { label: 'Errors', value: o.totalErrors, sub: 'this period', color: o.totalErrors > 0 ? 'red' : 'green' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`rounded-xl border p-4 ${colorMap[card.color]}`}>
            <p className="text-[11px] uppercase tracking-wider opacity-60 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-[11px] mt-1 opacity-60">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily Activity Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DailyChart title="Daily Signups" data={data.dailySignups} color="#3b82f6" days={data.range} />
        <DailyChart title="Daily Resumes Created" data={data.dailyResumes} color="#8b5cf6" days={data.range} />
      </div>

      {/* Events by type */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Event Breakdown (this period)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(data.eventCounts).sort((a, b) => b[1] - a[1]).map(([event, count]) => (
            <div key={event} className="bg-white/5 rounded-lg p-3">
              <p className="text-[11px] text-neutral-500 font-mono">{event}</p>
              <p className="text-lg font-bold text-white">{count}</p>
            </div>
          ))}
          {Object.keys(data.eventCounts).length === 0 && (
            <p className="text-neutral-500 text-sm col-span-4">No events tracked yet. Events will appear as users interact with the site.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// FUNNEL TAB
// ═══════════════════════════════════════════════

function FunnelTab({ data }: { data: DashboardData }) {
  const f = data.funnel;
  const maxVal = Math.max(f.signups, f.resumesCreated, f.pdfDownloads, f.atsChecks, f.emailCaptures, 1);

  const steps = [
    { label: 'Signups', value: f.signups, desc: 'Users who created an account' },
    { label: 'Resumes Created', value: f.resumesCreated, desc: 'Started building a resume' },
    { label: 'Resumes Saved', value: f.resumesSaved, desc: 'Saved their progress' },
    { label: 'PDF Downloads', value: f.pdfDownloads, desc: 'Downloaded their resume' },
  ];

  const atsSteps = [
    { label: 'ATS Checks', value: f.atsChecks, desc: 'Uploaded a resume for ATS check' },
    { label: 'Email Captures', value: f.emailCaptures, desc: 'Gave email to unlock report' },
  ];

  return (
    <div className="space-y-8">
      {/* Main funnel */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-1">Resume Builder Funnel</h3>
        <p className="text-[12px] text-neutral-500 mb-6">How users progress through the resume building flow</p>
        <div className="space-y-4">
          {steps.map((step, i) => {
            const pct = maxVal > 0 ? (step.value / maxVal) * 100 : 0;
            const convRate = i > 0 && steps[i - 1].value > 0
              ? Math.round((step.value / steps[i - 1].value) * 100)
              : null;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-neutral-200">{step.label}</span>
                    <span className="text-[11px] text-neutral-500">{step.desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {convRate !== null && (
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${convRate >= 50 ? 'bg-green-500/10 text-green-400' : convRate >= 20 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                        {convRate}% conv
                      </span>
                    )}
                    <span className="text-lg font-bold text-white w-12 text-right">{step.value}</span>
                  </div>
                </div>
                <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg transition-all duration-500"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ATS funnel */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-1">ATS Checker Funnel</h3>
        <p className="text-[12px] text-neutral-500 mb-6">Lead capture conversion from ATS checker</p>
        <div className="space-y-4">
          {atsSteps.map((step, i) => {
            const atsMax = Math.max(f.atsChecks, f.emailCaptures, 1);
            const pct = (step.value / atsMax) * 100;
            const convRate = i > 0 && atsSteps[i - 1].value > 0
              ? Math.round((step.value / atsSteps[i - 1].value) * 100)
              : null;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-neutral-200">{step.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {convRate !== null && (
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${convRate >= 50 ? 'bg-green-500/10 text-green-400' : convRate >= 20 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                        {convRate}% conv
                      </span>
                    )}
                    <span className="text-lg font-bold text-white w-12 text-right">{step.value}</span>
                  </div>
                </div>
                <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-600 to-pink-500 rounded-lg transition-all duration-500"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {f.atsChecks > 0 && f.emailCaptures > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
            <p className="text-[12px] text-green-400">
              Email capture rate: <strong>{Math.round((f.emailCaptures / f.atsChecks) * 100)}%</strong> —
              {Math.round((f.emailCaptures / f.atsChecks) * 100) >= 30
                ? ' Great conversion rate!'
                : ' Consider making the value proposition clearer.'}
            </p>
          </div>
        )}
      </div>

      {/* Conversion insights */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Growth Insights</h3>
        <div className="space-y-3">
          {f.signups > 0 && f.resumesCreated === 0 && (
            <Insight type="critical" text="Users are signing up but NOT creating resumes. The onboarding flow needs work. Consider auto-creating a resume on signup." />
          )}
          {f.resumesCreated > 0 && f.pdfDownloads === 0 && (
            <Insight type="warning" text="Users create resumes but don't download. The download button might be hard to find, or users abandon before completing their resume." />
          )}
          {f.signups > 0 && f.pdfDownloads > 0 && f.pdfDownloads / f.signups < 0.2 && (
            <Insight type="warning" text={`Only ${Math.round((f.pdfDownloads / f.signups) * 100)}% of signups lead to downloads. Focus on reducing friction in the builder.`} />
          )}
          {f.atsChecks > 0 && f.emailCaptures / f.atsChecks < 0.2 && (
            <Insight type="info" text="Less than 20% of ATS checker users give their email. Consider showing more value before the gate." />
          )}
          {f.signups === 0 && f.atsChecks === 0 && (
            <Insight type="info" text="No activity recorded yet. Events will populate as users interact with the site after tracking is deployed." />
          )}
        </div>
      </div>
    </div>
  );
}

function Insight({ type, text }: { type: 'critical' | 'warning' | 'info'; text: string }) {
  const colors = {
    critical: 'bg-red-500/10 border-red-500/20 text-red-300',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  };
  const icons = { critical: '!!', warning: '!', info: 'i' };
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${colors[type]}`}>
      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{icons[type]}</span>
      <p className="text-[13px] leading-relaxed">{text}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════
// RESUMES TAB
// ═══════════════════════════════════════════════

function ResumesTab({ data }: { data: DashboardData }) {
  const templates = Object.entries(data.templatePopularity).sort((a, b) => b[1] - a[1]);
  const totalResumes = templates.reduce((sum, [, count]) => sum + count, 0) || 1;
  const completion = data.completionStats;

  const completionFields = [
    { key: 'hasName', label: 'Name' },
    { key: 'hasEmail', label: 'Email' },
    { key: 'hasPhone', label: 'Phone' },
    { key: 'hasSummary', label: 'Summary (20+ chars)' },
    { key: 'hasExperience', label: 'Work Experience' },
    { key: 'hasEducation', label: 'Education' },
    { key: 'hasSkills', label: 'Skills' },
    { key: 'hasLinkedIn', label: 'LinkedIn' },
    { key: 'hasProjects', label: 'Projects' },
    { key: 'hasCertifications', label: 'Certifications' },
    { key: 'hasLanguages', label: 'Languages' },
    { key: 'hasPhoto', label: 'Photo' },
  ];

  return (
    <div className="space-y-6">
      {/* Template popularity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-1">Template Popularity</h3>
        <p className="text-[12px] text-neutral-500 mb-5">Which templates users choose (all time)</p>
        <div className="space-y-3">
          {templates.map(([name, count]) => {
            const pct = Math.round((count / totalResumes) * 100);
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-300 font-mono">{name}</span>
                  <span className="text-sm font-semibold text-white">{count} ({pct}%)</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {templates.length === 0 && (
            <p className="text-neutral-500 text-sm">No resumes created yet.</p>
          )}
        </div>
      </div>

      {/* Resume completion */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-1">Resume Completion Analysis</h3>
        <p className="text-[12px] text-neutral-500 mb-5">What % of resumes include each section (this period). Low numbers = users drop off here.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {completionFields.map(field => {
            const pct = completion[field.key] || 0;
            return (
              <div key={field.key} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-neutral-400">{field.label}</span>
                    <span className={`text-[13px] font-bold ${pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {Object.values(completion).some(v => v < 40 && v > 0) && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <p className="text-[12px] text-amber-300">
              Sections with low completion (&lt;40%) indicate where users get stuck or lose interest. Consider: pre-filling with AI suggestions, making fields optional, or improving UX for those sections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ATS TAB
// ═══════════════════════════════════════════════

function ATSTab({ data }: { data: DashboardData }) {
  const ats = data.atsScores;
  const dist = ats.distribution;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Total ATS Checks</p>
          <p className="text-3xl font-bold text-white">{ats.total}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Avg ATS Score</p>
          <p className={`text-3xl font-bold ${ats.average >= 75 ? 'text-green-400' : ats.average >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
            {ats.average || '—'}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Email Capture Rate</p>
          <p className="text-3xl font-bold text-pink-400">
            {ats.total > 0 ? `${Math.round((data.overview.recentEmailLeads / ats.total) * 100)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Score distribution */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Score Distribution</h3>
        {ats.total === 0 ? (
          <p className="text-neutral-500 text-sm">No ATS checks tracked yet.</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Excellent (90-100)', value: dist.excellent, color: 'bg-green-500' },
              { label: 'Good (75-89)', value: dist.good, color: 'bg-blue-500' },
              { label: 'Needs Work (50-74)', value: dist.needsWork, color: 'bg-amber-500' },
              { label: 'Poor (<50)', value: dist.poor, color: 'bg-red-500' },
            ].map(item => {
              const pct = ats.total > 0 ? Math.round((item.value / ats.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-neutral-400">{item.label}</span>
                    <span className="text-[13px] font-bold text-white">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.max(pct, 1)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ATS daily trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DailyChart
          title="Daily ATS Checks"
          data={data.dailyEventsByType['ats_check'] || {}}
          color="#f59e0b"
          days={data.range}
        />
        <DailyChart
          title="Daily Email Captures"
          data={data.dailyEventsByType['ats_email_capture'] || {}}
          color="#ec4899"
          days={data.range}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ERRORS TAB
// ═══════════════════════════════════════════════

function ErrorsTab({ data }: { data: DashboardData }) {
  const errors = data.recentErrors;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-red-400/60 mb-1">Total Errors</p>
          <p className="text-3xl font-bold text-red-400">{data.overview.totalErrors}</p>
          <p className="text-[11px] text-red-400/60 mt-1">this period</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-amber-400/60 mb-1">PDF Errors</p>
          <p className="text-3xl font-bold text-amber-400">{data.overview.pdfErrors}</p>
          <p className="text-[11px] text-amber-400/60 mt-1">download failures</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">API Errors</p>
          <p className="text-3xl font-bold text-white">{data.eventCounts['api_error'] || 0}</p>
          <p className="text-[11px] text-neutral-500 mt-1">this period</p>
        </div>
      </div>

      {/* Error log */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-neutral-300">Recent Error Log</h3>
        </div>
        {errors.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">No errors recorded. Errors will appear here as they occur.</div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {errors.map((err) => (
              <div key={err.id} className="p-4 hover:bg-white/5 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">{err.endpoint}</span>
                      {err.error_code && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400">{err.error_code}</span>
                      )}
                    </div>
                    <p className="text-[13px] text-neutral-300 break-all">{err.error_message}</p>
                    {err.metadata && Object.keys(err.metadata).length > 0 && (
                      <pre className="text-[11px] text-neutral-500 mt-1 font-mono overflow-x-auto">{JSON.stringify(err.metadata, null, 2)}</pre>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 whitespace-nowrap">
                    {new Date(err.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily errors chart */}
      <DailyChart
        title="Daily Errors"
        data={data.dailyEventsByType['api_error'] || {}}
        color="#ef4444"
        days={data.range}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════
// AI COSTS TAB
// ═══════════════════════════════════════════════

function AICostsTab({ data }: { data: DashboardData }) {
  const ai = data.aiCosts;
  if (!ai) return <p className="text-neutral-500 text-sm">No AI usage data yet.</p>;

  const avgCostPerCall = ai.totalCalls > 0 ? ai.totalCost / ai.totalCalls : 0;
  const projectedMonthlyCost = ai.totalCost > 0 && data.range > 0
    ? (ai.totalCost / data.range) * 30
    : 0;

  return (
    <div className="space-y-6">
      {/* Top-level metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-green-400/60 mb-1">Total AI Cost</p>
          <p className="text-3xl font-bold text-green-400">${ai.totalCost.toFixed(4)}</p>
          <p className="text-[11px] text-green-400/60 mt-1">this period</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-blue-400/60 mb-1">Total API Calls</p>
          <p className="text-3xl font-bold text-blue-400">{ai.totalCalls}</p>
          <p className="text-[11px] text-blue-400/60 mt-1">this period</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-purple-400/60 mb-1">Avg Cost/Call</p>
          <p className="text-3xl font-bold text-purple-400">${avgCostPerCall.toFixed(4)}</p>
          <p className="text-[11px] text-purple-400/60 mt-1">{(ai.totalTokens / Math.max(ai.totalCalls, 1)).toFixed(0)} tokens avg</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-amber-400/60 mb-1">Projected /mo</p>
          <p className="text-3xl font-bold text-amber-400">${projectedMonthlyCost.toFixed(2)}</p>
          <p className="text-[11px] text-amber-400/60 mt-1">at current rate</p>
        </div>
      </div>

      {/* Cost by endpoint */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Cost by Endpoint</h3>
        <div className="space-y-3">
          {Object.entries(ai.byEndpoint)
            .sort((a, b) => b[1].cost - a[1].cost)
            .map(([endpoint, stats]) => {
              const pct = ai.totalCost > 0 ? (stats.cost / ai.totalCost) * 100 : 0;
              return (
                <div key={endpoint}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-neutral-300">/api/ai/{endpoint}</span>
                      <span className="text-[11px] text-neutral-500">{stats.calls} calls</span>
                    </div>
                    <span className="text-sm font-bold text-white">${stats.cost.toFixed(4)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          {Object.keys(ai.byEndpoint).length === 0 && (
            <p className="text-neutral-500 text-sm">No AI calls logged yet.</p>
          )}
        </div>
      </div>

      {/* Top users by cost */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-neutral-300">Top Users by AI Cost</h3>
          <p className="text-[12px] text-neutral-500 mt-0.5">Users consuming the most API credits this period</p>
        </div>
        {ai.topUsers.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">No AI usage logged yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-5 gap-4 px-4 py-2 text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              <span>User ID</span>
              <span className="text-right">Calls</span>
              <span className="text-right">Tokens</span>
              <span className="text-right">Cost</span>
              <span className="text-right">Tier</span>
            </div>
            {ai.topUsers.map((u, i) => {
              const profile = ai.topAiProfiles?.find(p => p.id === u.userId);
              return (
                <div key={u.userId} className="grid grid-cols-5 gap-4 px-4 py-3 hover:bg-white/5 transition items-center">
                  <span className="text-[12px] font-mono text-neutral-400 truncate" title={u.userId}>
                    <span className={`inline-block w-4 text-center mr-2 ${i < 3 ? 'text-amber-400' : 'text-neutral-600'}`}>
                      {i + 1}
                    </span>
                    {u.userId.slice(0, 8)}...
                  </span>
                  <span className="text-[13px] text-white text-right font-medium">{u.calls}</span>
                  <span className="text-[13px] text-neutral-300 text-right">{u.tokens.toLocaleString()}</span>
                  <span className={`text-[13px] text-right font-bold ${u.cost > 0.01 ? 'text-red-400' : 'text-green-400'}`}>
                    ${u.cost.toFixed(4)}
                  </span>
                  <span className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      profile?.subscription_tier === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                      profile?.subscription_tier === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-neutral-500/20 text-neutral-400'
                    }`}>
                      {profile?.subscription_tier || 'free'}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profitability insight */}
      {ai.totalCalls > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-neutral-300 mb-4">Profitability Analysis</h3>
          <div className="space-y-3">
            <Insight
              type={projectedMonthlyCost < 5 ? 'info' : projectedMonthlyCost < 20 ? 'warning' : 'critical'}
              text={`Projected monthly AI cost: $${projectedMonthlyCost.toFixed(2)}. ${
                projectedMonthlyCost < 5
                  ? 'Costs are very low. Focus on growth before monetizing.'
                  : projectedMonthlyCost < 20
                    ? 'Costs are manageable but growing. Ensure free users are gated and Pro pricing covers this.'
                    : 'Costs are significant. Verify usage gates are working and consider tightening free tier limits.'
              }`}
            />
            {ai.topUsers.length > 0 && ai.topUsers[0].cost > projectedMonthlyCost * 0.3 && (
              <Insight
                type="warning"
                text={`Top user accounts for ${((ai.topUsers[0].cost / ai.totalCost) * 100).toFixed(0)}% of total cost (${ai.topUsers[0].calls} calls, $${ai.topUsers[0].cost.toFixed(4)}). Check if they're on a paid plan.`}
              />
            )}
          </div>
        </div>
      )}

      {/* Daily cost chart */}
      <DailyChart
        title="Daily AI Cost ($)"
        data={Object.fromEntries(Object.entries(ai.dailyCost).map(([k, v]) => [k, Math.round(v * 10000)]))}
        color="#10b981"
        days={data.range}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════
// DAILY CHART (BAR CHART)
// ═══════════════════════════════════════════════

function DailyChart({ title, data, color, days }: { title: string; data: Record<string, number>; color: string; days: number }) {
  // Generate all days in range
  const allDays: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    allDays.push(d.toISOString().split('T')[0]);
  }

  const values = allDays.map(d => data[d] || 0);
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);

  // Show last N days based on range
  const displayDays = days <= 14 ? allDays : allDays.filter((_, i) => i % Math.ceil(days / 30) === 0 || i === allDays.length - 1);
  const displayValues = days <= 14 ? values : displayDays.map(d => data[d] || 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-300">{title}</h3>
        <span className="text-sm font-bold text-white">{total} total</span>
      </div>
      <div className="flex items-end gap-[2px] h-[120px]">
        {(days <= 14 ? values : displayValues).map((val, i) => {
          const height = max > 0 ? (val / max) * 100 : 0;
          const day = (days <= 14 ? allDays : displayDays)[i];
          return (
            <div
              key={day}
              className="flex-1 group relative"
              title={`${day}: ${val}`}
            >
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-neutral-800 border border-white/10 rounded-md px-2 py-1 text-[10px] text-white whitespace-nowrap shadow-lg">
                  {day}: <strong>{val}</strong>
                </div>
              </div>
              <div
                className="w-full rounded-sm transition-all hover:opacity-80"
                style={{
                  height: `${Math.max(height, 2)}%`,
                  backgroundColor: color,
                  opacity: val === 0 ? 0.15 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-neutral-600">{allDays[0]}</span>
        <span className="text-[10px] text-neutral-600">{allDays[allDays.length - 1]}</span>
      </div>
    </div>
  );
}
