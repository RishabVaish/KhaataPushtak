import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import generateToken from "../../utils/generateToken.js";

describe("generateToken", () => {
  beforeAll(() => {
    // generateToken reads process.env.JWT_SECRET at CALL time (not
    // import time), so setting it here before the tests run is safe.
    process.env.JWT_SECRET = "test_secret_key";
  });

  it("produces a token that can be verified with the same secret", () => {
    const token = generateToken("user123");
    const decoded = jwt.verify(token, "test_secret_key");

    expect(decoded.id).toBe("user123");
  });

  it("sets a 30-day expiry claim", () => {
    const token = generateToken("user123");
    const decoded = jwt.decode(token);

    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const actualLifetime = decoded.exp - decoded.iat;

    // Allow a tiny tolerance for test execution time.
    expect(actualLifetime).toBeGreaterThan(thirtyDaysInSeconds - 5);
    expect(actualLifetime).toBeLessThanOrEqual(thirtyDaysInSeconds);
  });

  it("throws if verified with the WRONG secret", () => {
    const token = generateToken("user123");
    expect(() => jwt.verify(token, "wrong_secret")).toThrow();
  });
});
