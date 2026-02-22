// lib/redis.ts
import { Redis } from '@upstash/redis';

declare global {
  // Extend the NodeJS Global interface to include 'redis'
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  globalForRedis.redis ??
  (url && token
    ? new Redis({
        url,
        token,
        automaticDeserialization: false
      })
    : (null as unknown as Redis));

if (process.env.NODE_ENV !== 'production' && url && token) {
  globalForRedis.redis = redis;
}
