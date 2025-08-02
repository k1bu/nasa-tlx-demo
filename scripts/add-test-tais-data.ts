import { db } from '../src/lib/server/db';
import { taisResults, users } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function addTestTaisData() {
	try {
		console.log('Adding test TAIS data...');

		// Get the first user (or create one if needed)
		const [user] = await db.select().from(users).limit(1);
		
		if (!user) {
			console.log('No users found. Please create a user first.');
			return;
		}

		console.log(`Adding TAIS data for user: ${user.email}`);

		// Sample TAIS data with realistic percentile scores (0-99.9)
		const testTaisData = {
			userId: user.id,
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
			notes: 'Test TAIS assessment data for demonstration purposes'
		};

		// Check if TAIS data already exists for this user
		const existingData = await db
			.select()
			.from(taisResults)
			.where(eq(taisResults.userId, user.id))
			.limit(1);

		if (existingData.length > 0) {
			console.log('TAIS data already exists for this user. Updating...');
			await db
				.update(taisResults)
				.set(testTaisData)
				.where(eq(taisResults.userId, user.id));
		} else {
			console.log('Creating new TAIS data...');
			await db.insert(taisResults).values(testTaisData);
		}

		console.log('✅ Test TAIS data added successfully!');
		console.log(`User: ${user.email}`);
		console.log('You can now view the TAIS results page to see the data.');

	} catch (error) {
		console.error('Error adding test TAIS data:', error);
	}
}

addTestTaisData().then(() => {
	process.exit(0);
}).catch((error) => {
	console.error('Script failed:', error);
	process.exit(1);
}); 