// lib/redis.ts
import { Redis } from '@upstash/redis';

declare global {
  // Extend the NodeJS Global interface to include 'redis'
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

export const redis =
  global.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    automaticDeserialization:false
  });

if (process.env.NODE_ENV !== 'production') global.redis = redis;
