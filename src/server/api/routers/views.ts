import { db } from "@/server/db";
import { views } from "@/server/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

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
             
    })
})