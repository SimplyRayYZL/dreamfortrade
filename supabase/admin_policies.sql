-- =====================================================
-- ADMIN RLS POLICIES - Run this in Supabase SQL Editor
-- Allows insert, update, delete on products and brands
-- =====================================================

-- Allow all operations on products (for admin functionality)
DROP POLICY IF EXISTS "Allow public insert on products" ON products;
CREATE POLICY "Allow public insert on products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on products" ON products;
CREATE POLICY "Allow public update on products" ON products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on products" ON products;
CREATE POLICY "Allow public delete on products" ON products FOR DELETE USING (true);

-- Allow all operations on brands (for admin functionality)
DROP POLICY IF EXISTS "Allow public insert on brands" ON brands;
CREATE POLICY "Allow public insert on brands" ON brands FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on brands" ON brands;
CREATE POLICY "Allow public update on brands" ON brands FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on brands" ON brands;
CREATE POLICY "Allow public delete on brands" ON brands FOR DELETE USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('products', 'brands')
ORDER BY tablename, cmd;
