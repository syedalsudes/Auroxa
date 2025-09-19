import { connectToDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return new Response("All fields are required", { status: 400 });
    }

    await connectToDB();
    await ContactMessage.create({
      userId: user.id,
      name,
      email,
      subject,
      message,
      status: "unread",
      createdAt: new Date()
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}



