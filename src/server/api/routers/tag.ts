import { redis } from "@/lib/redis";
import { db } from "@/server/db";
import { postTags, tags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../trpc";


export const tagsRouter = createTRPCRouter({
    getTags: baseProcedure
    .query(async () => {
        console.time("redis-fetch");
        const redisTags = await redis.smembers('tags');
        if (redisTags.length > 0) {
            // If categories are found in redis, return them
            // Convert the set of tags to an array of objects with id, name, and slug
            const tagsList = redisTags.map(tag => JSON.parse(tag)) as unknown as { id: string; name: string; slug: string }[];   
            console.timeEnd("redis-fetch");    
            return tagsList;
        } else {
            const tagsList = await db.select({
                id: tags.id,
                name: tags.name,
                slug: tags.slug
            }).from(tags);
            return tagsList;
        }
        
    }),
    addTag: protectedProcedure
    .input(z.object({
        tag: z.string().min(1),
    }))
    .mutation(async ({input}) => {
        //Add in postgres
        const newTag = await db.insert(tags).values({
            name: input.tag,
            slug: input.tag.toLocaleLowerCase().replace(/\s+/g, '-')
        }).returning({name: tags.name,id:tags.id, slug: tags.slug}); 
        
        //Add in redis
        // Convert the new tag to a JSON string and add it to the 'tags' set in Redis
        // This will allow us to retrieve it later without needing to query the database
        // This is useful for performance and caching purposes  
        const redisTag = JSON.stringify({
            id: newTag[0].id,
            name: newTag[0].name,
            slug: newTag[0].slug
        }); 
        await redis.sadd('tags', redisTag);
        return newTag[0];
    }),
    deleteTag: protectedProcedure
    .input(z.object({
        id: z.string().min(1),
    }))
    .mutation(async ({input}) => {
        const tagArray = await db.select().from(postTags).where(eq(postTags.tagId,input.id));
        console.log("Tag Array: ", tagArray);
        const deletedTag = await db.delete(tags).where(eq(tags.id, input.id)).returning();
        //TODO: Delete from redis

        //Delete from tags set
        await redis.srem('tags',JSON.stringify({
            id: deletedTag[0].id,
            name: deletedTag[0].name,
            slug: deletedTag[0].slug,
        }))
        for(const tag of tagArray) {
            // Delete each tag from the Redis set
            console.log("Deleting tag from Redis: ", tag.tagId);
            await redis.srem(`tags:${tag.tagId}`, tag.postId);
        }
        return deletedTag[0];
    }),
})