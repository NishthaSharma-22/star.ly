export const MAX_LENGTH = 5;

export type ParseFailure = "empty" | "too_long" | "format" | "zero_denominator";

export type Fraction = { numerator: number; denominator: number };

export type ParseResult =
  | { ok: true; value: Fraction }
  | { ok: false; reason: ParseFailure };

export type GradeResult =
  | { status: "correct" }
  | { status: "incorrect" }
  | { status: "invalid"; reason: ParseFailure };

export const INVALID_MESSAGES: Record<ParseFailure, string> = {
  empty: "Enter an answer.",
  too_long: `Answers can be at most ${MAX_LENGTH} characters.`,
  format:
    "Enter a whole number, a decimal like 0.75, or a fraction like 3/4. Mixed numbers aren't allowed.",
  zero_denominator: "A fraction can't have 0 as the denominator.",
};

export function parseAnswer(input: string): ParseResult {
  const text = input.trim();
  if (text === "") return { ok: false, reason: "empty" };

  const negative = text.startsWith("-");
  const body = negative ? text.slice(1) : text;
  const sign = negative ? -1 : 1;

  let numerator: number;
  let denominator: number;

  if (/^\d+$/.test(body)) {
    numerator = Number(body);
    denominator = 1;
  } else if (/^\d+\.\d+$/.test(body)) {
    const [whole, decimals] = body.split(".");
    numerator = Number(whole + decimals);
    denominator = 10 ** decimals.length;
  } else if (/^\d+\/\d+$/.test(body)) {
    const [top, bottom] = body.split("/");
    numerator = Number(top);
    denominator = Number(bottom);
  } else {
    return { ok: false, reason: "format" };
  }

  if (body.length > MAX_LENGTH) return { ok: false, reason: "too_long" };
  if (denominator === 0) return { ok: false, reason: "zero_denominator" };

  return { ok: true, value: { numerator: sign * numerator, denominator } };
}

export function isSameValue(a: Fraction, b: Fraction): boolean {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

export function gradeStudentResponse(
  input: string,
  acceptedAnswers: string[],
): GradeResult {
  const parsed = parseAnswer(input);
  if (!parsed.ok) return { status: "invalid", reason: parsed.reason };

  const isCorrect = acceptedAnswers.some((accepted) => {
    const answer = parseAnswer(accepted);
    return answer.ok && isSameValue(parsed.value, answer.value);
  });

  return { status: isCorrect ? "correct" : "incorrect" };
}
