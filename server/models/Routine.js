// models/Routine.js
//
// A "Routine" = a SAVED TEMPLATE the user can reuse, e.g. "Chest Day" with
// a planned list of exercises/sets/reps. This is different from a Workout:
// a Routine is the PLAN, a Workout is an actual LOGGED session.
// Matches the "Create Routine" screen from the reference screenshots.

import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Routine name is required"],
      trim: true,
      // e.g. "Chest", "Push Day", "Leg Day"
    },
    // The planned exercises in this routine - note this does NOT have
    // actual logged results (no "did you complete it" tracking here),
    // just the PLAN: what exercise, how many sets/reps, target weight.
    exercises: [
      {
        exerciseName: {
          type: String,
          required: true,
        },
        sets: {
          type: Number,
          required: true,
        },
        reps: {
          type: Number,
          required: true,
        },
        weightKg: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Routine = mongoose.model("Routine", routineSchema);

export default Routine;