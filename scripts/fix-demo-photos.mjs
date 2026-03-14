import { createClient } from '@supabase/supabase-js';
import https from 'https';

const SUPABASE_URL = 'https://yfgtdhmpmaqzloewrujv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function fetchAsBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchAsBase64(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'image/png';
        resolve(`data:${contentType};base64,${buffer.toString('base64')}`);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Generate simple SVG avatar as base64 (no external dependency)
function generateAvatarBase64(initials, bgColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bgColor}" rx="100"/>
    <text x="100" y="100" text-anchor="middle" dominant-baseline="central" fill="white" font-family="Arial, sans-serif" font-size="80" font-weight="bold">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const { data: users } = await supabase.auth.admin.listUsers();
const user = users.users.find(u => u.email === 'yj.digitall@gmail.com');

const { data: resumes } = await supabase
  .from('resumes')
  .select('*')
  .eq('user_id', user.id);

const photoConfigs = {
  'Sarah Mitchell': { initials: 'SM', color: '#1a91f0' },
  'James Rodriguez': { initials: 'JR', color: '#7c3aed' },
  'Emily Chen': { initials: 'EC', color: '#0d9488' },
  'Priya Sharma': { initials: 'PS', color: '#16a34a' },
  'David Park': { initials: 'DP', color: '#ea580c' },
  'Alex Turner': { initials: 'AT', color: '#8b5cf6' },
  'Lisa Anderson': { initials: 'LA', color: '#2d3748' },
};

for (const resume of resumes) {
  const rd = resume.resume_data;
  if (!rd?.personalDetails) continue;

  const fullName = `${rd.personalDetails.firstName} ${rd.personalDetails.lastName}`;
  const config = photoConfigs[fullName];

  if (config) {
    // Generate SVG avatar as base64
    rd.personalDetails.photo = generateAvatarBase64(config.initials, config.color);

    const { error } = await supabase
      .from('resumes')
      .update({ resume_data: rd })
      .eq('id', resume.id);

    if (error) console.error(`❌ ${fullName}:`, error.message);
    else console.log(`✅ ${fullName} - base64 SVG photo set`);
  }
}

console.log('Done!');
