import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { taisResults } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	try {
		const user = await getSessionUser(event);

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Only allow admin users (superuser or coach) to view TAIS results
		if (user.role !== 'superuser' && user.role !== 'coach') {
			return json({ error: 'Insufficient permissions' }, { status: 403 });
		}

		// Fetch all TAIS results
		const results = await db
			.select({
				id: taisResults.id,
				userId: taisResults.userId,
				createdAt: taisResults.createdAt,
				assessmentDate: taisResults.assessmentDate,
				notes: taisResults.notes
			})
			.from(taisResults)
			.orderBy(taisResults.createdAt);

		return json({
			success: true,
			results
		});
	} catch (error) {
		console.error('Error fetching TAIS results:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
