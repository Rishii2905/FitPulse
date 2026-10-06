// config/db.js
//
// This file's ONLY job is: connect to MongoDB using Mongoose.
// We keep it separate from server.js so the "how do I connect to the database"
// logic lives in one clearly-named place.

import mongoose from "mongoose"; // Mongoose = a library that lets us talk to MongoDB using JS objects/classes instead of raw database queries

// This is an "async function" because connecting to a database takes time
// (it happens over the network) - we can't know the result instantly.
const connectDB = async () => {
  try {
    // mongoose.connect() reads the connection string (from .env) and opens
    // a connection to our MongoDB database. "await" pauses this function
    // until the connection succeeds or fails.
    // serverSelectionTimeoutMS: give up after 8 seconds instead of hanging
    // indefinitely, so we always get a clear error instead of silence.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    // conn.connection.host tells us which MongoDB server we successfully connected to.
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If the connection string is wrong, or MongoDB is unreachable, we land here.
    // Logging the FULL error (not just .message) shows us exactly what MongoDB
    // driver is complaining about - auth failure, TLS issue, bad hostname, etc.
    console.error("MongoDB connection failed - full error below:");
    console.error(error);

    // process.exit(1) stops the whole Node process immediately.
    // We do this because a server with NO database connection can't do
    // anything useful anyway - better to fail loudly now than fail
    // confusingly later when a request tries to save data.
    process.exit(1);
  }
};

// We export this function so server.js can import it and call it once,
// when the app starts up.
export default connectDB;