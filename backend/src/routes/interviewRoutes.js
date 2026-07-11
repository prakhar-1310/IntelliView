import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  saveInterviewReport,
  getInterviewHistory,
  getInterviewById,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/save", protectRoute, saveInterviewReport);
router.get("/history", protectRoute, getInterviewHistory);
router.get("/:id", protectRoute, getInterviewById);

export default router;
