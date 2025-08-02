import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { taisResults } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (event) => {
	try {
		const user = await getSessionUser(event);

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Only allow admin users (superuser or coach) to delete TAIS data
		if (user.role !== 'superuser' && user.role !== 'coach') {
			return json({ error: 'Insufficient permissions' }, { status: 403 });
		}

		const resultId = parseInt(event.params.id!);

		if (isNaN(resultId)) {
			return json({ error: 'Invalid result ID' }, { status: 400 });
		}

		// Check if the result exists
		const existingResult = await db
			.select()
			.from(taisResults)
			.where(eq(taisResults.id, resultId))
			.limit(1);

		if (existingResult.length === 0) {
			return json({ error: 'TAIS result not found' }, { status: 404 });
		}

		// Delete the result
		await db.delete(taisResults).where(eq(taisResults.id, resultId));

		return json({ success: true, message: 'TAIS result deleted successfully' });
	} catch (error) {
		console.error('Error deleting TAIS result:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
