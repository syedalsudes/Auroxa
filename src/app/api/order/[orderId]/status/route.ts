import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import mongoose from "mongoose"

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectToDB()

    const { orderId } = await params
    const { status } = await req.json()

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 })
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        updatedAt: new Date(), // Add updatedAt timestamp
      },
      { new: true },
    )

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to update order status", error: error.message },
      { status: 500 },
    )
  }
}
