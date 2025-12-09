-- =====================================================
-- ORDERS RLS POLICIES - Run this in Supabase SQL Editor
-- Allows insert, select, update on orders and order_items
-- =====================================================

-- Allow public to insert orders (for checkout)
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow public to view orders (for tracking)
DROP POLICY IF EXISTS "Allow public read on orders" ON orders;
CREATE POLICY "Allow public read on orders" ON orders FOR SELECT USING (true);

-- Allow public to update orders (for admin)
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Order items policies
DROP POLICY IF EXISTS "Allow public insert on order_items" ON order_items;
CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on order_items" ON order_items;
CREATE POLICY "Allow public read on order_items" ON order_items FOR SELECT USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, cmd;
