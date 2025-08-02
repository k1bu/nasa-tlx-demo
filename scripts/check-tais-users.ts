import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/db/schema';
import dotenv from 'dotenv';

dotenv.config();

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function checkTaisUsers() {
	console.log('Checking TAIS data...');
	
	try {
		// Get all users
		const users = await db.select().from(schema.users);
		console.log('Users:', users.map(u => ({ id: u.id, email: u.email })));
		
		// Get all TAIS results
		const taisResults = await db.select().from(schema.taisResults);
		console.log('TAIS Results:', taisResults.map(t => ({ 
			id: t.id, 
			userId: t.userId, 
			awareness: t.awareness,
			externalDistractibility: t.externalDistractibility 
		})));
		
	} catch (error) {
		console.error('Error:', error);
	}
}

checkTaisUsers(); 