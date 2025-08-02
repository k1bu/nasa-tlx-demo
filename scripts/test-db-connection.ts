import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function testConnection() {
	try {
		console.log('Testing database connection...');
		console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

		// Test basic connection
		const result = await client`SELECT 1 as test`;
		console.log('✅ Database connection successful:', result);

		// Check if VIR track exists
		const virTrack = await db
			.select({ id: schema.tracks.id, name: schema.tracks.name })
			.from(schema.tracks)
			.where(eq(schema.tracks.name, 'Virginia International Raceway'))
			.limit(1);

		console.log('VIR track found:', virTrack);

		// Check existing turns
		if (virTrack.length > 0) {
			const existingTurns = await db
				.select({ count: schema.trackTurns.id })
				.from(schema.trackTurns)
				.where(eq(schema.trackTurns.trackId, virTrack[0].id));

			console.log('Existing turns for VIR:', existingTurns.length);
		}

	} catch (error) {
		console.error('❌ Database connection failed:', error);
	}
}

testConnection()
	.then(() => {
		console.log('Test completed');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Test failed:', error);
		process.exit(1);
	}); 