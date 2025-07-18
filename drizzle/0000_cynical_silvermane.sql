CREATE TABLE "tlx_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"mental" integer NOT NULL,
	"physical" integer NOT NULL,
	"temporal" integer NOT NULL,
	"performance" integer NOT NULL,
	"effort" integer NOT NULL,
	"frustration" integer NOT NULL,
	"mental_weight" integer,
	"physical_weight" integer,
	"temporal_weight" integer,
	"performance_weight" integer,
	"effort_weight" integer,
	"frustration_weight" integer
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer
);
