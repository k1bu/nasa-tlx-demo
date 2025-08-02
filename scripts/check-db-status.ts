import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set in .env file');
	process.exit(1);
}

const client = neon(DATABASE_URL);
const db = drizzle(client);

async function checkDatabaseStatus() {
	try {
		console.log('🔍 Checking current database status...\n');

		// Check if users table exists and has data
		try {
			const userCount = await db.execute('SELECT COUNT(*) as count FROM users');
			console.log(`👥 Users table: ${userCount[0].count} users found`);
		} catch (error) {
			console.log('❌ Users table: Does not exist');
		}

		// Check if tlx_results table exists and has data
		try {
			const tlxCount = await db.execute('SELECT COUNT(*) as count FROM tlx_results');
			console.log(`📊 TLX Results table: ${tlxCount[0].count} results found`);
		} catch (error) {
			console.log('❌ TLX Results table: Does not exist');
		}

		// Check for existing MindLap tables
		const mindlapTables = [
			'tracks',
			'track_turns',
			'tais_results',
			'driver_intake_results',
			'pressure_results',
			'lap_times',
			'turn_performance',
			'courses',
			'course_progress',
			'biometric_data',
			'ai_recommendations'
		];

		console.log('\n🏁 Checking for existing MindLap tables:');
		for (const table of mindlapTables) {
			try {
				const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
				console.log(`  ${table}: ${result[0].count} records`);
			} catch (error) {
				console.log(`  ${table}: Does not exist`);
			}
		}

		console.log('\n💡 Recommendation:');
		console.log('✅ You can safely run "npm run setup-mindlap" on your existing database.');
		console.log(
			'   The script uses "CREATE TABLE IF NOT EXISTS" so it won\'t overwrite existing data.'
		);
		console.log('   It will only add the new MindLap tables and pilot tracks.');
	} catch (error) {
		console.error('❌ Error checking database:', error);
	}
}

checkDatabaseStatus()
	.then(() => {
		console.log('\n✨ Database check completed!');
		process.exit(0);
	})
	.catch((error) => {
		console.error('💥 Check failed:', error);
		process.exit(1);
	});
