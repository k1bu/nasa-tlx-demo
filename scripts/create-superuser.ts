import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '../src/lib/server/db/schema';

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createSuperuser() {
	try {
		const email = process.argv[2];
		const password = process.argv[3];
		const organization = process.argv[4] || 'Performance In Mind';

		if (!email || !password) {
			console.error('Usage: tsx create-superuser.ts <email> <password> [organization]');
			process.exit(1);
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 12);

		// Create superuser
		const [user] = await db
			.insert(users)
			.values({
				email,
				passwordHash,
				role: 'superuser',
				organization
			})
			.returning({
				id: users.id,
				email: users.email,
				role: users.role,
				organization: users.organization
			});

		console.log('Superuser created successfully:');
		console.log(`ID: ${user.id}`);
		console.log(`Email: ${user.email}`);
		console.log(`Role: ${user.role}`);
		console.log(`Organization: ${user.organization}`);
	} catch (error) {
		console.error('Error creating superuser:', error);
		process.exit(1);
	}
}

createSuperuser();
