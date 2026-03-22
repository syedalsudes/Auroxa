import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [authData, _] = await Promise.all([
      auth(),
      connectToDB()
    ]);

    const { userId } = authData;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ "user.id": userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(
      { success: true, orders },
      {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}