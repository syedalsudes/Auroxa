import { connectToDB } from "@/lib/mongodb"
import { Product } from "@/models/Products"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDB()

  try {
    // Next.js 15 mein params ko await karna padta hai
    const { id } = await params
    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDB()

  try {
    const { id } = await params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting product" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDB()

  try {
    const { id } = await params
    const body = await req.json()
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true })
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updatedProduct })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating product" }, { status: 500 })
  }
}
