import { connectToDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return new Response("ID is required", { status: 400 });

    await connectToDB();
    await ContactMessage.findByIdAndUpdate(id, { status: "read" });

    return new Response("Updated successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}
