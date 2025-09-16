import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

// Database connection
const sql = neon(process.env.DATABASE_URL!);

async function addPasswordResetFields() {
	try {
		console.log('Adding password reset fields to users table...');

		// Check if columns already exist
		const checkResult = await sql`
			SELECT column_name 
			FROM information_schema.columns 
			WHERE table_name = 'users' 
			AND column_name IN ('password_reset_token', 'password_reset_expires')
		`;

		const existingColumns = checkResult.map((row) => row.column_name);
		console.log('Existing columns:', existingColumns);

		// Add password reset token column if it doesn't exist
		if (!existingColumns.includes('password_reset_token')) {
			await sql`ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255)`;
			console.log('✅ Added password_reset_token column');
		} else {
			console.log('✅ password_reset_token column already exists');
		}

		// Add password reset expires column if it doesn't exist
		if (!existingColumns.includes('password_reset_expires')) {
			await sql`ALTER TABLE users ADD COLUMN password_reset_expires TIMESTAMP`;
			console.log('✅ Added password_reset_expires column');
		} else {
			console.log('✅ password_reset_expires column already exists');
		}

		console.log('✅ Password reset fields added successfully!');
	} catch (error) {
		console.error('❌ Error adding password reset fields:', error);
		process.exit(1);
	}
}

addPasswordResetFields();



