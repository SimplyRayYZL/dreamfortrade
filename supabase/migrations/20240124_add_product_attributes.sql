-- Add new attributes to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cooling_type text CHECK (cooling_type IN ('cold', 'cold_hot')) DEFAULT 'cold',
ADD COLUMN IF NOT EXISTS is_inverter boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.products.cooling_type IS 'Type of cooling: cold or cold_hot';
COMMENT ON COLUMN public.products.is_inverter IS 'Whether the unit is an inverter type';
