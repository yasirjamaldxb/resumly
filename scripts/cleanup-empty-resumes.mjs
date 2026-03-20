import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yfgtdhmpmaqzloewrujv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const { data: users } = await supabase.auth.admin.listUsers();
const user = users.users.find(u => u.email === 'yj.digitall@gmail.com');

const { data: resumes } = await supabase
  .from('resumes')
  .select('id, title')
  .eq('user_id', user.id)
  .eq('title', 'My Resume');

console.log(`Found ${resumes.length} empty "My Resume" entries to delete`);

for (const r of resumes) {
  const { error } = await supabase.from('resumes').delete().eq('id', r.id);
  if (error) console.error(`❌ ${r.id}:`, error.message);
  else console.log(`🗑 Deleted: ${r.id}`);
}

console.log('Done!');
