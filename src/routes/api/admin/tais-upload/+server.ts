import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { taisResults } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (event) => {
	try {
		const user = await getSessionUser(event);

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Only allow admin users (superuser or coach) to upload TAIS data
		if (user.role !== 'superuser' && user.role !== 'coach') {
			return json({ error: 'Insufficient permissions' }, { status: 403 });
		}

		const body = await event.request.json();
		const { userId, scores, assessmentDate, notes } = body;

		// Validate required fields
		if (!userId || !scores) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Validate scores object has all required dimensions
		const requiredDimensions = [
			'awareness',
			'externalDistractibility',
			'analyticalConceptual',
			'internalDistractibility',
			'actionFocused',
			'reducedFlexibility',
			'informationProcessing',
			'orientationToRulesAndRisks',
			'control',
			'selfConfidence',
			'physicallyCompetitive',
			'decisionMakingStyle',
			'extroversion',
			'introversion',
			'expressionOfIdeas',
			'expressionOfAnger',
			'expressionOfSupport',
			'selfCritical',
			'focusOverTime',
			'performanceUnderPressure',
			'confidence',
			'energy',
			'competitiveness',
			'extraversion',
			'critical',
			'anxiety',
			'distractibility'
		];

		for (const dimension of requiredDimensions) {
			if (
				typeof scores[dimension] !== 'number' ||
				scores[dimension] < 0 ||
				scores[dimension] > 99.9
			) {
				return json(
					{
						error: `Invalid score for ${dimension}. Must be a number between 0 and 99.9.`
					},
					{ status: 400 }
				);
			}
		}

		// Check if user already has TAIS results and update or insert accordingly
		const existingResult = await db
			.select()
			.from(taisResults)
			.where(eq(taisResults.userId, userId))
			.limit(1);

		let result;
		if (existingResult.length > 0) {
			// Update existing record
			[result] = await db
				.update(taisResults)
				.set({
					awareness: scores.awareness,
					externalDistractibility: scores.externalDistractibility,
					analyticalConceptual: scores.analyticalConceptual,
					internalDistractibility: scores.internalDistractibility,
					actionFocused: scores.actionFocused,
					reducedFlexibility: scores.reducedFlexibility,
					informationProcessing: scores.informationProcessing,
					orientationToRulesAndRisks: scores.orientationToRulesAndRisks,
					control: scores.control,
					selfConfidence: scores.selfConfidence,
					physicallyCompetitive: scores.physicallyCompetitive,
					decisionMakingStyle: scores.decisionMakingStyle,
					extroversion: scores.extroversion,
					introversion: scores.introversion,
					expressionOfIdeas: scores.expressionOfIdeas,
					expressionOfAnger: scores.expressionOfAnger,
					expressionOfSupport: scores.expressionOfSupport,
					selfCritical: scores.selfCritical,
					focusOverTime: scores.focusOverTime,
					performanceUnderPressure: scores.performanceUnderPressure,
					confidence: scores.confidence,
					energy: scores.energy,
					competitiveness: scores.competitiveness,
					extraversion: scores.extraversion,
					critical: scores.critical,
					anxiety: scores.anxiety,
					distractibility: scores.distractibility,
					rawScores: scores,
					assessmentDate: assessmentDate || new Date().toISOString().split('T')[0],
					notes: notes || null
				})
				.where(eq(taisResults.userId, userId))
				.returning();
		} else {
			// Insert new record
			[result] = await db
				.insert(taisResults)
				.values({
					userId: userId,
					awareness: scores.awareness,
					externalDistractibility: scores.externalDistractibility,
					analyticalConceptual: scores.analyticalConceptual,
					internalDistractibility: scores.internalDistractibility,
					actionFocused: scores.actionFocused,
					reducedFlexibility: scores.reducedFlexibility,
					informationProcessing: scores.informationProcessing,
					orientationToRulesAndRisks: scores.orientationToRulesAndRisks,
					control: scores.control,
					selfConfidence: scores.selfConfidence,
					physicallyCompetitive: scores.physicallyCompetitive,
					decisionMakingStyle: scores.decisionMakingStyle,
					extroversion: scores.extroversion,
					introversion: scores.introversion,
					expressionOfIdeas: scores.expressionOfIdeas,
					expressionOfAnger: scores.expressionOfAnger,
					expressionOfSupport: scores.expressionOfSupport,
					selfCritical: scores.selfCritical,
					focusOverTime: scores.focusOverTime,
					performanceUnderPressure: scores.performanceUnderPressure,
					confidence: scores.confidence,
					energy: scores.energy,
					competitiveness: scores.competitiveness,
					extraversion: scores.extraversion,
					critical: scores.critical,
					anxiety: scores.anxiety,
					distractibility: scores.distractibility,
					rawScores: scores,
					assessmentDate: assessmentDate || new Date().toISOString().split('T')[0],
					notes: notes || null
				})
				.returning();
		}

		return json({
			success: true,
			result: {
				id: result.id,
				userId: result.userId,
				assessmentDate: result.assessmentDate,
				message:
					existingResult.length > 0
						? 'TAIS data updated successfully'
						: 'TAIS data uploaded successfully'
			}
		});
	} catch (error) {
		console.error('Error uploading TAIS data:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
