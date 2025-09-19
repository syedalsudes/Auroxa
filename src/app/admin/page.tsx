"use client"

import { useAuth, useProducts, useOrders } from "@/contexts"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from "lucide-react"

interface ContactMessage {
  _id: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const { user, isLoaded, isAdmin, redirectIfNotAdmin } = useAuth()
  const { products, loading: productsLoading } = useProducts()
  const { orders, loading: ordersLoading, getOrderCounts } = useOrders()

  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  })

  redirectIfNotAdmin()

  // Fetch contact messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact")
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error("Failed to fetch messages")
      } finally {
        setMessagesLoading(false)
      }
    }

    if (isAdmin) {
      fetchMessages()
    }
  }, [isAdmin])

  // Calculate stats
  useEffect(() => {
    if (orders.length > 0) {
      const totalRevenue = orders
        .filter((order) => order.status === "delivered")
        .reduce((sum, order) => sum + order.total, 0)

      const thisMonth = new Date()
      thisMonth.setDate(1)

      const thisMonthRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= thisMonth && order.status === "delivered"
        })
        .reduce((sum, order) => sum + order.total, 0)

      const deliveredOrders = orders.filter((order) => order.status === "delivered")
      const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0

      // Mock conversion rate (you can calculate based on actual data)
      const conversionRate = orders.length > 0 ? (deliveredOrders.length / orders.length) * 100 : 0

      setStats({
        totalRevenue,
        thisMonthRevenue,
        avgOrderValue,
        conversionRate,
      })
    }
  }, [orders])

  if (!isLoaded || !user || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    )
  }

  const { total: totalOrders, pending: pendingOrders } = getOrderCounts()
  const unreadMessages = messages.filter((msg) => msg.status === "unread").length
  const lowStockProducts = products.filter((product) => (product.stock ?? 0) < 5).length

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-background p-6 rounded-lg shadow border border-gray300">
        <h1 className="text-3xl font-bold text-foreground mb-2">👑 Admin Dashboard</h1>
        <p className="text-gray500">Welcome back, {user.firstName || "Admin"}!</p>
        <p className="text-sm text-gray400 mt-1">
          Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-blue text-primaryWhite p-6 rounded-lg shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Products</h3>
              <p className="text-3xl font-bold mt-2">{productsLoading ? "..." : products.length}</p>
              <p className="text-sm opacity-80 mt-1">{lowStockProducts > 0 && `${lowStockProducts} low stock`}</p>
            </div>
            <Package className="w-12 h-12 opacity-20 absolute right-4" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-green-500 text-primaryWhite p-6 rounded-lg shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-3xl font-bold mt-2">{ordersLoading ? "..." : totalOrders}</p>
              <p className="text-sm opacity-80 mt-1">{pendingOrders} pending</p>
            </div>
            <ShoppingCart className="w-12 h-12 opacity-20 absolute right-4" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-Orange text-primaryWhite p-6 rounded-lg shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm opacity-80 mt-1">This month: ${stats.thisMonthRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-20 absolute right-4" />
          </div>
        </div>

        {/* Messages */}
        <div className="bg-purple-500 text-primaryWhite p-6 rounded-lg shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Messages</h3>
              <p className="text-3xl font-bold mt-2">{messagesLoading ? "..." : messages.length}</p>
              <p className="text-sm opacity-80 mt-1">{unreadMessages} unread</p>
            </div>
            <Users className="w-12 h-12 opacity-20 absolute right-4" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background p-6 rounded-lg shadow border border-gray300">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-foreground">Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray500">Avg Order Value:</span>
              <span className="font-semibold text-foreground">₹{Math.round(stats.avgOrderValue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray500">Conversion Rate:</span>
              <span className="font-semibold text-foreground">{stats.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray500">Low Stock Items:</span>
              <span className="font-semibold text-Orange">{lowStockProducts}</span>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg shadow border border-gray300">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray500">• {pendingOrders} orders awaiting confirmation</p>
            <p className="text-gray500">• {unreadMessages} new messages received</p>
            <p className="text-gray500">• {lowStockProducts} products need restocking</p>
            <p className="text-gray500">
              • Last product added:{" "}
              {products[0]?.createdAt ? new Date(products[0].createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg shadow border border-gray300">
          <h2 className="text-xl font-bold mb-4 text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/add-product"
              className="block w-full bg-blue text-primaryWhite text-center py-3 rounded-md hover:opacity-90 transition-colors"
            >
              Add New Product
            </a>
            <a
              href="/admin/orders"
              className="block w-full bg-Orange text-primaryWhite text-center py-3 rounded-md hover:opacity-90 transition-colors"
            >
              Manage Orders ({pendingOrders} pending)
            </a>
            <a
              href="/admin/notifications"
              className="block w-full bg-purple-500 text-primaryWhite text-center py-3 rounded-md hover:bg-purple-600 transition-colors"
            >
              View Messages ({unreadMessages} new)
            </a>
          </div>
        </div>
      </div>

      {/* Charts Section (Placeholder for future) */}
      <div className="bg-background p-6 rounded-lg shadow border border-gray300">
        <h2 className="text-xl font-bold mb-4 text-foreground">📊 Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-lightGray rounded-lg flex items-center justify-center">
            <div className="text-center text-gray500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Sales Chart</p>
              <p className="text-sm">(Coming Soon)</p>
            </div>
          </div>
          <div className="h-64 bg-lightGray rounded-lg flex items-center justify-center">
            <div className="text-center text-gray500">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p>Product Performance</p>
              <p className="text-sm">(Coming Soon)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
