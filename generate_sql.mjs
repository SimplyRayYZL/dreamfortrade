// Generate SQL INSERT statements from fetched data
// Run with: node generate_sql.mjs

import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('fetched_data.json', 'utf-8'));

function escapeSQL(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''").replace(/&#8211;/g, '-') + "'";
}

function arrayToSQL(arr) {
    if (!arr || arr.length === 0) return 'NULL';
    const escaped = arr.map(item => String(item).replace(/'/g, "''").replace(/&#8211;/g, '-'));
    return `ARRAY['${escaped.join("','")}']`;
}

let sql = `-- Migration SQL for Dream Elevate Shop
-- Run this in Supabase SQL Editor
-- Generated from ${data.brands.length} brands and ${data.products.length} products

-- 1. Delete existing data (if any)
DELETE FROM products;
DELETE FROM brands;

-- 2. Insert Brands
INSERT INTO brands (id, name, name_ar, logo_url, product_count, is_active, created_at) VALUES
`;

const brandRows = data.brands.map(b => {
    return `('${b.id}', ${escapeSQL(b.name)}, ${escapeSQL(b.name_ar)}, ${escapeSQL(b.logo_url)}, ${b.product_count || 0}, ${b.is_active}, '${b.created_at}')`;
});
sql += brandRows.join(',\n') + ';\n\n';

sql += `-- 3. Insert Products (${data.products.length} total)\nINSERT INTO products (id, name, brand_id, price, old_price, capacity, type, features, image_url, model, description, rating, is_active, created_at, updated_at) VALUES\n`;

const productRows = data.products.map(p => {
    return `('${p.id}', ${escapeSQL(p.name)}, '${p.brand_id}', ${p.price || 0}, ${p.old_price || 'NULL'}, ${escapeSQL(p.capacity)}, ${escapeSQL(p.type)}, ${arrayToSQL(p.features)}, ${escapeSQL(p.image_url)}, ${escapeSQL(p.model)}, ${escapeSQL(p.description)}, ${p.rating || 4.5}, ${p.is_active}, '${p.created_at}', '${p.updated_at}')`;
});
sql += productRows.join(',\n') + ';\n\n';

sql += `-- Verification: Check counts
SELECT 'Brands:' as type, COUNT(*) as count FROM brands
UNION ALL
SELECT 'Products:' as type, COUNT(*) as count FROM products;
`;

writeFileSync('migration_data.sql', sql);
console.log(`Generated migration_data.sql with ${data.brands.length} brands and ${data.products.length} products`);
