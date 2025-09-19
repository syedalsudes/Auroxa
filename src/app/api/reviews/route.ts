import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Product } from "@/models/Products";
import mongoose from "mongoose";

function bad(msg: string, status = 400) {
  return NextResponse.json({ success: false, error: msg }, { status });
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const body = await request.json();

    const { productId, userId, userName, userEmail, productName, rating, userAvatar, comment } = body || {};

    if (!productId) return bad("productId is required");
    if (!userId) return bad("userId is required");
    if (!userName) return bad("userName is required");
    if (typeof rating !== "number") return bad("rating must be a number");
    if (rating < 1 || rating > 5) return bad("rating must be between 1 and 5");
    if (!comment || !String(comment).trim()) return bad("comment is required");

    const safeProductId = new mongoose.Types.ObjectId(productId);

    const product = await Product.findById(safeProductId);
    if (!product) return bad("Product not found");

    const review = new Review({
      productId: safeProductId,
      productName: product.title,
      userId,
      userName,
      userEmail: userEmail || "no-email@provided.com",
      userAvatar: userAvatar || "/placeholder.svg",
      rating,
      comment: String(comment).trim(),
    });

    await review.save();

    // ✅ Update product stats
    const agg = await Review.aggregate([
      { $match: { productId: review.productId } },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
          avg: { $avg: "$rating" },
        },
      },
    ]);

    const stats = agg?.[0];
    if (stats) {
      await Product.findByIdAndUpdate(review.productId, {
        rating: Math.round((stats.avg || 0) * 10) / 10,
        reviewCount: stats.count || 0,
      });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    console.error("🔥 Review creation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const limit = Number(searchParams.get("limit") || 50);
    const skip = Number(searchParams.get("skip") || 0);

    let query: any = {};
    if (productId) {
      query.productId = new mongoose.Types.ObjectId(productId);
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 100))
      .lean();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error("🔥 Reviews fetch error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
