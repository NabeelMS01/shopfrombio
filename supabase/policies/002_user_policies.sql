-- Policies: 002_user_policies.sql
-- Description: RLS policies for users table
-- Date: 2024-01-01

-- Users can view their own data
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow user registration (no auth required for insert)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- Allow admin operations (service role bypass)
CREATE POLICY "Admin bypass" ON users
    FOR ALL USING (current_setting('role') = 'service_role'); 