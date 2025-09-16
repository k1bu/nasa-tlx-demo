import { db } from '$lib/server/db';
import { pressureResults } from '$lib/server/db/schema';
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

		const results = await db
			.select({
				id: pressureResults.id,
				pressureFeelings: pressureResults.pressureFeelings,
				pressureEffect: pressureResults.pressureEffect,
				pressurePerformanceRating: pressureResults.pressurePerformanceRating,
				stressfulSituations: pressureResults.stressfulSituations,
				mistakeRecoveryTime: pressureResults.mistakeRecoveryTime,
				resetStrategies: pressureResults.resetStrategies,
				raceDayPreparation: pressureResults.raceDayPreparation,
				postSessionDrain: pressureResults.postSessionDrain,
				version: pressureResults.version,
				completed: pressureResults.completed,
				createdAt: pressureResults.createdAt
			})
			.from(pressureResults)
			.where(eq(pressureResults.userId, userId))
			.orderBy(pressureResults.createdAt);

		return new Response(JSON.stringify({ results }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Get Pressure Assessment results error:', error);

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
