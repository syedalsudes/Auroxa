"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Clock, CheckCircle, Package, Truck, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ToastContainer"
import type { Order, OrdersContextType } from "@/types"

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    console.error("useOrders must be used within OrdersProvider. Make sure the component is wrapped with OrdersProvider.")
    throw new Error("useOrders must be used within OrdersProvider")
  }
  return context
}

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const toast = useToast()

  const showSuccess = (title: string, message: string) => {
    if (toast) toast.showSuccess(title, message)
  }

  const showError = (title: string, message: string) => {
    if (toast) toast.showError(title, message)
    else console.error(`❌ ${title}: ${message}`)
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/order")
      const data = await res.json()

      if (data.success) {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const activeOrders = data.orders.filter((order: Order) => {
          if (order.status === "delivered") {
            const updatedDate = new Date(order.updatedAt || order.createdAt)
            return updatedDate > oneWeekAgo
          }
          return true
        })

        setOrders(activeOrders)
      }
    } catch (error) {
      showError("Error", "Failed to fetch orders")
      console.error("❌ Orders fetch error:", error)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }


  const getOrderCounts = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }
  }


  // ✅ newStatus type-safe banaya
  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingStatus(orderId)
    try {
      console.log("🔄 Updating order status:", orderId, "to", newStatus)

      const res = await fetch(`/api/order/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        )

        showSuccess("Status Updated!", `Order status changed to ${newStatus}`)

        if (["confirmed", "processing", "shipped", "delivered"].includes(newStatus)) {
          sendStatusEmail(orderId, newStatus)
        }
      } else {
        showError("Update Failed", data.message)
      }
    } catch (error) {
      showError("Error", "Failed to update order status")
      console.error("❌ Order status update error:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  // ✅ type-safe
  const sendStatusEmail = async (orderId: string, status: Order["status"]) => {
    setSendingEmail(orderId)
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      })

      const data = await res.json()
      if (data.success) {
        showSuccess("Email Sent!", `${status} email sent to customer`)
      } else {
        showError("Email Failed", data.message)
      }
    } catch {
      showError("Error", "Failed to send email")
    } finally {
      setSendingEmail(null)
    }
  }

  // ✅ type-safe
  const sendStatusEmailWithOrderData = async (orderData: Order, status: Order["status"]) => {
    setSendingEmail(orderData._id)
    try {
      const res = await fetch("/api/send-email-with-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData, status }),
      })

      const data = await res.json()
      if (data.success) {
        showSuccess("Email Sent!", `${status} email sent to customer with tracking details`)
      } else {
        showError("Email Failed", data.message)
      }
    } catch {
      showError("Error", "Failed to send email")
    } finally {
      setSendingEmail(null)
    }
  }

  // ✅ shipOrder fix
  const shipOrder = async (orderId: string, shippingData: any) => {
    setUpdatingStatus(orderId)
    try {
      const res = await fetch(`/api/order/${orderId}/ship`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingData),
      })

      const data = await res.json()
      if (data.success) {
        const foundOrder = orders.find((o) => o._id === orderId)!
        const updatedOrder: Order = {
          ...foundOrder,
          status: "shipped" as Order["status"], // ✅ type safe
          shippingDetails: shippingData,
          updatedAt: new Date().toISOString(),
        }

        setOrders(orders.map((order) => (order._id === orderId ? updatedOrder : order)))
        showSuccess("Order Shipped!", "Shipping details updated and email sent to customer")

        sendStatusEmailWithOrderData(updatedOrder, "shipped")
      } else {
        showError("Update Failed", data.message)
      }
    } catch {
      showError("Error", "Failed to update shipping details")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const copyOrderInfo = (order: Order) => {
    const orderInfo = `
🛍️ NEW ORDER DETAILS
===================

📋 ORDER INFO:
Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status.toUpperCase()}
Payment: ${order.paymentMethod.toUpperCase()}

👤 CUSTOMER INFO:
Name: ${order.shippingAddress.fullName}
Email: ${order.user.email}
Phone: ${order.shippingAddress.phone}

📍 DELIVERY ADDRESS:
${order.shippingAddress.fullName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

📦 ITEMS TO DELIVER:
${order.items
        .map(
          (item, index) =>
            `${index + 1}. ${item.title}
     Qty: ${item.quantity} | Price: ₹${item.price.toLocaleString()}
     Total: ₹${(item.price * item.quantity).toLocaleString()}`,
        )
        .join("\n\n")}

💰 PAYMENT SUMMARY:
Total Amount: $${order.total.toLocaleString()}
Payment Method: ${order.paymentMethod.toUpperCase()}

📝 SPECIAL INSTRUCTIONS:
${order.specialInstructions || "No special instructions"}

===================
Copy this info to dealer! 📋
    `

    navigator.clipboard.writeText(orderInfo).then(() => {
      showSuccess("Copied!", "Order information copied to clipboard. Send this to dealer!")
    })
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "processing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "shipped":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }


  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes("/admin") && !initialized) {
      console.log("🔍 OrdersProvider - Initializing for admin pages")
      fetchOrders()
    }
  }, [initialized])

  const value: OrdersContextType = {
    orders,
    loading,
    updatingStatus,
    sendingEmail,

    fetchOrders,
    updateOrderStatus,
    sendStatusEmail,
    sendStatusEmailWithOrderData,
    shipOrder,
    copyOrderInfo,
    getStatusColor,
    getStatusIcon,
    getOrderCounts,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
