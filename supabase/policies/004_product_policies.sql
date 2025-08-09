-- Policies: 004_product_policies.sql
-- Description: RLS policies for products and product_variants tables
-- Date: 2024-01-01

-- Product policies
CREATE POLICY "Store owners can view their products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Store owners can update their products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Store owners can insert their products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Store owners can delete their products" ON products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

-- Product variants policies
CREATE POLICY "Store owners can view their product variants" ON product_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products 
            JOIN stores ON stores.id = products.store_id
            WHERE products.id = product_variants.product_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Store owners can update their product variants" ON product_variants
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM products 
            JOIN stores ON stores.id = products.store_id
            WHERE products.id = product_variants.product_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Store owners can insert their product variants" ON product_variants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM products 
            JOIN stores ON stores.id = products.store_id
            WHERE products.id = product_variants.product_id 
            AND stores.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Store owners can delete their product variants" ON product_variants
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM products 
            JOIN stores ON stores.id = products.store_id
            WHERE products.id = product_variants.product_id 
            AND stores.user_id::text = auth.uid()::text
        )
    ); 