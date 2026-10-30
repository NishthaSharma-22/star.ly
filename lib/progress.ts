import { db } from "@/db";
import { attempts } from "@/db/progress-schema";
import { and, countDistinct, eq } from "drizzle-orm";

export async function getSolvedCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ solved: countDistinct(attempts.problemId) })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.isCorrect, true)));

  return Number(row?.solved ?? 0);
}
