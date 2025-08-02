import { redirect } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { taisResults, driverIntakeResults, pressureResults } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);

	if (!user) {
		throw redirect(302, '/login');
	}

	// Fetch assessment data for the user
	const [taisResult] = await db
		.select()
		.from(taisResults)
		.where(eq(taisResults.userId, user.id))
		.limit(1);

	const [driverIntakeResult] = await db
		.select()
		.from(driverIntakeResults)
		.where(eq(driverIntakeResults.userId, user.id))
		.limit(1);

	const [pressureResult] = await db
		.select()
		.from(pressureResults)
		.where(eq(pressureResults.userId, user.id))
		.limit(1);

	return {
		user,
		assessments: {
			tais: taisResult || null,
			driverIntake: driverIntakeResult || null,
			pressure: pressureResult || null
		}
	};
};
