import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email } = await request.json();

		if (!email) {
			return new Response(JSON.stringify({ error: 'Email is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Check if user exists
		const [user] = await db
			.select({ id: users.id, email: users.email })
			.from(users)
			.where(eq(users.email, email));

		if (!user) {
			// Don't reveal if user exists or not for security
			return new Response(
				JSON.stringify({
					message: 'If an account with that email exists, a password reset link has been sent.'
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Generate reset token
		const resetToken = randomBytes(32).toString('hex');
		const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

		// Store reset token in database
		await db
			.update(users)
			.set({
				passwordResetToken: resetToken,
				passwordResetExpires: resetExpires
			})
			.where(eq(users.id, user.id));

		// In a real application, you would send an email here
		// For now, we'll just return the token (remove this in production)
		console.log(`Password reset token for ${email}: ${resetToken}`);
		console.log(`Reset link: /reset-password?token=${resetToken}`);

		return new Response(
			JSON.stringify({
				message: 'If an account with that email exists, a password reset link has been sent.',
				// Remove this in production - only for development
				debug: {
					token: resetToken,
					resetLink: `/reset-password?token=${resetToken}`
				}
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Forgot password error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};



