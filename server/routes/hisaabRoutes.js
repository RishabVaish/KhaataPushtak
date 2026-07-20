import express from "express";
import {
  getHisaabs,
  getHisaabById,
  createHisaab,
  updateHisaab,
  deleteHisaab,
} from "../controllers/hisaabController.js";

const router = express.Router();

// Note: router.route(path) lets us chain multiple HTTP methods
// for the SAME path — cleaner than repeating the path twice.
router.route("/").get(getHisaabs).post(createHisaab);

router
  .route("/:id")
  .get(getHisaabById)
  .put(updateHisaab)
  .delete(deleteHisaab);

export default router;
