// controllers/routineController.js
//
// Same CRUD pattern as workouts, but simpler - routines are just saved
// templates, so we only need Create, Read, and Delete (no "update" screen
// in the reference design - editing just means delete + recreate for now).

import Routine from "../models/Routine.js";

// --- CREATE a new routine ---
// POST /api/routines
export const createRoutine = async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Routine name and at least one exercise are required" });
    }

    const routine = await Routine.create({
      user: req.user._id,
      name,
      exercises,
    });

    res.status(201).json(routine);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// --- READ all routines for the logged-in user ---
// GET /api/routines
export const getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// --- DELETE a routine ---
// DELETE /api/routines/:id
export const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    if (routine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this routine" });
    }

    await routine.deleteOne();

    res.status(200).json({ message: "Routine deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};