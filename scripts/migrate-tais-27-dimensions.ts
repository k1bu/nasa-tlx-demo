import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function migrateTaisDimensions() {
	console.log('Starting TAIS 27-dimension migration...');

	try {
		// Add new columns to tais_results table
		const alterQueries = [
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS awareness integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS external_distractibility integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS analytical_conceptual integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS internal_distractibility integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS action_focused integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS reduced_flexibility integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS orientation_to_rules_and_risks integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS physically_competitive integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS decision_making_style integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS extroversion integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS introversion integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS expression_of_anger integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS expression_of_support integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS self_critical integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS focus_over_time integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS confidence integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS energy integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS competitiveness integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS extraversion integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS critical integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS anxiety integer',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS distractibility integer'
		];

		for (const query of alterQueries) {
			try {
				await sql(query);
				console.log(`✓ Executed: ${query}`);
			} catch (error) {
				console.log(`⚠ Column might already exist: ${query}`);
			}
		}

		// Remove old columns that are no longer needed
		const dropQueries = [
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS internal_attention',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS external_attention',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS broad_attention',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS focused_attention',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS reduced_attention',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS frustration',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS fatigue'
		];

		for (const query of dropQueries) {
			try {
				await sql(query);
				console.log(`✓ Executed: ${query}`);
			} catch (error) {
				console.log(`⚠ Column might not exist: ${query}`);
			}
		}

		console.log('✅ TAIS 27-dimension migration completed successfully!');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	}
}

migrateTaisDimensions(); 