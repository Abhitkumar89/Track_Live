const Redis = require("ioredis");
const { RedisMemoryServer } = require("redis-memory-server");

// Redis stores short-lived "who's online right now" data (not full history)
async function connectRedis() {
    // Prefer a real Redis server when REDIS_URL is set (Cloud / Docker / local)
    if (process.env.REDIS_URL) {
        const redis = new Redis(process.env.REDIS_URL);
        redis.on("connect", () => console.log("Redis connected"));
        redis.on("error", (err) => console.error("Redis error:", err.message));
        return redis;
    }

    // Fallback for local dev: start an in-process Redis so the app runs without installing Redis
    const redisServer = await RedisMemoryServer.create();
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    const redis = new Redis({ host, port });

    console.log(`Redis connected (local memory server on ${host}:${port})`);
    return redis;
}

module.exports = connectRedis;
