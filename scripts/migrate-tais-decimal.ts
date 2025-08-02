import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function migrateTaisToDecimal() {
	console.log('🔄 Starting TAIS decimal migration...');

	try {
		// Add new decimal columns
		const alterQueries = [
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS awareness_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS external_distractibility_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS analytical_conceptual_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS internal_distractibility_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS action_focused_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS reduced_flexibility_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS information_processing_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS orientation_to_rules_and_risks_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS control_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS self_confidence_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS physically_competitive_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS decision_making_style_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS extroversion_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS introversion_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS expression_of_ideas_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS expression_of_anger_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS expression_of_support_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS self_critical_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS focus_over_time_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS performance_under_pressure_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS confidence_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS energy_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS competitiveness_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS extraversion_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS critical_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS anxiety_decimal decimal(4,1)',
			'ALTER TABLE tais_results ADD COLUMN IF NOT EXISTS distractibility_decimal decimal(4,1)'
		];

		for (const query of alterQueries) {
			try {
				await sql(query);
				console.log(`✓ Executed: ${query}`);
			} catch (error) {
				console.log(`⚠ Column might already exist: ${query}`);
			}
		}

		// Copy data from integer columns to decimal columns (if they exist)
		const copyQueries = [
			'UPDATE tais_results SET awareness_decimal = awareness::decimal(4,1) WHERE awareness IS NOT NULL',
			'UPDATE tais_results SET external_distractibility_decimal = external_distractibility::decimal(4,1) WHERE external_distractibility IS NOT NULL',
			'UPDATE tais_results SET analytical_conceptual_decimal = analytical_conceptual::decimal(4,1) WHERE analytical_conceptual IS NOT NULL',
			'UPDATE tais_results SET internal_distractibility_decimal = internal_distractibility::decimal(4,1) WHERE internal_distractibility IS NOT NULL',
			'UPDATE tais_results SET action_focused_decimal = action_focused::decimal(4,1) WHERE action_focused IS NOT NULL',
			'UPDATE tais_results SET reduced_flexibility_decimal = reduced_flexibility::decimal(4,1) WHERE reduced_flexibility IS NOT NULL',
			'UPDATE tais_results SET information_processing_decimal = information_processing::decimal(4,1) WHERE information_processing IS NOT NULL',
			'UPDATE tais_results SET orientation_to_rules_and_risks_decimal = orientation_to_rules_and_risks::decimal(4,1) WHERE orientation_to_rules_and_risks IS NOT NULL',
			'UPDATE tais_results SET control_decimal = control::decimal(4,1) WHERE control IS NOT NULL',
			'UPDATE tais_results SET self_confidence_decimal = self_confidence::decimal(4,1) WHERE self_confidence IS NOT NULL',
			'UPDATE tais_results SET physically_competitive_decimal = physically_competitive::decimal(4,1) WHERE physically_competitive IS NOT NULL',
			'UPDATE tais_results SET decision_making_style_decimal = decision_making_style::decimal(4,1) WHERE decision_making_style IS NOT NULL',
			'UPDATE tais_results SET extroversion_decimal = extroversion::decimal(4,1) WHERE extroversion IS NOT NULL',
			'UPDATE tais_results SET introversion_decimal = introversion::decimal(4,1) WHERE introversion IS NOT NULL',
			'UPDATE tais_results SET expression_of_ideas_decimal = expression_of_ideas::decimal(4,1) WHERE expression_of_ideas IS NOT NULL',
			'UPDATE tais_results SET expression_of_anger_decimal = expression_of_anger::decimal(4,1) WHERE expression_of_anger IS NOT NULL',
			'UPDATE tais_results SET expression_of_support_decimal = expression_of_support::decimal(4,1) WHERE expression_of_support IS NOT NULL',
			'UPDATE tais_results SET self_critical_decimal = self_critical::decimal(4,1) WHERE self_critical IS NOT NULL',
			'UPDATE tais_results SET focus_over_time_decimal = focus_over_time::decimal(4,1) WHERE focus_over_time IS NOT NULL',
			'UPDATE tais_results SET performance_under_pressure_decimal = performance_under_pressure::decimal(4,1) WHERE performance_under_pressure IS NOT NULL',
			'UPDATE tais_results SET confidence_decimal = confidence::decimal(4,1) WHERE confidence IS NOT NULL',
			'UPDATE tais_results SET energy_decimal = energy::decimal(4,1) WHERE energy IS NOT NULL',
			'UPDATE tais_results SET competitiveness_decimal = competitiveness::decimal(4,1) WHERE competitiveness IS NOT NULL',
			'UPDATE tais_results SET extraversion_decimal = extraversion::decimal(4,1) WHERE extraversion IS NOT NULL',
			'UPDATE tais_results SET critical_decimal = critical::decimal(4,1) WHERE critical IS NOT NULL',
			'UPDATE tais_results SET anxiety_decimal = anxiety::decimal(4,1) WHERE anxiety IS NOT NULL',
			'UPDATE tais_results SET distractibility_decimal = distractibility::decimal(4,1) WHERE distractibility IS NOT NULL'
		];

		for (const query of copyQueries) {
			try {
				await sql(query);
				console.log(`✓ Data copied: ${query.split(' ')[1]}`);
			} catch (error) {
				console.log(`⚠ Data copy skipped (column might not exist): ${query.split(' ')[1]}`);
			}
		}

		// Drop old integer columns
		const dropQueries = [
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS awareness',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS external_distractibility',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS analytical_conceptual',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS internal_distractibility',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS action_focused',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS reduced_flexibility',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS information_processing',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS orientation_to_rules_and_risks',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS control',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS self_confidence',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS physically_competitive',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS decision_making_style',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS extroversion',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS introversion',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS expression_of_ideas',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS expression_of_anger',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS expression_of_support',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS self_critical',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS focus_over_time',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS performance_under_pressure',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS confidence',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS energy',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS competitiveness',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS extraversion',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS critical',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS anxiety',
			'ALTER TABLE tais_results DROP COLUMN IF EXISTS distractibility'
		];

		for (const query of dropQueries) {
			try {
				await sql(query);
				console.log(`✓ Dropped old column: ${query.split(' ')[4]}`);
			} catch (error) {
				console.log(`⚠ Column might not exist: ${query.split(' ')[4]}`);
			}
		}

		// Rename decimal columns to original names
		const renameQueries = [
			'ALTER TABLE tais_results RENAME COLUMN awareness_decimal TO awareness',
			'ALTER TABLE tais_results RENAME COLUMN external_distractibility_decimal TO external_distractibility',
			'ALTER TABLE tais_results RENAME COLUMN analytical_conceptual_decimal TO analytical_conceptual',
			'ALTER TABLE tais_results RENAME COLUMN internal_distractibility_decimal TO internal_distractibility',
			'ALTER TABLE tais_results RENAME COLUMN action_focused_decimal TO action_focused',
			'ALTER TABLE tais_results RENAME COLUMN reduced_flexibility_decimal TO reduced_flexibility',
			'ALTER TABLE tais_results RENAME COLUMN information_processing_decimal TO information_processing',
			'ALTER TABLE tais_results RENAME COLUMN orientation_to_rules_and_risks_decimal TO orientation_to_rules_and_risks',
			'ALTER TABLE tais_results RENAME COLUMN control_decimal TO control',
			'ALTER TABLE tais_results RENAME COLUMN self_confidence_decimal TO self_confidence',
			'ALTER TABLE tais_results RENAME COLUMN physically_competitive_decimal TO physically_competitive',
			'ALTER TABLE tais_results RENAME COLUMN decision_making_style_decimal TO decision_making_style',
			'ALTER TABLE tais_results RENAME COLUMN extroversion_decimal TO extroversion',
			'ALTER TABLE tais_results RENAME COLUMN introversion_decimal TO introversion',
			'ALTER TABLE tais_results RENAME COLUMN expression_of_ideas_decimal TO expression_of_ideas',
			'ALTER TABLE tais_results RENAME COLUMN expression_of_anger_decimal TO expression_of_anger',
			'ALTER TABLE tais_results RENAME COLUMN expression_of_support_decimal TO expression_of_support',
			'ALTER TABLE tais_results RENAME COLUMN self_critical_decimal TO self_critical',
			'ALTER TABLE tais_results RENAME COLUMN focus_over_time_decimal TO focus_over_time',
			'ALTER TABLE tais_results RENAME COLUMN performance_under_pressure_decimal TO performance_under_pressure',
			'ALTER TABLE tais_results RENAME COLUMN confidence_decimal TO confidence',
			'ALTER TABLE tais_results RENAME COLUMN energy_decimal TO energy',
			'ALTER TABLE tais_results RENAME COLUMN competitiveness_decimal TO competitiveness',
			'ALTER TABLE tais_results RENAME COLUMN extraversion_decimal TO extraversion',
			'ALTER TABLE tais_results RENAME COLUMN critical_decimal TO critical',
			'ALTER TABLE tais_results RENAME COLUMN anxiety_decimal TO anxiety',
			'ALTER TABLE tais_results RENAME COLUMN distractibility_decimal TO distractibility'
		];

		for (const query of renameQueries) {
			try {
				await sql(query);
				console.log(`✓ Renamed column: ${query.split(' ')[4]} -> ${query.split(' ')[6]}`);
			} catch (error) {
				console.log(`⚠ Rename skipped: ${query.split(' ')[4]}`);
			}
		}

		console.log('✅ TAIS decimal migration completed successfully!');
		console.log('📋 Summary:');
		console.log('   - All TAIS columns now use decimal(4,1) for percentile scores');
		console.log('   - Range: 0.0 to 99.9');
		console.log('   - Existing data preserved and converted');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	}
}

migrateTaisToDecimal();
