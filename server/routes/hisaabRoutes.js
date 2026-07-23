import express from "express";
import {
  getHisaabs,
  getHisaabById,
  createHisaab,
  updateHisaab,
  deleteHisaab,
} from "../controllers/hisaabController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route below this line requires a valid JWT. protect runs
// first, attaches req.user, and only then does the matched
// controller execute. No Hisaab route is public anymore.
router.use(protect);

// Note: router.route(path) lets us chain multiple HTTP methods
// for the SAME path — cleaner than repeating the path twice.
router.route("/").get(getHisaabs).post(createHisaab);

router.route("/:id").get(getHisaabById).put(updateHisaab).delete(deleteHisaab);

export default router;
