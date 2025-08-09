-- Migration: 001_extensions.sql
-- Description: Enable required PostgreSQL extensions
-- Date: 2024-01-01

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional cryptographic functions (optional)
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 