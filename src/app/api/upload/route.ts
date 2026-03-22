import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files sent" }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json({ success: false, error: "Max 4 images allowed" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (file.size > 6 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too large (> 6MB)`);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      return cloudinary.uploader.upload(dataUri, {
        folder: "products",
        resource_type: "image",
      });
    });

    const results = await Promise.all(uploadPromises);
    const uploadedUrls = results.map((result) => result.secure_url);

    return NextResponse.json({ success: true, uploaded: uploadedUrls });

  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Upload failed" 
    }, { status: 500 });
  }
}