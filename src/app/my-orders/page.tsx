"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Package, Eye, Calendar, MapPin, CreditCard, Truck } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useToast } from "@/components/ToastContainer"

interface Order {
  _id: string
  orderNumber: string
  items: Array<{
    title: string
    quantity: number
    price: number
    image: string
    color?: string | null
    size?: string | null
  }>
  shippingAddress: {
    fullName: string
    city: string
    state: string
    country: string
  }
  paymentMethod: string
  total: number
  status: string
  createdAt: string
  shippingDetails?: {
    trackingId: string
    courierName: string
    trackingUrl?: string
  }
}

export default function MyOrdersPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { showError } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
      return
    }

    if (user) {
      fetchMyOrders()
    }
  }, [user, isLoaded, router])

  const fetchMyOrders = async () => {
    try {
      const res = await fetch("/api/my-orders")
      const data = await res.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        showError("Failed to Load", "Could not fetch your orders")
      }
    } catch (error) {
      showError("Network Error", "Error fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your orders..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-gray600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray800 mb-2">No Orders Yet</h2>
            <p className="text-gray600 mb-6">You haven't placed any orders yet. Start shopping!</p>
            <Link
              href="/blog"
              className="bg-deepBlack text-primaryWhite px-6 py-3 rounded-full font-semibold hover:bg-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-background border border-gray300 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-lg font-semibold text-foreground">Order #{order.orderNumber}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {order.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <Link
                      href={`/order-success/${order._id}`}
                      className="flex items-center gap-2 bg-blue-500 text-foreground px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h4 className="font-medium mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.image || "/placeholder.svg?height=50&width=50"}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-gray600">Qty: {item.quantity}</p>

                            {/* ✅ Show Color and Size */}
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray600">
                              {item.color && (
                                <div className="flex items-center gap-1">
                                  <span>Color:</span>
                                  <span
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: item.color }}
                                  />
                                </div>
                              )}
                              {item.size && (
                                <div className="flex items-center gap-1">
                                  <span>Size:</span>
                                  <span className="font-medium">{item.size}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="font-semibold text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray600">+{order.items.length - 3} more items</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery & Total */}
                  <div>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Delivery Address
                      </h4>
                      <div className="text-sm text-gray600">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    {order.shippingDetails?.trackingId && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Shipping Details
                        </h4>
                        <div className="text-sm text-gray600 bg-orange-50 p-3 rounded-lg">
                          <p>
                            <strong>Tracking ID:</strong> {order.shippingDetails.trackingId}
                          </p>
                          <p>
                            <strong>Courier:</strong> {order.shippingDetails.courierName}
                          </p>
                          {order.shippingDetails.trackingUrl && (
                            <a
                              href={order.shippingDetails.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600"
                            >
                              🔍 Track Package
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-lg text-Orange">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
