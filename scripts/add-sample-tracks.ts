import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/db/schema';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const sampleTracks = [
	{
		name: 'Sebring International Raceway',
		location: 'Sebring, Florida',
		country: 'USA',
		circuitLength: 3.74,
		trackType: 'road',
		surface: 'asphalt',
		description:
			'Historic 12-hour endurance racing circuit known for its challenging surface and technical corners.',
		active: true
	},
	{
		name: 'Road Atlanta',
		location: 'Braselton, Georgia',
		country: 'USA',
		circuitLength: 2.54,
		trackType: 'road',
		surface: 'asphalt',
		description: 'Fast and flowing circuit with elevation changes and the famous "esses" section.',
		active: true
	},
	{
		name: 'Watkins Glen International',
		location: 'Watkins Glen, New York',
		country: 'USA',
		circuitLength: 3.37,
		trackType: 'road',
		surface: 'asphalt',
		description:
			'Historic circuit with fast straights and technical corners, home to the NASCAR Cup Series.',
		active: true
	},
	{
		name: 'Virginia International Raceway',
		location: 'Alton, Virginia',
		country: 'USA',
		circuitLength: 3.27,
		trackType: 'road',
		surface: 'asphalt',
		description: 'Technical circuit with elevation changes and multiple layout options.',
		active: true
	},
	{
		name: 'Lime Rock Park',
		location: 'Lakeville, Connecticut',
		country: 'USA',
		circuitLength: 1.53,
		trackType: 'road',
		surface: 'asphalt',
		description: 'Short, fast circuit known for its challenging corners and close racing.',
		active: true
	},
	{
		name: 'Mid-Ohio Sports Car Course',
		location: 'Lexington, Ohio',
		country: 'USA',
		circuitLength: 2.25,
		trackType: 'road',
		surface: 'asphalt',
		description: 'Technical circuit with elevation changes and challenging corners.',
		active: true
	},
	{
		name: 'Laguna Seca',
		location: 'Monterey, California',
		country: 'USA',
		circuitLength: 2.238,
		trackType: 'road',
		surface: 'asphalt',
		description:
			'Famous for the "Corkscrew" turn, this circuit offers elevation changes and technical challenges.',
		active: true
	},
	{
		name: 'Sonoma Raceway',
		location: 'Sonoma, California',
		country: 'USA',
		circuitLength: 2.52,
		trackType: 'road',
		surface: 'asphalt',
		description: 'Technical circuit with elevation changes and challenging corners.',
		active: true
	}
];

async function addSampleTracks() {
	try {
		console.log('Adding sample tracks to database...');

		for (const track of sampleTracks) {
			// Check if track already exists
			const existingTrack = await db
				.select()
				.from(schema.tracks)
				.where(eq(schema.tracks.name, track.name))
				.limit(1);

			if (existingTrack.length === 0) {
				await db.insert(schema.tracks).values(track);
				console.log(`✅ Added: ${track.name}`);
			} else {
				console.log(`⏭️  Skipped (already exists): ${track.name}`);
			}
		}

		console.log('\n🎉 Sample tracks added successfully!');

		// Show all tracks
		const allTracks = await db.select().from(schema.tracks);
		console.log(`\nTotal tracks in database: ${allTracks.length}`);
		allTracks.forEach((track) => {
			console.log(`- ${track.name} (${track.location})`);
		});
	} catch (error) {
		console.error('Error adding sample tracks:', error);
	}
}

addSampleTracks()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	});
