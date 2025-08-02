import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { lapTimes } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	try {
		const user = await getSessionUser(event);

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await event.request.json();
		const {
			trackId,
			lapTime,
			lapNumber,
			sessionDate,
			sessionType,
			environment,
			carClass,
			weather,
			trackConditions,
			notes
		} = body;

		// Validate required fields
		if (!trackId || !lapTime || !sessionDate) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Validate lap time is positive
		if (lapTime <= 0) {
			return json({ error: 'Lap time must be positive' }, { status: 400 });
		}

		// Insert lap time
		const [result] = await db
			.insert(lapTimes)
			.values({
				userId: user.id,
				trackId: trackId,
				lapTime: lapTime,
				lapNumber: lapNumber || 1,
				sessionDate: sessionDate,
				sessionType: sessionType || 'practice',
				environment: environment || 'real',
				carClass: carClass || null,
				weather: weather || null,
				trackConditions: trackConditions || null,
				notes: notes || null
			})
			.returning();

		return json({
			success: true,
			message: 'Lap time saved successfully',
			lapTime: result
		});
	} catch (error) {
		console.error('Error saving lap time:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
