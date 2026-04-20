#!/usr/bin/env node
// Pulls visitor/funnel data from Supabase to understand what the ~50 Google
// visitors this week actually did. Reads env from .env.local via Node's
// --env-file flag (see package.json or run:  node --env-file=.env.local scripts/traffic-report.mjs ).

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const DAYS = parseInt(process.argv[2] || '14', 10);
const since = new Date();
since.setDate(since.getDate() - DAYS);
const sinceISO = since.toISOString();

const fmt = (n) => (n == null ? '0' : String(n));
const pct = (a, b) => (b === 0 ? '0%' : `${((a / b) * 100).toFixed(1)}%`);

console.log(`\n═══════════════════════════════════════════════════`);
console.log(`  Resumly traffic & funnel report · last ${DAYS} days`);
console.log(`═══════════════════════════════════════════════════\n`);

// 1. Signups
const { count: newUsers } = await supabase
  .from('profiles')
  .select('id', { count: 'exact', head: true })
  .gte('created_at', sinceISO);

const { count: totalUsers } = await supabase
  .from('profiles')
  .select('id', { count: 'exact', head: true });

// 2. Resumes created
const { count: newResumes } = await supabase
  .from('resumes')
  .select('id', { count: 'exact', head: true })
  .gte('created_at', sinceISO);

const { count: totalResumes } = await supabase
  .from('resumes')
  .select('id', { count: 'exact', head: true });

// 3. Applications + jobs parsed
let newApplications = 0;
let newJobs = 0;
try {
  const r1 = await supabase.from('applications').select('id', { count: 'exact', head: true }).gte('created_at', sinceISO);
  newApplications = r1.count || 0;
} catch {}
try {
  const r2 = await supabase.from('jobs').select('id', { count: 'exact', head: true }).gte('created_at', sinceISO);
  newJobs = r2.count || 0;
} catch {}

// 4. Email leads (ATS checker)
let newEmailLeads = 0;
try {
  const r = await supabase.from('ats_email_leads').select('email', { count: 'exact', head: true }).gte('created_at', sinceISO);
  newEmailLeads = r.count || 0;
} catch {}

// 5. Analytics events breakdown
const { data: events } = await supabase
  .from('analytics_events')
  .select('event_type, metadata, created_at, user_id')
  .gte('created_at', sinceISO)
  .order('created_at', { ascending: false })
  .limit(5000);

const eventCounts = new Map();
const uniqUserIds = new Set();
const uniqAnonIds = new Set();
for (const e of events || []) {
  eventCounts.set(e.event_type, (eventCounts.get(e.event_type) || 0) + 1);
  if (e.user_id) uniqUserIds.add(e.user_id);
  const anon = e.metadata?.anon_id || e.metadata?.session_id;
  if (anon) uniqAnonIds.add(anon);
}

// 6. AI usage (did anyone hit paid endpoints?)
let aiCalls = 0, aiCost = 0;
try {
  const { data: ai } = await supabase
    .from('ai_usage_log')
    .select('estimated_cost, endpoint')
    .gte('created_at', sinceISO);
  aiCalls = ai?.length || 0;
  aiCost = (ai || []).reduce((s, r) => s + Number(r.estimated_cost || 0), 0);
} catch {}

// 7. Errors
let errorCount = 0;
try {
  const { count } = await supabase.from('error_logs').select('id', { count: 'exact', head: true }).gte('created_at', sinceISO);
  errorCount = count || 0;
} catch {}

// 8. Latest 10 signups — where did they land?
const { data: recentSignups } = await supabase
  .from('profiles')
  .select('id, created_at, subscription_tier, onboarding_complete')
  .gte('created_at', sinceISO)
  .order('created_at', { ascending: false })
  .limit(15);

console.log('📊 CORE METRICS');
console.log('───────────────────────────────────────────────────');
console.log(`  Signups (new profiles)       ${fmt(newUsers)} (total: ${fmt(totalUsers)})`);
console.log(`  Resumes created              ${fmt(newResumes)} (total: ${fmt(totalResumes)})`);
console.log(`  Jobs parsed                  ${fmt(newJobs)}`);
console.log(`  Applications created         ${fmt(newApplications)}`);
console.log(`  ATS email leads              ${fmt(newEmailLeads)}`);
console.log(`  AI endpoint calls            ${fmt(aiCalls)} ($${aiCost.toFixed(4)} spent)`);
console.log(`  Errors logged                ${fmt(errorCount)}`);
console.log('');

console.log('👥 UNIQUE VISITORS (from analytics_events)');
console.log('───────────────────────────────────────────────────');
console.log(`  Unique logged-in user_ids    ${uniqUserIds.size}`);
console.log(`  Unique anon/session ids      ${uniqAnonIds.size}`);
console.log(`  Total events captured        ${events?.length || 0}`);
console.log('');

if (eventCounts.size > 0) {
  console.log('🎯 EVENT FUNNEL (top 20 event types)');
  console.log('───────────────────────────────────────────────────');
  const sorted = [...eventCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  for (const [type, count] of sorted) {
    console.log(`  ${type.padEnd(36)} ${String(count).padStart(6)}`);
  }
  console.log('');
}

// Derive rough funnel metrics
const viewEvents = [...eventCounts.entries()].filter(([t]) => /view|visit|page/i.test(t));
const ctaEvents = [...eventCounts.entries()].filter(([t]) => /click|cta|paste|submit/i.test(t));
const signupEvents = [...eventCounts.entries()].filter(([t]) => /sign|signup|register|auth/i.test(t));

const totalViews = viewEvents.reduce((s, [, c]) => s + c, 0);
const totalCTA = ctaEvents.reduce((s, [, c]) => s + c, 0);
const totalSignupEvents = signupEvents.reduce((s, [, c]) => s + c, 0);

console.log('📉 ROUGH FUNNEL (derived from events)');
console.log('───────────────────────────────────────────────────');
console.log(`  Page views / visits          ${totalViews}`);
console.log(`  CTA interactions             ${totalCTA}  (${pct(totalCTA, totalViews)} of views)`);
console.log(`  Signup-related events        ${totalSignupEvents}`);
console.log(`  Actual signups               ${newUsers}  (${pct(newUsers || 0, totalViews)} of views)`);
console.log(`  Resumes built                ${newResumes}  (${pct(newResumes || 0, newUsers || 1)} of signups)`);
console.log(`  Jobs parsed                  ${newJobs}`);
console.log(`  Applications                 ${newApplications}`);
console.log('');

console.log('🆕 RECENT SIGNUPS (last 15)');
console.log('───────────────────────────────────────────────────');
for (const p of recentSignups || []) {
  const d = new Date(p.created_at).toISOString().slice(0, 16).replace('T', ' ');
  const tier = (p.subscription_tier || 'free').padEnd(6);
  const onb = p.onboarding_complete ? '✓' : '·';
  console.log(`  ${d}  tier=${tier}  onboarded=${onb}  id=${p.id.slice(0, 8)}…`);
}
console.log('');

// Sample metadata from a few events to understand what info we actually capture
console.log('🔍 SAMPLE EVENT METADATA (first 5 with metadata)');
console.log('───────────────────────────────────────────────────');
const withMeta = (events || []).filter((e) => e.metadata && Object.keys(e.metadata).length > 0).slice(0, 5);
for (const e of withMeta) {
  console.log(`  ${e.event_type}:`);
  console.log(`    ${JSON.stringify(e.metadata).slice(0, 200)}`);
}
console.log('');

console.log('✓ Done');
