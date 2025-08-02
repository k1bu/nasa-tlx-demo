-- MindLap Schema Updates
-- Additional features and improvements

-- ===== ROLE UPDATES =====

-- Update role naming convention
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_role_check";
ALTER TABLE "users" ADD CONSTRAINT "users_role_check" 
    CHECK (role IN ('driver', 'coach', 'admin'));

-- Update existing roles
UPDATE "users" SET role = 'driver' WHERE role = 'regular';
UPDATE "users" SET role = 'admin' WHERE role = 'superuser';

-- ===== SESSION MANAGEMENT =====

CREATE TABLE IF NOT EXISTS "user_sessions" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "session_type" varchar(50) NOT NULL, -- 'tlx', 'assessment', 'course', 'track_session'
    "started_at" timestamp NOT NULL DEFAULT now(),
    "completed_at" timestamp,
    "duration_minutes" integer,
    "device_info" jsonb, -- browser, device type, etc.
    "session_data" jsonb -- any session-specific data
);

-- ===== TEAM/ORGANIZATION MANAGEMENT =====

CREATE TABLE IF NOT EXISTS "teams" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "description" text,
    "coach_id" integer REFERENCES "users"("id"),
    "created_at" timestamp DEFAULT now(),
    "active" boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS "team_members" (
    "id" serial PRIMARY KEY NOT NULL,
    "team_id" integer NOT NULL REFERENCES "teams"("id"),
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "role" varchar(50) NOT NULL, -- 'driver', 'engineer', 'coach'
    "joined_at" timestamp DEFAULT now(),
    "active" boolean DEFAULT true,
    UNIQUE("team_id", "user_id")
);

-- ===== GOAL SETTING & PROGRESS TRACKING =====

CREATE TABLE IF NOT EXISTS "user_goals" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "title" varchar(255) NOT NULL,
    "description" text,
    "target_date" date,
    "goal_type" varchar(50) NOT NULL, -- 'lap_time', 'mental_skill', 'assessment_score'
    "target_value" decimal(8,3),
    "current_value" decimal(8,3),
    "status" varchar(20) DEFAULT 'active', -- 'active', 'completed', 'missed'
    "track_id" integer REFERENCES "tracks"("id"), -- for track-specific goals
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- ===== NOTIFICATION SYSTEM =====

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "type" varchar(50) NOT NULL, -- 'reminder', 'achievement', 'coach_message', 'assessment_due'
    "title" varchar(255) NOT NULL,
    "message" text,
    "read" boolean DEFAULT false,
    "action_url" text,
    "priority" integer DEFAULT 1, -- 1-5
    "expires_at" timestamp,
    "created_at" timestamp DEFAULT now()
);

-- ===== ASSESSMENT VERSION TRACKING =====

-- Add version tracking to existing assessment tables
ALTER TABLE "driver_intake_results" ADD COLUMN IF NOT EXISTS "assessment_version" varchar(10) DEFAULT 'v2';
ALTER TABLE "pressure_results" ADD COLUMN IF NOT EXISTS "assessment_version" varchar(10) DEFAULT 'v2';
ALTER TABLE "tais_results" ADD COLUMN IF NOT EXISTS "assessment_version" varchar(10) DEFAULT 'v1';

-- ===== TLX CONTEXT IMPROVEMENTS =====

-- Make TLX track context optional (already done in main schema)
-- Add context type for better categorization
ALTER TABLE "tlx_results" ADD COLUMN IF NOT EXISTS "context_type" varchar(50); -- 'track_turn', 'general_task', 'practice_session', 'race_session'

-- ===== PERFORMANCE INSIGHTS =====

CREATE TABLE IF NOT EXISTS "performance_insights" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "insight_type" varchar(50) NOT NULL, -- 'trend', 'correlation', 'recommendation'
    "title" varchar(255) NOT NULL,
    "description" text,
    "data" jsonb, -- insight-specific data
    "confidence" integer, -- 1-100
    "source" varchar(100), -- 'tlx_analysis', 'tais_correlation', 'performance_trend'
    "created_at" timestamp DEFAULT now(),
    "expires_at" timestamp
);

-- ===== COACHING NOTES =====

CREATE TABLE IF NOT EXISTS "coaching_notes" (
    "id" serial PRIMARY KEY NOT NULL,
    "coach_id" integer NOT NULL REFERENCES "users"("id"),
    "driver_id" integer NOT NULL REFERENCES "users"("id"),
    "note_type" varchar(50), -- 'session_feedback', 'assessment_review', 'goal_progress'
    "title" varchar(255),
    "content" text NOT NULL,
    "private" boolean DEFAULT false, -- coach-only vs visible to driver
    "related_assessment_id" integer, -- link to specific assessment
    "related_session_id" integer, -- link to specific session
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX IF NOT EXISTS "idx_user_sessions_user_id" ON "user_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_sessions_type" ON "user_sessions"("session_type");
CREATE INDEX IF NOT EXISTS "idx_team_members_team_id" ON "team_members"("team_id");
CREATE INDEX IF NOT EXISTS "idx_team_members_user_id" ON "team_members"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_goals_user_id" ON "user_goals"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_goals_status" ON "user_goals"("status");
CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications"("user_id");
CREATE INDEX IF NOT EXISTS "idx_notifications_read" ON "notifications"("read");
CREATE INDEX IF NOT EXISTS "idx_performance_insights_user_id" ON "performance_insights"("user_id");
CREATE INDEX IF NOT EXISTS "idx_coaching_notes_coach_id" ON "coaching_notes"("coach_id");
CREATE INDEX IF NOT EXISTS "idx_coaching_notes_driver_id" ON "coaching_notes"("driver_id");

-- ===== RELATIONSHIPS =====

-- Add foreign key constraints
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" 
    FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;

ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "performance_insights" ADD CONSTRAINT "performance_insights_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "coaching_notes" ADD CONSTRAINT "coaching_notes_coach_id_fkey" 
    FOREIGN KEY ("coach_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "coaching_notes" ADD CONSTRAINT "coaching_notes_driver_id_fkey" 
    FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE CASCADE; 