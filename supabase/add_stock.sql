-- =====================================================
-- ADD STOCK COLUMN TO PRODUCTS
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add stock column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Update existing products to have default stock of 10
UPDATE products SET stock = 10 WHERE stock IS NULL OR stock = 0;

-- Verify the change
SELECT id, name, stock FROM products LIMIT 5;
