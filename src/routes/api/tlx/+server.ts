import { db } from '$lib/server/db';
import { tlxResults } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Require authentication
		const user = requireAuth({ cookies } as any);
		
		const data = await request.json();
		const { task, form, weights } = data;

		// Validate required data
		if (!form || typeof form !== 'object') {
			return new Response(JSON.stringify({ error: 'Invalid form data' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Compose insert object
		const insertData: any = {
			userId: user.id, // Link to authenticated user
			task,
			mental: form.mental || 0,
			physical: form.physical || 0,
			temporal: form.temporal || 0,
			performance: form.performance || 0,
			effort: form.effort || 0,
			frustration: form.frustration || 0
		};
		
		if (weights && typeof weights === 'object') {
			insertData.mentalWeight = weights.mental || 0;
			insertData.physicalWeight = weights.physical || 0;
			insertData.temporalWeight = weights.temporal || 0;
			insertData.performanceWeight = weights.performance || 0;
			insertData.effortWeight = weights.effort || 0;
			insertData.frustrationWeight = weights.frustration || 0;
		}

		const [result] = await db.insert(tlxResults).values(insertData).returning();
		return new Response(JSON.stringify(result), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error: any) {
		console.error('TLX submission error:', error);
		
		if (error.message === 'Authentication required') {
			return new Response(JSON.stringify({ error: 'Authentication required' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
