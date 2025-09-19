"use client"

import { useState } from "react"
import { Eye, Copy, Package, User, MapPin, Mail, X } from "lucide-react"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/contexts"
import { useOrders } from "@/contexts"

export default function OrdersPage() {
  const { user, isLoaded, isAdmin, redirectIfNotAdmin } = useAuth()

  const {
    orders, // 🔥 SIMPLIFIED: Only active orders
    loading,
    updatingStatus,
    sendingEmail,
    updateOrderStatus,
    sendStatusEmail,
    copyOrderInfo,
    getStatusColor,
    getStatusIcon,
    getOrderCounts,
    shipOrder,
  } = useOrders()

  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<any>(null)
  const [shippingForm, setShippingForm] = useState({
    trackingId: "",
    courierCompany: "",
    courierName: "",
    trackingUrl: "",
  })

  const courierOptions = [
    { value: "tcs", name: "TCS Express", baseUrl: "https://www.tcs.com.pk/tracking?trackingNumber=" },
    { value: "leopards", name: "Leopards Courier", baseUrl: "https://leopardscourier.com/track/" },
    { value: "dhl", name: "DHL Express", baseUrl: "https://www.dhl.com/pk-en/home/tracking.html?tracking-id=" },
    { value: "fedex", name: "FedEx", baseUrl: "https://www.fedex.com/fedextrack/?trknbr=" },
    { value: "mnp", name: "M&P Express", baseUrl: "https://www.mpexpress.com/tracking?id=" },
    { value: "callcourier", name: "Call Courier", baseUrl: "https://callcourier.com.pk/tracking/" },
    { value: "other", name: "Other Courier", baseUrl: "" },
  ]

  redirectIfNotAdmin()

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleShipOrder = (order: any) => {
    setSelectedOrderForShipping(order)
    setShippingForm({
      trackingId: "",
      courierCompany: "",
      courierName: "",
      trackingUrl: "",
    })
    setShowShippingModal(true)
  }

  const submitShippingDetails = async () => {
    if (!selectedOrderForShipping || !shippingForm.trackingId || !shippingForm.courierCompany) {
      return
    }

    await shipOrder(selectedOrderForShipping._id, shippingForm)
    setShowShippingModal(false)
  }

  const handleCourierChange = (courierValue: string) => {
    const courier = courierOptions.find((c) => c.value === courierValue)
    setShippingForm({
      ...shippingForm,
      courierCompany: courierValue,
      courierName: courier?.name || "",
      trackingUrl: courier?.baseUrl ? courier.baseUrl + shippingForm.trackingId : "",
    })
  }

  // 🔥 PROPER LOADING CHECK
  if (!isLoaded || !user || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    )
  }

  // 🔥 SHOW LOADING WHILE FETCHING ORDERS
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    )
  }

  const { total, pending } = getOrderCounts()


  return (
    <div className="space-y-6">
      {/* 🔥 DYNAMIC COLORS - Using CSS variables */}
      <div className="bg-background p-6 rounded-lg shadow border border-gray300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">📦 Order Management</h1>
          <div className="flex gap-4 items-center">
            {/* 🔥 SIMPLIFIED COUNTERS - No hidden orders */}
            <span className="bg-blue text-primaryWhite px-3 py-1 rounded-full text-sm font-medium">
              {total} Active Orders
            </span>
            <span className="bg-Orange text-primaryWhite px-3 py-1 rounded-full text-sm font-medium">
              {pending} Pending
            </span>
          </div>
        </div>

        {/* 🔥 PROPER NO ORDERS STATE - Only after loading */}
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray400" />
            <p className="text-lg">No active orders found</p>
            <p className="text-sm text-gray400 mt-2">Delivered orders are automatically removed after 1 week</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray300 bg-lightGray">
                    <th className="text-left p-4 font-semibold text-foreground">Order Details</th>
                    <th className="text-left p-4 font-semibold text-foreground">Customer</th>
                    <th className="text-left p-4 font-semibold text-foreground">Items & Total</th>
                    <th className="text-left p-4 font-semibold text-foreground">Status</th>
                    <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray300 hover:bg-lightGray">
                      <td className="p-4">
                        <div>
                          <p className="font-mono text-sm font-bold text-foreground">{order.orderNumber}</p>
                          <p className="text-xs text-gray500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray400">{order.paymentMethod.toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{order.user.name}</p>
                          <p className="text-sm text-gray500">{order.user.email}</p>
                          <p className="text-xs text-gray400">{order.shippingAddress.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="space-y-1">
                            <span className="bg-gray300 text-foreground px-2 py-1 rounded text-sm">
                              {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </span>

                            {/* Show first item with color/size as preview */}
                            {order.items.length > 0 && (
                              <div className="text-xs text-gray500">
                                <p className="truncate max-w-32" title={order.items[0].title}>
                                  {order.items[0].title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {order.items[0].color && (
                                    <div className="flex items-center gap-1">
                                      <span
                                        className="w-3 h-3 rounded-full border border-gray400"
                                        style={{ backgroundColor: order.items[0].color }}
                                      />
                                      <span className="text-xs">{order.items[0].color}</span>
                                    </div>
                                  )}
                                  {order.items[0].size && (
                                    <span className="text-xs bg-gray200 px-1 rounded">{order.items[0].size}</span>
                                  )}
                                </div>
                                {order.items.length > 1 && (
                                  <p className="text-xs text-gray400 mt-1">+{order.items.length - 1} more</p>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-Orange mt-1">${order.total.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>

                          <div className="flex flex-col gap-1 relative z-10">
                            {order.status === "pending" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "confirmed")}
                                disabled={updatingStatus === order._id}
                                className="bg-blue hover:bg-blue text-primaryWhite px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 relative z-20"
                              >
                                {updatingStatus === order._id ? "..." : "✅ Confirm"}
                              </button>
                            )}

                            {order.status === "confirmed" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "processing")}
                                disabled={updatingStatus === order._id}
                                className="bg-purple-500 hover:bg-purple-600 text-primaryWhite px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 relative z-20"
                              >
                                {updatingStatus === order._id ? "..." : "⚙️ Process"}
                              </button>
                            )}

                            {order.status === "processing" && (
                              <button
                                onClick={() => handleShipOrder(order)}
                                disabled={updatingStatus === order._id}
                                className="bg-Orange hover:bg-Orange text-primaryWhite px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 relative z-20"
                              >
                                {updatingStatus === order._id ? "..." : "🚚 Ship"}
                              </button>
                            )}

                            {order.status === "shipped" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "delivered")}
                                disabled={updatingStatus === order._id}
                                className="bg-green-500 hover:bg-green-600 text-primaryWhite px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 relative z-20"
                              >
                                {updatingStatus === order._id ? "..." : "📦 Deliver"}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2 relative z-10">
                          <button
                            onClick={() => copyOrderInfo(order)}
                            className="bg-green-500 hover:bg-green-600 text-primaryWhite p-2 rounded transition-colors flex items-center gap-1 relative z-20"
                            title="Copy Order Info for Dealer"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="text-xs">Copy Info</span>
                          </button>

                          <button
                            onClick={() => handleViewOrder(order)}
                            className="bg-blue hover:bg-blue text-primaryWhite p-2 rounded transition-colors flex items-center gap-1 relative z-20"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-xs">View</span>
                          </button>

                          {["confirmed", "processing", "shipped", "delivered"].includes(order.status) && (
                            <button
                              onClick={() => sendStatusEmail(order._id, order.status)}
                              disabled={sendingEmail === order._id}
                              className="bg-indigo-500 hover:bg-indigo-600 text-primaryWhite p-2 rounded transition-colors flex items-center gap-1 disabled:opacity-50 relative z-20"
                              title="Send Status Email"
                            >
                              <Mail className="w-4 h-4" />
                              <span className="text-xs">{sendingEmail === order._id ? "..." : "Email"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 MODAL WITH DYNAMIC COLORS */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray300">
            <div className="p-6 border-b border-gray300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">📋 Order Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray500 hover:text-foreground text-2xl">
                  <X />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Package className="w-5 h-5" />
                    Order Information
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <strong>Order Number:</strong> {selectedOrder.orderNumber}
                    </p>
                    <p className="text-foreground">
                      <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-foreground">
                      <strong>Status:</strong>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p className="text-foreground">
                      <strong>Payment:</strong> {selectedOrder.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <User className="w-5 h-5" />
                    Customer Information
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <strong>Name:</strong> {selectedOrder.shippingAddress.fullName}
                    </p>
                    <p className="text-foreground">
                      <strong>Email:</strong> {selectedOrder.user.email}
                    </p>
                    <p className="text-foreground">
                      <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </div>
                <div className="bg-lightGray p-4 rounded-lg text-sm">
                  <p className="font-medium text-foreground">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-foreground">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-foreground">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-foreground">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-lightGray rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-gray500">Quantity: {item.quantity}</p>

                        <div className="flex items-center gap-3 mt-2">
                          {item.color && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray600">Color:</span>
                              <div className="flex items-center gap-1">
                                <span
                                  className="w-4 h-4 rounded-full border border-gray300"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm capitalize">{item.color}</span>
                              </div>
                            </div>
                          )}

                          {item.size && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray600">Size:</span>
                              <span className="text-sm bg-gray200 px-2 py-1 rounded font-medium">{item.size}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Special Instructions</h3>
                  <p className="bg-yellow-50 p-3 rounded-lg text-sm text-foreground">
                    {selectedOrder.specialInstructions}
                  </p>
                </div>
              )}

              <div className="border-t border-gray300 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-foreground">Total Amount:</span>
                  <span className="text-Orange">${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => copyOrderInfo(selectedOrder)}
                  className="bg-green-500 hover:bg-green-600 text-primaryWhite px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy for Dealer
                </button>

                {["confirmed", "processing", "shipped", "delivered"].includes(selectedOrder.status) && (
                  <button
                    onClick={() => sendStatusEmail(selectedOrder._id, selectedOrder.status)}
                    disabled={sendingEmail === selectedOrder._id}
                    className="bg-indigo-500 hover:bg-indigo-600 text-primaryWhite px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" />
                    {sendingEmail === selectedOrder._id ? "Sending..." : "Send Email"}
                  </button>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray500 hover:bg-gray600 text-primaryWhite px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 SHIPPING MODAL WITH DYNAMIC COLORS */}
      {showShippingModal && selectedOrderForShipping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full border border-gray300">
            <div className="p-6 border-b border-gray300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-foreground">📦 Add Shipping Details</h2>
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="text-gray500 hover:text-foreground text-2xl"
                >
                  <X />
                </button>
              </div>
              <p className="text-sm text-gray500 mt-1">Order: {selectedOrderForShipping.orderNumber}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Tracking ID *</label>
                <input
                  type="text"
                  placeholder="Enter tracking ID from dealer"
                  value={shippingForm.trackingId}
                  onChange={(e) => {
                    const newTrackingId = e.target.value
                    setShippingForm({
                      ...shippingForm,
                      trackingId: newTrackingId,
                      trackingUrl: shippingForm.courierCompany
                        ? courierOptions.find((c) => c.value === shippingForm.courierCompany)?.baseUrl + newTrackingId
                        : "",
                    })
                  }}
                  className="w-full p-3 border border-gray300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Courier Company *</label>
                <select
                  value={shippingForm.courierCompany}
                  onChange={(e) => handleCourierChange(e.target.value)}
                  className="w-full p-3 border border-gray300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue focus:border-transparent"
                >
                  <option value="">Select Courier Company</option>
                  {courierOptions.map((courier) => (
                    <option key={courier.value} value={courier.value}>
                      {courier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Tracking URL (Auto-generated)</label>
                <input
                  type="url"
                  placeholder="Will be auto-generated or enter custom URL"
                  value={shippingForm.trackingUrl}
                  onChange={(e) => setShippingForm({ ...shippingForm, trackingUrl: e.target.value })}
                  className="w-full p-3 border border-gray300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="flex-1 bg-gray500 hover:bg-gray600 text-primaryWhite py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitShippingDetails}
                  disabled={!shippingForm.trackingId || !shippingForm.courierCompany}
                  className="flex-1 bg-Orange hover:bg-Orange text-primaryWhite py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Ship & Email Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
