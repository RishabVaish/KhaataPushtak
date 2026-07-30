import { describe, it, expect } from "vitest";
import getErrorMessage from "../../utils/getErrorMessage";

describe("getErrorMessage", () => {
  it("returns a timeout-specific message for ECONNABORTED", () => {
    const error = { code: "ECONNABORTED" };
    expect(getErrorMessage(error)).toMatch(/took too long/i);
  });

  it("returns a network error message when there's no response at all", () => {
    const error = {};
    expect(getErrorMessage(error)).toMatch(/network error/i);
  });

  it("prefers the backend's own message when present", () => {
    const error = {
      response: { status: 400, data: { message: "Title is required" } },
    };
    expect(getErrorMessage(error)).toBe("Title is required");
  });

  it("falls back to a status-specific message when the backend sends none", () => {
    const error = { response: { status: 401, data: {} } };
    expect(getErrorMessage(error)).toMatch(/not authorized/i);
  });

  it("falls back to a generic message for an unrecognized status with no message", () => {
    const error = { response: { status: 418, data: {} } };
    expect(getErrorMessage(error)).toMatch(/unexpected error/i);
  });
});
