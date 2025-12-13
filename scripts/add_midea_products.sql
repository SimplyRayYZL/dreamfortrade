-- Midea Products Insert Script
-- Based on 3b-shop.com data
-- Run this in Supabase SQL Editor

-- Delete existing Midea products that are NOT in any orders (to avoid foreign key errors)
DELETE FROM products 
WHERE brand_id IN (SELECT id FROM brands WHERE name = 'Midea' OR name_ar = 'ميديا')
AND id NOT IN (SELECT DISTINCT product_id FROM order_items WHERE product_id IS NOT NULL);

-- =====================================================
-- Midea Miraco Products
-- =====================================================
INSERT INTO products (name, brand_id, price, old_price, capacity, type, model, description, features, is_active, stock, image_url)
VALUES 
-- MSCT1-12HR-DN-F - 1.5 HP Hot/Cold Inverter - 33,000 EGP (Sold Out)
(
  'ميديا ميراكو تكييف انفرتر حائطي 1.5 حصان بارد ساخن MSCT1-12HR-DN-F',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  33000,
  NULL,
  '1.5 حصان',
  'بارد/ساخن',
  'MSCT1-12HR-DN-F',
  'تكييف ميديا ميراكو انفرتر 1.5 حصان بارد ساخن. توفير عالي للطاقة وأداء ممتاز.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد وساخن', 'ميراكو'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSCT1-12CR-DN-F - 1.5 HP Cold Inverter - 16,275 EGP (Sold Out)
(
  'ميديا ميراكو ميشن تكييف انفرتر حائطي 1.5 حصان بارد فقط MSCT1-12CR-DN-F',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  16275,
  NULL,
  '1.5 حصان',
  'بارد فقط',
  'MSCT1-12CR-DN-F',
  'تكييف ميديا ميراكو ميشن انفرتر 1.5 حصان بارد فقط. توفير عالي للطاقة.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد فقط', 'ميشن'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSCT1-12HR-NF - 1.5 HP Hot/Cold - 25,000 EGP
(
  'ميديا ميراكو تكييف حائطي 1.5 حصان بارد وساخن MSCT1-12HR-NF',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  25000,
  NULL,
  '1.5 حصان',
  'بارد/ساخن',
  'MSCT1-12HR-NF',
  'تكييف ميديا ميراكو 1.5 حصان بارد وساخن. أداء ممتاز وتصميم أنيق.',
  ARRAY['بارد وساخن', 'ميراكو', 'تصميم أنيق'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSCT1-18CR-DN-F - 2.25 HP Cold Inverter - 25,000 EGP (Sold Out)
(
  'ميديا ميراكو ميشن تكييف انفرتر حائطي 2.25 حصان بارد فقط MSCT1-18CR-DN-F',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  25000,
  NULL,
  '2.25 حصان',
  'بارد فقط',
  'MSCT1-18CR-DN-F',
  'تكييف ميديا ميراكو ميشن انفرتر 2.25 حصان بارد فقط. قوة تبريد عالية.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد فقط', 'ميشن'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSCT1-18HR-DN-F - 2.25 HP Hot/Cold Inverter - 33,100 EGP (Sold Out)
(
  'ميديا ميراكو ميشن تكييف انفرتر حائطي 2.25 حصان بارد ساخن فقط MSCT1-18HR-DN-F',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  33100,
  NULL,
  '2.25 حصان',
  'بارد/ساخن',
  'MSCT1-18HR-DN-F',
  'تكييف ميديا ميراكو ميشن انفرتر 2.25 حصان بارد ساخن. أداء قوي وتوفير طاقة.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد وساخن', 'ميشن'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSC1T-18CR-N - 2.25 HP Cold - 34,500 EGP
(
  'ميديا ميراكو ميشن تكييف حائطي 2.25 حصان بارد فقط MSC1T-18CR-N',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  34500,
  NULL,
  '2.25 حصان',
  'بارد فقط',
  'MSC1T-18CR-N',
  'تكييف ميديا ميراكو ميشن 2.25 حصان بارد فقط.',
  ARRAY['بارد فقط', 'ميشن', 'ميراكو'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSCT1-18HR-N F - 2.25 HP Hot/Cold
(
  'ميديا ميراكو ميشن تكييف حائطي 2.25 حصان بارد ساخن فقط MSCT1-18HR-N',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  23375,
  NULL,
  '2.25 حصان',
  'بارد/ساخن',
  'MSCT1-18HR-N',
  'تكييف ميديا ميراكو ميشن 2.25 حصان بارد ساخن.',
  ARRAY['بارد وساخن', 'ميشن', 'ميراكو'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSC1T-18CR-N Special - 2.25 HP - 46,000 EGP (was 49,100)
(
  'ميديا ميراكو تكييف انفرتر حائطي 1.5 حصان بارد ساخن فقط MSC1T-18CR-N',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  46000,
  49100,
  '1.5 حصان',
  'بارد/ساخن',
  'MSC1T-18CR-N',
  'تكييف ميديا ميراكو انفرتر 1.5 حصان بارد ساخن.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد وساخن'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSCT1-24CR-DN-F - 3 HP Cold Inverter - 32,000 EGP
(
  'ميديا ميراكو ميشن انفرتر تكييف حائطي 3 حصان بارد فقط MSCT1-24CR-DN-F',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  32000,
  NULL,
  '3 حصان',
  'بارد فقط',
  'MSCT1-24CR-DN-F',
  'تكييف ميديا ميراكو ميشن انفرتر 3 حصان بارد فقط. قوة تبريد ممتازة للمساحات الكبيرة.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد فقط', 'ميشن', '3 حصان'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSM1T-CR-24 - 3 HP Cold - 40,000 EGP
(
  'ميديا ميراكو ميشن تكييف حائطي 3 حصان بارد MSM1T-CR-24',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  40000,
  NULL,
  '3 حصان',
  'بارد فقط',
  'MSM1T-CR-24',
  'تكييف ميديا ميراكو ميشن 3 حصان بارد. قوي ومناسب للمساحات الكبيرة.',
  ARRAY['بارد فقط', 'ميشن', '3 حصان'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSC1T-24H-N-F - 3 HP Hot/Cold - 42,500 EGP
(
  'ميديا ميراكو ميشن تكييف حائطي 3 حصان بارد ساخن MSC1T-24H-N-F',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  42500,
  NULL,
  '3 حصان',
  'بارد/ساخن',
  'MSC1T-24H-N-F',
  'تكييف ميديا ميراكو ميشن 3 حصان بارد ساخن. قوي مع خاصية التدفئة.',
  ARRAY['بارد وساخن', 'ميشن', '3 حصان', 'تدفئة'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSM81T-36HRDNF - 5 HP Hot/Cold Inverter - 81,900 EGP (was 88,750) (Sold Out)
(
  'ميديا ميراكو ميشن تكييف حائطي انفرتر 5 حصان بارد ساخن فقط MSM81T-36HRDNF',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  81900,
  88750,
  '5 حصان',
  'بارد/ساخن',
  'MSM81T-36HRDNF',
  'تكييف ميديا ميراكو ميشن انفرتر 5 حصان بارد ساخن. للمساحات الكبيرة جداً.',
  ARRAY['انفرتر', 'توفير طاقة', 'بارد وساخن', 'ميشن', '5 حصان'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- MSMB1T-12CR - 1.5 HP Cold
(
  'ميديا ميراكو ميشن تكييف حائطي 1.5 حصان بارد فقط MSMB1T-12CR',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  24000,
  NULL,
  '1.5 حصان',
  'بارد فقط',
  'MSMB1T-12CR',
  'تكييف ميديا ميراكو ميشن 1.5 حصان بارد فقط. اقتصادي وفعال.',
  ARRAY['بارد فقط', 'ميشن', 'اقتصادي'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
),
-- 2.25 HP - 34,800 EGP
(
  'ميديا ميراكو تكييف حائطي 2.25 حصان بارد فقط',
  (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1),
  34800,
  NULL,
  '2.25 حصان',
  'بارد فقط',
  'MSC1T-18CR',
  'تكييف ميديا ميراكو 2.25 حصان بارد فقط.',
  ARRAY['بارد فقط', 'ميراكو'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/midea-ac.jpeg'
);

-- Verify the insert
SELECT name, price, capacity, type, model, is_active FROM products 
WHERE brand_id = (SELECT id FROM brands WHERE name = 'Midea' LIMIT 1)
ORDER BY price;
