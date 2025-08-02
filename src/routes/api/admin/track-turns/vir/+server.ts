import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { trackTurns } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

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

export const POST: RequestHandler = async (event) => {
	try {
		const user = await getSessionUser(event);

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Only allow admin users (superuser or coach) to add turn data
		if (user.role !== 'superuser' && user.role !== 'coach') {
			return json({ error: 'Insufficient permissions' }, { status: 403 });
		}

		const { trackId } = await event.request.json();

		if (!trackId) {
			return json({ error: 'Track ID is required' }, { status: 400 });
		}

		// Check if turns already exist for this track
		const existingTurns = await db
			.select({ id: trackTurns.id })
			.from(trackTurns)
			.where(eq(trackTurns.trackId, trackId))
			.limit(1);

		if (existingTurns.length > 0) {
			return json({ error: 'Turns already exist for this track' }, { status: 400 });
		}

		// Add each turn
		const results = [];
		for (const turn of virTurns) {
			const result = await db
				.insert(trackTurns)
				.values({
					trackId: trackId,
					...turn
				})
				.returning();

			results.push(result[0]);
		}

		return json({
			success: true,
			message: 'VIR turns added successfully',
			turnsAdded: results.length
		});
	} catch (error) {
		console.error('Error adding VIR turns:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
