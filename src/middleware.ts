// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"



const getAdminIds = () => {
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS
  return adminIds ? adminIds.split(",").map((id) => id.trim()) : []
}

const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId } = await auth()
    const adminIds = getAdminIds()

    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.rewrite(new URL("/__found-page-404", req.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}