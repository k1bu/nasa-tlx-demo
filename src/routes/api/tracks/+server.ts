import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tracks } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		const allTracks = await db
			.select({
				id: tracks.id,
				name: tracks.name,
				location: tracks.location,
				country: tracks.country,
				circuitLength: tracks.circuitLength,
				trackType: tracks.trackType,
				surface: tracks.surface,
				description: tracks.description,
				active: tracks.active
			})
			.from(tracks)
			.where(eq(tracks.active, true))
			.orderBy(tracks.name);

		return json({ tracks: allTracks });
	} catch (error) {
		console.error('Error fetching tracks:', error);
		return json({ error: 'Failed to fetch tracks' }, { status: 500 });
	}
};
