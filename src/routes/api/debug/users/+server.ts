import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		// Simple test query
		const userList = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role
			})
			.from(users);

		return new Response(
			JSON.stringify({
				success: true,
				userCount: userList.length,
				users: userList
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error: any) {
		console.error('Debug users error:', error);

		return new Response(
			JSON.stringify({
				success: false,
				error: error.message,
				stack: error.stack
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
