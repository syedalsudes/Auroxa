export interface ContactMessage {
  _id: string
  userId: string
  name: string
  email: string
  subject: string
  message: string
  status: "unread" | "read"
  createdAt: string
}
