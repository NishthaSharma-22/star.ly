import { describe, expect, it } from "vitest";
import { summarizeDashboard, type SkillRow } from "./dashboard-summary";

const row = (overrides: Partial<SkillRow>): SkillRow => ({
  moduleSlug: "algebra",
  moduleName: "Algebra",
  moduleDescription: "Linear equations.",
  skillSlug: "linear",
  skillName: "Linear equations",
  total: 4,
  solved: 0,
  ...overrides,
});

describe("summarizeDashboard", () => {
  it("hides modules with no published problems", () => {
    const result = summarizeDashboard([
      row({}),
      row({ moduleSlug: "geometry", moduleName: "Geometry", total: 0 }),
    ]);
    expect(result.modules.map((m) => m.slug)).toEqual(["algebra"]);
  });

  it("adds up skills into module progress", () => {
    const result = summarizeDashboard([
      row({ skillSlug: "a", total: 4, solved: 2 }),
      row({ skillSlug: "b", total: 4, solved: 0 }),
    ]);
    expect(result.modules[0]).toMatchObject({
      total: 8,
      solved: 2,
      progress: 25,
    });
  });

  it("points Up next at the first unfinished skill, in order", () => {
    const result = summarizeDashboard([
      row({ skillSlug: "a", skillName: "A", total: 3, solved: 3 }),
      row({ skillSlug: "b", skillName: "B", total: 3, solved: 1 }),
      row({ skillSlug: "c", skillName: "C", total: 3, solved: 0 }),
    ]);
    expect(result.upNext).toEqual({
      topic: "B",
      moduleName: "Algebra",
      href: "/practice/algebra/b",
    });
  });

  it("has no Up next when everything is solved", () => {
    const result = summarizeDashboard([row({ total: 3, solved: 3 })]);
    expect(result.upNext).toBeNull();
    expect(result.modules[0].progress).toBe(100);
  });

  it("returns nothing for no rows", () => {
    expect(summarizeDashboard([])).toEqual({ modules: [], upNext: null });
  });
});
