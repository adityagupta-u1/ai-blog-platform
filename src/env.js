import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string(),
        CLERK_WEBHOOK_SIGNING_SECRET:z.string(),
        GOOGLE_GEMINI_API_KEY:z.string(),
        ADMIN_EMAIL: z.string().email(),
        UPSTASH_REDIS_REST_URL:z.string(),
        UPSTASH_REDIS_REST_TOKEN:z.string(),
        CLOUDINARY_URL:z.string(),
        GROQ_API_KEY:z.string(),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
        CLERK_SECRET_KEY: z.string(),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    runtimeEnv:{
        DATABASE_URL: process.env.DATABASE_URL,
        CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
        GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
        CLOUDINARY_URL:process.env.CLOUDINARY_URL,
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    },
    emptyStringAsUndefined: true,
});