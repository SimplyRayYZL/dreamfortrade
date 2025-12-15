-- =====================================================
-- Create Brand Logos Storage Bucket
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create storage bucket for brand logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for brand logos
DROP POLICY IF EXISTS "Public can view brand logos" ON storage.objects;
CREATE POLICY "Public can view brand logos" ON storage.objects 
FOR SELECT USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Allow uploads to brand logos" ON storage.objects;
CREATE POLICY "Allow uploads to brand logos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Allow updates to brand logos" ON storage.objects;
CREATE POLICY "Allow updates to brand logos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Allow deletes from brand logos" ON storage.objects;
CREATE POLICY "Allow deletes from brand logos" ON storage.objects 
FOR DELETE USING (bucket_id = 'brand-logos');

-- Verify
SELECT id, name, public FROM storage.buckets WHERE id = 'brand-logos';
