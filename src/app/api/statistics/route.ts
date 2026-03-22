import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectToDB();

    const [reviewStats, orderStats, productsSold, recentReviews] = await Promise.all([
      Review.aggregate([
        { $group: { _id: null, totalReviews: { $sum: 1 }, averageRating: { $avg: "$rating" } } }
      ]),
      
      Order.aggregate([
        { $group: { _id: null, totalOrders: { $sum: 1 }, deliveredOrders: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } } } }
      ]),

      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: null, totalProductsSold: { $sum: "$items.quantity" } } }
      ]),

      Review.find({ rating: { $gte: 4 } })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    const reviews = reviewStats[0] || { totalReviews: 0, averageRating: 0 };
    const orders = orderStats[0] || { totalOrders: 0, deliveredOrders: 0 };
    const products = productsSold[0] || { totalProductsSold: 0 };

    const satisfactionRate = orders.totalOrders > 0 
      ? Math.round((orders.deliveredOrders / orders.totalOrders) * 100) 
      : 99;

    const statistics = {
      happyCustomers: reviews.totalReviews || 0,
      averageRating: reviews.averageRating ? Math.round(reviews.averageRating * 10) / 10 : 4.9,
      productsSold: products.totalProductsSold || 0,
      satisfactionRate: satisfactionRate,
      recentReviews: recentReviews,
    };

    return NextResponse.json({ success: true, data: statistics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}