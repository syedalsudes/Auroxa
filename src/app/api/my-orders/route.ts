import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Find orders for the current user
    const orders = await Order.find({ "user.id": user.id }).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, orders })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
