import { redirect } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users, taisResults } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);

	if (!user) {
		throw redirect(302, '/login');
	}

	// Only allow admin users (superuser or coach) to access this page
	if (user.role !== 'superuser' && user.role !== 'coach') {
		throw redirect(302, '/dashboard');
	}

	// Fetch all users for the dropdown
	const allUsers = await db
		.select({
			id: users.id,
			email: users.email,
			role: users.role,
			organization: users.organization
		})
		.from(users)
		.orderBy(users.email);

	// Fetch existing TAIS results
	const existingTaisResults = await db
		.select({
			id: taisResults.id,
			userId: taisResults.userId,
			createdAt: taisResults.createdAt,
			assessmentDate: taisResults.assessmentDate,
			notes: taisResults.notes
		})
		.from(taisResults)
		.orderBy(taisResults.createdAt);

	return {
		user,
		users: allUsers,
		existingTaisResults
	};
};
