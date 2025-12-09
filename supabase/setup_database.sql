-- =====================================================
-- Dream Elevate Shop - Database Setup & Data Migration
-- Run this in Supabase SQL Editor
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
CREATE POLICY "Allow public read access on brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);

-- 10. Create policies for authenticated users
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert orders" ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
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

-- =====================================================
-- SEED DATA - Brands
-- =====================================================

INSERT INTO brands (name, name_ar, logo_url, product_count, is_active) VALUES
('General', 'جنرال', '/brands/general.png', 12, true),
('Fresh', 'فريش', '/brands/fresh.png', 8, true),
('Carrier', 'كاريير', '/brands/carrier.png', 6, true),
('Midea', 'ميديا', '/brands/midea.png', 7, true),
('Sharp', 'شارب', '/brands/sharp.png', 5, true),
('Tornado', 'تورنيدو', '/brands/tornado.png', 4, true),
('Haier', 'هاير', '/brands/haier.png', 5, true);

-- =====================================================
-- SEED DATA - Products
-- =====================================================

-- Get brand IDs for inserting products
DO $$
DECLARE
    general_id UUID;
    fresh_id UUID;
    carrier_id UUID;
    midea_id UUID;
    sharp_id UUID;
    tornado_id UUID;
    haier_id UUID;
