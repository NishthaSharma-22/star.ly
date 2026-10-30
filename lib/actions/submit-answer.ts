"use server";

import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  attempts,
  problemAnswers,
  problemChoices,
  problems,
  solutions,
} from "@/db/schema";
import { gradeStudentResponse, INVALID_MESSAGES } from "@/lib/answers";
import { requireSession } from "@/lib/auth-utils";
import { getLocalDate } from "@/lib/dates";

export type AnswerResult =
  | { status: "idle" }
  | { status: "invalid"; message: string }
  | { status: "correct"; solutions: string[] }
  | { status: "incorrect"; solutions: string[] };

const inputSchema = z.object({
  problemId: z.uuid(),
  choice: z.uuid().optional(),
  answer: z.string().max(20).optional(),
  timezone: z.string().max(64).optional(),
});

export async function submitAnswer(
  _prevState: AnswerResult,
  formData: FormData,
): Promise<AnswerResult> {
  const session = await requireSession();

  const parsed = inputSchema.safeParse({
    problemId: formData.get("problemId"),
    choice: formData.get("choice") ?? undefined,
    answer: formData.get("answer") ?? undefined,
    timezone: formData.get("timezone") ?? undefined,
  });
  if (!parsed.success) {
    return { status: "invalid", message: "Something went wrong. Try again." };
  }
  const { problemId, choice, answer, timezone } = parsed.data;

  const [problem] = await db
    .select({ id: problems.id, type: problems.type })
    .from(problems)
    .where(and(eq(problems.id, problemId), eq(problems.status, "published")))
    .limit(1);
  if (!problem) {
    return { status: "invalid", message: "This problem isn't available." };
  }

  let isCorrect: boolean;
  let response: string;

  if (problem.type === "multiple_choice") {
    if (!choice) {
      return { status: "invalid", message: "Pick an answer choice." };
    }
    const [row] = await db
      .select({
        isCorrect: problemChoices.isCorrect,
        body: problemChoices.body,
      })
      .from(problemChoices)
      .where(
        and(
          eq(problemChoices.id, choice),
          eq(problemChoices.problemId, problemId),
        ),
      )
      .limit(1);
    if (!row) {
      return { status: "invalid", message: "Pick one of the choices shown." };
    }
    isCorrect = row.isCorrect;
    response = row.body;
  } else {
    const accepted = await db
      .select({ value: problemAnswers.value })
      .from(problemAnswers)
      .where(eq(problemAnswers.problemId, problemId));

    const result = gradeStudentResponse(
      answer ?? "",
      accepted.map((a) => a.value),
    );
    if (result.status === "invalid") {
      return { status: "invalid", message: INVALID_MESSAGES[result.reason] };
    }
    isCorrect = result.status === "correct";
    response = (answer ?? "").trim();
  }

  await db.insert(attempts).values({
    userId: session.user.id,
    problemId,
    isCorrect,
    response,
    localDate: getLocalDate(timezone),
  });

  const solutionRows = await db
    .select({ body: solutions.body })
    .from(solutions)
    .where(eq(solutions.problemId, problemId))
    .orderBy(asc(solutions.position));
  const solutionTexts = solutionRows.map((s) => s.body);

  return isCorrect
    ? { status: "correct", solutions: solutionTexts }
    : { status: "incorrect", solutions: solutionTexts };
}
