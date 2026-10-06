// routes/workoutRoutes.js

import express from "express";
import {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Notice "protect" sits BETWEEN the path and the controller function on
// every single line below. This means EVERY workout route requires a
// valid login token - there is no public way to view or create workouts.
// Express runs middleware left to right: protect runs FIRST, and only
// calls next() (continuing to the controller) if the token checks out.

router.post("/", protect, createWorkout);     // POST   /api/workouts
router.get("/", protect, getWorkouts);        // GET    /api/workouts
router.put("/:id", protect, updateWorkout);   // PUT    /api/workouts/:id
router.delete("/:id", protect, deleteWorkout); // DELETE /api/workouts/:id

export default router;
