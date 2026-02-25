import { db } from "@/server/db";
import { categories, posts, postTags, tags } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { env } from "../../../env";
// import { redis } from "../../../lib/redis";
import { redis } from "@/lib/redis";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../../server/api/trpc";

import OpenAI from "openai";

const client = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});




interface PostRedisWithoutTags {
  id:string;
  title:string;
  content:string;
  category:string;
  slug:string,
  banner_img:string;
}
interface PostRedis {
  id:string;
  title:string;
  content:string;
  category:string;
  slug:string;
  banner_img:string;
  tags:string[];
}


export const postRouter = createTRPCRouter({

  getAllPosts: baseProcedure
  .query(
    async () => {
      //Read from redis(cache)
      const postList = await db.select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        status: posts.status
      }).from(posts).where(eq(posts.status, "publish"));
      return postList
    }
  ),
  // getAllDrafts: protectedProcedure
  // .query(
  //   async () => {
  //     //Read from redis(cache)
  //     const postList = await db.select({
  //       id: posts.id,
  //       title: posts.title,
  //       slug: posts.slug,
  //       status: posts.status
  //     }).from(posts).where(eq(posts.status, "draft"));
  //     return postList
  //   }
  // ),
  getDrafts: protectedProcedure
  .query(
    async ({ctx}) => {
      const user = ctx.session.userId;
      const postList = await db.select({
        id: posts.id,
        title: posts.title,
        slug:posts.slug,
        status: posts.status
      }).from(posts).where(
        and(eq(posts.userId, user),eq(posts.status, "draft"))
      );
      return postList
    }
  ),
  getPosts: protectedProcedure
  .query(
    async ({ctx}) => {
      const user = ctx.session.userId;
      const postList = await db.select({
        id: posts.id,
        title: posts.title,
        slug:posts.slug,
        status: posts.status
      }).from(posts).where(
        and(eq(posts.userId, user),eq(posts.status, "publish"))
      );
      return postList
    }
  ),
  getPostBySlug: baseProcedure
  .input(z.object({
    slug: z.string().min(1)
  }))
  .query(
    async ({input}) => {
      const post = await redis.get(`post:${input.slug}`) as unknown as string | null;
      const tagsRedis = await redis.smembers(`post:${input.slug}:tags`) as string[] | null;
      // const tagArray = await redis.
      if(!post){
        const post = await db.select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          slug: posts.slug,
          category: categories.id
        })
        .from(posts)
        .leftJoin(categories,eq(posts.categoryId, categories.id))
        .where(
          // and(
            eq(posts.slug, input.slug),
          //   eq(posts.status, input.status)
          // )
        );
        const tagArray = await db
          .select({
            id: tags.id,
          })
          .from(postTags)
          .leftJoin(tags,eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, post[0].id));

        const updatedPost = {
          ...post[0],
          tags: tagArray.map((tag) => tag.id),
        }

        if(post.length === 0){
          return null;
        }
        return updatedPost
      }
      const parsedPost = JSON.parse(post) as unknown as PostRedisWithoutTags;
      const updatedPost = {
        id: parsedPost.id,
        title: parsedPost.title,
        content: parsedPost.content,
        category: parsedPost.category,
        tags: tagsRedis || [],
        slug: parsedPost.slug
      } as PostRedis;
      return updatedPost
    }
  ),
  generatePosts: protectedProcedure
  .input(
    z.object({
      prompt: z.string().min(1).max(1000),
      title:z.string().min(1).max(1000),
    })
  )
  .mutation(
    async ({input}) => {

      const response = await client.responses.create({
          model: "openai/gpt-oss-20b",
          input: `Write the blog post using proper HTML tags like <h1>, <p>, <ul>, <li> etc., and do not wrap it in backticks,the description of the post is this ${input.prompt} and the title is ${input.title}`,

      });
      return response.output_text
    }
  ),
  generateTitle: protectedProcedure
  .input(
    z.object({
      prompt: z.string().min(1).max(1000),
    })
  )
  .mutation(
    async ({input}) => {

      const response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: `Write 10 title of a blog post in js array format without any extra text only the array,${input.prompt}`,
      });
      console.log("Response from OpenAI: ", response.output_text);
      return response.output_text
    }
  ),
  savePost: protectedProcedure
  .input(
    z.object({
      userId: z.string(),
      title: z.string().min(1),
      content: z.string().min(1),
      status: z.enum(["draft", "publish"]).default("draft"),
      categoryId:z.string(),
      tags:z.array(z.string().min(1)),
      image_url:z.string().min(1)
    })
  )
  .mutation(
    async ({input}) => {
      //Saving to Postgres
      const savePost = await db.insert(posts).values({// Generate a unique ID
        userId: input.userId,
        title: input.title,
        content: input.content,
        categoryId: input.categoryId,
        slug: input.title.replace(/\s+/g, '-').toLowerCase().concat(`-${uuid()}`), 
        status: input.status,
        isPublished: input.status === "publish",
        banner_img: input.image_url,
      }).returning({ id: posts.id,slug: posts.slug});

      const category = await db.select({
        id: categories.id,
      })
      .from(categories)
      .where(eq(categories.id, input.categoryId));

      for(const tag of input.tags) {
        // Check if the tag already exists in the database
        const existingTag = await db.select().from(postTags).where(
            eq(postTags.tagId, tag)
        );
        // If the tag does not exist, insert it
        if (existingTag.length === 0) {
          await db.insert(postTags).values({
            postId: savePost[0].id,
            tagId: tag
          });
        }
      }

      const postRedisData = JSON.stringify({
        id:savePost[0].id,
        title:input.title,
        content:input.content,
        category:category[0].id,
        slug:savePost[0].slug,
        banner_img: input.image_url
      })
      console.log("Post data to be saved in Redis: ", postRedisData);
      if(input.status === "publish"){
        //Saving to Redis
        await redis.set(`post:${savePost[0].slug}`, postRedisData
          , { ex: 3600 });
        for(const tag of input.tags) {
          // Add each tag to the Redis set for the post
          await redis.sadd(`tags:${tag}`, `${savePost[0].id}`);
          await redis.sadd(`post:${savePost[0].slug}:tags`, tag);
        }
      }
      return savePost[0].id;
    }
  ),
  editPost: protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      slug:z.string(),
      title: z.string().min(1),
      content: z.string().min(1),
      categoryId:z.string(),
      tags:z.array(z.string().min(1)),
      image_url:z.string().min(1)
    })
  )
  .mutation(
    async ({input}) => {
      //Edit in Postgres
      const updatedPost = await db
      .update(posts)
      .set({
        content: input.content,
        title: input.title,
        categoryId: input.categoryId,
      })
      .where(eq(posts.id,input.postId))
      .returning({
        id: posts.id,
        title:posts.title,
        content:posts.content,
        slug:posts.slug 
      });
      const category = await db.select({
        id: categories.id,
      })
      .from(categories)
      .where(eq(categories.id, input.categoryId));
      // Update the tags for the post
      // First, delete all existing tags for the post
      await db.delete(postTags).where(eq(postTags.postId, input.postId));
      // Then, insert the new tags
      for(const tag of input.tags) {
        // Check if the tag already exists in the database

          await db.insert(postTags).values({
            postId: updatedPost[0].id,
            tagId: tag
          });
      } 
      const tagsRedis = input.tags;
      const updatedRedisPost = {
        id: updatedPost[0].id,
        title: updatedPost[0].title,
        content: updatedPost[0].content,
        category: category[0].id,
        tags: tagsRedis || [],
        slug: updatedPost[0].slug
      } as PostRedis;

      //Edit in Redis
      await redis.del(`post:${input.slug}`)
      await redis.set(`post:${updatedPost[0].slug}`,JSON.stringify(updatedRedisPost),{ex: 3600})
      return updatedRedisPost.slug;
    }
  ),
  deletePost: protectedProcedure
  .input(
    z.object({
      postId: z.string(),
    })
  )
  .mutation(
    async ({input}) => {
      //Deleting from postgres
      const deletePost = await db.delete(posts).where(
        eq(posts.id,input.postId)
      ).returning({ id: posts.id,slug:posts.slug });

      //Deleting the key from Redis
      await redis.del(`post:${deletePost[0].slug}`)
      return deletePost[0].id;
    }
  )
});
