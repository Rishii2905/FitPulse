// routes/routineRoutes.js

import express from "express";
import {
  createRoutine,
  getRoutines,
  deleteRoutine,
} from "../controllers/routineController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRoutine);      // POST   /api/routines
router.get("/", protect, getRoutines);         // GET    /api/routines
router.delete("/:id", protect, deleteRoutine); // DELETE /api/routines/:id

export default router;
