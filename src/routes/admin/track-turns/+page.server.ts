import { getSessionUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
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

	return {
		user
	};
};
