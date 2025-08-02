import { clearSession } from '$lib/server/session';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		clearSession({ cookies } as any);

		return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Logout error:', error);
		return new Response(JSON.stringify({ error: 'Logout failed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
