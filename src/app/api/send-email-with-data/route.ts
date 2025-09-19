import { NextResponse } from "next/server"
import { getEmailTemplate, sendEmail } from "@/lib/emailService"

export async function POST(req: Request) {
  try {
    const { orderData, status } = await req.json()

    if (!orderData || !status) {
      return NextResponse.json({ success: false, message: "Order data and status are required" }, { status: 400 })
    }

    const emailTemplate = getEmailTemplate(status, orderData)
    if (!emailTemplate) {
      return NextResponse.json({ success: false, message: "Invalid status for email" }, { status: 400 })
    }

    // Send real email
    const emailResult = await sendEmail(orderData.user.email, emailTemplate.subject, emailTemplate.html)

    if (emailResult.success) {

      return NextResponse.json({
        success: true,
        message: `Shipping email sent successfully to ${orderData.user.email}`,
        emailSent: true,
        messageId: emailResult.messageId,
      })
    } else {
      console.error("❌ Shipping email sending failed:", emailResult.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send shipping email",
          error: emailResult.error,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("❌ Shipping Email API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send shipping email",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
