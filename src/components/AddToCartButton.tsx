"use client"

import { ShoppingCart, Check } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/lib/cartStore"
import { motion } from "framer-motion"
import { useUser, useClerk } from "@clerk/nextjs"

interface AddToCartButtonProps {
  product: {
    _id: string
    title: string
    price: number
    image: string
    stock: number
    color?: string | null  
    size?: string | null
  }
  className?: string
  disabled?: boolean
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { isSignedIn, isLoaded } = useUser()
  const { openSignIn } = useClerk()

  const handleAddToCart = () => {
    if (!isLoaded) return

    if (!isSignedIn) {
      openSignIn()
      return
    }

    if (product.stock <= 0) return

    // ✅ Add color and size to cart
    addItem({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
      color: product.color || null,
      size: product.size || null,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddToCart}
      disabled={product.stock <= 0 || isAdded}
      className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${product.stock <= 0
          ? "bg-gray400 text-gray600 cursor-not-allowed"
          : isAdded
            ? "bg-Orange text-primaryWhite"
            : "bg-deepBlack text-primaryWhite hover:bg-dark"
        } ${className}`}
    >
      {!isLoaded ? (
        <>
          <div className="w-5 h-5 border-2 border-primaryWhite border-t-transparent rounded-full animate-spin" />
          Checking...
        </>
      ) : !isSignedIn ? (
        <>
          <ShoppingCart className="w-5 h-5" />
          Login to Add
        </>
      ) : isAdded ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </motion.button>
  )
}
