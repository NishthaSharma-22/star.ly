import { describe, expect, it } from "vitest";
import { pickProblemId, type ProblemHistory } from "./picker";

const first = () => 0;
const at = (day: string) => new Date(`2026-10-${day}T10:00:00Z`);
const h = (
  problemId: string,
  everCorrect: boolean,
  day: string,
): ProblemHistory => ({ problemId, everCorrect, lastAttemptAt: at(day) });

describe("pickProblemId", () => {
  it("returns null when there are no problems", () => {
    expect(pickProblemId([], [], first)).toBeNull();
  });

  it("prefers problems the student has never attempted", () => {
    expect(pickProblemId(["a", "b", "c"], [h("a", true, "30")], first)).toBe(
      "b",
    );
  });

  it("then prefers problems answered wrongly over solved ones", () => {
    const history = [
      h("a", true, "28"),
      h("b", false, "29"),
      h("c", true, "30"),
    ];
    expect(pickProblemId(["a", "b", "c"], history, first)).toBe("b");
  });

  it("falls back to solved problems when everything is solved", () => {
    const history = [
      h("a", true, "28"),
      h("b", true, "29"),
      h("c", true, "30"),
    ];
    expect(pickProblemId(["a", "b", "c"], history, first)).toBe("a");
  });

  it("does not repeat the problem just answered when others exist", () => {
    const history = [h("a", false, "30"), h("b", false, "29")];
    expect(pickProblemId(["a", "b"], history, first)).toBe("b");
  });

  it("returns the only problem when there is just one", () => {
    expect(pickProblemId(["a"], [h("a", true, "30")], first)).toBe("a");
  });

  it("ignores history for problems outside this skill", () => {
    expect(pickProblemId(["a", "b"], [h("zzz", true, "30")], first)).toBe("a");
  });
});
