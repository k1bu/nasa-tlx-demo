import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Sample track images - these would typically be hosted on a CDN or static file server
const trackImages = {
	'Sebring International Raceway': '/images/tracks/sebring-layout.png',
	'Road Atlanta': '/images/tracks/road-atlanta-layout.png',
	'Watkins Glen International': '/images/tracks/watkins-glen-layout.png',
	'Virginia International Raceway': '/images/tracks/vir-layout.png',
	'Lime Rock Park': '/images/tracks/lime-rock-layout.png',
	'Mid-Ohio Sports Car Course': '/images/tracks/mid-ohio-layout.png',
	'Laguna Seca': '/images/tracks/laguna-seca-layout.png',
	'Sonoma Raceway': '/images/tracks/sonoma-layout.png',
	'Circuit of the Americas': '/images/tracks/circuit-of-the-americas-layout.png',
	'Barber Motorsports Park': '/images/tracks/barber-motorsports-park-layout.png',
	'Road America': '/images/tracks/road-america-layout.png'
};

async function addTrackImages() {
	try {
		console.log('Adding track layout images to database...');

		for (const [trackName, imageUrl] of Object.entries(trackImages)) {
			// Update the track with the image URL
			const result = await db
				.update(schema.tracks)
				.set({ imageUrl })
				.where(eq(schema.tracks.name, trackName))
				.returning();

			if (result.length > 0) {
				console.log(`✅ Added image for: ${trackName}`);
			} else {
				console.log(`⚠️  Track not found: ${trackName}`);
			}
		}

		console.log('\n🎉 Track images added successfully!');

		// Show updated tracks
		const allTracks = await db
			.select({
				name: schema.tracks.name,
				imageUrl: schema.tracks.imageUrl
			})
			.from(schema.tracks);

		console.log('\nUpdated tracks with images:');
		allTracks.forEach((track) => {
			console.log(`- ${track.name}: ${track.imageUrl ? '✅ Has image' : '❌ No image'}`);
		});
	} catch (error) {
		console.error('Error adding track images:', error);
	}
}

addTrackImages()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	});
