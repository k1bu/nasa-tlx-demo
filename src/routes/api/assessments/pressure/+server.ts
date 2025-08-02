import { json } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { pressureResults } from '$lib/server/db/schema';

export async function POST(event) {
	const user = await getSessionUser(event);
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();

	// Insert the pressure assessment result
	const [result] = await db
		.insert(pressureResults)
		.values({
			userId: user.id,
			...data
		})
		.returning();

	return json({ success: true, result });
}
