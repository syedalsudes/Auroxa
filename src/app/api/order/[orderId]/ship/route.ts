import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import mongoose from "mongoose"

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectToDB()

    const { orderId } = await params
    const { trackingId, courierCompany, courierName, trackingUrl } = await req.json()

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    if (!trackingId || !courierCompany || !courierName) {
      return NextResponse.json(
        {
          success: false,
          message: "Tracking ID, courier company, and courier name are required",
        },
        { status: 400 },
      )
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "shipped",
        shippingDetails: {
          trackingId,
          courierCompany,
          courierName,
          trackingUrl,
          shippedDate: new Date(),
          estimatedDelivery: "7-14 business days",
        },
      },
      { new: true },
    )

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order shipped successfully",
      order: updatedOrder,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to update shipping details", error: error.message },
      { status: 500 },
    )
  }
}
