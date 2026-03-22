import { connectToDB } from "@/lib/mongodb"
import { Product } from "@/models/Products"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB()
    const { id } = await params
    
    const product = await Product.findById(id).lean()

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      data: product 
    }, {
      headers: { "Cache-Control": "no-store, max-age=0" }
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const { id } = await params;

    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully",
      id
    });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Error: " + error.message }, { status: 500 });
  }
}



export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    if (!userId || !adminIds.includes(userId)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await connectToDB();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, lean: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct, message: "Updated!" });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}