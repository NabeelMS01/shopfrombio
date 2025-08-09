-- ShopFromBio Database Schema
-- This file imports all schema components in the correct order

-- Enable required extensions
\i supabase/migrations/001_extensions.sql

-- Create tables
\i supabase/migrations/002_tables.sql

-- Create indexes
\i supabase/migrations/003_indexes.sql

-- Create triggers
\i supabase/triggers/updated_at_triggers.sql

-- Enable Row Level Security
\i supabase/policies/001_enable_rls.sql

-- Create RLS policies
\i supabase/policies/002_user_policies.sql
\i supabase/policies/003_store_policies.sql
\i supabase/policies/004_product_policies.sql
\i supabase/policies/005_public_policies.sql

-- Create functions (if any)
\i supabase/functions/utility_functions.sql 