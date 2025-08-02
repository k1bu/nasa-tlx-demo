import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { trackTurns } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	try {
		const trackId = parseInt(event.params.trackId!);

		if (isNaN(trackId)) {
			return json({ error: 'Invalid track ID' }, { status: 400 });
		}

		const turns = await db
			.select({
				id: trackTurns.id,
				turnNumber: trackTurns.turnNumber,
				turnName: trackTurns.turnName,
				description: trackTurns.description,
				mentalChallenges: trackTurns.mentalChallenges,
				pressurePoints: trackTurns.pressurePoints,
				confidenceBuilders: trackTurns.confidenceBuilders,
				commonMistakes: trackTurns.commonMistakes,
				turnType: trackTurns.turnType,
				difficulty: trackTurns.difficulty,
				order: trackTurns.order
			})
			.from(trackTurns)
			.where(eq(trackTurns.trackId, trackId))
			.orderBy(trackTurns.order);

		return json({ turns });
	} catch (error) {
		console.error('Error fetching turns:', error);
		return json({ error: 'Failed to fetch turns' }, { status: 500 });
	}
};
