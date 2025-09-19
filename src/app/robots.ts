// app/robots.ts
import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/about", "/contact-us", "/services", "/help", "/policies"],
      disallow: [
        "/admin/",
        "/cart",
        "/checkout",
        "/my-orders",
        "/order-success/",
        "/api/",
        "/_next/",
        "/private/",
      ],
      crawlDelay: 1,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
