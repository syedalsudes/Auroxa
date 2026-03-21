import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
  userId: { type: String, default: null, required: false }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  createdAt: { type: Date, default: Date.now }
});


const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);

export default ContactMessage;