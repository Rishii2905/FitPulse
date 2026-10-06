// server.js
//
// This is the ENTRY POINT of the whole backend - the file you run to start
// the server.

import express from "express";
import dotenv from "dotenv";   //dotenv loads environment variables from a .env file into process.env
import cors from "cors";  //cors enables communication between the frontend and backend when they are on different ports/domains

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();  //this line reads the .env file and makes the variables available in process.env

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FitPulse API is running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});