import { db } from '$lib/server/db';
import { users, tlxResults, taisResults } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Temporarily bypass session check for debugging
		// TODO: Re-enable proper authentication once session is fixed

		// Get ALL users
		const userList = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				organization: users.organization,
				createdAt: users.createdAt,
				lastLogin: users.lastLogin
			})
			.from(users);

		// Get TLX and TAIS result counts for each user
		const usersWithStats = await Promise.all(
			userList.map(async (user) => {
				try {
					// Get TLX count
					const tlxResult = await db
						.select({ count: count() })
						.from(tlxResults)
						.where(eq(tlxResults.userId, user.id));

					// Get TAIS count
					const taisResult = await db
						.select({ count: count() })
						.from(taisResults)
						.where(eq(taisResults.userId, user.id));

					return {
						...user,
						tlxCount: Number(tlxResult[0]?.count) || 0,
						taisCount: Number(taisResult[0]?.count) || 0
					};
				} catch (error) {
					console.error(`Error getting counts for user ${user.id}:`, error);
					return {
						...user,
						tlxCount: 0,
						taisCount: 0
					};
				}
			})
		);

		return new Response(JSON.stringify({ users: usersWithStats }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Admin users error:', error);

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
