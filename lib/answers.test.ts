// lib/answers.test.ts
import { describe, expect, it } from "vitest";
import { gradeStudentResponse, parseAnswer } from "./answers";

describe("gradeStudentResponse", () => {
  it("accepts the same value in equivalent forms", () => {
    expect(gradeStudentResponse("3/4", ["3/4"]).status).toBe("correct");
    expect(gradeStudentResponse("6/8", ["3/4"]).status).toBe("correct");
    expect(gradeStudentResponse("0.75", ["3/4"]).status).toBe("correct");
  });

  it("marks wrong answers incorrect", () => {
    expect(gradeStudentResponse("1/2", ["3/4"]).status).toBe("incorrect");
  });

  it("does not accept rounded decimals for 2/3", () => {
    expect(gradeStudentResponse("0.666", ["2/3"]).status).toBe("incorrect");
    expect(gradeStudentResponse("0.667", ["2/3"]).status).toBe("incorrect");
    expect(gradeStudentResponse("2/3", ["2/3"]).status).toBe("correct");
  });

  it("handles negative answers", () => {
    expect(gradeStudentResponse("-3/4", ["-3/4"]).status).toBe("correct");
    expect(gradeStudentResponse("-0.75", ["-3/4"]).status).toBe("correct");
    expect(gradeStudentResponse("3/4", ["-3/4"]).status).toBe("incorrect");
  });

  it("accepts any listed answer", () => {
    expect(gradeStudentResponse("5", ["5", "-5"]).status).toBe("correct");
    expect(gradeStudentResponse("-5", ["5", "-5"]).status).toBe("correct");
  });
});

describe("invalid formats", () => {
  it("rejects bad input without grading it", () => {
    expect(parseAnswer(".75")).toEqual({ ok: false, reason: "format" });
    expect(parseAnswer("1 1/2")).toEqual({ ok: false, reason: "format" });
    expect(parseAnswer("abc")).toEqual({ ok: false, reason: "format" });
    expect(parseAnswer("")).toEqual({ ok: false, reason: "empty" });
    expect(parseAnswer("123456")).toEqual({ ok: false, reason: "too_long" });
    expect(parseAnswer("1/0")).toEqual({
      ok: false,
      reason: "zero_denominator",
    });
  });

  it("allows 5 characters plus a minus sign", () => {
    expect(parseAnswer("12345").ok).toBe(true);
    expect(parseAnswer("-12345").ok).toBe(true);
  });
});
