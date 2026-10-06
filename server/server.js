// server.js
//
// This is the ENTRY POINT of the whole backend - the file you run to start
// the server. Right now it does the bare minimum: start Express, connect to
// MongoDB, and respond to one test route. We'll plug in real routes
// (workouts, exercises, recipes...) in later steps.

import express from "express";       // Express = a framework that makes it easy to handle HTTP requests in Node.js
import dotenv from "dotenv";         // dotenv = loads variables from our .env file into process.env
import cors from "cors";             // cors = allows our React app (running on a different port) to call this API

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import routineRoutes from "./routes/routineRoutes.js"; // our signup/login routes

// Load the .env file's contents into process.env, so process.env.PORT
// and process.env.MONGO_URI become available anywhere in this app.
dotenv.config();

// Connect to MongoDB. This runs once, when the server starts.
connectDB();

// Create the actual Express application. "app" is now our server object -
// everything else (routes, middleware) gets attached to it.
const app = express();

// --- Middleware ---
// "Middleware" = functions that run on EVERY request, before it reaches
// our route logic. Think of it as a checkpoint every request passes through.

app.use(cors());
// ^ Without this, a browser would block requests from your React app
//   (e.g. http://localhost:5173) to your API (http://localhost:5000)
//   because they're on different ports - CORS explicitly allows it.

app.use(express.json());
// ^ Without this, when the frontend sends JSON data (like a new workout),
//   Express wouldn't know how to read it. This middleware parses incoming
//   JSON request bodies and makes them available as req.body.

// --- A single test route, so we can confirm the server works ---
// app.get(path, handlerFunction) means:
// "When a GET request hits this path, run this function."
app.get("/api/health", (req, res) => {
  // req = the incoming request (data coming IN)
  // res = the response we send back (data going OUT)
  res.json({ status: "ok", message: "FitPulse API is running" });
});

// --- Auth routes ---
// app.use(basePath, router) means: "any route defined inside authRoutes.js
// actually lives at /api/auth/<that route>."
// So router.post("/signup", ...) becomes reachable at POST /api/auth/signup
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/routines", routineRoutes);

// Read the port from .env, or default to 5000 if it's not set.
const PORT = process.env.PORT || 5000;

// Start listening for requests. Everything above this line just SETS UP
// the app - nothing actually runs until listen() is called.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});