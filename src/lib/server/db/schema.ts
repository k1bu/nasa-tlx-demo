import {
	pgTable,
	serial,
	integer,
	timestamp,
	text,
	varchar,
	boolean,
	json,
	decimal,
	date
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===== CORE USER TABLES =====
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	role: varchar('role', { length: 20 }).default('regular').notNull(), // 'regular', 'superuser', 'coach'
	organization: varchar('organization', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	lastLogin: timestamp('last_login'),
	passwordResetToken: varchar('password_reset_token', { length: 255 }),
	passwordResetExpires: timestamp('password_reset_expires')
});

export const userProfiles = pgTable('user_profiles', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	name: varchar('name', { length: 255 }),
	age: integer('age'),
	phone: varchar('phone', { length: 20 }),
	emergencyContact: varchar('emergency_contact', { length: 255 }),
	emergencyPhone: varchar('emergency_phone', { length: 20 }),
	// Driver-specific fields
	racingExperience: text('racing_experience'),
	preferredDisciplines: text('preferred_disciplines'), // JSON array
	licenseLevel: varchar('license_level', { length: 50 }),
	team: varchar('team', { length: 255 }),
	carNumber: varchar('car_number', { length: 10 }),
	// Profile completion tracking
	profileCompleted: boolean('profile_completed').default(false),
	lastProfileUpdate: timestamp('last_profile_update')
});

// ===== ASSESSMENT TABLES =====

// TAIS Inventory Results
export const taisResults = pgTable('tais_results', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	// TAIS Scale Scores - 27 dimensions (percentile scores 0-99.9)
	awareness: decimal('awareness', { precision: 4, scale: 1 }),
	externalDistractibility: decimal('external_distractibility', { precision: 4, scale: 1 }),
	analyticalConceptual: decimal('analytical_conceptual', { precision: 4, scale: 1 }),
	internalDistractibility: decimal('internal_distractibility', { precision: 4, scale: 1 }),
	actionFocused: decimal('action_focused', { precision: 4, scale: 1 }),
	reducedFlexibility: decimal('reduced_flexibility', { precision: 4, scale: 1 }),
	informationProcessing: decimal('information_processing', { precision: 4, scale: 1 }),
	orientationToRulesAndRisks: decimal('orientation_to_rules_and_risks', { precision: 4, scale: 1 }),
	control: decimal('control', { precision: 4, scale: 1 }),
	selfConfidence: decimal('self_confidence', { precision: 4, scale: 1 }),
	physicallyCompetitive: decimal('physically_competitive', { precision: 4, scale: 1 }),
	decisionMakingStyle: decimal('decision_making_style', { precision: 4, scale: 1 }),
	extroversion: decimal('extroversion', { precision: 4, scale: 1 }),
	introversion: decimal('introversion', { precision: 4, scale: 1 }),
	expressionOfIdeas: decimal('expression_of_ideas', { precision: 4, scale: 1 }),
	expressionOfAnger: decimal('expression_of_anger', { precision: 4, scale: 1 }),
	expressionOfSupport: decimal('expression_of_support', { precision: 4, scale: 1 }),
	selfCritical: decimal('self_critical', { precision: 4, scale: 1 }),
	focusOverTime: decimal('focus_over_time', { precision: 4, scale: 1 }),
	performanceUnderPressure: decimal('performance_under_pressure', { precision: 4, scale: 1 }),
	confidence: decimal('confidence', { precision: 4, scale: 1 }),
	energy: decimal('energy', { precision: 4, scale: 1 }),
	competitiveness: decimal('competitiveness', { precision: 4, scale: 1 }),
	extraversion: decimal('extraversion', { precision: 4, scale: 1 }),
	critical: decimal('critical', { precision: 4, scale: 1 }),
	anxiety: decimal('anxiety', { precision: 4, scale: 1 }),
	distractibility: decimal('distractibility', { precision: 4, scale: 1 }),
	// Raw data storage
	rawScores: json('raw_scores'), // Store complete TAIS data
	assessmentDate: date('assessment_date'),
	notes: text('notes')
});

