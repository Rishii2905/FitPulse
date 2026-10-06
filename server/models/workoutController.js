// controllers/workoutController.js
//
// The actual logic for the 4 basic operations on workouts - these four
// operations (Create, Read, Update, Delete) are so common they have a
// nickname: "CRUD". Almost every feature in every app boils down to CRUD
// on some kind of data. Workouts are our first full CRUD example.

import Workout from "../models/Workout.js";

// --- CREATE a new workout ---
// POST /api/workouts
export const createWorkout = async (req, res) => {
  try {
    const { exerciseName, muscleGroup, sets, date, notes } = req.body;

    if (!exerciseName || !sets || sets.length === 0) {
      return res.status(400).json({ message: "Exercise name and at least one set are required" });
    }

    // Notice: we get the user ID from req.user (attached by authMiddleware),
    // NOT from anything the frontend sends us. This is important - it
    // means a user can only ever create a workout for THEMSELVES, never
    // for someone else, because req.user comes from their verified token,
    // not from data they could fake in the request body.
    const workout = await Workout.create({
      user: req.user._id,
      exerciseName,
      muscleGroup,
      sets,
      date,
      notes,
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// --- READ all workouts for the logged-in user ---
// GET /api/workouts
export const getWorkouts = async (req, res) => {
  try {
    // Only fetch workouts belonging to THIS user - never return
    // everyone's workouts. This is the same req.user._id pattern again.
    // .sort({ date: -1 }) means "newest first" (-1 = descending order).
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// --- UPDATE an existing workout ---
// PUT /api/workouts/:id
export const updateWorkout = async (req, res) => {
  try {
    // req.params.id comes from the URL itself - e.g. for a request to
    // /api/workouts/6ac221f5..., req.params.id is "6ac221f5...".
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // SECURITY CHECK: make sure this workout actually belongs to the
    // person making the request. Without this check, any logged-in user
    // could edit ANY workout just by guessing/changing the ID in the URL.
    // .toString() because workout.user is an ObjectId object, and
    // req.user._id is too - we compare them as plain strings to be safe.
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this workout" });
    }

    // Object.assign copies every field from req.body onto the existing
    // workout document, overwriting only the fields that were actually sent.
    Object.assign(workout, req.body);

    const updatedWorkout = await workout.save();

    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// --- DELETE a workout ---
// DELETE /api/workouts/:id
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Same ownership check as update - you can only delete your OWN workouts.
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this workout" });
    }

    await workout.deleteOne();

    res.status(200).json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};