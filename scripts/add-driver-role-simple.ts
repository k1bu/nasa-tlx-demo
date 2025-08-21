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

async function addDriverRole() {
	try {
		console.log('🔧 Adding driver role support...');
		
		// Drop existing constraint if it exists
		await db.execute(`
			ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_role_check"
		`);
		
		// Add new constraint with driver role
		await db.execute(`
			ALTER TABLE "users" ADD CONSTRAINT "users_role_check" 
			CHECK (role IN ('driver', 'regular', 'superuser', 'coach'))
		`);
		
		console.log('✅ Driver role constraint added successfully!');
		console.log('✅ New users will now default to "driver" role');
		
	} catch (error) {
		console.error('❌ Error adding driver role:', error);
	} finally {
		// Close connection
		await client.end();
	}
}

addDriverRole();
