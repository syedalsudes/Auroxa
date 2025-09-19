import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        image: { type: String },
        color: { type: String },
        size: { type: String },  
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "bank"],
      default: "cod",
    },
    specialInstructions: { type: String, default: "" },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingDetails: {
      trackingId: { type: String, default: "" },
      courierCompany: { type: String, default: "" },
      courierName: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
      shippedDate: { type: Date },
      estimatedDelivery: { type: String, default: "7-14 business days" },
    },
    orderNumber: { type: String, unique: true },
  },
  { timestamps: true },
)

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }
  next()
})

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
