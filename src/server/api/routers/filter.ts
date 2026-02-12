import { posts } from "@/server/db/schema";
import { and, between, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/index";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const filterRouter = createTRPCRouter({
    filterPost: protectedProcedure
    .input(z.object({
        from_date:z.string(),
        to_date:z.string(),
        status: z.string()
    }))
    .mutation(async ({input}) => {
        const {from_date, to_date, status} = input;
        console.log(new Date(from_date), new Date(to_date), status);
        const filteredPost = await db.select({
            id: posts.id,
            userId: posts.userId,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            status: posts.status,
        }).from(posts).where(and(between(posts.createdAt, new Date(from_date), new Date(to_date)), eq(posts.status, status)));
        return filteredPost
    })
})