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

async function debugTaisData() {
	try {
		console.log('🔍 Debugging TAIS Data...\n');

		// Get all users
		const users = await db.select().from(schema.users);
		console.log('📋 All Users:');
		users.forEach((user) => {
			console.log(`  ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
		});

		console.log('\n📊 All TAIS Results:');
		const allTaisResults = await db
			.select({
				id: schema.taisResults.id,
				userId: schema.taisResults.userId,
				awareness: schema.taisResults.awareness,
				externalDistractibility: schema.taisResults.externalDistractibility,
				control: schema.taisResults.control,
				assessmentDate: schema.taisResults.assessmentDate,
				createdAt: schema.taisResults.createdAt
			})
			.from(schema.taisResults);

		if (allTaisResults.length === 0) {
			console.log('  No TAIS results found in database');
		} else {
			allTaisResults.forEach((result) => {
				const user = users.find((u) => u.id === result.userId);
				console.log(
					`  ID: ${result.id}, UserID: ${result.userId} (${user?.email || 'Unknown'}), Awareness: ${result.awareness}, External Distractibility: ${result.externalDistractibility}, Control: ${result.control}, Date: ${result.assessmentDate}`
				);
			});
		}

		// Check specific users
		console.log('\n🔍 Checking Specific Users:');
		for (const user of users) {
			const userTaisResults = await db
				.select()
				.from(schema.taisResults)
				.where(eq(schema.taisResults.userId, user.id));

			console.log(`  ${user.email} (ID: ${user.id}): ${userTaisResults.length} TAIS results`);
			if (userTaisResults.length > 0) {
				userTaisResults.forEach((result) => {
					console.log(
						`    - Result ID: ${result.id}, Awareness: ${result.awareness}, External Distractibility: ${result.externalDistractibility}`
					);
				});
			}
		}
	} catch (error) {
		console.error('Error debugging TAIS data:', error);
	}
}

debugTaisData()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	});