BEGIN
    SELECT id INTO general_id FROM brands WHERE name = 'General';
    SELECT id INTO fresh_id FROM brands WHERE name = 'Fresh';
    SELECT id INTO carrier_id FROM brands WHERE name = 'Carrier';
    SELECT id INTO midea_id FROM brands WHERE name = 'Midea';
    SELECT id INTO sharp_id FROM brands WHERE name = 'Sharp';
    SELECT id INTO tornado_id FROM brands WHERE name = 'Tornado';
    SELECT id INTO haier_id FROM brands WHERE name = 'Haier';

    -- تكييفات جنرال
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url, model) VALUES
    ('تكييف جنرال 3 حصان بارد/ساخن Super Fast', general_id, 32999, 36999, 4.8, '3 حصان', 'بارد ساخن', ARRAY['يعمل حتى 175 فولت', 'تبريد سريع Turbo', 'بارد ساخن'], '/products/general-3hp.jpg', 'AS24TD4LAA'),
    ('تكييف جنرال 2.25 حصان بارد/ساخن Super Fast', general_id, 25999, 29999, 4.9, '2.25 حصان', 'بارد ساخن', ARRAY['يعمل حتى 175 فولت', 'تبريد سريع Turbo', 'بارد ساخن'], '/products/general-2.25hp.jpg', 'AS18TD4LAA'),
    ('تكييف جنرال 1.5 حصان بارد/ساخن Super Fast', general_id, 18999, 21999, 4.7, '1.5 حصان', 'بارد ساخن', ARRAY['يعمل حتى 175 فولت', 'تبريد سريع Turbo', 'بارد ساخن'], '/products/general-1.5hp.jpg', 'AS12TB4LAA'),
    ('تكييف جنرال 3 حصان بارد فقط Super Fast', general_id, 29999, 33999, 4.6, '3 حصان', 'بارد فقط', ARRAY['يعمل حتى 175 فولت', 'تبريد سريع Turbo', 'اقتصادي'], '/products/general-3hp-cold.jpg', 'AS24TD4LAA'),
    ('تكييف جنرال 2.25 حصان بارد فقط Super Fast', general_id, 22999, 25999, 4.8, '2.25 حصان', 'بارد فقط', ARRAY['يعمل حتى 175 فولت', 'تبريد سريع Turbo', 'اقتصادي'], '/products/general-2.25hp-cold.jpg', 'AS18TD4LAA'),
    ('تكييف جنرال 1.5 حصان بارد فقط Super Fast', general_id, 15999, 18999, 4.7, '1.5 حصان', 'بارد فقط', ARRAY['يعمل حتى 175 فولت', 'تبريد سريع Turbo', 'اقتصادي'], '/products/general-1.5hp-cold.jpg', 'AS12TB4LAA'),
    ('تكييف جنرال 3 حصان PURITY INVERTER PLUS - توفير 60%', general_id, 42999, 48999, 4.9, '3 حصان', 'بارد ساخن', ARRAY['انفرتر', 'توفير 60% طاقة', 'شاشة LED', 'يعمل حتى 175 فولت'], '/products/general-inverter-3hp.jpg', 'PU-AS24FB1ERA'),
    ('تكييف جنرال 2.25 حصان PURITY INVERTER PLUS - توفير 60%', general_id, 35999, 39999, 4.8, '2.25 حصان', 'بارد ساخن', ARRAY['انفرتر', 'توفير 60% طاقة', 'شاشة LED', 'يعمل حتى 175 فولت'], '/products/general-inverter-2.25hp.jpg', 'PU-AS18FB1ERA'),
    ('تكييف جنرال 1.5 حصان PURITY INVERTER PLUS - توفير 60%', general_id, 28999, 32999, 4.9, '1.5 حصان', 'بارد ساخن', ARRAY['انفرتر', 'توفير 60% طاقة', 'شاشة LED', 'يعمل حتى 175 فولت'], '/products/general-inverter-1.5hp.jpg', 'PU-AS12FB1ERA'),
    ('تكييف جنرال 5 حصان بارد ساخن TITAN', general_id, 55999, 62999, 4.7, '5 حصان', 'بارد ساخن', ARRAY['قوة عالية', 'مناسب للمساحات الكبيرة', 'ضمان شامل'], '/products/general-titan-5hp.jpg', NULL),
    ('تكييف جنرال 4 حصان بارد ساخن TITAN', general_id, 48999, 54999, 4.6, '4 حصان', 'بارد ساخن', ARRAY['قوة عالية', 'مناسب للمساحات الكبيرة', 'ضمان شامل'], '/products/general-titan-4hp.jpg', NULL),
    ('تكييف جنرال 3 حصان Triple Clean بلازما', general_id, 34999, 38999, 4.8, '3 حصان', 'بارد ساخن', ARRAY['تنقية بلازما', 'Triple Clean', 'تنقية الهواء'], '/products/general-plasma-3hp.jpg', NULL);

    -- تكييفات فريش
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url, description) VALUES
    ('تكييف فريش تربو 1.5 حصان بارد بدون بلازما', fresh_id, 13999, 16999, 4.5, '1.5 حصان', 'بارد فقط', ARRAY['خاصية التتبع', 'فريون R410A صديق للبيئة', 'اقتصادي'], '/products/fresh-turbo-1.5hp.jpg', 'يتميز بخاصية التتبع التي تعمل على وجود سينسور بالريموت'),
    ('تكييف فريش تربو 2.25 حصان بارد بلازما', fresh_id, 18999, 21999, 4.6, '2.25 حصان', 'بارد فقط', ARRAY['بلازما', 'خاصية التتبع', 'فريون R410A'], '/products/fresh-turbo-2.25hp.jpg', NULL),
    ('تكييف فريش سمارت انفرتر 1.5 حصان', fresh_id, 22999, 25999, 4.7, '1.5 حصان', 'بارد ساخن', ARRAY['انفرتر', 'ذكي', 'توفير الطاقة'], '/products/fresh-smart-1.5hp.jpg', NULL);

    -- تكييفات كاريير
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url, model) VALUES
    ('كاريير أوبتيماكس 1.5 حصان بارد ساخن', carrier_id, 19999, 22999, 4.8, '1.5 حصان', 'بارد ساخن', ARRAY['بلازما', 'شاشة LED', 'ضمان 5 سنوات'], '/products/carrier-optimax-1.5hp.jpg', '53QHCT12N'),
    ('كاريير أوبتيماكس 2.25 حصان بارد ساخن', carrier_id, 25999, 29999, 4.9, '2.25 حصان', 'بارد ساخن', ARRAY['بلازما', 'شاشة LED', 'ضمان 5 سنوات'], '/products/carrier-optimax-2.25hp.jpg', '53QHCT18N'),
    ('كاريير انفرتر 1.5 حصان بارد ساخن', carrier_id, 28999, 32999, 4.9, '1.5 حصان', 'بارد ساخن', ARRAY['انفرتر', 'توفير الطاقة', 'هادئ جداً'], '/products/carrier-inverter-1.5hp.jpg', NULL);

    -- تكييفات ميديا
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url, model) VALUES
    ('ميديا ميراكو ميشن 1.5 حصان بارد فقط', midea_id, 14999, 17999, 4.5, '1.5 حصان', 'بارد فقط', ARRAY['شاشة LED', 'خاصية تربو', 'ضمان 5 سنوات'], '/products/midea-mission-1.5hp.jpg', 'MSMB1T-12CR'),
    ('ميديا ميراكو ميشن 2.25 حصان بارد فقط', midea_id, 19999, 22999, 4.6, '2.25 حصان', 'بارد فقط', ARRAY['شاشة LED', 'خاصية تربو', 'ضمان 5 سنوات'], '/products/midea-mission-2.25hp.jpg', 'MSMB1T-18CR'),
    ('ميديا انفرتر 3 حصان بارد ساخن', midea_id, 38999, 43999, 4.8, '3 حصان', 'بارد ساخن', ARRAY['انفرتر', 'واي فاي', 'توفير الطاقة'], '/products/midea-inverter-3hp.jpg', NULL);

    -- تكييفات شارب
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url) VALUES
    ('تكييف شارب انفرتر 1.5 حصان بارد فقط', sharp_id, 21999, 24999, 4.7, '1.5 حصان', 'بارد فقط', ARRAY['انفرتر', 'بلازما كلاستر', 'توفير الطاقة'], '/products/sharp-inverter-1.5hp.jpg'),
    ('تكييف شارب انفرتر 2.25 حصان بارد ساخن', sharp_id, 28999, 32999, 4.8, '2.25 حصان', 'بارد ساخن', ARRAY['انفرتر', 'بلازما كلاستر', 'تنقية الهواء'], '/products/sharp-inverter-2.25hp.jpg');

    -- تكييفات تورنيدو
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url) VALUES
    ('تكييف تورنيدو 1.5 حصان بارد فقط', tornado_id, 12999, 15999, 4.4, '1.5 حصان', 'بارد فقط', ARRAY['اقتصادي', 'ضمان 5 سنوات', 'تبريد سريع'], '/products/tornado-1.5hp.jpg'),
    ('تكييف تورنيدو 2.25 حصان بارد ساخن', tornado_id, 17999, 20999, 4.5, '2.25 حصان', 'بارد ساخن', ARRAY['اقتصادي', 'ضمان 5 سنوات', 'بارد ساخن'], '/products/tornado-2.25hp.jpg');

    -- تكييفات هاير
    INSERT INTO products (name, brand_id, price, old_price, rating, capacity, type, features, image_url) VALUES
    ('تكييف هاير 1.5 حصان بارد فقط', haier_id, 14999, 17999, 4.5, '1.5 حصان', 'بارد فقط', ARRAY['تبريد سريع', 'هادئ', 'اقتصادي'], '/products/haier-1.5hp.jpg'),
    ('تكييف هاير انفرتر 2.25 حصان بارد ساخن', haier_id, 26999, 30999, 4.7, '2.25 حصان', 'بارد ساخن', ARRAY['انفرتر', 'توفير الطاقة', 'تنقية الهواء'], '/products/haier-inverter-2.25hp.jpg');

END $$;

-- =====================================================
-- CREATE STORAGE BUCKET FOR PRODUCT IMAGES
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow uploads to product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow updates to product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow deletes from product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- =====================================================
-- DONE! Check your tables in Table Editor
-- =====================================================
