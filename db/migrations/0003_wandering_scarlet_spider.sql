CREATE TABLE "problem_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "answers_problem_position_unique" UNIQUE("problem_id","position")
);
--> statement-breakpoint
ALTER TABLE "problem_answers" ADD CONSTRAINT "problem_answers_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;