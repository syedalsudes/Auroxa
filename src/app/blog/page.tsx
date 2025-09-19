"use client"

import { useEffect, useState } from "react"
import { Settings2 } from "lucide-react"
import BlogSlideBar from "@/components/BlogSlideBar"
import BlogButtons from "@/components/BlogButtons"
import CardProducts from "@/components/CardProducts"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useProducts } from "@/contexts"
import { useSearchParams } from "next/navigation"

export default function Blog() {
  const [showFilter, setShowFilter] = useState(false) // ✅ default false
  const [mounted, setMounted] = useState(false) // ✅ hydration fix

  const { filteredProducts, loading, error, setCategory } = useProducts()
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const searchQuery = searchParams.get("search")

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // ✅ client par mount hone ke baad hi init state set karo
  useEffect(() => {
    setMounted(true)

    const saved = localStorage.getItem("showFilter")
    if (saved !== null) {
      setShowFilter(saved === "true")
    } else {
      if (window.innerWidth >= 1280) {
        setShowFilter(true)
      }
    }

    const handleResize = () => {
      if (!localStorage.getItem("showFilter")) {
        setShowFilter(window.innerWidth >= 1280)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ✅ category sync
  useEffect(() => {
    if (category) {
      setCategory(category)
    } else {
      setCategory(null)
    }
  }, [category, setCategory])

  // ✅ preference save
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("showFilter", String(showFilter))
    }
  }, [showFilter, mounted])

  // ✅ hydration safe render
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading page..." />
      </div>
    )
  }

  const getPageTitle = () => {
    return `Products (${filteredProducts.length})`
  }

  const generateProductListSchema = () => {
    if (!filteredProducts.length) return null

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: getPageTitle(),
      description: `Browse ${filteredProducts.length} premium ${category || "fashion"} products at Auroxa`,
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.slice(0, 20).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          "@id": `${baseUrl}/blog/${product._id}`,
          name: product.title,
          description: product.description,
          image: product.images?.[0] || "/placeholder.svg",
          url: `${baseUrl}/blog/${product._id}`,
          brand: {
            "@type": "Brand",
            name: "Auroxa",
          },
          category: product.category,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Auroxa",
            },
          },
        },
      })),
    }
  }

  return (
    <>
      {mounted && filteredProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductListSchema()),
          }}
        />
      )}

      <div className="blog-container">
        <div className="flex justify-between items-center mt-4">
          <h3 className="text-2xl font-semibold ml-5">{getPageTitle()}</h3>
          <div className="flex gap-2 mt-2 mr-10">
            <div className="flex items-center">
              <h1 className="text-base font-medium">{showFilter ? "Hide Filters" : "Show Filters"}</h1>
              <Settings2 className="h-5 ml-1 mt-[3px] cursor-pointer" onClick={() => setShowFilter(!showFilter)} />
            </div>
          </div>
        </div>

        <div className="flex transition-all duration-300 ease-in-out relative">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 mt-8 ease-in-out 
            ${showFilter ? "w-64" : "w-0"} 
            overflow-hidden
            xl:z-auto
            fixed xl:static top-0 left-0 h-full z-50 xl:h-auto
            ${showFilter ? "xl:block" : "xl:hidden"}`}
          >
            <BlogSlideBar setShowFilter={setShowFilter} />
          </div>



          {/* Main Content */}
          <div className="flex-1 bg-background text-foreground">
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" text="Loading products..." />
              </div>
            ) : error ? (
              <div className="text-Orange text-center mt-10">Error: {error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  {searchQuery ? (
                    <>
                      <p className="text-gray500 text-lg">No products found for "{searchQuery}"</p>
                      <p className="text-gray400 text-sm mt-2">Try different keywords or browse all products</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray500 text-lg">No products available</p>
                      <p className="text-gray400 text-sm mt-2">Check back soon for new arrivals!</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <CardProducts products={filteredProducts} isFull={!showFilter} />
            )}
          </div>
        </div>

        <BlogButtons />
      </div>
    </>
  )
}
