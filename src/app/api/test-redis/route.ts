import { redis } from "@/lib/redis";

export async function GET() {
  const start = Date.now();
  const data = await redis.smembers("categories");
  const data2 = await redis.smembers("tags");
  const parsed = data.map((c) => JSON.parse(c));
  const parsed2 = data2.map((c) => JSON.parse(c));
  const duration = Date.now() - start;

  return Response.json({ duration, count: parsed.length,count2: parsed2.length })
}