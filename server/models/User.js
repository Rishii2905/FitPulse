// models/User.js
//
// A "model" in Mongoose = a blueprint for what one document looks like in
// a MongoDB collection. This one defines exactly what fields a "User" has.
// Every user that signs up will be saved using this exact shape.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // NOTE: this holds the SCRAMBLED (hashed) password, never the real one.
    },
    currentWeight: {
      type: Number,
      default: null,
    },
    targetWeight: {
      type: Number,
      default: null,
    },
  },
  {
    // Adds createdAt / updatedAt fields automatically.
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;