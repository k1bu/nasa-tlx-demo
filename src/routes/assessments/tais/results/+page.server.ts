import { redirect } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { taisResults } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);

	if (!user) {
		throw redirect(302, '/login');
	}

	// Fetch TAIS results for the user
	const [taisResult] = await db
		.select()
		.from(taisResults)
		.where(eq(taisResults.userId, user.id))
		.limit(1);

	return {
		user,
		taisResult: taisResult || null
	};
};
