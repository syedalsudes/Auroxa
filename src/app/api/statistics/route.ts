import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Review } from "@/models/Review"
import { Order } from "@/models/Order"

export async function GET() {
  try {
    await connectToDB()

    // Get total review count and average rating
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    // Get total orders and delivered orders for satisfaction rate
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          deliveredOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
            },
          },
        },
      },
    ])

    // Get total products sold (sum of quantities from all orders)
    const productsSold = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalProductsSold: { $sum: "$items.quantity" },
        },
      },
    ])

    // Get recent reviews for testimonials
    const recentReviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Calculate statistics with fallbacks
    const reviews = reviewStats[0] || { totalReviews: 0, averageRating: 0 }
    const orders = orderStats[0] || { totalOrders: 0, deliveredOrders: 0 }
    const products = productsSold[0] || { totalProductsSold: 0 }

    const satisfactionRate =
      orders.totalOrders > 0 ? Math.round((orders.deliveredOrders / orders.totalOrders) * 100) : 99

    const statistics = {
      happyCustomers: reviews.totalReviews || 0,
      averageRating: reviews.averageRating ? Math.round(reviews.averageRating * 10) / 10 : 4.9,
      productsSold: products.totalProductsSold || 0,
      satisfactionRate: satisfactionRate,
      recentReviews: recentReviews.slice(0, 5), // Top 5 recent good reviews
    }

    return NextResponse.json({ success: true, data: statistics })
  } catch (error: any) {
    console.error("Statistics fetch error:", error)
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch statistics" }, { status: 500 })
  }
}
