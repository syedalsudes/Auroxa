import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import mongoose from "mongoose"

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectToDB()

    // Next.js 15 mein params ko await karna padta hai
    const { orderId } = await params

    if (!orderId || orderId === "undefined" || orderId === "null") {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    // Check if orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID format" }, { status: 400 })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("❌ Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
