import { db } from '$lib/server/db';
import { tlxResults } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
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

		const results = await db
			.select({
				id: tlxResults.id,
				task: tlxResults.task,
				goal: tlxResults.goal,
				track: tlxResults.track,
				seriesCompetition: tlxResults.seriesCompetition,
				trackConditions: tlxResults.trackConditions,
				mental: tlxResults.mental,
				physical: tlxResults.physical,
				temporal: tlxResults.temporal,
				performance: tlxResults.performance,
				effort: tlxResults.effort,
				frustration: tlxResults.frustration,
				mentalWeight: tlxResults.mentalWeight,
				physicalWeight: tlxResults.physicalWeight,
				temporalWeight: tlxResults.temporalWeight,
				performanceWeight: tlxResults.performanceWeight,
				effortWeight: tlxResults.effortWeight,
				frustrationWeight: tlxResults.frustrationWeight,
				createdAt: tlxResults.createdAt
			})
			.from(tlxResults)
			.where(eq(tlxResults.userId, userId))
			.orderBy(desc(tlxResults.createdAt));

		return new Response(JSON.stringify({ results }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Get TLX results error:', error);

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
