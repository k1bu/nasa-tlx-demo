import { pgTable, serial, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});

export const tlxResults = pgTable('tlx_results', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	mental: integer('mental').notNull(),
	physical: integer('physical').notNull(),
	temporal: integer('temporal').notNull(),
	performance: integer('performance').notNull(),
	effort: integer('effort').notNull(),
	frustration: integer('frustration').notNull(),
	task: text('task'),
	user: text('user'),
	// Optionally add weights for each dimension if you want to support pairwise weighting
	mentalWeight: integer('mental_weight'),
	physicalWeight: integer('physical_weight'),
	temporalWeight: integer('temporal_weight'),
	performanceWeight: integer('performance_weight'),
	effortWeight: integer('effort_weight'),
	frustrationWeight: integer('frustration_weight')
});
