import { connectToDB } from "@/lib/mongodb";
import { Product } from "@/models/Products";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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
        return NextResponse.json(
          { success: false, message: "Maximum 4 featured products allowed" },
          { status: 400 }
        );
      }
    }


    const price = Number.parseFloat(body.price);
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json({ success: false, message: "Invalid price" }, { status: 400 });
    }

    let discountPrice: number | null = null;
    if (body.discountPrice !== undefined && body.discountPrice !== null && body.discountPrice !== "") {
      const d = Number.parseFloat(body.discountPrice);
      if (Number.isNaN(d) || d < 0 || d >= price) {
        return NextResponse.json({ success: false, message: "Invalid discount price" }, { status: 400 });
      }
      discountPrice = d;
    }

    const stock = Number.parseInt(body.stock ?? "1", 10);
    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json({ success: false, message: "Invalid stock" }, { status: 400 });
    }

    let images: string[] = [];
    if (Array.isArray(body.images)) images = body.images.filter(Boolean).map(String);
    else if (body.image) images = [String(body.image)];
    if (images.length < 1) {
      return NextResponse.json({ success: false, message: "At least 1 image is required" }, { status: 400 });
    }
    const mainImage = images[0] || "/placeholder.svg?height=300&width=300";

    const productData = {
      title: String(body.title).trim(),
      slug: String(body.slug).trim(),
      description: String(body.description).trim(),
      category: String(body.category).trim(),
      targetAudience: String(body.targetAudience).trim(),
      price,
      discountPrice,
      stock,
      image: mainImage,
      images,
      colors: Array.isArray(body.colors) ? body.colors : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      brand: body.brand || "",
      isFeatured: Boolean(body.isFeatured),
      // ✅ ensure active by default (and allow override)
      isActive: body.isActive === false ? false : true,
    };

    const saved = await new Product(productData).save();

    return NextResponse.json({ success: true, data: saved, message: "Product created successfully" });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json({ success: false, message: "Validation Error: " + error.message }, { status: 400 });
    }
    if (error.code === 11000 && String(error.message || "").includes("slug")) {
      return NextResponse.json({ success: false, message: "Duplicate slug" }, { status: 409 });
    }
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

    // ✅ include docs with isActive=true OR no isActive field (old docs)
    const query: any = { $or: [{ isActive: true }, { isActive: { $exists: false } }] };

    if (category && category !== "all") query.category = category;
    if (targetAudience && targetAudience !== "all") query.targetAudience = targetAudience;
    if (featured === "true") query.isFeatured = true;

    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
    // (optional) if you want consistent shape:
    // return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
