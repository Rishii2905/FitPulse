// routes/authRoutes.js
//
// A "route" file's only job is to say: "when a request hits THIS url with
// THIS method, run THIS controller function." No actual logic lives here.

import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;