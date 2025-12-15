-- =====================================================
-- Admin RLS Policies for Brands & Products
-- Run this in Supabase SQL Editor to allow editing
-- =====================================================

-- Allow all operations on brands (for admin)
DROP POLICY IF EXISTS "Allow public read access on brands" ON brands;
DROP POLICY IF EXISTS "Allow all access on brands" ON brands;
DROP POLICY IF EXISTS "Allow insert on brands" ON brands;
DROP POLICY IF EXISTS "Allow update on brands" ON brands;
DROP POLICY IF EXISTS "Allow delete on brands" ON brands;

CREATE POLICY "Allow all access on brands" ON brands FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on products (for admin)
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow all access on products" ON products;
DROP POLICY IF EXISTS "Allow insert on products" ON products;
DROP POLICY IF EXISTS "Allow update on products" ON products;
DROP POLICY IF EXISTS "Allow delete on products" ON products;

CREATE POLICY "Allow all access on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Verify
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('brands', 'products');
