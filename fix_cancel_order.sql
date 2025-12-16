-- Allow authenticated users to update their own orders (e.g. to cancel them)
-- We restrict this to just the 'status' column if possible using triggers, 
-- but for RLS we generally allow UPDATE on the row if user owns it.

CREATE POLICY "Authenticated users can update own orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Also ensure we grant UPDATE permission
GRANT UPDATE ON orders TO authenticated;

-- If existing policies conflict (e.g. deny all), this new policy normally adds permission.
-- But it's good practice to ensure no restrictive policy blocks it.
