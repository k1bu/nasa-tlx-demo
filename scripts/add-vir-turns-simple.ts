import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting VIR turns script...');

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const virTurns = [
	{
		turnNumber: 1,
		turnName: 'Horseshoe',
		description: 'Sharp right hairpin, heavy braking into tight late apex.',
		mentalChallenges: 'Commitment under pressure, precise braking control',
		pressurePoints: 'Heavy braking zone, late apex commitment',
		confidenceBuilders: 'Rehearsed mental cue ("brake-apex-release")',
		commonMistakes: 'Over-braking, early apex, lack of commitment',
		turnType: 'hairpin',
		difficulty: 8,
		order: 1
	},
	{
		turnNumber: 2,
		turnName: 'NASCAR Bend',
		description: 'High-speed left kink taken near flat, immediately sets up Left Hook.',
		mentalChallenges: 'Trust in preparation, high-speed commitment',
		pressurePoints: 'High-speed entry, transition to Left Hook',
		confidenceBuilders: 'Visualization of smooth line, sensory feedback focus',
		commonMistakes: 'Over-thinking, micro-control, outcome anxiety',
		turnType: 'kink',
		difficulty: 6,
		order: 2
	},
	{
		turnNumber: 3,
		turnName: 'Left Hook',
		description: 'Quick transition turns from left to right with elevation changes.',
		mentalChallenges: 'Rhythm maintenance, elevation adaptation',
		pressurePoints: 'Rapid transitions, elevation changes',
		confidenceBuilders: 'Breath-in on entry to reset focus',
		commonMistakes: 'Loss of rhythm, poor elevation adaptation',
		turnType: 'chicane',
		difficulty: 7,
		order: 3
	},
	{
		turnNumber: 7,
		turnName: 'Climbing Esses',
		description: 'Rapid uphill series of left-right-lefts with crests and compressions at speed.',
		mentalChallenges: 'Rhythm consistency, flow state maintenance',
		pressurePoints: 'Uphill compression, rapid direction changes',
		confidenceBuilders: 'Internal rhythm counting, breath-apex pairing',
		commonMistakes: 'Loss of rhythm, inconsistent apex speeds',
		turnType: 'esses',
		difficulty: 9,
		order: 4
	},
	{
		turnNumber: 10,
		turnName: 'South Bend',
		description: 'Blind, downhill left with heavy visual uncertainty and committed entry.',
		mentalChallenges: 'Trust under uncertainty, blind commitment',
		pressurePoints: 'Blind entry, visual uncertainty',
		confidenceBuilders: 'Mindful acceptance, trust in line and execution',
		commonMistakes: 'Fear-based hesitation, lack of trust',
		turnType: 'blind',
		difficulty: 9,
		order: 5
	},
	{
		turnNumber: 11,
		turnName: 'Oak Tree',
		description: 'Mid-speed hairpin around historic oak; precise braking and turn-in is key.',
		mentalChallenges: 'Concentration reset, precise braking',
		pressurePoints: 'Historic significance, precise turn-in',
		confidenceBuilders: 'Full exhale to clear mental noise',
		commonMistakes: 'Mental noise, imprecise braking',
		turnType: 'hairpin',
		difficulty: 7,
		order: 6
	},
	{
		turnNumber: 14,
		turnName: 'Roller Coaster',
		description: 'Tight left-right combo downhill—requires rapid weight transfer control.',
		mentalChallenges: 'Sensory composure, rapid weight transfer',
		pressurePoints: 'Downhill compression, rapid direction changes',
		confidenceBuilders: 'Tactile anchor (grip position), joy in flow',
		commonMistakes: 'Loss of composure, poor weight transfer',
		turnType: 'chicane',
		difficulty: 8,
		order: 7
	},
	{
		turnNumber: 17,
		turnName: 'Hog Pen',
		description: 'Fast sweeping right curve leading onto front straight—momentum-critical.',
		mentalChallenges: 'Process focus, momentum maintenance',
		pressurePoints: 'End-of-lap focus, momentum carry',
		confidenceBuilders: 'Process cue ("exit smooth, throttle progressive")',
		commonMistakes: 'Mental slack, poor exit speed',
		turnType: 'sweeper',
		difficulty: 6,
		order: 8
	}
];

async function addVirTurns() {
	try {
		console.log('Finding VIR track...');

		// First, find the VIR track ID
		const virTrack = await db
			.select({ id: schema.tracks.id, name: schema.tracks.name })
			.from(schema.tracks)
			.where(eq(schema.tracks.name, 'Virginia International Raceway'))
			.limit(1);

		if (virTrack.length === 0) {
			console.error('VIR track not found in database');
			return;
		}

		const trackId = virTrack[0].id;
		console.log(`Found VIR track: ${virTrack[0].name} (ID: ${trackId})`);

		// Check if turns already exist
		const existingTurns = await db
			.select({ count: schema.trackTurns.id })
			.from(schema.trackTurns)
			.where(eq(schema.trackTurns.trackId, trackId));

		if (existingTurns.length > 0) {
			console.log(`Turns already exist for VIR (${existingTurns.length} turns found)`);
			return;
		}

		console.log('Adding turns...');

		// Add each turn
		for (const turn of virTurns) {
			const result = await db
				.insert(schema.trackTurns)
				.values({
					trackId: trackId,
					...turn
				})
				.returning();

			console.log(`✅ Added: Turn ${turn.turnNumber} - ${turn.turnName}`);
		}

		console.log('\n🎉 VIR turns added successfully!');
		
		// Show all VIR turns
		const allVirTurns = await db
			.select({
				turnNumber: schema.trackTurns.turnNumber,
				turnName: schema.trackTurns.turnName,
				difficulty: schema.trackTurns.difficulty
			})
			.from(schema.trackTurns)
			.where(eq(schema.trackTurns.trackId, trackId))
			.orderBy(schema.trackTurns.order);

		console.log('\nVIR Turns:');
		allVirTurns.forEach(turn => {
			console.log(`- Turn ${turn.turnNumber}: ${turn.turnName} (Difficulty: ${turn.difficulty}/10)`);
		});

	} catch (error) {
		console.error('Error adding VIR turns:', error);
		throw error;
	}
}

addVirTurns()
	.then(() => {
		console.log('Script completed successfully');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	}); 