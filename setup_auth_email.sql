-- =====================================================
-- GOOGLE AUTH SETUP INSTRUCTIONS
-- =====================================================
-- 
-- Go to Supabase Dashboard → Authentication → Providers → Google
-- 
-- 1. Enable Google provider
-- 2. Get credentials from Google Cloud Console:
--    - Go to: https://console.cloud.google.com/
--    - Create a new project or select existing
--    - Go to APIs & Services → Credentials
--    - Create OAuth 2.0 Client ID (Web application)
--    - Authorized JavaScript origins: https://targetaircool.com
--    - Authorized redirect URIs: https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
-- 3. Copy Client ID and Client Secret to Supabase
-- 
-- =====================================================

-- =====================================================
-- RESEND EMAIL SETUP FOR SUPABASE
-- =====================================================
-- 
-- Go to Supabase Dashboard → Project Settings → Authentication
-- 
-- SMTP Settings:
-- Host: smtp.resend.com
-- Port: 465 (or 587)
-- Username: resend
-- Password: YOUR_RESEND_API_KEY (from resend.com dashboard)
-- Sender email: noreply@yourdomain.com (must be verified in Resend)
-- 
-- =====================================================

-- Create a table to log email notifications
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    email_type TEXT NOT NULL, -- 'order_placed', 'order_confirmed', 'order_shipped'
    recipient_email TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent'
);

-- Enable RLS
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Policy for reading
CREATE POLICY "Users can view their email notifications"
ON email_notifications FOR SELECT
USING (true);

-- =====================================================
-- EDGE FUNCTION FOR ORDER NOTIFICATIONS
-- =====================================================
-- 
-- Create this file: supabase/functions/send-order-notification/index.ts
-- 
-- Then run: supabase functions deploy send-order-notification
-- 
-- =====================================================

-- Create a database trigger to call the edge function when a new order is placed
CREATE OR REPLACE FUNCTION notify_admin_on_order()
RETURNS TRIGGER AS $$
DECLARE
    payload json;
BEGIN
    -- Build the notification payload
    payload := json_build_object(
        'order_id', NEW.id,
        'customer_name', NEW.customer_name,
        'customer_phone', NEW.customer_phone,
        'customer_email', NEW.customer_email,
        'total_amount', NEW.total_amount,
        'admin_email', 'ahmedhossa20008@gmail.com'
    );
    
    -- Call the edge function via pg_net (if available) or use webhook
    -- This is a placeholder - actual implementation depends on your setup
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_on_order();

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Email notifications table created' as status;
