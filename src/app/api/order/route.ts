import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const orderData = await req.json();

    const requiredFields = ["items", "shippingAddress", "subtotal", "total"];
    const missingFields = requiredFields.filter((field) => !orderData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ success: false, message: `Missing fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

    const newOrderData = {
      user: {
        id: userId,
        name: orderData.user?.name || "Guest User",
        email: orderData.user?.email || "No Email",
      },
      items: orderData.items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        color: item.color || "", 
        size: item.size || "",   
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || "cod",
      specialInstructions: orderData.specialInstructions || "",
      subtotal: Number(orderData.subtotal),
      deliveryFee: Number(orderData.deliveryFee || 0),
      total: Number(orderData.total),
      status: "pending",
    };

    revalidatePath("/admin/orders"); 
    revalidatePath("/my-orders");

    const savedOrder = await Order.create(newOrderData);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id.toString(),
      orderNumber: savedOrder.orderNumber,
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Parallel mein auth aur DB connect karne ki koshish karein
    const [authData, _] = await Promise.all([
      auth(),
      connectToDB()
    ]);

    const { userId } = authData;
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Lean query fast hoti hai, lekin indexing lazmi hai
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec(); // exec() use karna better practice hai

    return NextResponse.json(
      { success: true, orders },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0', // Browser ko cache karne se rokein
        },
      }
    );
  } catch (error: any) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}