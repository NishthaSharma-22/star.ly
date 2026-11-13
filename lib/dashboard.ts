import { and, asc, count, countDistinct, eq } from "drizzle-orm";
import { db } from "@/db";
import { attempts, modules, problems, skills } from "@/db/schema";
import { summarizeDashboard } from "@/lib/dashboard-summary";

export async function getDashboard(userId: string) {
  const [skillRows, solvedRows] = await Promise.all([
    db
      .select({
        moduleSlug: modules.slug,
        moduleName: modules.name,
        moduleDescription: modules.description,
        skillId: skills.id,
        skillSlug: skills.slug,
        skillName: skills.name,
        total: count(problems.id),
      })
      .from(skills)
      .innerJoin(modules, eq(skills.moduleId, modules.id))
      .leftJoin(
        problems,
        and(eq(problems.skillId, skills.id), eq(problems.status, "published")),
      )
      .groupBy(skills.id, modules.id)
      .orderBy(asc(modules.position), asc(skills.position)),
    db
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
        ),
      )
      .groupBy(problems.skillId),
  ]);

  const solvedBySkill = new Map(
    solvedRows.map((row) => [row.skillId, Number(row.solved)]),
  );

  return summarizeDashboard(
    skillRows.map((row) => ({
      moduleSlug: row.moduleSlug,
      moduleName: row.moduleName,
      moduleDescription: row.moduleDescription,
      skillSlug: row.skillSlug,
      skillName: row.skillName,
      total: Number(row.total),
      solved: solvedBySkill.get(row.skillId) ?? 0,
    })),
  );
}
