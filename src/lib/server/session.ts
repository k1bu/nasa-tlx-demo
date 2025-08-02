import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './auth';

export interface Session {
	user: User;
}

export function getSession(event: RequestEvent): Session | null {
	// In a real implementation, you'd use a proper session store
	// For now, we'll use a simple approach with cookies
	const sessionCookie = event.cookies.get('session');
	if (!sessionCookie) return null;

	try {
		const session = JSON.parse(sessionCookie);

		// Validate session structure
		if (!session || typeof session !== 'object' || !session.user) {
			console.warn('Invalid session structure:', session);
			return null;
		}

		// Validate user object
		if (!session.user.id || !session.user.email || !session.user.role) {
			console.warn('Invalid user object in session:', session.user);
			return null;
		}

		return session;
	} catch (error) {
		console.error('Error parsing session cookie:', error);
		return null;
	}
}

export function setSession(event: RequestEvent, user: User): void {
	const session: Session = { user };
	event.cookies.set('session', JSON.stringify(session), {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export function clearSession(event: RequestEvent): void {
	event.cookies.delete('session', { path: '/' });
}
