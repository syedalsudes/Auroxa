"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/cartStore"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Truck, MapPin, Phone, User, Mail } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ToastContainer"
import LoadingSpinner from "@/components/LoadingSpinner"
import { countries } from "@/lib/countries"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useUser()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    paymentMethod: "cod",
    specialInstructions: "",
  })

  useEffect(() => {
    if (items.length === 0 && !isRedirecting && !orderPlaced) {
      setIsRedirecting(true)
      router.push("/cart")
    }
  }, [items.length, router, isRedirecting, orderPlaced])

  const deliveryFee = getTotalPrice() >= 14000 ? 0 : 200
  const finalTotal = getTotalPrice() + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const requiredFields = [
      { field: "fullName", label: "Full Name" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "address", label: "Address" },
      { field: "city", label: "City" },
      { field: "state", label: "State" },
      { field: "zipCode", label: "ZIP Code" },
    ]

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        showError("Missing Information", `${label} is required`)
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showError("Invalid Email", "Please enter a valid email address")
      return false
    }

    if (formData.phone.length < 10) {
      showError("Invalid Phone", "Please enter a valid phone number")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (items.length === 0) {
      showError("Empty Cart", "Your cart is empty")
      return
    }

    if (!user) {
      showError("Authentication Required", "Please sign in to place an order")
      return
    }

    setLoading(true)
    setOrderPlaced(true)

    try {
      const orderData = {
        user: {
          id: user?.id,
          name: formData.fullName,
          email: formData.email,
        },
        items: items.map((item) => ({
          productId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          color: item.color || null,
          size: item.size || null,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions,
        subtotal: getTotalPrice(),
        deliveryFee: deliveryFee,
        total: finalTotal,
      }

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (result.success && result.orderId) {
        showSuccess("Order Placed!", `Order ${result.orderNumber || result.orderId} has been placed successfully`)

        clearCart()

        window.location.href = `/order-success/${result.orderId}`
      } else {
        showError("Order Failed", result.message || "Order placement failed. Please try again.")
        setOrderPlaced(false)
      }
    } catch (error: any) {
      showError("Network Error", error.message || "Something went wrong. Please try again.")
      setOrderPlaced(false)
    } finally {
      setLoading(false)
    }
  }

  if ((items.length === 0 && !orderPlaced) || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text={loading ? "Placing your order..." : "Redirecting to cart..."} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background border border-gray300 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6" />
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="+92 300 1234567"
                    className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    rows={3}
                    placeholder="House/Flat No, Street, Area, Landmark"
                    className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      placeholder="New York"
                      className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State/Province *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      placeholder="Georgia"
                      className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      placeholder="93330"
                      className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray300 rounded-lg cursor-pointer hover:bg-gray100">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="mr-3"
                      />
                      <span className="font-medium">Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray300 rounded-lg cursor-pointer hover:bg-gray100 opacity-50">
                      <input type="radio" name="paymentMethod" value="card" disabled className="mr-3" />
                      <span className="font-medium">Credit/Debit Card (Coming Soon)</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray300 rounded-lg cursor-pointer hover:bg-gray100 opacity-50">
                      <input type="radio" name="paymentMethod" value="bank" disabled className="mr-3" />
                      <span className="font-medium">Bank Transfer (Coming Soon)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions (Optional)</label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows={3}
                    placeholder="Any special delivery instructions..."
                    className="w-full p-3 border border-gray300 rounded-lg bg-background focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-deepBlack text-primaryWhite py-4 rounded-full font-semibold hover:bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" color="text-primaryWhite" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - $${finalTotal.toLocaleString()}`
                  )}
                </button>
              </form>
            </div>

            <div className="bg-background border border-gray300 rounded-lg p-6 h-fit sticky top-8">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <Image
                      src={item.image || "/placeholder.svg?height=60&width=60"}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray500">
                        {item.color && (
                          <span className="flex items-center gap-1">
                            <span
                              className="inline-block w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.color?.toLowerCase() }}
                            ></span>
                            {item.color}
                          </span>
                        )}
                        {item.size && <span> Size: {item.size}</span>}
                      </div>
                      <p className="text-gray500 text-xs">Qty: {item.quantity}</p>
                      <p className="font-semibold text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray300 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray300 pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm font-medium">🚚 Expected Delivery: 7-14 Business Days</p>
                  <p className="text-blue-600 text-xs">Free delivery on orders above $3,000</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">💰 Cash on Delivery Available</p>
                  <p className="text-green-600 text-xs">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
