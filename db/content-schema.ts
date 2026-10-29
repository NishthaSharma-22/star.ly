import {
  pgEnum,
  pgTable,
  smallint,
  text,
  uuid,
  unique,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const problemTypeEnum = pgEnum("problem_type", [
  "multiple_choice",
  "student_response",
]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const problemStatusEnum = pgEnum("problem_status", [
  "draft",
  "published",
]);

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  position: smallint("position").notNull(),
});

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    position: smallint("position").notNull(),
  },
  (t) => [unique("skills_module_slug_unique").on(t.moduleId, t.slug)],
);

export const problems = pgTable(
  "problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "restrict" }),
    type: problemTypeEnum("type").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    prompt: text("prompt").notNull(),
    status: problemStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("problems_skill_difficulty_idx").on(t.skillId, t.difficulty)],
);

export const problemChoices = pgTable(
  "problem_choices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    body: text("body").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (t) => [
    unique("choices_problem_position_unique").on(t.problemId, t.position),
  ],
);

export const solutions = pgTable(
  "solutions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    position: smallint("position").notNull().default(0),
    body: text("body").notNull(),
  },
  (t) => [
    unique("solutions_problem_position_unique").on(t.problemId, t.position),
  ],
);
