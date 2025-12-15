-- =====================================================
-- Fix Products Table - Add missing stock column
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add stock column if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 10;

-- Verify
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';
