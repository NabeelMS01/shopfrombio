-- Migration: 002_tables.sql
-- Description: Create all database tables
-- Date: 2024-01-01

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table
CREATE TABLE stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(3) DEFAULT 'USD',
  razorpay_key_id VARCHAR(255),
  theme VARCHAR(50) DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'amount')),
  discount_value DECIMAL(10,2),
  stock INTEGER NOT NULL,
  product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('product', 'service')),
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_variants table
CREATE TABLE product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_type VARCHAR(50) NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  stock INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 