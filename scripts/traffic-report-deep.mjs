#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const DAYS = parseInt(process.argv[2] || '14', 10);
const since = new Date(Date.now() - DAYS * 86400000).toISOString();

console.log(`\n═══ Deep traffic report · last ${DAYS} days ═══\n`);

// Full event listing — what are we actually capturing?
const { data: events } = await supabase
  .from('analytics_events')
  .select('event_type, user_id, metadata, created_at')
  .gte('created_at', since)
  .order('created_at', { ascending: true });

console.log(`Total events: ${events?.length || 0}\n`);

// Group by user — individual journeys
const byUser = new Map();
for (const e of events || []) {
  const uid = e.user_id || 'anon';
  if (!byUser.has(uid)) byUser.set(uid, []);
  byUser.get(uid).push(e);
}

console.log(`Unique users with events: ${byUser.size}\n`);

// Print each user's journey (first 20)
console.log('═══ INDIVIDUAL USER JOURNEYS ═══\n');
let n = 0;
for (const [uid, userEvents] of byUser) {
  if (n++ >= 20) break;
  const duration = (new Date(userEvents[userEvents.length - 1].created_at) - new Date(userEvents[0].created_at)) / 1000;
  const types = userEvents.map((e) => e.event_type);
  console.log(`User ${uid.slice(0, 8)} — ${userEvents.length} events · ${duration.toFixed(0)}s total`);
  console.log(`  path: ${types.join(' → ')}`);
  console.log('');
}

// Profile data — signup → activation funnel
const { data: profiles } = await supabase
  .from('profiles')
  .select('id, created_at, subscription_tier, onboarding_complete, ai_optimizations_used, applications_count, job_level, target_role')
  .gte('created_at', since)
  .order('created_at', { ascending: true });

console.log(`\n═══ NEW USERS DETAIL (${profiles?.length || 0}) ═══\n`);
for (const p of profiles || []) {
  const d = new Date(p.created_at).toISOString().slice(0, 16).replace('T', ' ');
  console.log(`${d}  ${p.id.slice(0,8)}  tier=${p.subscription_tier || 'free'}  onb=${p.onboarding_complete?'Y':'N'}  ai_used=${p.ai_optimizations_used||0}  apps=${p.applications_count||0}  role=${p.target_role||'-'}`);
}

// Resume counts per user
const { data: resumes } = await supabase.from('resumes').select('user_id, created_at, template_id').gte('created_at', since);
console.log(`\n═══ RESUMES CREATED (${resumes?.length || 0}) ═══\n`);
const byRUser = new Map();
for (const r of resumes || []) {
  byRUser.set(r.user_id, (byRUser.get(r.user_id) || 0) + 1);
}
console.log(`Unique users who created a resume: ${byRUser.size}`);
const templates = new Map();
for (const r of resumes || []) templates.set(r.template_id, (templates.get(r.template_id) || 0) + 1);
console.log('Template popularity:');
for (const [t, c] of [...templates.entries()].sort((a,b) => b[1]-a[1])) console.log(`  ${t}: ${c}`);

// Applications per user
const { data: apps } = await supabase.from('applications').select('user_id, status, created_at, job_id').gte('created_at', since);
console.log(`\n═══ APPLICATIONS (${apps?.length || 0}) ═══`);
const appStatusCount = new Map();
const byAppUser = new Map();
for (const a of apps || []) {
  appStatusCount.set(a.status, (appStatusCount.get(a.status) || 0) + 1);
  byAppUser.set(a.user_id, (byAppUser.get(a.user_id) || 0) + 1);
}
console.log(`Unique users with an application: ${byAppUser.size}`);
for (const [s, c] of appStatusCount) console.log(`  status=${s}: ${c}`);

// ATS email leads (anon visitors who converted)
const { data: leads } = await supabase.from('ats_email_leads').select('email, created_at, score').gte('created_at', since).order('created_at', { ascending: false });
console.log(`\n═══ ATS EMAIL LEADS (${leads?.length || 0}) ═══`);
for (const l of leads || []) {
  const d = new Date(l.created_at).toISOString().slice(0, 16).replace('T', ' ');
  console.log(`  ${d}  ${l.email}  score=${l.score || '-'}`);
}

// FINAL FUNNEL
console.log(`\n═══ FUNNEL SUMMARY · last ${DAYS} days ═══`);
console.log(`  Google/organic visitors:         ~50  (from your mention — NOT tracked in DB)`);
console.log(`  Signed up (new profiles):        ${profiles?.length || 0}`);
console.log(`  Completed onboarding:            ${(profiles || []).filter(p => p.onboarding_complete).length}`);
console.log(`  Used AI optimize at least once:  ${(profiles || []).filter(p => (p.ai_optimizations_used || 0) > 0).length}`);
console.log(`  Created a resume:                ${byRUser.size}`);
console.log(`  Created an application:          ${byAppUser.size}`);
console.log(`  Upgraded to Starter/Pro:         ${(profiles || []).filter(p => p.subscription_tier && p.subscription_tier !== 'free').length}`);
console.log('');
