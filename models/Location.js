const mongoose = require("mongoose");

// Each GPS ping is stored as one document (permanent history)
const locationSchema = new mongoose.Schema({
    socketId: String, // which connected user sent this point
    name: String,
    // GeoJSON Point — required shape for MongoDB geospatial queries
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        // IMPORTANT: GeoJSON order is [longitude, latitude], not lat/lng
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 2dsphere index enables "find nearby" / distance queries on this field
locationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Location", locationSchema);
