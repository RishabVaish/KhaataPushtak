import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// `protect` runs BEFORE getUserProfile. If the token is missing or
// invalid, protect throws an error and getUserProfile never executes.
router.get("/profile", protect, getUserProfile);

export default router;
