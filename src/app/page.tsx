import React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"

export function generateMetadata(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return {
    title: "Home - Premium Fashion & Lifestyle Products",
    description:
      "Shop premium fashion, accessories, and lifestyle products at Auroxa. Discover the latest trends with fast shipping and quality guarantee. Free returns on all orders.",
    openGraph: {
      title: "Auroxa - Premium Fashion & Lifestyle Store",
      description:
        "Shop premium fashion and lifestyle products with fast shipping and quality guarantee.",
      url: baseUrl,
      images: [
        {
          url: `${baseUrl}/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: "Auroxa Homepage - Premium Fashion Store",
        },
      ],
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

const HeroSection = React.lazy(() => import("@/components/HeroSection"))
const FeaturedProducts = React.lazy(() => import("@/components/FeaturedProducts"))
const CategoryShowcase = React.lazy(() => import("@/components/CategoryShowcase"))
const TestimonialsSection = React.lazy(() => import("@/components/TestimonialsSection"))

const SectionSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} loading-shimmer rounded-lg mb-8`} />
)

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Auroxa",
            url: baseUrl,
            description: "Premium fashion and lifestyle e-commerce store",
            potentialAction: {
              "@type": "SearchAction",
              target: `${baseUrl}/blog?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <div className="home-container">
        <div className="mt-20">
          <Suspense fallback={<SectionSkeleton height="h-screen" />}>
            <HeroSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="h-[800px]" />}>
            <FeaturedProducts />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
            <CategoryShowcase />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
            <TestimonialsSection />
          </Suspense>
        </div>
      </div>
    </>
  )
}
