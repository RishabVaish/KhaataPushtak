import { describe, it, expect } from "vitest";
import { decodeToken, isTokenExpired } from "../../utils/jwt";

// Builds a fake (unsigned) JWT-shaped string — decodeToken never
// verifies the signature, only reads the payload, so this is enough
// to test decoding logic without needing the real jsonwebtoken lib.
const buildFakeToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
};

describe("decodeToken", () => {
  it("decodes a well-formed token's payload", () => {
    const token = buildFakeToken({ id: "user123", exp: 9999999999 });
    expect(decodeToken(token)).toEqual({ id: "user123", exp: 9999999999 });
  });

  it("returns null for a malformed token instead of throwing", () => {
    expect(decodeToken("not-a-real-token")).toBeNull();
  });
});

describe("isTokenExpired", () => {
  it("returns false for a token with a future exp claim", () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // +1 hour
    const token = buildFakeToken({ id: "user123", exp: futureExp });
    expect(isTokenExpired(token)).toBe(false);
  });

  it("returns true for a token with a past exp claim", () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // -1 hour
    const token = buildFakeToken({ id: "user123", exp: pastExp });
    expect(isTokenExpired(token)).toBe(true);
  });

  it("returns true for a malformed/undecodable token (fail safe, not fail open)", () => {
    expect(isTokenExpired("garbage")).toBe(true);
  });
});
