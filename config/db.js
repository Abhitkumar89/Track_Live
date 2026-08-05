const mongoose = require("mongoose");

// Connects to MongoDB using MONGODB_URI from .env (local or Atlas)
async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is missing. Copy .env.example to .env and set it.");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
}

module.exports = connectDB;
