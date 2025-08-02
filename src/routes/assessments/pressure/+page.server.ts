import type { PageServerLoad } from './$types';
import { getSessionUser } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	const user = await getSessionUser(event);
	
	return {
		user
	};
}; 