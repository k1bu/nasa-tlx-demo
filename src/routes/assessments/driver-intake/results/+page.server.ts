import { redirect } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { driverIntakeResults } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);

	if (!user) {
		throw redirect(302, '/login');
	}

	// Fetch Driver Intake results for the user
	const [driverIntakeResult] = await db
		.select()
		.from(driverIntakeResults)
		.where(eq(driverIntakeResults.userId, user.id))
		.limit(1);

	return {
		user,
		driverIntakeResult: driverIntakeResult || null
	};
};
