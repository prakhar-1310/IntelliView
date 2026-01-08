import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createProblem, getProblems, deleteProblem, updateProblem, getProblemById } from "../controllers/problemController.js";

const router = express.Router();

router.post("/", protectRoute, createProblem);
router.get("/", getProblems);
router.get("/:id", getProblemById);
router.put("/:id", protectRoute, updateProblem);
router.delete("/:id", protectRoute, deleteProblem);

export default router;