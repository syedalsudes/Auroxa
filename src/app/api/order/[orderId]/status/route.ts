import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    // 🔥 STEP 1: Sab cheezon ko parallel mein shuru karein
    // Auth, DB Connection, Params aur JSON body sab ek saath shuru honge
    const [authData, _, resolvedParams, body] = await Promise.all([
      auth(),
      connectToDB(),
      params,
      req.json()
    ]);

    const { userId } = authData;
    const { orderId } = resolvedParams;
    const { status } = body;

    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 });
    }

    // 🔥 STEP 2: Database update ko lean rakhein
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        $set: { 
          status, 
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // 🔥 STEP 3: Cache Invalidation
    // Ye zaroori hai taake Admin Dashboard aur User Order list foran refresh ho jayein
    revalidatePath("/admin/orders");
    revalidatePath("/my-orders");
    // Agar koi specific order page hai toh usay bhi revalidate karein
    revalidatePath(`/orders/${orderId}`);

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      order: updatedOrder,
    });

  } catch (error: any) {
    console.error("PATCH UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}