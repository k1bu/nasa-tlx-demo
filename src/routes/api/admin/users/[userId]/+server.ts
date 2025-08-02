import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const userId = parseInt(params.userId!);

		if (isNaN(userId)) {
			return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const user = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				organization: users.organization,
				createdAt: users.createdAt
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (user.length === 0) {
			return new Response(JSON.stringify({ error: 'User not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ user: user[0] }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Get user error:', error);

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
