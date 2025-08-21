import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	console.error('❌ DATABASE_URL environment variable not set');
	process.exit(1);
}

// Create database connection
const client = postgres(connectionString);
const db = drizzle(client);

async function checkUserRole(email: string) {
	try {
		console.log(`🔍 Checking role for user: ${email}`);
		
		// Query the user's role
		const result = await db.execute(`
			SELECT id, email, role, created_at 
			FROM users 
			WHERE email = '${email}'
		`);
		
		if (result.length === 0) {
			console.log('❌ User not found');
		} else {
			const user = result[0];
			console.log('✅ User found:');
			console.log(`   ID: ${user.id}`);
			console.log(`   Email: ${user.email}`);
			console.log(`   Role: ${user.role || 'NULL'}`);
			console.log(`   Created: ${user.created_at}`);
		}
		
	} catch (error) {
		console.error('❌ Error checking user role:', error);
	} finally {
		// Close connection
		await client.end();
	}
}

// Check the specific user
checkUserRole('itdoesntmatter@gmail.com');
