-- Add Driver Role Support
-- This script adds the 'driver' role to the users table

-- First, drop any existing role constraints
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_role_check";

-- Add new role constraint that includes 'driver'
ALTER TABLE "users" ADD CONSTRAINT "users_role_check" 
    CHECK (role IN ('driver', 'regular', 'superuser', 'coach'));

-- Update the default role for new users (this will be handled by the application)
-- The application now defaults to 'driver' for new registrations

-- Note: Existing users keep their current roles
-- You can manually update specific users to 'driver' role if needed:
-- UPDATE "users" SET role = 'driver' WHERE email = 'specific@email.com';
