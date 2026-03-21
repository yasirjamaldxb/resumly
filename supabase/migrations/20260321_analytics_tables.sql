-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_code TEXT,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);

-- RLS policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics_insert" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "analytics_select" ON analytics_events FOR SELECT USING (true);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "errors_insert" ON error_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "errors_select" ON error_logs FOR SELECT USING (true);
