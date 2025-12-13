-- Tornado Products Insert Script
-- Based on 3b-shop.com data
-- Run this in Supabase SQL Editor

-- Delete existing Tornado products that are NOT in any orders (to avoid foreign key errors)
DELETE FROM products 
WHERE brand_id IN (SELECT id FROM brands WHERE name = 'Tornado' OR name_ar = 'تورنيدو')
AND id NOT IN (SELECT DISTINCT product_id FROM order_items WHERE product_id IS NOT NULL);

-- =====================================================
-- Tornado Air Conditioner Products
-- =====================================================
INSERT INTO products (name, brand_id, price, old_price, capacity, type, model, description, features, is_active, stock, image_url)
VALUES 
-- TY-VX12ZEE - 1.5 HP Hot/Cold Inverter Digital Plasma Shield (Sold Out)
(
  'تكييف تورنيدو اسبليت 1.5 حصان بارد ساخن انفرتر ديجيتال بلازما شيلد أبيض TY-VX12ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  0,
  NULL,
  '1.5 حصان',
  'بارد/ساخن',
  'TY-VX12ZEE',
  'تكييف تورنيدو اسبليت انفرتر ديجيتال 1.5 حصان بارد ساخن مع تقنية بلازما شيلد لتنقية الهواء.',
  ARRAY['انفرتر', 'ديجيتال', 'بلازما شيلد', 'بارد وساخن', 'أبيض'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-VX12ZEE - 1.5 HP Cold Inverter Digital Plasma Shield (Sold Out)
(
  'تكييف تورنيدو اسبليت 1.5 حصان بارد انفرتر ديجيتال بلازما شيلد أبيض TH-VX12ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  0,
  NULL,
  '1.5 حصان',
  'بارد فقط',
  'TH-VX12ZEE',
  'تكييف تورنيدو اسبليت انفرتر ديجيتال 1.5 حصان بارد فقط مع تقنية بلازما شيلد.',
  ARRAY['انفرتر', 'ديجيتال', 'بلازما شيلد', 'بارد فقط', 'أبيض'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-C12BEE - 1.5 HP Cold Fast Cooling - 22,500 EGP
(
  'تكييف تورنيدو اسبليت 1.5 حصان بارد تبريد سريع أبيض TH-C12BEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  22500,
  NULL,
  '1.5 حصان',
  'بارد فقط',
  'TH-C12BEE',
  'تكييف تورنيدو اسبليت 1.5 حصان بارد مع خاصية التبريد السريع.',
  ARRAY['تبريد سريع', 'بارد فقط', 'أبيض'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-H12YEE - 1.5 HP Cold Digital Plasma Shield - 22,500 EGP (Sold Out)
(
  'تكييف تورنيدو اسبليت 1.5 حصان بارد ديجيتال بلازما شيلد أبيض TH-H12YEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  22500,
  NULL,
  '1.5 حصان',
  'بارد فقط',
  'TH-H12YEE',
  'تكييف تورنيدو اسبليت ديجيتال 1.5 حصان بارد مع بلازما شيلد.',
  ARRAY['ديجيتال', 'بلازما شيلد', 'بارد فقط', 'أبيض'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TY-VX18ZEE - 2.25 HP Hot/Cold Inverter Digital Plasma Shield (Sold Out)
(
  'تكييف تورنيدو اسبليت 2.25 حصان بارد ساخن انفرتر ديجيتال بلازما شيلد أبيض TY-VX18ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  0,
  NULL,
  '2.25 حصان',
  'بارد/ساخن',
  'TY-VX18ZEE',
  'تكييف تورنيدو اسبليت انفرتر ديجيتال 2.25 حصان بارد ساخن مع بلازما شيلد.',
  ARRAY['انفرتر', 'ديجيتال', 'بلازما شيلد', 'بارد وساخن', 'أبيض'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-VX18ZEE - 2.25 HP Cold Inverter Digital Plasma Shield (Sold Out)
(
  'تكييف تورنيدو اسبليت 2.25 حصان بارد انفرتر ديجيتال بلازما شيلد أبيض TH-VX18ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  0,
  NULL,
  '2.25 حصان',
  'بارد فقط',
  'TH-VX18ZEE',
  'تكييف تورنيدو اسبليت انفرتر ديجيتال 2.25 حصان بارد مع بلازما شيلد.',
  ARRAY['انفرتر', 'ديجيتال', 'بلازما شيلد', 'بارد فقط', 'أبيض'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TY-C18WEE - 2.25 HP Hot/Cold Standard - 19,825 EGP
(
  'تكييف تورنيدو اسبليت 2.25 حصان بارد ساخن ستاندرد أبيض TY-C18WEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  19825,
  NULL,
  '2.25 حصان',
  'بارد/ساخن',
  'TY-C18WEE',
  'تكييف تورنيدو اسبليت ستاندرد 2.25 حصان بارد ساخن. سعر اقتصادي.',
  ARRAY['ستاندرد', 'بارد وساخن', 'أبيض', 'اقتصادي'],
  true,
  10,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-C18ZEE - 2.25 HP Cold Digital (Sold Out)
(
  'تكييف تورنيدو اسبليت 2.25 حصان بارد ديجيتال TH-C18ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  0,
  NULL,
  '2.25 حصان',
  'بارد فقط',
  'TH-C18ZEE',
  'تكييف تورنيدو اسبليت ديجيتال 2.25 حصان بارد فقط.',
  ARRAY['ديجيتال', 'بارد فقط'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TY-VX24ZEE - 3 HP Hot/Cold Inverter Digital Plasma Shield (Sold Out)
(
  'تكييف تورنيدو اسبليت 3 حصان بارد ساخن انفرتر ديجيتال بلازما شيلد أبيض TY-VX24ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  0,
  NULL,
  '3 حصان',
  'بارد/ساخن',
  'TY-VX24ZEE',
  'تكييف تورنيدو اسبليت انفرتر ديجيتال 3 حصان بارد ساخن مع بلازما شيلد. للمساحات الكبيرة.',
  ARRAY['انفرتر', 'ديجيتال', 'بلازما شيلد', 'بارد وساخن', '3 حصان'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-VX24ZEE - 3 HP Cold Inverter Digital Plasma Shield - 30,499 EGP (was 30,725) (Sold Out)
(
  'تكييف تورنيدو اسبليت 3 حصان بارد انفرتر ديجيتال بلازما شيلد أبيض TH-VX24ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  30499,
  30725,
  '3 حصان',
  'بارد فقط',
  'TH-VX24ZEE',
  'تكييف تورنيدو اسبليت انفرتر ديجيتال 3 حصان بارد مع بلازما شيلد.',
  ARRAY['انفرتر', 'ديجيتال', 'بلازما شيلد', 'بارد فقط', '3 حصان'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
),
-- TH-C24ZEE - 3 HP Cold Digital - 36,000 EGP (Sold Out)
(
  'تكييف تورنيدو اسبليت 3 حصان بارد ديجيتال TH-C24ZEE',
  (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1),
  36000,
  NULL,
  '3 حصان',
  'بارد فقط',
  'TH-C24ZEE',
  'تكييف تورنيدو اسبليت ديجيتال 3 حصان بارد فقط. قوة تبريد ممتازة.',
  ARRAY['ديجيتال', 'بارد فقط', '3 حصان'],
  false,
  0,
  'https://3b-shop.com/wp-content/uploads/2022/05/tornado-ac.jpeg'
);

-- Verify the insert
SELECT name, price, capacity, type, model, is_active FROM products 
WHERE brand_id = (SELECT id FROM brands WHERE name = 'Tornado' LIMIT 1)
ORDER BY price;
