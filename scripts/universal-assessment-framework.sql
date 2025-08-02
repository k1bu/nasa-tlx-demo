-- Universal Assessment Framework
-- This framework allows the platform to work across any domain

-- ===== UNIVERSAL ASSESSMENT STRUCTURE =====

-- Generic assessment templates
CREATE TABLE IF NOT EXISTS "assessment_templates" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "domain" varchar(100) NOT NULL, -- 'racing', 'business', 'soccer', 'lacrosse'
    "category" varchar(100) NOT NULL, -- 'workload', 'personality', 'pressure', 'intake'
    "version" varchar(10) NOT NULL,
    "description" text,
    "structure" jsonb NOT NULL, -- Question structure, scoring, etc.
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now()
);

-- Generic assessment results
CREATE TABLE IF NOT EXISTS "assessment_results" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "template_id" integer NOT NULL REFERENCES "assessment_templates"("id"),
    "created_at" timestamp DEFAULT now(),
    "completed_at" timestamp,
    "raw_responses" jsonb NOT NULL, -- All question responses
    "calculated_scores" jsonb, -- Processed scores
    "context_data" jsonb, -- Domain-specific context (track, project, field, etc.)
    "notes" text
);

-- ===== UNIVERSAL PERFORMANCE TRACKING =====

-- Generic performance sessions
CREATE TABLE IF NOT EXISTS "performance_sessions" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "session_type" varchar(100) NOT NULL, -- 'track_session', 'project_meeting', 'soccer_match'
    "domain" varchar(100) NOT NULL, -- 'racing', 'business', 'soccer'
    "started_at" timestamp NOT NULL,
    "completed_at" timestamp,
    "duration_minutes" integer,
    "performance_data" jsonb, -- Domain-specific metrics
    "context" jsonb, -- Session context (track, project, opponent, etc.)
    "notes" text
);

-- Generic performance metrics
CREATE TABLE IF NOT EXISTS "performance_metrics" (
    "id" serial PRIMARY KEY NOT NULL,
    "session_id" integer NOT NULL REFERENCES "performance_sessions"("id"),
    "metric_name" varchar(100) NOT NULL, -- 'lap_time', 'project_completion', 'goals_scored'
    "metric_value" decimal(10,3),
    "metric_unit" varchar(50), -- 'seconds', 'percentage', 'count'
    "recorded_at" timestamp NOT NULL,
    "context" jsonb -- Additional context for the metric
);

-- ===== UNIVERSAL GOAL SYSTEM =====

-- Generic goals that work across domains
CREATE TABLE IF NOT EXISTS "universal_goals" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "domain" varchar(100) NOT NULL, -- 'racing', 'business', 'soccer'
    "goal_type" varchar(100) NOT NULL, -- 'performance', 'skill_development', 'teamwork'
    "title" varchar(255) NOT NULL,
    "description" text,
    "target_date" date,
    "target_value" decimal(10,3),
    "current_value" decimal(10,3),
    "status" varchar(20) DEFAULT 'active',
    "context" jsonb, -- Domain-specific goal context
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- ===== UNIVERSAL INSIGHTS =====

-- Generic insights that work across domains
CREATE TABLE IF NOT EXISTS "universal_insights" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "domain" varchar(100) NOT NULL,
    "insight_type" varchar(100) NOT NULL, -- 'trend', 'correlation', 'recommendation'
    "title" varchar(255) NOT NULL,
    "description" text,
    "data" jsonb,
    "confidence" integer, -- 1-100
    "source" varchar(100), -- What data was analyzed
    "created_at" timestamp DEFAULT now(),
    "expires_at" timestamp
);

-- ===== DOMAIN-SPECIFIC CONFIGURATIONS =====

-- Domain configurations
CREATE TABLE IF NOT EXISTS "domain_configs" (
    "id" serial PRIMARY KEY NOT NULL,
    "domain" varchar(100) UNIQUE NOT NULL, -- 'racing', 'business', 'soccer'
    "display_name" varchar(255) NOT NULL,
    "description" text,
    "config" jsonb NOT NULL, -- Domain-specific settings
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now()
);

