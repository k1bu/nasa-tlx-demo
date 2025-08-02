import { getSessionUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);

	if (!user) {
		throw redirect(302, '/login');
	}

	return {
		user,
		trackId: event.params.trackId
	};
};
