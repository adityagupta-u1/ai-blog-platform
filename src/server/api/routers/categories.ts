import { redis } from "@/lib/redis";
import { db } from "@/server/db";
import { categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../trpc";


export const categoriesRouter = createTRPCRouter({
    
    getCategories: baseProcedure
    .query(async () => {
        //Fetch from redis if available
        const redisCategories = await redis.smembers('categories');
        if (redisCategories.length > 0) {
            // If categories are found in redis, return them
            const categoriesList = redisCategories
            .map((c) => {
                return JSON.parse(c) as { id: string; name: string; slug: string };
            })// remove any nulls from bad JSON

            return categoriesList;     
        } else {
            const categoryList = await db.select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug
            }).from(categories);
            return categoryList;
        }
    
        // Return the categories from the database  
  
    }),
    addCategory: protectedProcedure
    .input(z.object({
        category: z.string().min(1),
    }))
    .mutation(async ({input}) => {
        //Add to postgres
        const newCategory = await db.insert(categories).values({
            name: input.category,
            slug: input.category.toLocaleLowerCase().replace(/\s+/g, '-')
        }).returning();

        //TODO: add to redis
        const redisCategory =  JSON.stringify({
            id: newCategory[0].id,
            name: newCategory[0].name,
            slug: newCategory[0].slug
        })
        await redis.sadd('categories', redisCategory);
        return newCategory[0];
    }),
    deleteCategory: protectedProcedure
    .input(z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        slug: z.string().min(1),
    }))
    .mutation(async ({input}) => {
        const deletedCategory = await db.delete(categories).where(eq(categories.id, input.id)).returning();
        //TODO: delete from redis
        //Delete from tags set
        await redis.srem('categories',JSON.stringify({
            id: input.id,
            name: input.name,
            slug: input.slug,
        }))
        return deletedCategory[0];
    }),
})