import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {

    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const orderData = await req.json()

    const requiredFields = ["items", "shippingAddress", "subtotal", "total"]
    const missingFields = requiredFields.filter((field) => !orderData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    const requiredAddressFields = ["fullName", "phone", "address", "city", "state", "zipCode", "country"]
    const missingAddressFields = requiredAddressFields.filter((field) => !orderData.shippingAddress[field])

    if (missingAddressFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing address fields: ${missingAddressFields.join(", ")}` },
        { status: 400 },
      )
    }

    const newOrderData = {
      user: {
        id: user.id,
        name: orderData.user?.name || user.fullName || "Unknown",
        email: orderData.user?.email || user.primaryEmailAddress?.emailAddress || "unknown@email.com",
      },
      items: orderData.items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        color: item.color || "", // ✅ include color
        size: item.size || "",   // ✅ include size
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || "cod",
      specialInstructions: orderData.specialInstructions || "",
      subtotal: Number(orderData.subtotal),
      deliveryFee: Number(orderData.deliveryFee || 0),
      total: Number(orderData.total),
      status: "pending",
    }



    const newOrder = new Order(newOrderData)
    const savedOrder = await newOrder.save()


    // Ensure we return the ID as a string
    const orderIdString = savedOrder._id.toString()

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderIdString,
      orderNumber: savedOrder.orderNumber,
      debug: {
        originalId: savedOrder._id,
        stringId: orderIdString,
        idLength: orderIdString.length,
        idType: typeof orderIdString,
      },
    })
  } catch (error: any) {
    console.error("❌ Order creation error:", error)

    // More detailed error logging
    if (error.name === "ValidationError") {
      console.error("Validation Error Details:", error.errors)
      return NextResponse.json({ success: false, message: `Validation Error: ${error.message}` }, { status: 400 })
    }

    if (error.name === "MongoError" || error.name === "MongoServerError") {
      console.error("MongoDB Error:", error.message)
      return NextResponse.json({ success: false, message: `Database Error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectToDB()
    const orders = await Order.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, orders })
  } catch (error: any) {
    console.error("Error fetching orders:", error)
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
