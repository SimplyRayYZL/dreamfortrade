-- Analytics Events Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    page_url TEXT,
    product_id TEXT,
    product_name TEXT,
    order_id TEXT,
    order_total DECIMAL(10, 2),
    metadata JSONB DEFAULT '{}',
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert events (for tracking)
CREATE POLICY "Allow insert analytics events" ON analytics_events
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only authenticated admins can read events
CREATE POLICY "Allow admin read analytics events" ON analytics_events
    FOR SELECT TO authenticated
    USING (true);

-- Create a view for daily analytics summary
CREATE OR REPLACE VIEW analytics_daily_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT visitor_id) as unique_visitors,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE event_type = 'add_to_cart') as add_to_cart_count,
    COUNT(*) FILTER (WHERE event_type = 'view_cart') as view_cart_count,
    COUNT(*) FILTER (WHERE event_type = 'start_checkout') as start_checkout_count,
    COUNT(*) FILTER (WHERE event_type = 'complete_purchase') as completed_purchases,
    COALESCE(SUM(order_total) FILTER (WHERE event_type = 'complete_purchase'), 0) as total_revenue
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON analytics_daily_summary TO anon, authenticated;
