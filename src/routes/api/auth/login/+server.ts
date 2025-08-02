import { authenticateUser } from '$lib/server/auth';
import { setSession } from '$lib/server/session';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();
		
		if (!email || !password) {
			return new Response(JSON.stringify({ error: 'Email and password are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		const user = await authenticateUser(email, password);
		
		if (!user) {
			return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Set session
		setSession({ cookies } as any, user);
		
		return new Response(JSON.stringify({ 
			user: { 
				id: user.id, 
				email: user.email, 
				role: user.role,
				organization: user.organization 
			} 
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Login error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};