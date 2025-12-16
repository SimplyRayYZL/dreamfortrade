-- Create site_settings table for persistent settings
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (public website needs these)
CREATE POLICY "Anyone can read settings"
ON site_settings FOR SELECT
USING (true);

-- Only authenticated users (admins) can update settings
CREATE POLICY "Authenticated users can update settings"
ON site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow insert for authenticated users
CREATE POLICY "Authenticated users can insert settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Grant permissions
GRANT ALL ON site_settings TO authenticated;
GRANT SELECT ON site_settings TO anon;

-- Insert default empty row if not exists
INSERT INTO site_settings (id, settings)
VALUES ('main', '{}')
ON CONFLICT (id) DO NOTHING;
