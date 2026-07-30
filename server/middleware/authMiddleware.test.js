import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

// Mock the User model BEFORE importing the middleware that uses it —
// this avoids needing a real MongoDB connection just to test
// middleware logic. vi.mock is hoisted automatically by Vitest.
vi.mock("../../models/User.js", () => ({
  default: { findById: vi.fn() },
}));

const { protect } = await import("../../middleware/authMiddleware.js");
const User = (await import("../../models/User.js")).default;

describe("authMiddleware.protect", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret_key";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    return res;
  };

  it("calls next() with an error when no Authorization header is present", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = vi.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toMatch(/no token provided/i);
  });

  it("calls next() with an error for an invalid/malformed token", async () => {
    const req = { headers: { authorization: "Bearer not-a-real-token" } };
    const res = mockRes();
    const next = vi.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next.mock.calls[0][0].message).toMatch(/invalid or expired/i);
  });

  it("attaches req.user and calls next() with no error for a valid token", async () => {
    const fakeUser = { _id: "user123", name: "Ravi" };
    User.findById.mockResolvedValue(fakeUser);

    const validToken = jwt.sign({ id: "user123" }, "test_secret_key");
    const req = { headers: { authorization: `Bearer ${validToken}` } };
    const res = mockRes();
    const next = vi.fn();

    await protect(req, res, next);

    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalledWith(); // called with no arguments = success
  });

  it("rejects with 401 if the token is valid but the user no longer exists", async () => {
    User.findById.mockResolvedValue(null);

    const validToken = jwt.sign({ id: "deleted_user" }, "test_secret_key");
    const req = { headers: { authorization: `Bearer ${validToken}` } };
    const res = mockRes();
    const next = vi.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next.mock.calls[0][0].message).toMatch(/no longer exists/i);
  });
});
