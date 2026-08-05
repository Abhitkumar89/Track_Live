require("dotenv").config(); // load MONGODB_URI, REDIS_URL, PORT from .env

const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const connectDB = require("./config/db");
const connectRedis = require("./config/redis");
const Location = require("./models/Location");

const app = express();
const server = http.createServer(app);
// Socket.IO needs the raw HTTP server (not just Express) for WebSocket upgrades
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

async function start() {
    // Connect storage before accepting location events
    await connectDB(); // MongoDB = permanent location history
    const redis = await connectRedis(); // Redis = live online-user sessions

    io.on("connection", (socket) => {
        console.log("New WebSocket connection");

        // Browser sends GPS coords whenever the user's position changes
        socket.on("send-location", async (data) => {
            const { name, latitude, longitude } = data;

            try {
                // 1) Save to MongoDB for history (GeoJSON: [lng, lat])
                await Location.create({
                    socketId: socket.id,
                    name,
                    location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                });

                // 2) Cache latest position in Redis (fast live session state)
                await redis.set(
                    `user:${socket.id}`,
                    JSON.stringify({ name, latitude, longitude })
                );
            } catch (err) {
                console.error("Failed to save location:", err.message);
            }

            // 3) Broadcast to every connected client so maps update in real time
            io.emit("receive-location", { id: socket.id, ...data });
        });

        socket.on("disconnect", async () => {
            try {
                // User left → remove their live session from Redis
                await redis.del(`user:${socket.id}`);
            } catch (err) {
                console.error("Failed to clear Redis session:", err.message);
            }

            // Tell all clients to remove this user's marker from the map
            io.emit("user-disconnect", socket.id);
        });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
});
