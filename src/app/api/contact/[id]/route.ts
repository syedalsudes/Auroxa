import { connectToDB } from "@/lib/mongodb"
import ContactMessage from "@/models/ContactMessage"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB()
    const { id } = await params
    await ContactMessage.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 })
  }
}
