import { postRouter } from "../../server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "../../server/api/trpc";
import { categoriesRouter } from "./routers/categories";
import { editorRouter } from "./routers/editor";
import { filterRouter } from "./routers/filter";
import { tagsRouter } from "./routers/tag";
import { userRouter } from "./routers/user";
import { viewsRouter } from "./routers/views";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  editor: editorRouter,
  filter: filterRouter,
  tags: tagsRouter,
  categories: categoriesRouter,
  users: userRouter,
  views: viewsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
