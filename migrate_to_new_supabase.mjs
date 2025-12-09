// Script to migrate products from old Supabase to new Supabase
// Run with: node migrate_to_new_supabase.mjs

import { readFileSync } from 'fs';

const NEW_SUPABASE_URL = "https://rlunfsddczhxwfsfjnmd.supabase.co";
const NEW_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdW5mc2RkY3poeHdmc2Zqbm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDE5NDgsImV4cCI6MjA4MDgxNzk0OH0.nia0VExQYve20AZ4_l-T-O-TowhjA2Y35hWZaMBnCkw";

async function migrate() {
    try {
        // Read the fetched data
        const data = JSON.parse(readFileSync('fetched_data.json', 'utf-8'));
        console.log(`Loaded ${data.brands.length} brands and ${data.products.length} products`);

        // First, delete existing data
        console.log("\n1. Deleting existing products...");
        const deleteProductsRes = await fetch(`${NEW_SUPABASE_URL}/rest/v1/products?id=neq.00000000-0000-0000-0000-000000000000`, {
            method: 'DELETE',
            headers: {
                'apikey': NEW_ANON_KEY,
                'Authorization': `Bearer ${NEW_ANON_KEY}`,
                'Prefer': 'return=minimal'
            }
        });
        console.log(`Delete products status: ${deleteProductsRes.status}`);

        console.log("2. Deleting existing brands...");
        const deleteBrandsRes = await fetch(`${NEW_SUPABASE_URL}/rest/v1/brands?id=neq.00000000-0000-0000-0000-000000000000`, {
            method: 'DELETE',
            headers: {
                'apikey': NEW_ANON_KEY,
                'Authorization': `Bearer ${NEW_ANON_KEY}`,
                'Prefer': 'return=minimal'
            }
        });
        console.log(`Delete brands status: ${deleteBrandsRes.status}`);

        // Insert brands (keep same IDs for foreign key references)
        console.log("\n3. Inserting brands...");
        const brandsToInsert = data.brands.map(b => ({
            id: b.id,
            name: b.name,
            name_ar: b.name_ar,
            logo_url: b.logo_url,
            product_count: b.product_count,
            is_active: b.is_active,
            created_at: b.created_at
        }));

        const insertBrandsRes = await fetch(`${NEW_SUPABASE_URL}/rest/v1/brands`, {
            method: 'POST',
            headers: {
                'apikey': NEW_ANON_KEY,
                'Authorization': `Bearer ${NEW_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(brandsToInsert)
        });
        console.log(`Insert brands status: ${insertBrandsRes.status}`);
        if (insertBrandsRes.status !== 201) {
            const error = await insertBrandsRes.text();
            console.error("Error inserting brands:", error);
        }

        // Insert products in batches (keep same IDs)
        console.log("\n4. Inserting products...");
        const productsToInsert = data.products.map(p => ({
            id: p.id,
            name: p.name,
            brand_id: p.brand_id,
            price: p.price,
            old_price: p.old_price,
            capacity: p.capacity,
            type: p.type,
            features: p.features,
            image_url: p.image_url,
            model: p.model,
            description: p.description,
            rating: p.rating,
            is_active: p.is_active,
            created_at: p.created_at,
            updated_at: p.updated_at
        }));

        // Insert in batches of 20
        const batchSize = 20;
        for (let i = 0; i < productsToInsert.length; i += batchSize) {
            const batch = productsToInsert.slice(i, i + batchSize);
            const insertProductsRes = await fetch(`${NEW_SUPABASE_URL}/rest/v1/products`, {
                method: 'POST',
                headers: {
                    'apikey': NEW_ANON_KEY,
                    'Authorization': `Bearer ${NEW_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(batch)
            });
            console.log(`Insert products batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToInsert.length / batchSize)}: ${insertProductsRes.status}`);
            if (insertProductsRes.status !== 201) {
                const error = await insertProductsRes.text();
                console.error("Error:", error);
            }
        }

        // Verify
        console.log("\n5. Verifying migration...");
        const verifyBrandsRes = await fetch(`${NEW_SUPABASE_URL}/rest/v1/brands?select=count`, {
            headers: {
                'apikey': NEW_ANON_KEY,
                'Authorization': `Bearer ${NEW_ANON_KEY}`,
                'Prefer': 'count=exact'
            }
        });
        const brandsCount = verifyBrandsRes.headers.get('content-range');
        console.log(`Brands in new DB: ${brandsCount}`);

        const verifyProductsRes = await fetch(`${NEW_SUPABASE_URL}/rest/v1/products?select=count`, {
            headers: {
                'apikey': NEW_ANON_KEY,
                'Authorization': `Bearer ${NEW_ANON_KEY}`,
                'Prefer': 'count=exact'
            }
        });
        const productsCount = verifyProductsRes.headers.get('content-range');
        console.log(`Products in new DB: ${productsCount}`);

        console.log("\n✅ Migration complete!");

    } catch (error) {
        console.error("Error:", error);
    }
}

migrate();
