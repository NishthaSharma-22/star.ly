import { describe, expect, it } from "vitest";
import { getLocalDate } from "./dates";

const now = new Date("2026-10-30T02:00:00Z");

describe("getLocalDate", () => {
  it("uses the given timezone's calendar day", () => {
    expect(getLocalDate("UTC", now)).toBe("2026-10-30");
    expect(getLocalDate("Asia/Kolkata", now)).toBe("2026-10-30");
    expect(getLocalDate("America/Los_Angeles", now)).toBe("2026-10-29");
  });

  it("falls back to UTC for missing or invalid timezones", () => {
    expect(getLocalDate(undefined, now)).toBe("2026-10-30");
    expect(getLocalDate("", now)).toBe("2026-10-30");
    expect(getLocalDate("Not/AZone", now)).toBe("2026-10-30");
  });
});
