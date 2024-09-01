import { createClient } from "redis"; // Correct import for Redis
// Correctly create Redis client
const redisClient = createClient({
  url: 'redis://127.0.0.1:6379' // Ensure correct URL format if you want to specify host and port
});

(async () => {
  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  redisClient.on("ready", () => {
    console.log("Redis is ready");
  });

  await redisClient.connect();
  await redisClient.ping();
})();


export default redisClient;