import { redirect } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { pressureResults } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);

	if (!user) {
		throw redirect(302, '/login');
	}

	// Fetch Pressure Assessment results for the user
	const [pressureResult] = await db
		.select()
		.from(pressureResults)
		.where(eq(pressureResults.userId, user.id))
		.limit(1);

	return {
		user,
		pressureResult: pressureResult || null
	};
};
