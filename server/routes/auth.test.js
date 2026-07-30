import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import request from "supertest";

// Mock the User model entirely — these are INTEGRATION tests for the
// HTTP layer (routing, controller logic, status codes, response
// shape), not for MongoDB itself. Mocking the model keeps tests
// fast and independent of a real database connection.
vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

const User = (await import("../../models/User.js")).default;
const app = (await import("../../app.js")).default;

describe("Auth routes", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret_key";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("returns 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "a@a.com" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 if the email is already registered", async () => {
      User.findOne.mockResolvedValue({
        _id: "existing",
        email: "ravi@test.com",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Ravi",
        email: "ravi@test.com",
        password: "secret123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it("returns 201 and a token on successful registration", async () => {
      User.findOne.mockResolvedValue(null); // no existing user
      User.create.mockResolvedValue({
        _id: "new_user_id",
        name: "Ravi",
        email: "ravi@test.com",
        avatar: "",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Ravi",
        email: "ravi@test.com",
        password: "secret123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("ravi@test.com");
      expect(res.body.data.token).toBeDefined();
      // The password must NEVER appear in the response, even hashed.
      expect(res.body.data.password).toBeUndefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns 400 if email or password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "a@a.com" });

      expect(res.status).toBe(400);
    });

    it("returns 401 for a non-existent user", async () => {
      User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@test.com", password: "wrong" });

      expect(res.status).toBe(401);
      // Deliberately vague — see authController.js's comment on why.
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it("returns 401 when the password doesn't match", async () => {
      const fakeUser = { matchPassword: vi.fn().mockResolvedValue(false) };
      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(fakeUser),
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "ravi@test.com", password: "wrongpass" });

      expect(res.status).toBe(401);
    });

    it("returns 200 and a token for valid credentials", async () => {
      const fakeUser = {
        _id: "user123",
        name: "Ravi",
        email: "ravi@test.com",
        avatar: "",
        matchPassword: vi.fn().mockResolvedValue(true),
      };
      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(fakeUser),
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "ravi@test.com", password: "secret123" });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });
  });
});
