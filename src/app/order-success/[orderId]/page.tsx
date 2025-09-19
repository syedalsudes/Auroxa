import { CheckCircle, Package, Truck, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getOrder(orderId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/order/${orderId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.success ? data.order : null
  } catch (error) {
    return null
  }
}

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function OrderSuccessPage({ params }: PageProps) {
  let resolvedParams
  try {
    resolvedParams = await params
  } catch (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Order</h1>
          <p className="text-gray600 mb-4">Unable to load order parameters</p>
          <Link href="/blog" className="bg-deepBlack text-primaryWhite px-6 py-3 rounded-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const orderId = resolvedParams.orderId

  if (
    !orderId ||
    typeof orderId !== "string" ||
    orderId === "undefined" ||
    orderId === "null" ||
    orderId.trim() === ""
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Order ID</h1>
          <p className="text-gray600 mb-4">The order ID provided is not valid</p>
          <p className="text-sm text-gray500 mb-4">Please check your order confirmation email</p>
          <div className="flex gap-4 justify-center">
            <Link href="/blog" className="bg-deepBlack text-primaryWhite px-6 py-3 rounded-full">
              Continue Shopping
            </Link>
            <Link href="/my-orders" className="border border-gray400 text-foreground px-6 py-3 rounded-full">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const order = await getOrder(orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p className="text-gray600 mb-4">We couldn't find an order with ID: {orderId}</p>
          <p className="text-sm text-gray500 mt-2">Please check your order confirmation email</p>
          <div className="flex gap-4 justify-center">
            <Link href="/blog" className="bg-deepBlack text-primaryWhite px-6 py-3 rounded-full">
              Continue Shopping
            </Link>
            <Link href="/my-orders" className="border border-gray400 text-foreground px-6 py-3 rounded-full">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/my-orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Orders
          </Link>
        </div>

        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">🎉 Order Placed Successfully!</h1>
          <p className="text-gray600 text-lg">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="text-sm text-gray500 mt-2">Order ID: {orderId}</p>
        </div>

        <div className="bg-background border border-gray300 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Order Number:</strong> {order.orderNumber}
                </p>
                <p>
                  <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <strong>Status:</strong> <span className="text-Orange font-medium capitalize">{order.status}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h3>
              <div className="text-sm text-gray600">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background border border-gray300 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray200 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray600">Quantity: {item.quantity}</p>

                  {/* ✅ Color show as swatch + name */}
                  {item.color && (
                    <p className="text-sm flex items-center gap-2">
                      Color:
                      <span
                        className="w-4 h-4 rounded-full border border-gray300"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="capitalize">{item.color || "N/A"}</span>
                    </p>
                  )}

                  {/* ✅ Size show */}
                  {item.size && <p className="text-sm text-gray600">Size: {item.size || "N/A"}</p>}
                </div>

                <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray300 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? "Free" : `$${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-blue-800 font-medium">Expected Delivery: 7-14 Business Days</p>
            <p className="text-blue-600 text-sm">You will receive tracking information via email</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-deepBlack text-primaryWhite px-6 py-3 rounded-full font-semibold hover:bg-dark transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/my-orders"
              className="border border-gray400 text-foreground px-6 py-3 rounded-full font-semibold hover:bg-gray100 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
