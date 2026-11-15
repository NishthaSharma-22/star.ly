export type ProblemHistory = {
  problemId: string;
  everCorrect: boolean;
  lastAttemptAt: Date;
};

export function pickProblemId(
  problemIds: string[],
  history: ProblemHistory[],
  random: () => number = Math.random,
): string | null {
  if (problemIds.length === 0) return null;
  const byId = new Map(history.map((h) => [h.problemId, h]));

  const last = history
    .filter((h) => problemIds.includes(h.problemId))
    .sort((a, b) => b.lastAttemptAt.getTime() - a.lastAttemptAt.getTime())[0];
  const eligible =
    problemIds.length > 1 && last
      ? problemIds.filter((id) => id !== last.problemId)
      : problemIds;

  const never = eligible.filter((id) => !byId.has(id));
  const wrong = eligible.filter((id) => byId.get(id)?.everCorrect === false);
  const solved = eligible.filter((id) => byId.get(id)?.everCorrect === true);

  const pool =
    [never, wrong, solved].find((tier) => tier.length > 0) ?? eligible;

  return pool[Math.floor(random() * pool.length)];
}
