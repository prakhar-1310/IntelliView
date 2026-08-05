import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  createSession,
  endSession,
  leaveSession,
  getActiveSessions,
  getMyActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  joinSessionByCode,
  getAdminActiveSessions,
  cancelSessionAdmin,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/admin/active", protectRoute, requireAdmin, getAdminActiveSessions);
router.post("/admin/:id/cancel", protectRoute, requireAdmin, cancelSessionAdmin);
router.get("/my-active", protectRoute, getMyActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);
router.post("/join/code/:code", protectRoute, joinSessionByCode);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/leave", protectRoute, leaveSession);
router.post("/:id/end", protectRoute, endSession);

export default router;