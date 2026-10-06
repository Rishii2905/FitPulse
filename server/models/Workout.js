// models/Workout.js
//
// A "Workout" document = ONE logged exercise session, e.g. "Bench Press,
// 3 sets of 10 reps at 60kg, logged on Oct 5." Every time a user logs an
// exercise from the Workout Tracker page, one of these gets created.

import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    // This is the MOST IMPORTANT field in almost every model we'll build
    // from here on. It links this workout to EXACTLY ONE user.
    user: {
      type: mongoose.Schema.Types.ObjectId, // a MongoDB document ID (like the _id you saw in Postman)
      ref: "User", // tells Mongoose "this ID refers to a document in the User collection"
      required: true,
    },
    exerciseName: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
    },
    muscleGroup: {
      type: String,
      trim: true,
      // e.g. "Chest", "Back", "Legs" - helps later with filtering/analytics
    },
    // A workout can have multiple SETS (e.g. 3 sets of bench press, each
    // with its own reps/weight - they don't all have to be identical).
    // This is an ARRAY OF OBJECTS, nested directly inside one Workout document.
    sets: [
      {
        reps: {
          type: Number,
          required: true,
        },
        weightKg: {
          type: Number,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now, // if not provided, automatically use "right now"
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt automatically
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;