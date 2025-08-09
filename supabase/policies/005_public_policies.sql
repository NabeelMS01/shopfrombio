-- Policies: 005_public_policies.sql
-- Description: Public read access policies for storefronts (no auth required)
-- Date: 2024-01-01

-- Public read access for storefronts (no auth required)
CREATE POLICY "Public can view stores" ON stores
    FOR SELECT USING (true);

CREATE POLICY "Public can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Public can view product variants" ON product_variants
    FOR SELECT USING (true); 