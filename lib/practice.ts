import { and, asc, countDistinct, eq, sql, count, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  attempts,
  modules,
  problemChoices,
  problems,
  skills,
} from "@/db/schema";

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

export async function getModuleOverview(moduleSlug: string, userId: string) {
  const [mod] = await db
    .select({
      id: modules.id,
      name: modules.name,
      description: modules.description,
    })
    .from(modules)
    .where(eq(modules.slug, moduleSlug))
    .limit(1);
  if (!mod) return null;

  const skillRows = await db
    .select({
      id: skills.id,
      slug: skills.slug,
      name: skills.name,
      total: count(problems.id),
    })
    .from(skills)
    .leftJoin(
      problems,
      and(eq(problems.skillId, skills.id), eq(problems.status, "published")),
    )
    .where(eq(skills.moduleId, mod.id))
    .groupBy(skills.id)
    .orderBy(asc(skills.position));

  const skillIds = skillRows.map((row) => row.id);

  const solvedRows =
    skillIds.length === 0
      ? []
      : await db
          .select({
            skillId: problems.skillId,
            solved: countDistinct(attempts.problemId),
          })
          .from(attempts)
          .innerJoin(problems, eq(attempts.problemId, problems.id))
          .where(
            and(
              eq(attempts.userId, userId),
              eq(attempts.isCorrect, true),
              eq(problems.status, "published"),
              inArray(problems.skillId, skillIds),
            ),
          )
          .groupBy(problems.skillId);

  const solvedBySkill = new Map(
    solvedRows.map((row) => [row.skillId, Number(row.solved)]),
  );

  return {
    name: mod.name,
    description: mod.description,
    skills: skillRows
      .map((row) => ({
        slug: row.slug,
        name: row.name,
        total: Number(row.total),
        solved: solvedBySkill.get(row.id) ?? 0,
      }))
      .filter((skill) => skill.total > 0),
  };
}
