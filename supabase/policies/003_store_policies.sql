-- Policies: 003_store_policies.sql
-- Description: RLS policies for stores table
-- Date: 2024-01-01

-- Store owners can view their stores
CREATE POLICY "Store owners can view their stores" ON stores
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Store owners can update their stores
CREATE POLICY "Store owners can update their stores" ON stores
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Store owners can insert their stores
CREATE POLICY "Store owners can insert their stores" ON stores
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Store owners can delete their stores
CREATE POLICY "Store owners can delete their stores" ON stores
    FOR DELETE USING (auth.uid()::text = user_id::text); 