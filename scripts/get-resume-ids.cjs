const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yfgtdhmpmaqzloewrujv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI'
);

supabase.auth.signInWithPassword({ email: 'yj.digitall@gmail.com', password: 'Resumly2024!' })
.then(({ data, error }) => {
  if (error) { console.error('Login error:', error.message); return; }
  return supabase.from('resumes').select('id, template').eq('user_id', data.user.id).order('updated_at', { ascending: false });
}).then(({ data, error }) => {
  if (error) { console.error('Fetch error:', error.message); return; }
  const map = {};
  for (const r of data) {
    if (!map[r.template]) map[r.template] = r.id;
  }
  console.log(JSON.stringify(map, null, 2));
}).catch(e => console.error(e.message));
