# Supabase Schema Structure

This directory contains the organized Supabase database schema for the ShopFromBio application.

## 📁 Directory Structure

```
supabase/
├── schema.sql                 # Main schema file (imports all components)
├── migrations/                # Database migrations in order
│   ├── 001_extensions.sql     # Enable PostgreSQL extensions
│   ├── 002_tables.sql         # Create all tables
│   └── 003_indexes.sql        # Create database indexes
├── triggers/                  # Database triggers
│   └── updated_at_triggers.sql # Auto-update timestamps
├── policies/                  # Row Level Security (RLS) policies
│   ├── 001_enable_rls.sql     # Enable RLS on all tables
│   ├── 002_user_policies.sql  # User-specific policies
│   ├── 003_store_policies.sql # Store-specific policies
│   ├── 004_product_policies.sql # Product-specific policies
│   └── 005_public_policies.sql # Public read access
├── functions/                 # Database functions
│   └── utility_functions.sql  # Utility functions
└── types/                     # TypeScript type definitions
    └── database.types.ts      # Database types for TypeScript
```

## 🚀 Quick Start

### 1. Set up Supabase Project
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys

### 2. Run the Schema
Copy and paste the contents of `schema.sql` into your Supabase SQL editor and run it.

### 3. Update Environment Variables
Add these to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📋 Migration Order

The schema files are designed to be run in this specific order:

1. **Extensions** (`001_extensions.sql`) - Enable required PostgreSQL extensions
2. **Tables** (`002_tables.sql`) - Create all database tables
3. **Indexes** (`003_indexes.sql`) - Create performance indexes
4. **Triggers** (`updated_at_triggers.sql`) - Set up automatic timestamp updates
5. **RLS** (`001_enable_rls.sql`) - Enable Row Level Security
6. **Policies** (`002_*_policies.sql`) - Set up access control policies
7. **Functions** (`utility_functions.sql`) - Create utility functions

## 🔐 Security Features

### Row Level Security (RLS)
- **Users**: Can only access their own data
- **Stores**: Store owners can only access their own stores
- **Products**: Store owners can only access products from their stores
- **Public Access**: Storefronts are publicly readable

### Multi-tenancy
- Each user can only access their own store and products
- Subdomain-based isolation
- Secure data separation between tenants

## 🛠️ Database Functions

### `get_store_stats(store_uuid)`
Returns statistics for a store:
- Total products count
- Total revenue (sum of product prices)
- Total sales (placeholder for future)

### `search_products(search_term, store_uuid)`
Searches products by title or description within a store.

## 📊 Database Schema

### Tables
- **users**: User accounts and authentication
- **stores**: Store information and settings
- **products**: Product catalog
- **product_variants**: Product variants (size, color, etc.)

### Relationships
- `stores.user_id` → `users.id` (One user per store)
- `products.store_id` → `stores.id` (Many products per store)
- `product_variants.product_id` → `products.id` (Many variants per product)

## 🔄 Migrations

To add new migrations:

1. Create a new file in `migrations/` with the next number
2. Add the migration to `schema.sql` in the correct order
3. Test the migration in a development environment
4. Document the changes in this README

## 🧪 Testing

After setting up the schema:

1. Test user registration and login
2. Test store creation
3. Test product CRUD operations
4. Test storefront access
5. Verify RLS policies are working correctly

## 📝 Notes

- All tables use UUID primary keys for better security
- Timestamps are automatically updated via triggers
- RLS policies ensure data isolation between tenants
- Public policies allow storefront access without authentication 