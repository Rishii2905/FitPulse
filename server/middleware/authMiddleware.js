// middleware/authMiddleware.js
//
// This is the "bouncer" - it runs BEFORE a protected controller function,
// checks that a valid login token was sent, and only lets the request
// through if it's genuine. If not, it rejects the request immediately -
// the controller function never even runs.

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware functions always receive THREE things (not two, like normal
// route handlers): req, res, and "next".
// "next" is a function you call to say "this check passed, continue on
// to whatever comes after me" (usually the actual controller).
const protect = async (req, res, next) => {
  try {
    // The frontend sends the token in a request HEADER, not the body,
    // formatted like this: "Authorization: Bearer eyJhbGciOi..."
    const authHeader = req.headers.authorization;

    // If there's no Authorization header at all, or it doesn't start
    // with "Bearer ", there's no token to check - reject immediately.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // The header looks like "Bearer eyJhbGciOi...", so we split on the
    // space and take the second half - just the actual token string.
    const token = authHeader.split(" ")[1];

    // jwt.verify() does the actual signature check we discussed:
    // it re-calculates the signature using JWT_SECRET and compares it
    // to the one on the token. If they don't match (or the token is
    // expired/malformed), this line THROWS an error, which jumps us
    // straight to the catch block below.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded now looks like { id: "6ac221f5...", iat: ..., exp: ... }
    // We use that id to fetch the actual user from the database.
    // ".select('-password')" means "give me everything EXCEPT the
    // password field" - we never want to accidentally expose the
    // hashed password anywhere, even internally.
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // Edge case: the token is validly signed, but the user it points
      // to no longer exists (e.g. account was deleted).
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // THIS is the key step: we attach the logged-in user's info onto
    // the request object itself. Every controller function that runs
    // AFTER this middleware can now access "req.user" and instantly
    // know who's making the request - no need to re-check anything.
    req.user = user;

    // Everything checked out - let the request continue on to the
    // actual controller function (e.g. "create a workout").
    next();
  } catch (error) {
    // jwt.verify() throws here if the token is expired, tampered with,
    // or malformed in any way.
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export default protect;