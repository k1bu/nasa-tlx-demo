import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { token, password } = await request.json();

		if (!token || !password) {
			return new Response(JSON.stringify({ error: 'Token and password are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validate password strength
		if (password.length < 8) {
			return new Response(
				JSON.stringify({ error: 'Password must be at least 8 characters long' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Find user with valid reset token
		const [user] = await db
			.select({ id: users.id, email: users.email })
			.from(users)
			.where(and(eq(users.passwordResetToken, token), gt(users.passwordResetExpires, new Date())));

		if (!user) {
			return new Response(JSON.stringify({ error: 'Invalid or expired reset token' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Hash new password
		const passwordHash = await hashPassword(password);

		// Update password and clear reset token
		await db
			.update(users)
			.set({
				passwordHash,
				passwordResetToken: null,
				passwordResetExpires: null
			})
			.where(eq(users.id, user.id));

		return new Response(
			JSON.stringify({
				message: 'Password has been reset successfully. You can now log in with your new password.'
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Reset password error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};


