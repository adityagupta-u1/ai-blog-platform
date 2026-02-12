import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts:{headers:Headers}) => {
  const session = await auth();

  return {
    session,
    ...opts
  };
}
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer:superjson,
  errorFormatter({shape,error}){
    return{
        ...shape,
        data:{
            ...shape.data,
            zodError:
                error.cause instanceof ZodError ? error.cause.flatten() : null,
        }
    }
  }
});

export const protectedProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (!ctx.session.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return next({
        ctx: {
          session:{
            ...ctx.session,
            userId: ctx.session.userId,
          }
        },
      })
  });

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;