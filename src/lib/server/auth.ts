import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { getSession } from './session';

export interface User {
	id: number;
	email: string;
	role: 'regular' | 'superuser';
	organization?: string;
}

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export async function createUser(
	email: string,
	password: string,
	role: 'regular' | 'superuser' = 'regular',
	organization?: string
): Promise<User> {
	const passwordHash = await hashPassword(password);

	const [user] = await db
		.insert(users)
		.values({
			email,
			passwordHash,
			role,
			organization
		})
		.returning({
			id: users.id,
			email: users.email,
			role: users.role,
			organization: users.organization
		});

	return user;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
	const [user] = await db
		.select({
			id: users.id,
			email: users.email,
			passwordHash: users.passwordHash,
			role: users.role,
			organization: users.organization
		})
		.from(users)
		.where(eq(users.email, email));

	if (!user) return null;

	const isValid = await verifyPassword(password, user.passwordHash);
	if (!isValid) return null;

	// Update last login
	await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

	return {
		id: user.id,
		email: user.email,
		role: user.role,
		organization: user.organization
	};
}

export async function getUserById(id: number): Promise<User | null> {
	const [user] = await db
		.select({
			id: users.id,
			email: users.email,
			role: users.role,
			organization: users.organization
		})
		.from(users)
		.where(eq(users.id, id));

	return user || null;
}

export async function getSessionUser(event: RequestEvent): Promise<User | null> {
	try {
		const session = getSession(event);
		return session?.user || null;
	} catch (error) {
		console.error('Error getting session user:', error);
		return null;
	}
}

export async function requireAuth(event: RequestEvent): Promise<User> {
	const user = await getSessionUser(event);
	if (!user) {
		throw new Error('Authentication required');
	}
	return user;
}

export async function requireSuperuser(event: RequestEvent): Promise<User> {
	const user = await requireAuth(event);
	if (user.role !== 'superuser') {
		throw new Error('Superuser access required');
	}
	return user;
}

export async function isSuperuser(event: RequestEvent): Promise<boolean> {
	const user = await getSessionUser(event);
	return user?.role === 'superuser';
}
