import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { modules, problemChoices, problems, skills } from "@/db/schema";

export async function getSkill(moduleSlug: string, skillSlug: string) {
  const [row] = await db
    .select({
      skillId: skills.id,
      skillName: skills.name,
      moduleName: modules.name,
    })
    .from(skills)
    .innerJoin(modules, eq(skills.moduleId, modules.id))
    .where(and(eq(modules.slug, moduleSlug), eq(skills.slug, skillSlug)))
    .limit(1);

  return row ?? null;
}

export async function getRandomProblem(skillId: string) {
  const [problem] = await db
    .select({
      id: problems.id,
      type: problems.type,
      difficulty: problems.difficulty,
      prompt: problems.prompt,
    })
    .from(problems)
    .where(and(eq(problems.skillId, skillId), eq(problems.status, "published")))
    .orderBy(sql`random()`)
    .limit(1);

  if (!problem) return null;

  const choices =
    problem.type === "multiple_choice"
      ? await db
          .select({
            id: problemChoices.id,
            position: problemChoices.position,
            body: problemChoices.body,
          })
          .from(problemChoices)
          .where(eq(problemChoices.problemId, problem.id))
          .orderBy(asc(problemChoices.position))
      : [];

  return { ...problem, choices };
}
