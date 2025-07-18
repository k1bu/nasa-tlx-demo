import { db } from '$lib/server/db';
import { tlxResults } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { user, task, form, weights } = data;

	// Compose insert object
	const insertData: any = {
		user,
		task,
		mental: form.mental,
		physical: form.physical,
		temporal: form.temporal,
		performance: form.performance,
		effort: form.effort,
		frustration: form.frustration
	};
	if (weights) {
		insertData.mentalWeight = weights.mental;
		insertData.physicalWeight = weights.physical;
		insertData.temporalWeight = weights.temporal;
		insertData.performanceWeight = weights.performance;
		insertData.effortWeight = weights.effort;
		insertData.frustrationWeight = weights.frustration;
	}

	const [result] = await db.insert(tlxResults).values(insertData).returning();
	return new Response(JSON.stringify(result), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
};
