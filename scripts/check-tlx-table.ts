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

async function checkTLXTable() {
	try {
		console.log('🔍 Checking TLX results table structure...');
		
		// Check table structure
		const tableInfo = await db.execute(`
			SELECT column_name, data_type, is_nullable, column_default
			FROM information_schema.columns 
			WHERE table_name = 'tlx_results' 
			ORDER BY ordinal_position
		`);
		
		console.log('✅ TLX Results Table Structure:');
		tableInfo.forEach((col: any) => {
			console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
		});
		
		// Check if table has any data
		const countResult = await db.execute(`
			SELECT COUNT(*) as count FROM tlx_results
		`);
		
		console.log(`\n📊 Table has ${countResult[0]?.count || 0} records`);
		
	} catch (error) {
		console.error('❌ Error checking TLX table:', error);
	} finally {
		// Close connection
		await client.end();
	}
}

checkTLXTable();
