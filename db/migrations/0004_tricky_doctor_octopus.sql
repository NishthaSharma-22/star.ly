ALTER TABLE "problems" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_key_unique" UNIQUE("key");