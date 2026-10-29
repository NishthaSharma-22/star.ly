import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { parse } from "yaml";
import { z } from "zod";
import {
  modules,
  problemChoices,
  problems,
  skills,
  solutions,
} from "./content-schema";

config({ path: ".env.local" });

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const problemSchema = z
  .object({
    difficulty: z.enum(["easy", "medium", "hard"]),
    prompt: z.string().min(1),
    choices: z
      .array(
        z.object({
          body: z.string().min(1),
          correct: z.boolean().optional(),
        }),
      )
      .min(2),
    solution: z.string().min(1),
  })
  .refine((p) => p.choices.filter((c) => c.correct).length === 1, {
    message: "each problem needs exactly one correct choice",
  });

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

async function main() {
  const seedDir = path.join(process.cwd(), "db", "seed");
  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();
  if (files.length === 0) throw new Error("No .yaml files found in db/seed");

  const data = files.map((file) => {
    const raw = parse(fs.readFileSync(path.join(seedDir, file), "utf8"));
    const result = moduleSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        console.error(`${file}: ${issue.path.join(".")}: ${issue.message}`);
      }
      throw new Error(`Invalid seed file: ${file}`);
    }
    return result.data;
  });

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  let problemCount = 0;

  try {
    await db.transaction(async (tx) => {
      await tx.delete(problems);
      await tx.delete(skills);
      await tx.delete(modules);

      for (const mod of data) {
        const [m] = await tx
          .insert(modules)
          .values({
            slug: mod.slug,
            name: mod.name,
            description: mod.description,
            position: mod.position,
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
            .returning({ id: skills.id });

          for (const prob of skill.problems) {
            const [p] = await tx
              .insert(problems)
              .values({
                skillId: s.id,
                type: "multiple_choice",
                difficulty: prob.difficulty,
                prompt: prob.prompt,
                status: "published",
              })
              .returning({ id: problems.id });

            await tx.insert(problemChoices).values(
              prob.choices.map((c, ci) => ({
                problemId: p.id,
                position: ci + 1,
                body: c.body,
                isCorrect: c.correct === true,
              })),
            );

            await tx.insert(solutions).values({
              problemId: p.id,
              position: 0,
              body: prob.solution,
            });

            problemCount += 1;
          }
        }
      }
    });

    console.log(
      `Seeded ${data.length} module(s) and ${problemCount} problem(s).`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
