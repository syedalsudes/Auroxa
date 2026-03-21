// src/app/api/contact/route.ts
import { connectToDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // ⚡ ID mil gayi to theek, nahi mili to null (No 401 error anymore!)
    const { userId } = await auth(); 

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    await connectToDB();

    const messageData: any = {
  name,
  email,
  subject,
  message,
  status: "unread",
  createdAt: new Date()
};

if (userId) {
  messageData.userId = userId;
}

await ContactMessage.create(messageData);


    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error: any) {
    console.error("Contact API Error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}


export async function GET() {
  try {
    await connectToDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}