import { db } from "@/server/db";
import { views } from "@/server/db/schema";
import { subDays } from "date-fns";
import { and, eq, gt, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

const getDuplicateView = async (userId:string | null,postId:string,anonId: string | null) => {
    if(userId){
        const isDuplicateView = await db.select().from(views).where(
            and(
                eq(views.postId,postId),
                eq(views.userId,userId),
                gt(views.viewedAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
            )
        );
        return isDuplicateView;
    } else if(anonId) {
        const isDuplicateView = await db.select().from(views).where(
            and(
                eq(views.postId,postId),
                eq(views.anonId,anonId),
                gt(views.viewedAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
            )
        );
        return isDuplicateView;
    }
    return null;

}

export const viewsRouter = createTRPCRouter({
    
    createView: baseProcedure
    .input(z.object({
        userId:z.string().nullable(),
        anonId:z.string().nullable(),
        postId:z.string()
    }))
    .mutation(async ({input:{userId,postId,anonId}}) => {
        //check if the any duplicate view by the user, i.e in less than 24 hrs
        const isDuplicateView = await getDuplicateView(userId,postId,anonId);
        //if yes then dont create the view column in db
        if(isDuplicateView && isDuplicateView[0]){
            console.log("I am in the duplicate section")
            return null;
        } else if(userId){
                const newView = await db.insert(views).values({
                    postId:postId,
                    anonId: null,
                    userId:userId,
                }).returning({id: views.id});
                console.log("i am in the new view section");
                return newView[0].id;
            } else if(anonId){
                const newView = await db.insert(views).values({
                    postId:postId,
                    anonId: anonId,
                    userId:null,
                }).returning({id: views.id});
                console.log("i am in the new view section");
                return newView[0].id;
            } else {
                return null
            }
    }),

    getViewsByUserId: protectedProcedure
    .input(z.object({
        userId:z.string()
    }))
    .query(async ({input:{userId}}) => {
        const viewsCount = await db.select({count:sql<number>`count(*)`}).from(views).where(eq(views.userId,userId));
        return viewsCount[0].count;
    }),
    getTopPostByViews: protectedProcedure
    .query(async () => {
        const topPost = await db.select({
            postId: views.postId,
            count: sql<number>`count(*)`
        }).from(views).groupBy(views.postId).orderBy(sql`count(*) DESC`).limit(5);
        return topPost;
    }),
    getViewsByLast30Days: protectedProcedure
    .input(z.object({
        userId:z.string()
    }))
    .query(async ({input:{userId}}) => {
        const thirtyDaysAgo = subDays(new Date(),30)
        const viewsByDay = await db.select({
            date:sql<string>`DATE(${views.viewedAt})`,
            count:sql<number>`count(*)`
        }).from(views).where(and(eq(views.userId,userId),gte(views.viewedAt, thirtyDaysAgo))).groupBy(sql`DATE(${views.viewedAt})`).orderBy(sql`DATE(${views.viewedAt}) ASC`);
        return viewsByDay;
    })
})

