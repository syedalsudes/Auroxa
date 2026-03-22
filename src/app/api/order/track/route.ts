import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json({ success: false, message: "Order number is required" }, { status: 400 });
    }

    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    const isAdmin = userId ? adminIds.includes(userId) : false;

    await connectToDB();

    const order = (await Order.findOne({ orderNumber }).lean()) as any;

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const isOwner = userId && order.user?.id === userId;

    if (isAdmin || isOwner) {
      return NextResponse.json({ success: true, order });
    }

    const publicOrderInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items?.map((item: any) => ({ 
        title: item.title, 
        quantity: item.quantity 
      })) || [],
      createdAt: order.createdAt,
    };

    return NextResponse.json({ 
      success: true, 
      order: publicOrderInfo,
      message: "Limited view (Login for full details)" 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to track order" }, { status: 500 });
  }
}