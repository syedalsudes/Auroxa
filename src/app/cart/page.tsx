"use client"

import { useCartStore } from "@/lib/cartStore"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const { isSignedIn, isLoaded } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  const handleCheckout = () => {
    if (!isLoaded) return

    if (!isSignedIn) {
      openSignIn()
      return
    }

    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray400 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-gray500 mb-8">Add some products to get started!</p>
          <Link
            href="/blog"
            className="bg-deepBlack text-primaryWhite px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  const deliveryFee = getTotalPrice() >= 14000 ? 0 : 200
  const finalTotal = getTotalPrice() + deliveryFee

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1">
            <div className="bg-gray100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <h5 className="font-medium text-sm sm:text-base">Free Delivery</h5>
              <p className="text-xs sm:text-sm text-gray600">
                Applies to orders of $3,000 or more.{" "}
                <span className="underline font-semibold cursor-pointer">View details</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold">Bag ({items.length} items)</h1>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium self-start sm:self-auto"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col md:flex-row gap-4 p-3 border border-gray300 rounded-lg"
                >
                  {/* Image */}
                  <div className=" md:w-32 h-32 flex-shrink-0 mx-auto md:mx-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=128&width=128"}
                      alt={item.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <h3 className="font-bold text-base md:text-lg text-center md:text-left">{item.title}</h3>
                      <p className="font-semibold text-center md:text-right">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <p className="text-gray500 text-xs md:text-sm text-center md:text-left">
                      Price per item: ${item.price.toLocaleString()}
                    </p>

                    {/* Color and Size */}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center md:items-start">
                      {item.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-sm">Color:</span>
                          <span
                            className="w-4 h-4 rounded-full border border-gray300"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      )}

                      {item.size && <p className="text-xs md:text-sm">Size: {item.size}</p>}
                    </div>

                    {/* Quantity Controls and Remove */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="text-xs md:text-sm text-gray500">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray400 flex items-center justify-center hover:bg-gray100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 rounded-full border border-gray400 flex items-center justify-center hover:bg-gray100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-gray500">({item.stock} available)</span>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-red-500 hover:text-red-700 p-2 self-center md:self-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>

              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-background border border-gray300 rounded-lg p-4 sm:p-6 sticky top-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Summary</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Estimated Delivery & Handling</span>
                  <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee}`}</span>
                </div>
                <hr className="border-gray300" />
                <div className="flex justify-between font-semibold text-base sm:text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-deepBlack text-primaryWhite py-3 sm:py-4 rounded-full font-semibold hover:bg-dark transition-colors text-sm sm:text-base"
              >
                {!isLoaded ? "Loading..." : !isSignedIn ? "Login to Checkout" : "Proceed to Checkout"}
              </button>

              <div className="mt-4 text-center">
                <Link href="/blog" className="text-blue text-sm hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
