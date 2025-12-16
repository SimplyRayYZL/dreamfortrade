-- Create banners table for brand banners
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    logo_url TEXT,
    image_url TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    tagline TEXT,
    gradient TEXT DEFAULT 'from-blue-600 via-blue-700 to-blue-800',
    features JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read access for active banners
CREATE POLICY "Public can view active banners"
ON banners FOR SELECT
USING (is_active = true);

-- Full access for all users (for admin panel)
CREATE POLICY "Allow all operations on banners"
ON banners FOR ALL
USING (true)
WITH CHECK (true);

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner-images', 'banner-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banner images
CREATE POLICY "Public can view banner images"
ON storage.objects FOR SELECT
USING (bucket_id = 'banner-images');

CREATE POLICY "Anyone can upload banner images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'banner-images');

CREATE POLICY "Anyone can update banner images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'banner-images');

CREATE POLICY "Anyone can delete banner images"
ON storage.objects FOR DELETE
USING (bucket_id = 'banner-images');

-- Insert default banners
INSERT INTO banners (brand, logo_url, image_url, title, subtitle, tagline, gradient, features, sort_order) VALUES
(
    'Carrier',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_of_the_Carrier_Corporation.svg/330px-Logo_of_the_Carrier_Corporation.svg.png',
    '/banner-carrier.png',
    'راحة لا مثيل لها',
    'تكييفات كاريير الأمريكية - الاختيار الأمثل',
    'وكيل معتمد',
    'from-blue-600 via-blue-700 to-blue-800',
    '[{"icon": "Zap", "label": "توفير الطاقة"}, {"icon": "Thermometer", "label": "تبريد فوري"}, {"icon": "Wind", "label": "هدوء تام"}, {"icon": "Shield", "label": "ضمان شامل"}]',
    1
),
(
    'Midea',
    NULL,
    '/banner-midea.png',
    'تكنولوجيا متطورة',
    'أفضل أسعار تكييفات ميديا في مصر',
    'موزع رسمي',
    'from-cyan-500 via-cyan-600 to-teal-600',
    '[{"icon": "Settings", "label": "انفرتر"}, {"icon": "Snowflake", "label": "تبريد قوي"}, {"icon": "Wifi", "label": "تحكم ذكي"}, {"icon": "Leaf", "label": "موفر للطاقة"}]',
    2
),
(
    'Sharp',
    'https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Sharp_Corporation.svg',
    '/banner-sharp.png',
    'الجودة اليابانية',
    'تكييفات شارب - تقنية بلازما كلاستر',
    'وكيل حصري',
    'from-red-600 via-red-700 to-rose-700',
    '[{"icon": "Snowflake", "label": "بلازما كلاستر"}, {"icon": "Wind", "label": "هواء نقي"}, {"icon": "Wifi", "label": "تحكم عن بعد"}, {"icon": "Leaf", "label": "صديق للبيئة"}]',
    3
);

-- Verify
SELECT * FROM banners ORDER BY sort_order;
