-- Update user policies to allow registration
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own data" ON users;

-- Create new policies
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin bypass" ON users
    FOR ALL USING (current_setting('role') = 'service_role'); 