"use client"
import Link from "next/link"
import Image from "next/image"
import AddToCartButton from "./AddToCartButton"
import { motion, Variants } from "framer-motion"
import { Tag } from "lucide-react"
import { useState } from "react"
import { Product } from "@/types/product"


export default function CardProducts({ products, isFull }: { products: Product[], isFull?: boolean }) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <p className="text-gray500 text-lg">No products available</p>
          <p className="text-gray400 text-sm mt-2">Check back soon for new arrivals!</p>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const getDiscountPercentage = (price: number, discountPrice?: number) => {
    if (!discountPrice || discountPrice >= price) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  const getFinalPrice = (price: number, discountPrice?: number) => {
    return discountPrice && discountPrice < price ? discountPrice : price
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6"
    >
      {products.map((product, index) => {
        const finalPrice = getFinalPrice(product.price || 0, product.discountPrice ?? 0)
        const discountPercentage = getDiscountPercentage(product.price || 0, product.discountPrice ?? 0)

        return (
          <motion.div
            key={product._id || index}
            variants={itemVariants}
            className="group relative"
            onMouseEnter={() => setHoveredProduct(product._id || "")}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="glass-card hover-lift overflow-hidden h-full flex flex-col">
              {/* 🔥 PRODUCT IMAGE */}
              <div className="relative overflow-hidden rounded-xl mb-4">
                <Link href={`/blog/${product._id}`}>
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.title || "Product"}
                    width={300}
                    height={300}
                    className={`w-full object-cover transition-all duration-500 group-hover:scale-110
                    ${isFull ? "h-80" : "h-64"}`}
                  />
                </Link>

                {/* 🔥 BADGES */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">

                  {product.stock !== undefined && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10
                        ? "bg-green-500 text-white"
                        : product.stock > 0
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                        }`}
                    >
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                  )}
                </div>

                {/* 🔥 DISCOUNT BADGE */}
                {discountPercentage > 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{discountPercentage}%
                    </span>
                  </div>
                )}

              </div>

              {/* 🔥 PRODUCT INFO */}
              <div className="flex-1 flex flex-col">
                <Link href={`/blog/${product._id}`}>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-Orange font-medium uppercase tracking-wide">
                        {product.category?.replace("-", " ") || "Fashion"}
                      </span>

                      <span className="text-sm text-gray-500 ml-1">⭐({product.rating?.toFixed(1) || "0.0"})</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-Orange transition-colors line-clamp-2">
                      {product.title || "Premium Product"}
                    </h3>
                    {product.brand && <p className="text-sm text-gray500 font-medium">{product.brand}</p>}
                    {product.targetAudience && (
                      <span className="text-base text-Orange capitalize">{product.targetAudience}</span>
                    )}
                  </div>
                </Link>

                <p className="text-sm text-gray500 mb-3 line-clamp-2 flex-1">
                  {product.description || "High-quality product with premium materials and exceptional craftsmanship."}
                </p>

                {/* 🔥 COLORS & SIZES */}
                {(product.colors?.length || product.sizes?.length) && (
                  <div className="mb-3 space-y-2">
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray500">Colors:</span>
                        <div className="flex gap-1">
                          {product.colors.slice(0, 4).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 rounded-full border border-gray300"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <span className="text-xs text-gray500">+{product.colors.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray500">Sizes:</span>
                        <span className="text-xs text-foreground">
                          {product.sizes.slice(0, 3).join(", ")}
                          {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
                        </span>
                      </div>
                    )}
                  </div>
                )}




                {/* 🔥 TAGS */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Tag className="w-3 h-3 text-gray400" />
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray200 text-gray600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🔥 PRICE */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">${finalPrice}</span>
                    {discountPercentage > 0 && (
                      <span className="text-lg text-gray500 line-through">${product.price}</span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* 🔥 ADD TO CART */}
                <AddToCartButton
                  product={{
                    _id: product._id || "",
                    title: product.title || "",
                    price: finalPrice,
                    image: product.images?.[0] || "",
                    stock: product.stock || 0,
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
