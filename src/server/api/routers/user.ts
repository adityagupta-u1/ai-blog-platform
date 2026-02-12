import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const userRouter = createTRPCRouter({
    getAllUsers: protectedProcedure
    .query(async ()=>{
        const userList = await db.select({id:users.id,name:users.name}).from(users);
        return userList;
    })
})