// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { products, brand_name } = await req.json();

        // Create Supabase client with Service Role Key (available in Edge Functions env)
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Find Brand ID
        let brand_id = null;
        if (brand_name) {
            const { data: brand, error: brandError } = await supabase
                .from('brands')
                .select('id')
                .or(`name.ilike.%${brand_name}%,name_ar.ilike.%${brand_name}%`)
                .limit(1)
                .single();

            if (brand) brand_id = brand.id;
        }

        console.log(`Importing ${products.length} products for brand ${brand_name} (${brand_id})`);

        const inserted = [];
        const errors = [];

        // 2. Insert Products
        for (const p of products) {
            // Check if exists? Maybe skip for now to keep it simple, or upsert.
            // Using upsert on source_url (scrape_url) would be nice if we had a unique constraint.
            // But let's just insert.

            const productData = {
                name: p.name,
                description: p.description,
                price: p.price,
                image_url: p.image_url,
                brand_id: brand_id,
                stock: p.stock || 10,
                is_active: false, // Draft
                cooling_type: 'cold', // Default
                is_inverter: false, // Default
                features: p.features || ['مستورد تلقائياً']
            };

            const { data, error } = await supabase
                .from('products')
                .insert(productData)
                .select()
                .single();

            if (error) {
                console.error(`Error inserting ${p.name}:`, error);
                errors.push({ name: p.name, error: error.message });
            } else {
                inserted.push(data);
            }
        }

        return new Response(JSON.stringify({ success: true, inserted: inserted.length, errors }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Import error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
