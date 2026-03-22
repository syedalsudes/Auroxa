import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectToDB();
    const { orderId } = await params;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const order = (await Order.findById(orderId).lean()) as any;
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    const isAdmin = userId ? adminIds.includes(userId) : false;

  
    if (order.user?.id) { 
      const isOwner = userId === order.user.id;
      if (!isAdmin && !isOwner) {
        return NextResponse.json({ 
          success: false, 
          message: "Private Order: Please login to view" 
        }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}