"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AddToCartButton from "./AddToCartButton"
import LoadingSpinner from "./LoadingSpinner"

export default function FeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
    const [loading, setLoading] = useState(true) // ✅ loading state

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch("/api/product?featured=true")
                const data = await res.json()
                setFeaturedProducts(data.slice(0, 4)) // ✅ Max 4 hi show hon
            } catch (error) {
                console.error("Failed to fetch featured products:", error)
            } finally {
                setLoading(false) // ✅ hamesha end me false
            }
        }
        fetchFeatured()
    }, [])

    // ✅ jab tak load ho raha hai
    if (loading) {
        return (
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-64">
                    <LoadingSpinner size="lg" text="Loading featured products..." />
                </div>
            </section>
        )
    }

    // ✅ agar data hi nahi aaya
    if (featuredProducts.length === 0) {
        return null
    }

    // ✅ Helpers
    const getFinalPrice = (price: number, discountPrice?: number) =>
        discountPrice && discountPrice < price ? discountPrice : price

    const getDiscountPercentage = (price: number, discountPrice?: number) =>
        discountPrice && discountPrice < price
            ? Math.round(((price - discountPrice) / price) * 100)
            : 0

    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 glass-button text-Orange mb-4">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">Featured Collection</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Trending This Week
                    </h2>
                    <p className="text-lg text-gray500 max-w-2xl mx-auto">
                        Step into style with our trending premium picks, designed to elevate your look.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className={`grid gap-8 justify-center
                        grid-cols-1 sm:grid-cols-2
                        ${featuredProducts.length < 4 ? "lg:grid-cols-" + featuredProducts.length : "lg:grid-cols-4"}
                        `}
                >
                    {featuredProducts.map((product) => {
                        const finalPrice = getFinalPrice(product.price || 0, product.discountPrice ?? 0)
                        const discountPercentage = getDiscountPercentage(product.price || 0, product.discountPrice ?? 0)

                        return (
                            <motion.div
                                key={product._id}
                                className="group relative"
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                <div className="glass-card hover-lift overflow-hidden">
                                    {/* 🔥 Image */}
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl mb-4">
                                        <Link href={`/blog/${product._id}`} className="block w-full h-full">
                                            <Image
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority
                                            />
                                        </Link>

                                        {/* 🔥 Badge */}
                                        {product.badge && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-Orange text-white">
                                                    {product.badge}
                                                </span>
                                            </div>
                                        )}

                                        {/* 🔥 Discount */}
                                        {discountPercentage > 0 && (
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    -{discountPercentage}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 🔥 Info */}
                                    <div className="space-y-3">
                                        {/* Category + Rating */}
                                        <div className="flex items-center justify-between">
                                            {product.category && (
                                                <span className="text-sm text-Orange font-medium">
                                                    {product.category}
                                                </span>
                                            )}
                                            <span className="text-sm text-gray-300 font-medium">
                                                ⭐ ({product.rating?.toFixed(1) ?? "0.0"})
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-bold text-lg text-foreground group-hover:text-Orange transition-colors">
                                            {product.title}
                                        </h3>

                                        {/* Description ek line truncate */}
                                        {product.description && (
                                            <p className="text-sm text-gray500 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* 🔥 Colors */}
                                        {product.colors && product.colors.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                {product.colors.slice(0, 4).map((color: string, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="w-6 h-6 rounded-full border-2 border-gray300 cursor-pointer hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}

                                                {product.colors.length > 4 && (
                                                    <span className="text-xs text-gray500">
                                                        +{product.colors.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}


                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-foreground">
                                                ${finalPrice}
                                            </span>
                                            {discountPercentage > 0 && (
                                                <span className="text-lg text-gray500 line-through">
                                                    ${product.price}
                                                </span>
                                            )}
                                        </div>

                                        {/* Add to Cart */}
                                        <AddToCartButton
                                            product={{
                                                _id: product._id || "",
                                                title: product.title || "",
                                                price: finalPrice,
                                                image: product.image || "",
                                                stock: product.stock || 0,
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* View All */}
                <div className="text-center mt-12">
                    <Link href="/blog">
                        <button className="group glass-button text-foreground hover:bg-Orange hover:text-white text-lg px-8 py-4 flex items-center gap-2 mx-auto">
                            View All Products
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
