import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	console.error('❌ DATABASE_URL environment variable not set');
	console.error('💡 Make sure you have a .env file with DATABASE_URL set');
	process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function migrateTlxNewFields() {
	try {
		console.log('🔄 Starting TLX table migration...\n');

		// Check if columns already exist
		const checkColumns = await client`
			SELECT column_name 
			FROM information_schema.columns 
			WHERE table_name = 'tlx_results' 
			AND column_name IN ('goal', 'track', 'series_competition', 'track_conditions')
		`;

		const existingColumns = checkColumns.map((row: any) => row.column_name);

		// Add goal column if it doesn't exist
		if (!existingColumns.includes('goal')) {
			await db.execute(`
				ALTER TABLE "tlx_results" 
				ADD COLUMN IF NOT EXISTS "goal" text
			`);
			console.log('✅ Added "goal" column');
		} else {
			console.log('⏭️  "goal" column already exists');
		}

		// Add track column if it doesn't exist
		if (!existingColumns.includes('track')) {
			await db.execute(`
				ALTER TABLE "tlx_results" 
				ADD COLUMN IF NOT EXISTS "track" text
			`);
			console.log('✅ Added "track" column');
		} else {
			console.log('⏭️  "track" column already exists');
		}

		// Add series_competition column if it doesn't exist
		if (!existingColumns.includes('series_competition')) {
			await db.execute(`
				ALTER TABLE "tlx_results" 
				ADD COLUMN IF NOT EXISTS "series_competition" text
			`);
			console.log('✅ Added "series_competition" column');
		} else {
			console.log('⏭️  "series_competition" column already exists');
		}

		// Add track_conditions column if it doesn't exist
		if (!existingColumns.includes('track_conditions')) {
			await db.execute(`
				ALTER TABLE "tlx_results" 
				ADD COLUMN IF NOT EXISTS "track_conditions" varchar(50)
			`);
			console.log('✅ Added "track_conditions" column');
		} else {
			console.log('⏭️  "track_conditions" column already exists');
		}

		console.log('\n✅ Migration completed successfully!');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

migrateTlxNewFields();
