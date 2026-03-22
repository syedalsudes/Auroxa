import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getEmailTemplate, sendEmail } from "@/lib/emailService";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server"; 

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "Order ID and status are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 });
    }

    await connectToDB();

    const order = (await Order.findById(orderId).lean()) as any;

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const emailTemplate = getEmailTemplate(status, order);
    if (!emailTemplate) {
      return NextResponse.json({ success: false, message: "Invalid status for email" }, { status: 400 });
    }

    const emailResult = await sendEmail(order.user.email, emailTemplate.subject, emailTemplate.html);

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: `Status email (${status}) sent successfully to ${order.user.email}`,
        emailSent: true,
      });
    } else {
      throw new Error(emailResult.error);
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to send email", error: error.message }, { status: 500 });
  }
}