// Driver Intake Questionnaire Results
export const driverIntakeResults = pgTable('driver_intake_results', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	// Section 1: Driving Background & Style
	racingExperience: text('racing_experience'),
	drivingTypes: text('driving_types'), // JSON array
	enjoymentFactors: text('enjoyment_factors'),
	drivingStyle: text('driving_style'), // 3 words
	bestPerformance: text('best_performance'),
	improvementArea: text('improvement_area'),
	// Section 2: Thinking, Focus & Learning Style
	mentalPreparation: text('mental_preparation'),
	trackLearningProcess: text('track_learning_process'),
	planningStyle: varchar('planning_style', { length: 20 }), // A, B, C
	focusLevel: integer('focus_level'), // 1-5
	learningPreference: varchar('learning_preference', { length: 10 }), // A, B, C, D
	// Section 3: Feedback & Reflection
	feedbackProcessing: text('feedback_processing'),
	postSessionPreference: varchar('post_session_preference', { length: 20 }), // A, B, C, D
	technicalExplanation: integer('technical_explanation'), // 1-5
	mentalSideInterest: text('mental_side_interest'),
	// Metadata
	version: varchar('version', { length: 10 }).default('v2'),
	completed: boolean('completed').default(false)
});

// Pressure Questionnaire Results
export const pressureResults = pgTable('pressure_results', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	// Section 1: Pressure Perception
	pressureFeelings: text('pressure_feelings'),
	pressureEffect: text('pressure_effect'),
	pressurePerformanceRating: integer('pressure_performance_rating'), // 1-5
	stressfulSituations: text('stressful_situations'), // JSON array
	// Section 2: Recovery & Coping
	mistakeRecoveryTime: text('mistake_recovery_time'),
	resetStrategies: text('reset_strategies'),
	raceDayPreparation: text('race_day_preparation'),
	postSessionDrain: integer('post_session_drain'), // 1-5
	// Metadata
	version: varchar('version', { length: 10 }).default('v2'),
	completed: boolean('completed').default(false)
});

// TLX Results (existing, but enhanced)
export const tlxResults = pgTable('tlx_results', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	userId: integer('user_id').references(() => users.id),
	// TLX scores
	mental: integer('mental').notNull(),
	physical: integer('physical').notNull(),
	temporal: integer('temporal').notNull(),
	performance: integer('performance').notNull(),
	effort: integer('effort').notNull(),
	frustration: integer('frustration').notNull(),
	task: text('task'),
	// Weights
	mentalWeight: integer('mental_weight'),
	physicalWeight: integer('physical_weight'),
	temporalWeight: integer('temporal_weight'),
	performanceWeight: integer('performance_weight'),
	effortWeight: integer('effort_weight'),
	frustrationWeight: integer('frustration_weight')
});

// ===== TRACKS & PERFORMANCE DATA =====

// Tracks database
export const tracks = pgTable('tracks', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	location: varchar('location', { length: 255 }),
	country: varchar('country', { length: 100 }),
	circuitLength: decimal('circuit_length', { precision: 6, scale: 3 }), // in miles
	imageUrl: text('image_url'),
	description: text('description'),
	// Track characteristics
	trackType: varchar('track_type', { length: 50 }), // 'road', 'street', 'oval'
	surface: varchar('surface', { length: 50 }), // 'asphalt', 'concrete'
	// Metadata
	active: boolean('active').default(true),
	createdAt: timestamp('created_at').defaultNow()
});

// Track turns with psychology insights
export const trackTurns = pgTable('track_turns', {
	id: serial('id').primaryKey(),
	trackId: integer('track_id')
		.references(() => tracks.id)
		.notNull(),
	turnNumber: integer('turn_number').notNull(),
	turnName: varchar('turn_name', { length: 100 }),
	description: text('description'),
	// Psychology insights
	mentalChallenges: text('mental_challenges'),
	pressurePoints: text('pressure_points'),
	confidenceBuilders: text('confidence_builders'),
	commonMistakes: text('common_mistakes'),
	// Technical info
	turnType: varchar('turn_type', { length: 50 }), // 'hairpin', 'chicane', 'sweeper', etc.
	difficulty: integer('difficulty'), // 1-10
	// Metadata
	order: integer('order').notNull()
});

// Performance data - lap times
export const lapTimes = pgTable('lap_times', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	trackId: integer('track_id')
		.references(() => tracks.id)
		.notNull(),
	// Lap data
	lapTime: decimal('lap_time', { precision: 8, scale: 3 }), // in seconds
	lapNumber: integer('lap_number'),
	sessionDate: timestamp('session_date').notNull(),
	// Context
	sessionType: varchar('session_type', { length: 50 }), // 'practice', 'qualifying', 'race'
	environment: varchar('environment', { length: 20 }), // 'real', 'sim'
	carClass: varchar('car_class', { length: 100 }),
	weather: varchar('weather', { length: 50 }),
	trackConditions: varchar('track_conditions', { length: 50 }),
	// Metadata
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow()
});

