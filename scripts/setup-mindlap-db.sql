-- MindLap Database Setup Script
-- This script creates all tables for the MindLap platform

-- ===== CORE USER TABLES =====

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar(255) UNIQUE NOT NULL,
    "password_hash" varchar(255) NOT NULL,
    "role" varchar(20) DEFAULT 'regular' NOT NULL,
    "organization" varchar(255),
    "created_at" timestamp DEFAULT now(),
    "last_login" timestamp
);

-- User profiles table
CREATE TABLE IF NOT EXISTS "user_profiles" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "name" varchar(255),
    "age" integer,
    "phone" varchar(20),
    "emergency_contact" varchar(255),
    "emergency_phone" varchar(20),
    "racing_experience" text,
    "preferred_disciplines" text,
    "license_level" varchar(50),
    "team" varchar(255),
    "car_number" varchar(10),
    "profile_completed" boolean DEFAULT false,
    "last_profile_update" timestamp
);

-- ===== ASSESSMENT TABLES =====

-- TAIS Inventory Results
CREATE TABLE IF NOT EXISTS "tais_results" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "created_at" timestamp DEFAULT now(),
    "internal_attention" integer,
    "external_attention" integer,
    "broad_attention" integer,
    "focused_attention" integer,
    "reduced_attention" integer,
    "information_processing" integer,
    "expression_of_ideas" integer,
    "control" integer,
    "performance_under_pressure" integer,
    "frustration" integer,
    "fatigue" integer,
    "self_confidence" integer,
    "raw_scores" jsonb,
    "assessment_date" date,
    "notes" text
);

-- Driver Intake Questionnaire Results
CREATE TABLE IF NOT EXISTS "driver_intake_results" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "created_at" timestamp DEFAULT now(),
    "racing_experience" text,
    "driving_types" text,
    "enjoyment_factors" text,
    "driving_style" text,
    "best_performance" text,
    "improvement_area" text,
    "mental_preparation" text,
    "track_learning_process" text,
    "planning_style" varchar(20),
    "focus_level" integer,
    "learning_preference" varchar(10),
    "feedback_processing" text,
    "post_session_preference" varchar(20),
    "technical_explanation" integer,
    "mental_side_interest" text,
    "version" varchar(10) DEFAULT 'v2',
    "completed" boolean DEFAULT false
);

-- Pressure Questionnaire Results
CREATE TABLE IF NOT EXISTS "pressure_results" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "created_at" timestamp DEFAULT now(),
    "pressure_feelings" text,
    "pressure_effect" text,
    "pressure_performance_rating" integer,
    "stressful_situations" text,
    "mistake_recovery_time" text,
    "reset_strategies" text,
    "race_day_preparation" text,
    "post_session_drain" integer,
    "version" varchar(10) DEFAULT 'v2',
    "completed" boolean DEFAULT false
);

-- Enhanced TLX Results
CREATE TABLE IF NOT EXISTS "tlx_results" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "user_id" integer REFERENCES "users"("id"),
    "track_id" integer,
    "turn_number" integer,
    "session_type" varchar(50),
    "mental" integer NOT NULL,
    "physical" integer NOT NULL,
    "temporal" integer NOT NULL,
    "performance" integer NOT NULL,
    "effort" integer NOT NULL,
    "frustration" integer NOT NULL,
    "task" text,
    "mental_weight" integer,
    "physical_weight" integer,
    "temporal_weight" integer,
    "performance_weight" integer,
    "effort_weight" integer,
    "frustration_weight" integer
);

-- ===== TRACKS & PERFORMANCE DATA =====

-- Tracks database
CREATE TABLE IF NOT EXISTS "tracks" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "location" varchar(255),
    "country" varchar(100),
    "circuit_length" decimal(6,3),
    "image_url" text,
    "description" text,
    "track_type" varchar(50),
    "surface" varchar(50),
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now()
);

-- Track turns with psychology insights
CREATE TABLE IF NOT EXISTS "track_turns" (
    "id" serial PRIMARY KEY NOT NULL,
    "track_id" integer NOT NULL REFERENCES "tracks"("id"),
    "turn_number" integer NOT NULL,
    "turn_name" varchar(100),
    "description" text,
    "mental_challenges" text,
    "pressure_points" text,
    "confidence_builders" text,
    "common_mistakes" text,
    "turn_type" varchar(50),
    "difficulty" integer,
    "order" integer NOT NULL
);

