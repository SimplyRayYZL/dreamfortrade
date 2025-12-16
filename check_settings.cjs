const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqbhwuuftchurkybrykk.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYmh3dXVmdGNodXJreWJyeWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3MDQyMSwiZXhwIjoyMDgwODQ2NDIxfQ.w6Rzroe2j2EQZIoArkx2PXa7se9gtwno-3uucPl3Q_I';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkSettings() {
    console.log("=== Checking site_settings table ===\n");

    // 1. Read current data
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single();

    if (error) {
        console.log("❌ Error reading:", error);
    } else {
        console.log("📖 Current data in DB:");
        console.log("   ID:", data.id);
        console.log("   Updated At:", data.updated_at);
        console.log("   Settings:", JSON.stringify(data.settings, null, 2));
    }
}

checkSettings();
