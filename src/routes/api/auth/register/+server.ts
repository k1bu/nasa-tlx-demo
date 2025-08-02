import { createUser } from '$lib/server/auth';
import { setSession } from '$lib/server/session';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password, role = 'regular', organization } = await request.json();
		
		if (!email || !password) {
			return new Response(JSON.stringify({ error: 'Email and password are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Validate role
		if (role && !['regular', 'superuser'].includes(role)) {
			return new Response(JSON.stringify({ error: 'Invalid role' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Create user
		const user = await createUser(email, password, role as 'regular' | 'superuser', organization);
		
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
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error: any) {
		console.error('Registration error:', error);
		
		// Handle duplicate email error
		if (error.message?.includes('unique constraint')) {
			return new Response(JSON.stringify({ error: 'Email already exists' }), {
				status: 409,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};