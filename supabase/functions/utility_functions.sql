-- Functions: utility_functions.sql
-- Description: Utility functions for common database operations
-- Date: 2024-01-01

-- Function to get store statistics
CREATE OR REPLACE FUNCTION get_store_stats(store_uuid UUID)
RETURNS TABLE (
    total_products BIGINT,
    total_revenue DECIMAL(10,2),
    total_sales BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(p.id)::BIGINT as total_products,
        COALESCE(SUM(p.price), 0) as total_revenue,
        0::BIGINT as total_sales  -- Placeholder for future sales table
    FROM products p
    WHERE p.store_id = store_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search products by title
CREATE OR REPLACE FUNCTION search_products(search_term TEXT, store_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    price DECIMAL(10,2),
    product_type VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.product_type
    FROM products p
    WHERE p.store_id = store_uuid
    AND (
        p.title ILIKE '%' || search_term || '%'
        OR p.description ILIKE '%' || search_term || '%'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 