"use client"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ToastContainer"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/contexts"

interface Message {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function NotificationsPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useToast()
  const { user, isLoaded, isAdmin, redirectIfNotAdmin } = useAuth()

  useEffect(() => {
    if (!isLoaded || !user || !isAdmin) return
    fetchMessages()
  }, [isLoaded, user, isAdmin])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/contact")
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      showError("Failed to Load", "Could not fetch messages")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/contact/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, status: "read" } : msg))
      )

      window.dispatchEvent(new Event("updateUnreadCount"))
      showSuccess("Marked as Read", "Message has been read sucesfully")
    } catch (error) {
      showError("Error", "Failed to mark message as read")
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      const data = await res.json()

      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id))
        window.dispatchEvent(new Event("updateUnreadCount"))
        showSuccess("Message Deleted", "Message has been deleted successfully")
      } else {
        showError("Delete Failed", "Failed to delete message")
      }
    } catch (error) {
      showError("Error", "Error deleting message")
    }
  }

  if (!isLoaded || !user || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray500 italic">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-5 rounded-lg shadow-sm border transition-all duration-200 ${
                msg.status === "unread"
                  ? "bg-background border-Orange"
                  : "bg-background border-gray300"
              } hover:shadow-md`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground">{msg.name}</p>
                  <p className="text-sm text-gray500">{msg.email}</p>
                  <p className="text-sm text-Orange font-medium mt-1">{msg.subject}</p>
                  <p className="mt-2 text-gray500 break-words max-w-screen-md">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray400 mt-3">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {msg.status === "unread" && (
                    <button
                      onClick={() => markAsRead(msg._id)}
                      className="bg-green-500 hover:bg-green-600 text-primaryWhite px-4 py-2 rounded-full text-sm font-medium shadow-sm transition"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="bg-red-500 hover:bg-red-600 text-primaryWhite px-4 py-2 rounded-full text-sm font-medium shadow-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
