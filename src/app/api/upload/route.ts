// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// configure cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // 'images' fields (multiple)
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files sent" }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json({ success: false, error: "Max 4 images allowed" }, { status: 400 });
    }

    const uploaded: string[] = [];

    for (const file of files) {
      // file is a Web File object - convert to base64 data URI
      // @ts-ignore
      const arrayBuffer = await file.arrayBuffer(); 
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      // file.type should be like "image/png"
      // @ts-ignore
      const dataUri = `data:${file.type};base64,${base64}`;

      // optional: limit file size (e.g., 6MB)
      // @ts-ignore
      if (file.size && file.size > 6 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: "Each file must be <= 6MB" }, { status: 400 });
      }

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "products",
        resource_type: "image",
      });

      uploaded.push(result.secure_url);
    }

    return NextResponse.json({ success: true, uploaded });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
