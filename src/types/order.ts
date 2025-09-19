export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export interface Order {
  _id: string
  orderNumber: string
  user: {
    id: string
    name: string
    email: string
  }
  items: Array<{
    productId: string
    title: string
    quantity: number
    price: number
    image?: string
    color?: string | null
    size?: string | null
  }>
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  specialInstructions?: string
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  shippingDetails?: {
    trackingId: string
    courierCompany: string
    courierName: string
    trackingUrl: string
    shippedDate?: Date
    estimatedDelivery?: string
  }
}

export interface OrdersContextType {
  orders: Order[]
  loading: boolean
  updatingStatus: string | null   // 👈 orderId ya null
  sendingEmail: string | null     // 👈 orderId ya null

  fetchOrders: () => Promise<void>
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>
  sendStatusEmail: (orderId: string, status: OrderStatus) => Promise<void>
  sendStatusEmailWithOrderData: (orderData: Order, status: OrderStatus) => Promise<void>
  shipOrder: (orderId: string, shippingData: any) => Promise<void>
  copyOrderInfo: (order: Order) => void
  getStatusColor: (status: OrderStatus) => string
  getStatusIcon: (status: OrderStatus) => JSX.Element
  getOrderCounts: () => Record<OrderStatus, number> & { total: number }
}
