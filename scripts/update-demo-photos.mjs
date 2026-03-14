import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yfgtdhmpmaqzloewrujv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Find the user
const { data: users } = await supabase.auth.admin.listUsers();
const user = users.users.find(u => u.email === 'yj.digitall@gmail.com');
if (!user) { console.error('User not found'); process.exit(1); }

// Get all resumes
const { data: resumes, error } = await supabase
  .from('resumes')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: true });

if (error) { console.error(error); process.exit(1); }

console.log(`Found ${resumes.length} resumes for ${user.email}`);

// Deterministic avatar URLs from UI Avatars (generates letter-based avatars as PNG)
// These are real URLs that render as images
const photoUrls = {
  'Sarah Mitchell': 'https://ui-avatars.com/api/?name=Sarah+Mitchell&size=200&background=1a91f0&color=fff&bold=true&format=png',
  'James Rodriguez': 'https://ui-avatars.com/api/?name=James+Rodriguez&size=200&background=7c3aed&color=fff&bold=true&format=png',
  'Emily Chen': 'https://ui-avatars.com/api/?name=Emily+Chen&size=200&background=0d9488&color=fff&bold=true&format=png',
  'Michael Thompson': '', // No photo for Minimal template (by design)
  'Priya Sharma': 'https://ui-avatars.com/api/?name=Priya+Sharma&size=200&background=16a34a&color=fff&bold=true&format=png',
  'David Park': 'https://ui-avatars.com/api/?name=David+Park&size=200&background=ea580c&color=fff&bold=true&format=png',
  'Rachel Williams': '', // No photo for Compact (dense layout)
  'Alex Turner': 'https://ui-avatars.com/api/?name=Alex+Turner&size=200&background=8b5cf6&color=fff&bold=true&format=png',
  'Lisa Anderson': 'https://ui-avatars.com/api/?name=Lisa+Anderson&size=200&background=2d3748&color=fff&bold=true&format=png',
  'Omar Hassan': '', // No photo for Classic (traditional)
};

for (const resume of resumes) {
  const rd = resume.resume_data;
  if (!rd || !rd.personalDetails) {
    console.log(`⏭ Skipping ${resume.title} - no resume_data`);
    continue;
  }

  const fullName = `${rd.personalDetails.firstName} ${rd.personalDetails.lastName}`;
  const photo = photoUrls[fullName];

  if (photo !== undefined) {
    rd.personalDetails.photo = photo;
  }

  // Ensure the photo field exists (even if empty)
  if (!rd.personalDetails.photo) {
    rd.personalDetails.photo = '';
  }

  const { error: updateError } = await supabase
    .from('resumes')
    .update({ resume_data: rd })
    .eq('id', resume.id);

  if (updateError) {
    console.error(`❌ Error updating ${resume.title}:`, updateError.message);
  } else {
    console.log(`✅ Updated: ${resume.title} ${photo ? '(with photo)' : '(no photo)'}`);
  }
}

console.log('\nDone!');
