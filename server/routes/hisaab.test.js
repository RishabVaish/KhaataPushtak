import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock authMiddleware so every request is treated as already
// authenticated as a fixed test user — these tests focus on CRUD
// + ownership logic, not re-testing JWT verification (already
// covered in authMiddleware.test.js).
const TEST_USER_ID = "test_user_id";
vi.mock("../../middleware/authMiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { _id: TEST_USER_ID };
    next();
  },
}));

vi.mock("../../models/Hisaab.js", () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

const Hisaab = (await import("../../models/Hisaab.js")).default;
const app = (await import("../../app.js")).default;

describe("Hisaab routes (ownership enforcement)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/hisaab", () => {
    it("scopes the query to the authenticated user's ID", async () => {
      const chain = {
        sort: vi.fn().mockReturnThis(),
        populate: vi.fn().mockResolvedValue([{ _id: "1", title: "Milk" }]),
      };
      Hisaab.find.mockReturnValue(chain);

      const res = await request(app).get("/api/hisaab");

      expect(res.status).toBe(200);
      // The critical assertion: the query object passed to find()
      // MUST include the authenticated user's ID — this is the
      // enforcement mechanism that prevents cross-user data leaks.
      expect(Hisaab.find).toHaveBeenCalledWith(
        expect.objectContaining({ user: TEST_USER_ID }),
      );
    });
  });

  describe("POST /api/hisaab", () => {
    it("attaches the authenticated user's ID, ignoring any user field in the body", async () => {
      Hisaab.create.mockResolvedValue({
        _id: "1",
        title: "Milk",
        user: TEST_USER_ID,
      });

      await request(app).post("/api/hisaab").send({
        title: "Milk",
        content: "1L",
        category: "Grocery",
        user: "someone_else",
      });

      // Even though the request body tried to set a different user,
      // the controller must have used req.user._id, not the body.
      expect(Hisaab.create).toHaveBeenCalledWith(
        expect.objectContaining({ user: TEST_USER_ID }),
      );
    });
  });

  describe("GET /api/hisaab/:id", () => {
    it("returns 404 when the entry doesn't belong to the requesting user", async () => {
      const chain = { populate: vi.fn().mockResolvedValue(null) };
      Hisaab.findOne.mockReturnValue(chain);

      const res = await request(app).get("/api/hisaab/someid");

      expect(res.status).toBe(404);
      expect(Hisaab.findOne).toHaveBeenCalledWith({
        _id: "someid",
        user: TEST_USER_ID,
      });
    });
  });

  describe("PUT /api/hisaab/:id", () => {
    it("only forwards whitelisted fields, never a user field from the body", async () => {
      Hisaab.findOneAndUpdate.mockResolvedValue({ _id: "1", title: "Updated" });

      await request(app)
        .put("/api/hisaab/1")
        .send({ title: "Updated", user: "attacker_id" });

      const updatePayload = Hisaab.findOneAndUpdate.mock.calls[0][1];
      expect(updatePayload.user).toBeUndefined();
      expect(updatePayload.title).toBe("Updated");
    });
  });

  describe("DELETE /api/hisaab/:id", () => {
    it("returns 404 when trying to delete another user's entry", async () => {
      Hisaab.findOneAndDelete.mockResolvedValue(null);

      const res = await request(app).delete("/api/hisaab/not-mine");

      expect(res.status).toBe(404);
      expect(Hisaab.findOneAndDelete).toHaveBeenCalledWith({
        _id: "not-mine",
        user: TEST_USER_ID,
      });
    });
  });
});
