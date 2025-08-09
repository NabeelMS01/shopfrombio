-- Migration: 003_indexes.sql
-- Description: Create database indexes for better performance
-- Date: 2024-01-01

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);

-- Stores table indexes
CREATE INDEX idx_stores_subdomain ON stores(subdomain);
CREATE INDEX idx_stores_user_id ON stores(user_id);

-- Products table indexes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_title ON products(title);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_product_type ON products(product_type);

-- Product variants table indexes
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_type ON product_variants(variant_type);

-- Composite indexes for common queries
CREATE INDEX idx_products_store_type ON products(store_id, product_type);
CREATE INDEX idx_product_variants_product_type ON product_variants(product_id, variant_type); 