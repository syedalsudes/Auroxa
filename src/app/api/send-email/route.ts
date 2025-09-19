import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { getEmailTemplate, sendEmail } from "@/lib/emailService"
import mongoose from "mongoose"

export async function POST(req: Request) {
  try {
    const { orderId, status, orderData } = await req.json()

    let order

    if (orderData) {
      // Use provided order data (for shipping emails with fresh data)
      order = orderData
    } else {
      // Fetch order from database (for regular status emails)
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
      }

      await connectToDB()
      order = await Order.findById(orderId)

      if (!order) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
      }
    }

    const emailTemplate = getEmailTemplate(status, order)
    if (!emailTemplate) {
      return NextResponse.json({ success: false, message: "Invalid status for email" }, { status: 400 })
    }

    // Send real email
    const emailResult = await sendEmail(order.user.email, emailTemplate.subject, emailTemplate.html)

    if (emailResult.success) {

      return NextResponse.json({
        success: true,
        message: `Email sent successfully to ${order.user.email}`,
        emailSent: true,
        messageId: emailResult.messageId,
      })
    } else {
      console.error("❌ Email sending failed:", emailResult.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email",
          error: emailResult.error,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("❌ Email API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
