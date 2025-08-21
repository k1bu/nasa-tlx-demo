import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userId, newRole } = await request.json();

		// Validate input
		if (!userId || !newRole) {
			return new Response(JSON.stringify({ error: 'Missing userId or newRole' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validate role
		const validRoles = ['driver', 'regular', 'superuser', 'coach'];
		if (!validRoles.includes(newRole)) {
			return new Response(JSON.stringify({ error: 'Invalid role' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Update user role
		await db.update(users).set({ role: newRole }).where(eq(users.id, userId));

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Update role error:', error);

		return new Response(
			JSON.stringify({
				error: 'Internal server error',
				details: error.message
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
