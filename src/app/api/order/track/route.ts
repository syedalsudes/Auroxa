import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get("orderNumber")

    if (!orderNumber) {
      return NextResponse.json({ success: false, message: "Order number is required" }, { status: 400 })
    }

    await connectToDB()

    const order = await Order.findOne({ orderNumber }).lean()

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Order tracking error:", error)
    return NextResponse.json({ success: false, message: "Failed to track order" }, { status: 500 })
  }
}
