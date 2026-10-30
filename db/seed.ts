import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { and, eq, notInArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { parse } from "yaml";
import { z } from "zod";
import { parseAnswer } from "../lib/answers";
import {
  modules,
  problemAnswers,
  problemChoices,
  problems,
  skills,
  solutions,
} from "./content-schema";

config({ path: ".env.local" });

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const baseProblem = {
  key: slugSchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
  prompt: z.string().min(1),
  solution: z.string().min(1),
};

const multipleChoiceSchema = z.object({
  type: z.literal("multiple_choice"),
  ...baseProblem,
  choices: z
    .array(
      z.object({
        body: z.string().min(1),
        correct: z.boolean().optional(),
      }),
    )
    .min(2),
});

const studentResponseSchema = z.object({
  type: z.literal("student_response"),
  ...baseProblem,
  answers: z.array(z.string().min(1)).min(1),
});

const problemSchema = z.discriminatedUnion("type", [
  multipleChoiceSchema,
  studentResponseSchema,
]);

const moduleSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  position: z.number().int().positive(),
  skills: z
    .array(
      z.object({
        slug: slugSchema,
        name: z.string().min(1),
        problems: z.array(problemSchema),
      }),
    )
    .min(1),
});

type SeedProblem = z.infer<typeof problemSchema>;

function checkProblemRules(
  file: string,
  skillSlug: string,
  problem: SeedProblem,
): string[] {
  const where = `${file}: skill "${skillSlug}", problem "${problem.key}"`;
  const errors: string[] = [];

  if (problem.type === "multiple_choice") {
    const correctCount = problem.choices.filter((c) => c.correct).length;
    if (correctCount !== 1) {
      errors.push(
        `${where}: needs exactly one correct choice (found ${correctCount})`,
      );
    }
  } else {
    for (const answer of problem.answers) {
      const result = parseAnswer(answer);
      if (!result.ok) {
        errors.push(
          `${where}: answer "${answer}" can't be typed by a student (${result.reason})`,
        );
      }
    }
  }

  return errors;
}

async function main() {
  const seedDir = path.join(process.cwd(), "db", "seed");
  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();
  if (files.length === 0) throw new Error("No .yaml files found in db/seed");

  const errors: string[] = [];
  const seenKeys = new Set<string>();

  const data = files.flatMap((file) => {
    const raw = parse(fs.readFileSync(path.join(seedDir, file), "utf8"));
    const result = moduleSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${file}: ${issue.path.join(".")}: ${issue.message}`);
      }
      return [];
    }
    for (const skill of result.data.skills) {
      for (const problem of skill.problems) {
        if (seenKeys.has(problem.key)) {
          errors.push(`${file}: duplicate problem key "${problem.key}"`);
        }
        seenKeys.add(problem.key);
        errors.push(...checkProblemRules(file, skill.slug, problem));
      }
    }
    return [result.data];
  });

  if (errors.length > 0) {
    for (const message of errors) console.error(message);
    throw new Error(`Seed validation failed (${errors.length} problem(s))`);
  }

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  const seededKeys: string[] = [];
  let archivedKeys: string[] = [];

  try {
    await db.transaction(async (tx) => {
      for (const mod of data) {
        const [m] = await tx
          .insert(modules)
          .values({
            slug: mod.slug,
            name: mod.name,
            description: mod.description,
            position: mod.position,
          })
          .onConflictDoUpdate({
            target: modules.slug,
            set: {
              name: mod.name,
              description: mod.description,
              position: mod.position,
            },
          })
          .returning({ id: modules.id });

        for (const [si, skill] of mod.skills.entries()) {
          const [s] = await tx
            .insert(skills)
            .values({
              moduleId: m.id,
              slug: skill.slug,
              name: skill.name,
              position: si + 1,
            })
            .onConflictDoUpdate({
              target: [skills.moduleId, skills.slug],
              set: { name: skill.name, position: si + 1 },
            })
            .returning({ id: skills.id });

          for (const prob of skill.problems) {
            const [p] = await tx
              .insert(problems)
              .values({
                key: prob.key,
                skillId: s.id,
                type: prob.type,
                difficulty: prob.difficulty,
                prompt: prob.prompt,
                status: "published",
              })
              .onConflictDoUpdate({
                target: problems.key,
                set: {
                  skillId: s.id,
                  type: prob.type,
                  difficulty: prob.difficulty,
                  prompt: prob.prompt,
                  status: "published",
                  updatedAt: new Date(),
                },
              })
              .returning({ id: problems.id });

            await tx
              .delete(problemChoices)
              .where(eq(problemChoices.problemId, p.id));
            await tx
              .delete(problemAnswers)
              .where(eq(problemAnswers.problemId, p.id));
            await tx.delete(solutions).where(eq(solutions.problemId, p.id));

            if (prob.type === "multiple_choice") {
              await tx.insert(problemChoices).values(
                prob.choices.map((c, ci) => ({
                  problemId: p.id,
                  position: ci + 1,
                  body: c.body,
                  isCorrect: c.correct === true,
                })),
              );
            } else {
              await tx.insert(problemAnswers).values(
                prob.answers.map((value, ai) => ({
                  problemId: p.id,
                  position: ai + 1,
                  value,
                })),
              );
            }

            await tx.insert(solutions).values({
              problemId: p.id,
              position: 0,
              body: prob.solution,
            });

            seededKeys.push(prob.key);
          }
        }
      }

      if (seededKeys.length > 0) {
        const archived = await tx
          .update(problems)
          .set({ status: "draft", updatedAt: new Date() })
          .where(
            and(
              notInArray(problems.key, seededKeys),
              eq(problems.status, "published"),
            ),
          )
          .returning({ key: problems.key });
        archivedKeys = archived.map((row) => row.key);
      }
    });

    console.log(
      `Seeded ${data.length} module(s) and ${seededKeys.length} problem(s).`,
    );
    if (archivedKeys.length > 0) {
      console.log(
        `Archived ${archivedKeys.length} problem(s) no longer in the YAML: ${archivedKeys.join(", ")}`,
      );
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
