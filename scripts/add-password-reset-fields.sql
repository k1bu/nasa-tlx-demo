-- Add password reset fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Add index for password reset token lookups
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);


