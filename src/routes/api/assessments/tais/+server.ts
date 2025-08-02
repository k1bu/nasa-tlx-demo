import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { taisResults } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	try {
		const user = await getSessionUser(event);

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await event.request.json();
		const { scores, rawResponses, assessmentDate } = body;

		// Insert TAIS results into database with all 27 dimensions
		const [result] = await db
			.insert(taisResults)
			.values({
				userId: user.id,
				awareness: scores.awareness,
				externalDistractibility: scores.external_distractibility,
				analyticalConceptual: scores.analytical_conceptual,
				internalDistractibility: scores.internal_distractibility,
				actionFocused: scores.action_focused,
				reducedFlexibility: scores.reduced_flexibility,
				informationProcessing: scores.information_processing,
				orientationToRulesAndRisks: scores.orientation_to_rules_and_risks,
				control: scores.control,
				selfConfidence: scores.self_confidence,
				physicallyCompetitive: scores.physically_competitive,
				decisionMakingStyle: scores.decision_making_style,
				extroversion: scores.extroversion,
				introversion: scores.introversion,
				expressionOfIdeas: scores.expression_of_ideas,
				expressionOfAnger: scores.expression_of_anger,
				expressionOfSupport: scores.expression_of_support,
				selfCritical: scores.self_critical,
				focusOverTime: scores.focus_over_time,
				performanceUnderPressure: scores.performance_under_pressure,
				confidence: scores.confidence,
				energy: scores.energy,
				competitiveness: scores.competitiveness,
				extraversion: scores.extraversion,
				critical: scores.critical,
				anxiety: scores.anxiety,
				distractibility: scores.distractibility,
				rawScores: rawResponses,
				assessmentDate: assessmentDate || new Date().toISOString().split('T')[0]
			})
			.returning();

		return json({
			success: true,
			result: {
				id: result.id,
				scores,
				assessmentDate: result.assessmentDate
			}
		});
	} catch (error) {
		console.error('Error submitting TAIS assessment:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
