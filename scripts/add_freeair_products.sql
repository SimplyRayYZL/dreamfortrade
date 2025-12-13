-- FreeAir Products Insert Script
-- Based on 3b-shop.com data with user-provided images
-- Run this in Supabase SQL Editor

-- First, ensure FreeAir brand exists
INSERT INTO brands (name, name_ar, logo_url)
VALUES ('FreeAir', 'فري إير', 'https://i.imgur.com/freeair-logo.png')
ON CONFLICT (name) DO NOTHING;

-- Delete existing FreeAir products
DELETE FROM products WHERE brand_id = (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air');

-- =====================================================
-- AS Series (Inverter) - بارد/ساخن موفر للطاقة
-- =====================================================
INSERT INTO products (name, brand_id, price, old_price, capacity, type, model, description, features, is_active, stock, image_url)
VALUES 
-- AS-12HR - 1.5 HP - 14,799 EGP (Sold Out on 3b-shop)
(
  'تكييف فري إير AS-12HR قدرة 1.5 حصان بارد ساخن انفرتر موفر للطاقة',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  14799,
  NULL,
  '1.5 حصان',
  'بارد/ساخن',
  'AS-12HR',
  'تكييف فري إير انفرتر 1.5 حصان بارد ساخن موفر للطاقة. يتميز بضمان 5 سنوات وأقوى توفير للطاقة A+++ Class. مزود بخاصية البلازما لتنقية الهواء وتوزيع هوائي ثلاثي الأبعاد لتغطية مساحة أوسع. يعمل على ضغط تيار منخفض ويعمل بكفاءة حتى درجة حرارة 60 درجة مئوية.',
  ARRAY['ضمان 5 سنوات', 'A+++ Class توفير طاقة', 'تقنية البلازما لتنقية الهواء', 'توزيع هوائي ثلاثي الأبعاد', 'يعمل على ضغط تيار منخفض', 'يعمل حتى 60°C', 'انفرتر'],
  false,
  0,
  '/products/freeair-as.jpg'
),
-- AS-18HR - 2.25 HP - 19,250 EGP (Sold Out)
(
  'تكييف فري إير AS-18HR قدرة 2.25 حصان بارد ساخن انفرتر موفر للطاقة',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  19250,
  NULL,
  '2.25 حصان',
  'بارد/ساخن',
  'AS-18HR',
  'تكييف فري إير انفرتر 2.25 حصان بارد ساخن موفر للطاقة. يتميز بضمان 10 سنوات وأقوى توفير للطاقة A+++ Class. مزود بخاصية البلازما وتوزيع هوائي ثلاثي الأبعاد.',
  ARRAY['ضمان 10 سنوات', 'A+++ Class توفير طاقة', 'تقنية البلازما', 'توزيع هوائي ثلاثي الأبعاد', 'يعمل على ضغط تيار منخفض', 'يعمل حتى 60°C', 'انفرتر'],
  false,
  0,
  '/products/freeair-as.jpg'
),
-- AS-24HR - 3 HP - 22,000 EGP (Sold Out)
(
  'تكييف فري إير AS-24HR قدرة 3 حصان بارد ساخن انفرتر موفر للطاقة',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  22000,
  NULL,
  '3 حصان',
  'بارد/ساخن',
  'AS-24HR',
  'تكييف فري إير انفرتر 3 حصان بارد ساخن موفر للطاقة. مزود بتقنية البلازما وتوزيع هوائي ثلاثي الأبعاد. يعمل بكفاءة حتى 60 درجة مئوية.',
  ARRAY['ضمان شامل', 'A+++ Class توفير طاقة', 'تقنية البلازما', 'توزيع هوائي ثلاثي الأبعاد', 'يعمل حتى 60°C', 'انفرتر'],
  false,
  0,
  '/products/freeair-as.jpg'
),
-- AS-30HR - 4 HP - 36,500 EGP (was 38,999) (Sold Out)
(
  'تكييف فري إير AS-30HR قدرة 4 حصان بارد ساخن انفرتر موفر للطاقة',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  36500,
  38999,
  '4 حصان',
  'بارد/ساخن',
  'AS-30HR',
  'تكييف فري إير انفرتر 4 حصان بارد ساخن موفر للطاقة. مثالي للمساحات الكبيرة. مزود بتقنية البلازما وتوزيع هوائي ممتاز.',
  ARRAY['ضمان شامل', 'A+++ Class توفير طاقة', 'تقنية البلازما', 'للمساحات الكبيرة', 'يعمل حتى 60°C', 'انفرتر'],
  false,
  0,
  '/products/freeair-as.jpg'
),
-- AS-36HR - 5 HP - 92,000 EGP (Sold Out)
(
  'تكييف فري إير AS-36HR قدرة 5 حصان بارد ساخن موفر للطاقة',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  92000,
  NULL,
  '5 حصان',
  'بارد/ساخن',
  'AS-36HR',
  'تكييف فري إير 5 حصان بارد ساخن موفر للطاقة. قوة تبريد وتدفئة عالية للمساحات الكبيرة جداً.',
  ARRAY['ضمان شامل', 'للمساحات الكبيرة جداً', 'قوة تبريد عالية', 'انفرتر'],
  false,
  0,
  '/products/freeair-as.jpg'
);

-- =====================================================
-- FR Series (New Relax) - نيو ريلاكس
-- =====================================================
INSERT INTO products (name, brand_id, price, capacity, type, model, description, features, is_active, stock, image_url)
VALUES 
-- FR-12CR - 1.5 HP Cold Only - 19,500 EGP (Sold Out)
(
  'تكييف فري إير نيو ريلاكس FR-12CR قدرة 1.5 حصان بارد',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  19500,
  '1.5 حصان',
  'بارد فقط',
  'FR-12CR',
  'تكييف فري إير نيو ريلاكس 1.5 حصان بارد فقط. تصميم عصري وأداء ممتاز.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'نيو ريلاكس'],
  false,
  0,
  '/products/freeair-fr.png'
),
-- FR-12HR - 1.5 HP Hot/Cold - 21,400 EGP (Sold Out)
(
  'تكييف فري إير نيو ريلاكس FR-12HR قدرة 1.5 حصان بارد ساخن',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  21400,
  '1.5 حصان',
  'بارد/ساخن',
  'FR-12HR',
  'تكييف فري إير نيو ريلاكس 1.5 حصان بارد وساخن. تصميم عصري مع خاصية التدفئة.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'تدفئة شتوية', 'نيو ريلاكس'],
  false,
  0,
  '/products/freeair-fr.png'
),
-- FR-18CR - 2.25 HP Cold Only - 28,000 EGP (Sold Out)
(
  'تكييف فري إير نيو ريلاكس FR-18CR قدرة 2.25 حصان بارد',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  28000,
  '2.25 حصان',
  'بارد فقط',
  'FR-18CR',
  'تكييف فري إير نيو ريلاكس 2.25 حصان بارد فقط. قوة تبريد ممتازة.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'نيو ريلاكس'],
  false,
  0,
  '/products/freeair-fr.png'
),
-- FR-18HR - 2.25 HP Hot/Cold - 30,500 EGP
(
  'تكييف فري إير نيو ريلاكس FR-18HR قدرة 2.25 حصان بارد ساخن',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  30500,
  '2.25 حصان',
  'بارد/ساخن',
  'FR-18HR',
  'تكييف فري إير نيو ريلاكس 2.25 حصان بارد وساخن. تصميم عصري مع خاصية التدفئة.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'تدفئة شتوية', 'نيو ريلاكس'],
  false,
  0,
  '/products/freeair-fr.png'
),
-- FR-24CR - 3 HP Cold Only - 34,800 EGP (Sold Out)
(
  'تكييف فري إير نيو ريلاكس FR-24CR قدرة 3 حصان بارد',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  34800,
  '3 حصان',
  'بارد فقط',
  'FR-24CR',
  'تكييف فري إير نيو ريلاكس 3 حصان بارد فقط. قوة تبريد عالية.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'نيو ريلاكس'],
  false,
  0,
  '/products/freeair-fr.png'
),
-- FR-24HR - 3 HP Hot/Cold - 37,000 EGP (Sold Out)
(
  'تكييف فري إير نيو ريلاكس FR-24HR قدرة 3 حصان بارد ساخن',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  37000,
  '3 حصان',
  'بارد/ساخن',
  'FR-24HR',
  'تكييف فري إير نيو ريلاكس 3 حصان بارد وساخن. تصميم عصري مع خاصية التدفئة.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'تدفئة شتوية', 'نيو ريلاكس'],
  false,
  0,
  '/products/freeair-fr.png'
),
-- FR-18CR Special Edition - 2.25 HP - 28,500 EGP (extra listing from screenshot)
(
  'تكييف سبليت فري إير نيو ريلاكس 2.25 حصان بارد أبيض FR-18CR',
  (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1),
  28500,
  '2.25 حصان',
  'بارد فقط',
  'FR-18CR-M',
  'تكييف سبليت فري إير نيو ريلاكس 2.25 حصان بارد أبيض. تصميم أنيق وأداء ممتاز.',
  ARRAY['تصميم عصري', 'هدوء تام', 'توفير طاقة', 'نيو ريلاكس', 'لون أبيض'],
  false,
  0,
  '/products/freeair-fr.png'
);

-- Verify the insert
SELECT name, price, capacity, type, model, is_active FROM products 
WHERE brand_id = (SELECT id FROM brands WHERE name = 'FreeAir' OR name = 'Free Air' LIMIT 1)
ORDER BY price;
