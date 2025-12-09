// Generate complete SQL file with tables + data
// Run with: node generate_complete_sql.mjs

import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('fetched_data.json', 'utf-8'));

function escapeSQL(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''").replace(/&#8211;/g, '-').replace(/&#8212;/g, '-') + "'";
}

function arrayToSQL(arr) {
    if (!arr || arr.length === 0) return "'{}'";
    const escaped = arr.map(item => String(item).replace(/'/g, "''").replace(/&#8211;/g, '-').replace(/&#8212;/g, '-'));
    return `ARRAY['${escaped.join("','")}']`;
}

let sql = `-- =====================================================
-- Dream Elevate Shop - Complete Database Setup
-- Run this in Supabase SQL Editor
-- Contains: Tables + ${data.brands.length} Brands + ${data.products.length} Products
-- =====================================================

-- 1. Create ENUM types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create brands table
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    name_ar VARCHAR NOT NULL,
    logo_url VARCHAR,
    product_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    brand_id UUID REFERENCES brands(id),
    price DECIMAL NOT NULL,
    old_price DECIMAL,
    rating DECIMAL DEFAULT 4.5,
    capacity VARCHAR,
    type VARCHAR,
    features TEXT[],
    model VARCHAR,
    description TEXT,
    image_url VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    full_name VARCHAR,
    phone VARCHAR,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    customer_name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL NOT NULL,
    status order_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for public read access
DROP POLICY IF EXISTS "Allow public read access on brands" ON brands;
CREATE POLICY "Allow public read access on brands" ON brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);

-- 10. Create policies for authenticated users
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert orders" ON orders;
CREATE POLICY "Users can insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view order items for their orders" ON order_items;
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);

DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their profile" ON profiles;
CREATE POLICY "Users can insert their profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. Create has_role function
CREATE OR REPLACE FUNCTION has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow uploads to product images" ON storage.objects;
CREATE POLICY "Allow uploads to product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow updates to product images" ON storage.objects;
CREATE POLICY "Allow updates to product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow deletes from product images" ON storage.objects;
CREATE POLICY "Allow deletes from product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- =====================================================
-- CLEAR EXISTING DATA
-- =====================================================
DELETE FROM products;
DELETE FROM brands;

-- =====================================================
-- INSERT BRANDS (${data.brands.length} brands)
-- =====================================================
INSERT INTO brands (id, name, name_ar, logo_url, product_count, is_active, created_at) VALUES
`;

const brandRows = data.brands.map(b => {
    return `('${b.id}', ${escapeSQL(b.name)}, ${escapeSQL(b.name_ar)}, ${escapeSQL(b.logo_url)}, ${b.product_count || 0}, ${b.is_active}, '${b.created_at}')`;
});
sql += brandRows.join(',\n') + ';\n\n';

sql += `-- =====================================================
-- INSERT PRODUCTS (${data.products.length} products)
-- =====================================================
INSERT INTO products (id, name, brand_id, price, old_price, capacity, type, features, image_url, model, description, rating, is_active, created_at, updated_at) VALUES
`;

const productRows = data.products.map(p => {
    return `('${p.id}', ${escapeSQL(p.name)}, '${p.brand_id}', ${p.price || 0}, ${p.old_price || 'NULL'}, ${escapeSQL(p.capacity)}, ${escapeSQL(p.type)}, ${arrayToSQL(p.features)}, ${escapeSQL(p.image_url)}, ${escapeSQL(p.model)}, ${escapeSQL(p.description)}, ${p.rating || 4.5}, ${p.is_active}, '${p.created_at}', '${p.updated_at}')`;
});
sql += productRows.join(',\n') + ';\n\n';

sql += `-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Brands' as type, COUNT(*) as count FROM brands
UNION ALL
SELECT 'Products' as type, COUNT(*) as count FROM products;

-- =====================================================
-- DONE! You should see:
-- Brands: ${data.brands.length}
-- Products: ${data.products.length}
-- =====================================================
`;

writeFileSync('complete_setup.sql', sql, 'utf-8');
console.log(`Generated complete_setup.sql`);
console.log(`- Tables: 6 (brands, products, orders, order_items, profiles, user_roles)`);
console.log(`- Brands: ${data.brands.length}`);
console.log(`- Products: ${data.products.length}`);
