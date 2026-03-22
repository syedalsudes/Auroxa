import { connectToDB } from "@/lib/mongodb";
import { Product } from "@/models/Products";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const body = await req.json();

    const requiredFields = ["title", "slug", "description", "category", "price", "targetAudience"];
    const missing = requiredFields.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json({ success: false, message: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    if (body.isFeatured) {
      const featuredCount = await Product.countDocuments({ isFeatured: true });
      if (featuredCount >= 4) {
        return NextResponse.json({ success: false, message: "Maximum 4 featured products allowed" }, { status: 400 });
      }
    }

    const price = Number.parseFloat(body.price);
    const productData = {
      title: String(body.title).trim(),
      slug: String(body.slug).trim(),
      description: String(body.description).trim(),
      category: String(body.category).trim(),
      targetAudience: String(body.targetAudience).trim(),
      price,
      discountPrice: body.discountPrice ? Number.parseFloat(body.discountPrice) : null,
      stock: Number.parseInt(body.stock ?? "1", 10),
      image: Array.isArray(body.images) ? body.images[0] : body.image,
      images: Array.isArray(body.images) ? body.images : [body.image],
      colors: body.colors || [],
      sizes: body.sizes || [],
      tags: body.tags || [],
      brand: body.brand || "",
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== false,
    };

    const saved = await Product.create(productData);

    return NextResponse.json({ success: true, data: saved, message: "Product created successfully" });
  } catch (error: any) {
    console.error("Product POST Error:", error);
    return NextResponse.json({ success: false, message: "Server Error: " + error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    
    const category = searchParams.get("category");
    const targetAudience = searchParams.get("audience");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const query: any = { $or: [{ isActive: true }, { isActive: { $exists: false } }] };

    if (category && category !== "all") query.category = category;
    if (targetAudience && targetAudience !== "all") query.targetAudience = targetAudience;
    if (featured === "true") query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(24)
      .lean();

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}