// Turn-specific performance data
export const turnPerformance = pgTable('turn_performance', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	trackId: integer('track_id')
		.references(() => tracks.id)
		.notNull(),
	turnId: integer('turn_id')
		.references(() => trackTurns.id)
		.notNull(),
	// Performance metrics
	entrySpeed: decimal('entry_speed', { precision: 6, scale: 1 }),
	exitSpeed: decimal('exit_speed', { precision: 6, scale: 1 }),
	brakingPoint: decimal('braking_point', { precision: 6, scale: 1 }),
	apexSpeed: decimal('apex_speed', { precision: 6, scale: 1 }),
	// Session context
	sessionDate: timestamp('session_date').notNull(),
	sessionType: varchar('session_type', { length: 50 }),
	environment: varchar('environment', { length: 20 }), // 'real', 'sim'
	// Metadata
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow()
});

// ===== COURSES & LEARNING =====

// Course catalog
export const courses = pgTable('courses', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	// Course structure
	level: varchar('level', { length: 20 }), // 'beginner', 'intermediate', 'advanced'
	category: varchar('category', { length: 100 }), // 'mental_performance', 'technical', etc.
	estimatedDuration: integer('estimated_duration'), // in minutes
	// Content
	content: json('content'), // Structured course content
	prerequisites: text('prerequisites'),
	learningObjectives: text('learning_objectives'), // JSON array
	// Metadata
	active: boolean('active').default(true),
	order: integer('order'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// User course progress
export const courseProgress = pgTable('course_progress', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	courseId: integer('course_id')
		.references(() => courses.id)
		.notNull(),
	// Progress tracking
	status: varchar('status', { length: 20 }).default('not_started'), // 'not_started', 'in_progress', 'completed'
	progress: integer('progress').default(0), // 0-100
	startedAt: timestamp('started_at'),
	completedAt: timestamp('completed_at'),
	// Assessment scores
	quizScores: json('quiz_scores'),
	// Metadata
	lastAccessed: timestamp('last_accessed'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// ===== BIOMETRICS (PLACEHOLDER) =====

// Biometric data structure
export const biometricData = pgTable('biometric_data', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	// Data
	heartRate: integer('heart_rate'),
	heartRateVariability: decimal('hrv', { precision: 6, scale: 2 }),
	stressLevel: integer('stress_level'), // 1-10
	// Context
	sessionType: varchar('session_type', { length: 50 }),
	trackId: integer('track_id').references(() => tracks.id),
	// Timestamps
	recordedAt: timestamp('recorded_at').notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

// ===== AI COACH & INSIGHTS =====

// AI coach recommendations
export const aiRecommendations = pgTable('ai_recommendations', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	// Recommendation data
	type: varchar('type', { length: 50 }), // 'course', 'assessment', 'practice', 'insight'
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	priority: integer('priority').default(1), // 1-5
	// Action items
	actionRequired: boolean('action_required').default(false),
	actionUrl: text('action_url'),
	// Metadata
	read: boolean('read').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	expiresAt: timestamp('expires_at')
});

// ===== RELATIONSHIPS =====

// User relationships
export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(userProfiles, {
		fields: [users.id],
		references: [userProfiles.userId]
	}),
	tlxResults: many(tlxResults),
	taisResults: many(taisResults),
	driverIntakeResults: many(driverIntakeResults),
	pressureResults: many(pressureResults),
	lapTimes: many(lapTimes),
	turnPerformance: many(turnPerformance),
	courseProgress: many(courseProgress),
	biometricData: many(biometricData),
	aiRecommendations: many(aiRecommendations)
}));

// Track relationships
export const tracksRelations = relations(tracks, ({ many }) => ({
	turns: many(trackTurns),
	lapTimes: many(lapTimes),
	turnPerformance: many(turnPerformance)
}));

// Course relationships
export const coursesRelations = relations(courses, ({ many }) => ({
	progress: many(courseProgress)
}));

// Keep the old user table for backward compatibility during migration
export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});
