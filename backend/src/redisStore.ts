import RedisStore from "connect-redis";
import { createClient } from "redis";

export const getRedisStore = async (): Promise<RedisStore> => {
  const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  try {
    await redisClient.connect();
    console.info("Connected to redis successfully");
  } catch (err) {
    console.error("Could not establish a connection with redis.", err);
  }

  return new RedisStore({
    client: redisClient,
    prefix: "sessionStore",
  });
}