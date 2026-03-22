import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ success: false, message: "Unauthorized: Admin only" }, { status: 401 });
    }

    await connectToDB();

    const { orderId } = await params;
    const { trackingId, courierCompany, courierName, trackingUrl } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 });
    }

    if (!trackingId || !courierCompany || !courierName) {
      return NextResponse.json(
        { success: false, message: "Missing required tracking details" },
        { status: 400 }
      );
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
      { new: true }
    ).lean(); 

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Order shipped successfully and tracking updated",
      order: updatedOrder,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}