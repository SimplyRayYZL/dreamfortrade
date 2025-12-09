// Script to fetch all products from original Supabase and generate SQL
// Run with: node fetch_products.mjs

import { writeFileSync } from 'fs';

const ORIGINAL_SUPABASE_URL = "https://nnepwvkiwbkutfhyaogr.supabase.co";
const ORIGINAL_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZXB3dmtpd2JrdXRmaHlhb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDAxMzgsImV4cCI6MjA4MDcxNjEzOH0.Cg9BCI_2Eu06tJ6se46yFuVop-zrQuuCWotLNwlqwtc";

async function fetchData() {
    try {
        // Fetch brands
        console.log("Fetching brands...");
        const brandsRes = await fetch(`${ORIGINAL_SUPABASE_URL}/rest/v1/brands?select=*`, {
            headers: {
                'apikey': ORIGINAL_ANON_KEY,
                'Authorization': `Bearer ${ORIGINAL_ANON_KEY}`
            }
        });
        const brands = await brandsRes.json();
        console.log(`Found ${brands.length} brands`);

        // Fetch products
        console.log("Fetching products...");
        const productsRes = await fetch(`${ORIGINAL_SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: {
                'apikey': ORIGINAL_ANON_KEY,
                'Authorization': `Bearer ${ORIGINAL_ANON_KEY}`
            }
        });
        const products = await productsRes.json();
        console.log(`Found ${products.length} products`);

        // Save to file
        const data = { brands, products };
        writeFileSync('fetched_data.json', JSON.stringify(data, null, 2));
        console.log("Data saved to fetched_data.json");

    } catch (error) {
        console.error("Error:", error);
    }
}

fetchData();
