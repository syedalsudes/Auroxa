"use client"

import React from "react"
import { notFound } from "next/navigation"
import Gallery from "@/components/Gallery"
import AddToCartButton from "@/components/AddToCartButton"
import { Star, Tag, Package } from "lucide-react"
import ProductReviews from "@/components/ProductReviews"
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/LoadingSpinner"
import type { Product } from "@/types/product"

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/product/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    return null
  }
}


export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params) // ✅ unwrap params

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"


  useEffect(() => {
    const fetchProduct = async () => {
      const p = await getProduct(id)
      if (!p) return notFound()
      setProduct(p)
    }
    fetchProduct()
  }, [id])

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading page..." />
      </div>
    )
  }

  const finalPrice =
    product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price

  const generateProductSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${siteUrl}/blog/${product._id}`,
      name: product.title,
      description: product.description,
      image: product.images?.map((img) => `${siteUrl}${img}`) || [],
      url: `${siteUrl}/blog/${product._id}`,
      brand: {
        "@type": "Brand",
        name: "Auroxa",
      },
      category: product.category,
      sku: product._id,
      gtin: product._id,
      offers: {
        "@type": "Offer",
        price: finalPrice,
        priceCurrency: "USD",
        availability:
          product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Auroxa",
        },
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        itemCondition: "https://schema.org/NewCondition",
      },
      aggregateRating:
        product.rating && product.reviewCount
          ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
          : undefined,
      review:
        product.reviewCount && product.reviewCount > 0
          ? {
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: product.rating || 5,
              bestRating: 5,
            },
            author: {
              "@type": "Person",
              name: "Verified Customer",
            },
          }
          : undefined,
    }
  }

  const generateBreadcrumbSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${siteUrl}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.category,
          item: `${siteUrl}/blog?category=${product.category}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: product.title,
          item: `${siteUrl}/blog/${product._id}`,
        },
      ],
    }
  }


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema()),
        }}
      />

      <div className="min-h-screen bg-background mt-5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Gallery sticky only on desktop */}
            <div className="lg:w-1/2 lg:sticky lg:top-8 h-fit">
              <Gallery
                images={(product.images ?? []).filter((img): img is string => Boolean(img))}
                title={product.title ?? ""}
              />
            </div>


            {/* Product Info */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground leading-tight">{product.title}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-foreground">{product.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-sm text-muted-foreground">
                    {product.reviewCount && product.reviewCount > 0 ? `${product.reviewCount} reviews` : "No reviews"}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 py-2">
                  <div className="text-4xl font-bold text-orange-500">${finalPrice}</div>
                  {product.discountPrice && product.discountPrice < product.price && (
                    <>
                      <div className="text-xl text-muted-foreground line-through">${product.price}</div>
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </div>
                    </>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Availability:</span>
                  <span
                    className={`font-medium ${product.stock && product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stock && product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Product Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length ? (
                <div>
                  <h4 className="font-semibold mb-2">Choose Color</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors!.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "ring-2 ring-orange-500" : ""
                          }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Sizes */}
              {product.sizes?.length ? (
                <div>
                  <h4 className="font-semibold mb-2">Choose Size</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes!.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${selectedSize === size ? "bg-orange-500 text-white border-orange-500" : "hover:bg-muted/50"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Tags */}
              {product.tags?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-semibold">Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Add To Cart */}
              <AddToCartButton
                product={{
                  _id: product._id || "",
                  title: product.title || "",
                  price: finalPrice,
                  image: product.images?.[0] || "",
                  stock: product.stock || 0,
                  color: selectedColor,
                  size: selectedSize,
                }}
                disabled={!selectedColor || !selectedSize}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-3xl font-bold text-center mt-16 mb-8 bg-gradient-to-r text-Orange bg-clip-text">
            Customer Reviews
          </h2>
          <ProductReviews
            productId={product._id ?? ""}
            productName={product.title ?? ""}
            currentRating={product.rating ?? 0}
            reviewCount={product.reviewCount ?? 0}
          />
        </div>
      </div>
    </>
  )
}
