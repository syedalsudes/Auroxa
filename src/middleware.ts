// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const getAdminIds = () => {
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS
  return adminIds ? adminIds.split(",").map((id) => id.trim()) : []
}

// ✅ Matchers ko exact rakhein
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/contact(.*)"]) // Contact API ko bhi yahan add kiya

export default clerkMiddleware(async (auth, req) => {
  // 1. Pehle check karein ke kya ye admin route hai? 
  // Agar nahi hai, to auth() chalane ki zaroorat hi nahi!
  if (isAdminRoute(req)) {
    const { userId } = await auth() // ⚡ Ab auth() sirf admin routes par chalega
    const adminIds = getAdminIds()

    if (!userId || !adminIds.includes(userId)) {
      // Admin nahi hai to 404 rewrite
      return NextResponse.rewrite(new URL("/__found-page-404", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // ✅ Is matcher ko thora tight rakhein taake images/static files par middleware na chale
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}