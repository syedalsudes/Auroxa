import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Product } from "@/models/Products";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

function bad(msg: string, status = 400) {
  return NextResponse.json({ success: false, error: msg }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return bad("Unauthorized", 401);

    await connectToDB();
    const body = await request.json();
    const { productId, rating, comment, userName, userEmail, userAvatar } = body;

    if (!productId || !rating || !comment) return bad("Missing fields");

    const safeProductId = new mongoose.Types.ObjectId(productId);

    const product = (await Product.findById(safeProductId)
      .select("title")
      .lean()) as { title: string } | null;

    if (!product) return bad("Product not found");

    const review = await Review.create({
      productId: safeProductId,
      productName: product.title, 
      userId,
      userName: userName || "Anonymous",
      userEmail: userEmail || "",
      userAvatar: userAvatar || "/placeholder.svg",
      rating: Number(rating),
      comment: String(comment).trim(),
    });

    const statsAgg = await Review.aggregate([
      { $match: { productId: safeProductId } },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
          avg: { $avg: "$rating" },
        },
      },
    ]);

    const stats = statsAgg[0];
    if (stats) {
      await Product.findByIdAndUpdate(safeProductId, {
        rating: Math.round((stats.avg || 0) * 10) / 10,
        reviewCount: stats.count || 0,
      });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = Math.min(Number(searchParams.get("limit") || 10), 50);

    let query: any = {};
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      query.productId = new mongoose.Types.ObjectId(productId);
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-userEmail")
      .lean();

    return NextResponse.json(
      { success: true, data: reviews },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}