import { describe, it, expect } from "vitest";
import formatDate from "../../utils/formatDate";

describe("formatDate", () => {
  it("formats an ISO date string as 'D MMM YYYY'", () => {
    const result = formatDate("2026-07-25T10:30:00.000Z");
    expect(result).toMatch(/25 Jul 2026/);
  });

  it("handles different months correctly", () => {
    const result = formatDate("2026-01-05T00:00:00.000Z");
    expect(result).toMatch(/Jan 2026/);
  });
});