-- Performance data - lap times
CREATE TABLE IF NOT EXISTS "lap_times" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "track_id" integer NOT NULL REFERENCES "tracks"("id"),
    "lap_time" decimal(8,3),
    "lap_number" integer,
    "session_date" timestamp NOT NULL,
    "session_type" varchar(50),
    "environment" varchar(20),
    "car_class" varchar(100),
    "weather" varchar(50),
    "track_conditions" varchar(50),
    "notes" text,
    "created_at" timestamp DEFAULT now()
);

-- Turn-specific performance data
CREATE TABLE IF NOT EXISTS "turn_performance" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "track_id" integer NOT NULL REFERENCES "tracks"("id"),
    "turn_id" integer NOT NULL REFERENCES "track_turns"("id"),
    "entry_speed" decimal(6,1),
    "exit_speed" decimal(6,1),
    "braking_point" decimal(6,1),
    "apex_speed" decimal(6,1),
    "session_date" timestamp NOT NULL,
    "session_type" varchar(50),
    "environment" varchar(20),
    "notes" text,
    "created_at" timestamp DEFAULT now()
);

-- ===== COURSES & LEARNING =====

-- Course catalog
CREATE TABLE IF NOT EXISTS "courses" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text,
    "level" varchar(20),
    "category" varchar(100),
    "estimated_duration" integer,
    "content" jsonb,
    "prerequisites" text,
    "learning_objectives" text,
    "active" boolean DEFAULT true,
    "order" integer,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- User course progress
CREATE TABLE IF NOT EXISTS "course_progress" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "course_id" integer NOT NULL REFERENCES "courses"("id"),
    "status" varchar(20) DEFAULT 'not_started',
    "progress" integer DEFAULT 0,
    "started_at" timestamp,
    "completed_at" timestamp,
    "quiz_scores" jsonb,
    "last_accessed" timestamp,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- ===== BIOMETRICS (PLACEHOLDER) =====

-- Biometric data structure
CREATE TABLE IF NOT EXISTS "biometric_data" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "heart_rate" integer,
    "hrv" decimal(6,2),
    "stress_level" integer,
    "session_type" varchar(50),
    "track_id" integer REFERENCES "tracks"("id"),
    "recorded_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now()
);

-- ===== AI COACH & INSIGHTS =====

-- AI coach recommendations
CREATE TABLE IF NOT EXISTS "ai_recommendations" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "type" varchar(50),
    "title" varchar(255) NOT NULL,
    "description" text,
    "priority" integer DEFAULT 1,
    "action_required" boolean DEFAULT false,
    "action_url" text,
    "read" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now(),
    "expires_at" timestamp
);

-- Add foreign key constraints for TLX results
ALTER TABLE "tlx_results" ADD CONSTRAINT "tlx_results_track_id_fkey" 
    FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");
CREATE INDEX IF NOT EXISTS "idx_tlx_results_user_id" ON "tlx_results"("user_id");
CREATE INDEX IF NOT EXISTS "idx_tlx_results_track_id" ON "tlx_results"("track_id");
CREATE INDEX IF NOT EXISTS "idx_lap_times_user_id" ON "lap_times"("user_id");
CREATE INDEX IF NOT EXISTS "idx_lap_times_track_id" ON "lap_times"("track_id");
CREATE INDEX IF NOT EXISTS "idx_course_progress_user_id" ON "course_progress"("user_id");
CREATE INDEX IF NOT EXISTS "idx_course_progress_course_id" ON "course_progress"("course_id");

-- Insert pilot tracks
INSERT INTO "tracks" ("name", "location", "country", "circuit_length", "track_type", "surface") VALUES
('Sebring International Raceway', 'Sebring, Florida', 'USA', 3.740, 'road', 'asphalt'),
('Road Atlanta', 'Braselton, Georgia', 'USA', 2.540, 'road', 'asphalt'),
('Road America', 'Elkhart Lake, Wisconsin', 'USA', 4.048, 'road', 'asphalt'),
('Virginia International Raceway', 'Alton, Virginia', 'USA', 3.270, 'road', 'asphalt'),
('Watkins Glen International', 'Watkins Glen, New York', 'USA', 3.450, 'road', 'asphalt'),
('Lime Rock Park', 'Lakeville, Connecticut', 'USA', 1.530, 'road', 'asphalt'),
('Mid-Ohio Sports Car Course', 'Lexington, Ohio', 'USA', 2.258, 'road', 'asphalt'),
('Circuit of the Americas', 'Austin, Texas', 'USA', 3.427, 'road', 'asphalt'),
('Barber Motorsports Park', 'Birmingham, Alabama', 'USA', 2.380, 'road', 'asphalt')
ON CONFLICT DO NOTHING; 