-- Domain-specific terminology
CREATE TABLE IF NOT EXISTS "domain_terminology" (
    "id" serial PRIMARY KEY NOT NULL,
    "domain" varchar(100) NOT NULL,
    "term_key" varchar(100) NOT NULL, -- 'track', 'project', 'field'
    "term_value" varchar(255) NOT NULL, -- 'Track', 'Project', 'Field'
    "context" varchar(100), -- Where this term is used
    UNIQUE("domain", "term_key")
);

-- ===== INDEXES =====

CREATE INDEX IF NOT EXISTS "idx_assessment_templates_domain" ON "assessment_templates"("domain");
CREATE INDEX IF NOT EXISTS "idx_assessment_results_user_id" ON "assessment_results"("user_id");
CREATE INDEX IF NOT EXISTS "idx_assessment_results_template_id" ON "assessment_results"("template_id");
CREATE INDEX IF NOT EXISTS "idx_performance_sessions_user_id" ON "performance_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_performance_sessions_domain" ON "performance_sessions"("domain");
CREATE INDEX IF NOT EXISTS "idx_performance_metrics_session_id" ON "performance_metrics"("session_id");
CREATE INDEX IF NOT EXISTS "idx_universal_goals_user_id" ON "universal_goals"("user_id");
CREATE INDEX IF NOT EXISTS "idx_universal_goals_domain" ON "universal_goals"("domain");
CREATE INDEX IF NOT EXISTS "idx_universal_insights_user_id" ON "universal_insights"("user_id");
CREATE INDEX IF NOT EXISTS "idx_universal_insights_domain" ON "universal_insights"("domain");

-- ===== SAMPLE DOMAIN CONFIGURATIONS =====

-- Racing domain config
INSERT INTO "domain_configs" ("domain", "display_name", "description", "config") VALUES
('racing', 'MindLap Racing', 'Mental performance platform for racing drivers', '{
    "assessments": ["tlx", "tais", "driver_intake", "pressure"],
    "performance_metrics": ["lap_time", "turn_performance", "consistency"],
    "contexts": ["track", "turn", "session_type"],
    "terminology": {
        "track": "Track",
        "turn": "Turn", 
        "lap": "Lap",
        "session": "Session"
    }
}');

-- Business domain config
INSERT INTO "domain_configs" ("domain", "display_name", "description", "config") VALUES
('business', 'MindLap Business', 'Mental performance platform for business professionals', '{
    "assessments": ["workload", "stress", "leadership", "teamwork"],
    "performance_metrics": ["project_completion", "meeting_efficiency", "team_satisfaction"],
    "contexts": ["project", "meeting", "role"],
    "terminology": {
        "project": "Project",
        "meeting": "Meeting",
        "task": "Task",
        "session": "Work Session"
    }
}');

-- Soccer domain config
INSERT INTO "domain_configs" ("domain", "display_name", "description", "config") VALUES
('soccer', 'MindLap Soccer', 'Mental performance platform for soccer players', '{
    "assessments": ["pressure", "teamwork", "focus", "recovery"],
    "performance_metrics": ["goals_scored", "pass_accuracy", "defensive_actions"],
    "contexts": ["match", "position", "opponent"],
    "terminology": {
        "field": "Field",
        "match": "Match",
        "position": "Position",
        "session": "Training Session"
    }
}');

-- ===== SAMPLE TERMINOLOGY =====

INSERT INTO "domain_terminology" ("domain", "term_key", "term_value", "context") VALUES
-- Racing
('racing', 'track', 'Track', 'performance'),
('racing', 'turn', 'Turn', 'performance'),
('racing', 'lap', 'Lap', 'performance'),
('racing', 'session', 'Session', 'general'),
-- Business
('business', 'project', 'Project', 'performance'),
('business', 'meeting', 'Meeting', 'performance'),
('business', 'task', 'Task', 'performance'),
('business', 'session', 'Work Session', 'general'),
-- Soccer
('soccer', 'field', 'Field', 'performance'),
('soccer', 'match', 'Match', 'performance'),
('soccer', 'position', 'Position', 'performance'),
('soccer', 'session', 'Training Session', 'general'); 