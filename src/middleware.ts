import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/write(.*)","/admin(.*)"])

export default clerkMiddleware(async (auth,req) => {
  const { userId, redirectToSignIn } = await auth();
  const res = NextResponse.next()
  const anonId = req.cookies.get('anonId')
      
    // It is trying to check if the user is logged in and if the route matches the protected route
    // If the user is not logged in and the route is protected, redirect to sign in
    // If the user is logged in and the route is protected, do nothing
    if(!userId && isProtectedRoute(req)){
      return redirectToSignIn()
    } else if(!userId && !anonId){
      const randomId = crypto.randomUUID();
      res.cookies.set('anonId',randomId,{
        httpOnly: true,
        secure:true,
        path:'/',
        maxAge:60*60*24*30
      });
    } 

    return res;
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ],
}