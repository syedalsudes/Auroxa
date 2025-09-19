import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// ✅ Admin IDs from .env.local
const getAdminIds = () => {
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS
  return adminIds ? adminIds.split(",").map((id) => id.trim()) : []
}

// ✅ Matchers
const isAdminRoute = createRouteMatcher(["/admin(.*)"])            // protect /admin pages
const isAdminApiRoute = createRouteMatcher(["/api/admin(.*)"])     // protect /api/admin/*
                                                                    
export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth()
    const adminIds = getAdminIds()

    // 🛡 Helper: safe redirect to 404
    const goNotFound = () =>
      NextResponse.rewrite(new URL("/__found-page-404", req.url))

    // 🛡 Protect Admin routes (pages)
    if (isAdminRoute(req)) {
      if (!userId || !adminIds.includes(userId)) {
        return goNotFound()
      }
    }

    // 🛡 Protect Admin APIs
    if (isAdminApiRoute(req)) {
      if (!userId || !adminIds.includes(userId)) {
        return goNotFound()
      }
    }

    // ✅ Normal APIs (/api/orders, /api/products, etc.) remain open for logged-in users
    return NextResponse.next()
  } catch (error) {
    console.error("❌ Middleware error:", error)
    return NextResponse.rewrite(new URL("/__found-page-404", req.url))
  }
})

export const config = {
  matcher: [
    // ✅ Protect all routes except _next/static, images, etc.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)", // ✅ APIs included
  ],
}
