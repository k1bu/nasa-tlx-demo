import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function addPasswordResetFields() {
	try {
		console.log('Adding password reset fields to users table...');

		// Add password reset token column
		await sql`
			ALTER TABLE users 
			ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
			ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP
		`;

		console.log('✅ Password reset fields added successfully!');
		console.log('Added columns:');
		console.log('  - password_reset_token (VARCHAR(255))');
		console.log('  - password_reset_expires (TIMESTAMP)');
	} catch (error) {
		console.error('❌ Error adding password reset fields:', error);
		process.exit(1);
	}
}

addPasswordResetFields();


