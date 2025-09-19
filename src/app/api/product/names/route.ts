import { connectToDB } from "@/lib/mongodb";
import { Product } from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    // Sirf 10 products ke name aur _id lao
    const products = await Product.find({})
      .limit(10)

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
