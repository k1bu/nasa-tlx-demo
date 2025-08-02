import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in environment variables');
}

const client = neon(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

async function fixTaisData() {
	try {
		console.log('Fixing TAIS data...');

		// Get the first user
		const [user] = await db.select().from(schema.users).limit(1);
		if (!user) {
			console.log('No users found. Please create a user first.');
			return;
		}

		console.log(`Fixing TAIS data for user: ${user.email}`);

		// Complete TAIS data with all 27 dimensions
		const completeTaisData = {
			awareness: 58.0,
			externalDistractibility: 25.5,
			analyticalConceptual: 72.3,
			internalDistractibility: 15.8,
			actionFocused: 85.2,
			reducedFlexibility: 45.7,
			informationProcessing: 68.9,
			orientationToRulesAndRisks: 33.1,
			control: 98.0,
			selfConfidence: 76.4,
			physicallyCompetitive: 89.1,
			decisionMakingStyle: 62.7,
			extroversion: 72.0,
			introversion: 82.0,
			expressionOfIdeas: 55.3,
			expressionOfAnger: 28.9,
			expressionOfSupport: 67.2,
			selfCritical: 42.6,
			focusOverTime: 78.5,
			performanceUnderPressure: 91.3,
			confidence: 74.8,
			energy: 83.7,
			competitiveness: 87.2,
			extraversion: 69.4,
			critical: 51.8,
			anxiety: 35.2,
			distractibility: 22.1,
			assessmentDate: '2018-05-29',
			notes: 'Complete TAIS assessment data - all 27 dimensions populated'
		};

		// Check if TAIS data exists for this user
		const existingData = await db
			.select()
			.from(schema.taisResults)
			.where(eq(schema.taisResults.userId, user.id))
			.limit(1);

		if (existingData.length > 0) {
			console.log('TAIS data exists. Updating with complete data...');
			await db
				.update(schema.taisResults)
				.set(completeTaisData)
				.where(eq(schema.taisResults.userId, user.id));
		} else {
			console.log('No TAIS data found. Creating new record...');
			await db.insert(schema.taisResults).values({
				userId: user.id,
				...completeTaisData
			});
		}

		console.log('✅ TAIS data fixed successfully!');
		console.log(`User: ${user.email}`);
		console.log('All 27 dimensions should now be populated with test data.');

		// Verify the data was saved correctly
		const [verificationData] = await db
			.select()
			.from(schema.taisResults)
			.where(eq(schema.taisResults.userId, user.id))
			.limit(1);

		if (verificationData) {
			console.log('\nVerification - Sample values:');
			console.log(`Awareness: ${verificationData.awareness}`);
			console.log(`External Distractibility: ${verificationData.externalDistractibility}`);
			console.log(`Control: ${verificationData.control}`);
			console.log(`Extroversion: ${verificationData.extroversion}`);
		}
	} catch (error) {
		console.error('Error fixing TAIS data:', error);
	}
}

fixTaisData()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	});
