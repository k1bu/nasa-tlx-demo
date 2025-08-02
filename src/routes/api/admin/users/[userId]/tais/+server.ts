import { db } from '$lib/server/db';
import { taisResults } from '$lib/server/db/schema';
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
				id: taisResults.id,
				awareness: taisResults.awareness,
				externalDistractibility: taisResults.externalDistractibility,
				analyticalConceptual: taisResults.analyticalConceptual,
				internalDistractibility: taisResults.internalDistractibility,
				actionFocused: taisResults.actionFocused,
				reducedFlexibility: taisResults.reducedFlexibility,
				informationProcessing: taisResults.informationProcessing,
				orientationToRulesAndRisks: taisResults.orientationToRulesAndRisks,
				control: taisResults.control,
				selfConfidence: taisResults.selfConfidence,
				physicallyCompetitive: taisResults.physicallyCompetitive,
				decisionMakingStyle: taisResults.decisionMakingStyle,
				extroversion: taisResults.extroversion,
				introversion: taisResults.introversion,
				expressionOfIdeas: taisResults.expressionOfIdeas,
				expressionOfAnger: taisResults.expressionOfAnger,
				expressionOfSupport: taisResults.expressionOfSupport,
				selfCritical: taisResults.selfCritical,
				focusOverTime: taisResults.focusOverTime,
				performanceUnderPressure: taisResults.performanceUnderPressure,
				confidence: taisResults.confidence,
				energy: taisResults.energy,
				competitiveness: taisResults.competitiveness,
				extraversion: taisResults.extraversion,
				critical: taisResults.critical,
				anxiety: taisResults.anxiety,
				distractibility: taisResults.distractibility,
				assessmentDate: taisResults.assessmentDate,
				createdAt: taisResults.createdAt,
				notes: taisResults.notes
			})
			.from(taisResults)
			.where(eq(taisResults.userId, userId))
			.orderBy(taisResults.createdAt);

		return new Response(JSON.stringify({ results }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		console.error('Get TAIS results error:', error);

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
