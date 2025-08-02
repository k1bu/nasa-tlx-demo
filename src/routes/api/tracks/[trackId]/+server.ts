import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tracks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	try {
		const trackId = parseInt(event.params.trackId!);

		if (isNaN(trackId)) {
			return json({ error: 'Invalid track ID' }, { status: 400 });
		}

		const track = await db
			.select({
				id: tracks.id,
				name: tracks.name,
				location: tracks.location,
				country: tracks.country,
				circuitLength: tracks.circuitLength,
				trackType: tracks.trackType,
				surface: tracks.surface,
				description: tracks.description,
				imageUrl: tracks.imageUrl,
				active: tracks.active
			})
			.from(tracks)
			.where(eq(tracks.id, trackId))
			.limit(1);

		if (track.length === 0) {
			return json({ error: 'Track not found' }, { status: 404 });
		}

		return json({ track: track[0] });
	} catch (error) {
		console.error('Error fetching track:', error);
		return json({ error: 'Failed to fetch track' }, { status: 500 });
	}
};
