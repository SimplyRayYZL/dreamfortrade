const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqbhwuuftchurkybrykk.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYmh3dXVmdGNodXJreWJyeWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3MDQyMSwiZXhwIjoyMDgwODQ2NDIxfQ.w6Rzroe2j2EQZIoArkx2PXa7se9gtwno-3uucPl3Q_I';

const supabase = createClient(supabaseUrl, serviceKey);

async function fixRLS() {
    console.log("=== Fixing RLS Policies ===\n");

    // Run SQL to completely rebuild RLS
    const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
            -- Disable RLS temporarily
            ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
            
            -- Drop all policies
            DROP POLICY IF EXISTS "public_select" ON site_settings;
            DROP POLICY IF EXISTS "auth_insert" ON site_settings;
            DROP POLICY IF EXISTS "auth_update" ON site_settings;
            DROP POLICY IF EXISTS "auth_delete" ON site_settings;
            DROP POLICY IF EXISTS "allow_public_read" ON site_settings;
            DROP POLICY IF EXISTS "allow_authenticated_all" ON site_settings;
            
            -- Re-enable RLS
            ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
            
            -- Create super simple policies
            CREATE POLICY "anyone_read" ON site_settings FOR SELECT USING (true);
            CREATE POLICY "anyone_write" ON site_settings FOR INSERT WITH CHECK (true);
            CREATE POLICY "anyone_update" ON site_settings FOR UPDATE USING (true) WITH CHECK (true);
            CREATE POLICY "anyone_delete" ON site_settings FOR DELETE USING (true);
        `
    });

    if (error) {
        console.log("Note: rpc exec_sql not available, that's OK");
        console.log("Trying alternative approach...\n");

        // Try direct table operation - just test if we can update
        const testUpdate = await supabase
            .from('site_settings')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', 'main')
            .select();

        console.log("Direct update test result:", testUpdate);
    } else {
        console.log("✅ RLS policies updated!");
    }
}

fixRLS();
