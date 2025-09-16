import { db } from '$lib/server/db';
import { driverIntakeResults } from '$lib/server/db/schema';
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
				id: driverIntakeResults.id,
				racingExperience: driverIntakeResults.racingExperience,
				drivingTypes: driverIntakeResults.drivingTypes,
				enjoymentFactors: driverIntakeResults.enjoymentFactors,
				drivingStyle: driverIntakeResults.drivingStyle,
				bestPerformance: driverIntakeResults.bestPerformance,
				improvementArea: driverIntakeResults.improvementArea,
				mentalPreparation: driverIntakeResults.mentalPreparation,
				trackLearningProcess: driverIntakeResults.trackLearningProcess,
				planningStyle: driverIntakeResults.planningStyle,
				focusLevel: driverIntakeResults.focusLevel,
				learningPreference: driverIntakeResults.learningPreference,
				feedbackProcessing: driverIntakeResults.feedbackProcessing,
				postSessionPreference: driverIntakeResults.postSessionPreference,
				technicalExplanation: driverIntakeResults.technicalExplanation,
				mentalSideInterest: driverIntakeResults.mentalSideInterest,
				version: driverIntakeResults.version,
				completed: driverIntakeResults.completed,
				createdAt: driverIntakeResults.createdAt
			})
			.from(driverIntakeResults)
			.where(eq(driverIntakeResults.userId, userId))
			.orderBy(driverIntakeResults.createdAt);

		return new Response(JSON.stringify({ results }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Get Driver Intake results error:', error);

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
