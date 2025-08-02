import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const sessionCookie = cookies.get('session');
		
		return new Response(JSON.stringify({ 
			sessionCookie,
			allCookies: Object.fromEntries(cookies.getAll().map(c => [c.name, c.value]))
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Debug error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};