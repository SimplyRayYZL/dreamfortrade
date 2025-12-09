-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images (for admin)
CREATE POLICY "Allow uploads to product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow updates to product images
CREATE POLICY "Allow updates to product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow deletes from product images
CREATE POLICY "Allow deletes from product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');