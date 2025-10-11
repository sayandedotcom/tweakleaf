// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher(["/tweak(.*)"]);
// const isPublicRoute = createRouteMatcher(["/"]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   if (userId && req.nextUrl.pathname === "/") {
//     const userUrl = new URL("/tweak", req.url);
//     return NextResponse.redirect(userUrl);
//   }

//   if (isProtectedRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

export default function middleware() {}
