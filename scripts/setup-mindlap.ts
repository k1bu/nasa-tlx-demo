import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set in .env file');
	process.exit(1);
}

const client = neon(DATABASE_URL);
const db = drizzle(client);

async function setupMindLapDatabase() {
	try {
		console.log('🚀 Setting up MindLap database...');

		// Read the SQL setup script
		const sqlPath = join(__dirname, 'setup-mindlap-db.sql');
		const sqlContent = readFileSync(sqlPath, 'utf-8');

		// Split the SQL into individual statements more carefully
		const statements = sqlContent
			.split(';')
			.map((stmt) => stmt.trim())
			.filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'))
			.map((stmt) => stmt + ';'); // Add semicolon back

		console.log(`📝 Executing ${statements.length} SQL statements...`);

		// Execute each statement
		for (let i = 0; i < statements.length; i++) {
			const statement = statements[i];
			if (statement.trim() && statement.trim() !== ';') {
				try {
					await db.execute(statement);
					console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
				} catch (error) {
					// Log error but continue with other statements
					console.error(`❌ Error executing statement ${i + 1}:`, error.message);
					console.error('Statement:', statement.substring(0, 100) + '...');
				}
			}
		}

		console.log('🎉 MindLap database setup completed!');

		// Verify the setup by checking if tables exist
		console.log('🔍 Verifying database setup...');

		const tables = [
			'users',
			'user_profiles',
			'tais_results',
			'driver_intake_results',
			'pressure_results',
			'tlx_results',
			'tracks',
			'track_turns',
			'lap_times',
			'turn_performance',
			'courses',
			'course_progress',
			'biometric_data',
			'ai_recommendations'
		];

		let successCount = 0;
		for (const table of tables) {
			try {
				const result = await db.execute(`SELECT COUNT(*) FROM ${table}`);
				console.log(`✅ Table '${table}' exists and is accessible`);
				successCount++;
			} catch (error) {
				console.error(`❌ Table '${table}' not found or not accessible:`, error.message);
			}
		}

		console.log(`\n📊 Setup Summary: ${successCount}/${tables.length} tables created successfully`);

		// Check if pilot tracks were inserted
		try {
			const trackCount = await db.execute('SELECT COUNT(*) FROM tracks');
			console.log(`✅ Pilot tracks loaded: ${trackCount[0].count} tracks`);
		} catch (error) {
			console.error('❌ Error checking tracks:', error.message);
		}

		if (successCount >= tables.length * 0.8) {
			console.log('\n🎉 MindLap database setup was mostly successful!');
			console.log('You can now start building the MindLap platform.');
		} else {
			console.log('\n⚠️  Some tables failed to create. You may need to run the setup again.');
		}
	} catch (error) {
		console.error('❌ Database setup failed:', error);
		process.exit(1);
	}
}

// Run the setup
setupMindLapDatabase()
	.then(() => {
		console.log('✨ MindLap database setup finished!');
		process.exit(0);
	})
	.catch((error) => {
		console.error('💥 Setup failed:', error);
		process.exit(1);
	});
