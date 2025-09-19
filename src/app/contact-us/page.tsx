"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useToast } from "@/components/ToastContainer"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ContactUsPage() {
  const { user } = useUser()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // 🔥 VALIDATION - Check all required fields
    if (!formData.name.trim()) {
      showError("Name Required", "Please enter your name")
      return
    }

    if (!formData.email.trim()) {
      showError("Email Required", "Please enter your email")
      return
    }

    if (!formData.subject.trim()) {
      showError("Subject Required", "Please enter a subject")
      return
    }

    if (!formData.message.trim()) {
      showError("Message Required", "Please enter your message")
      return
    }

    // 🔥 EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showError("Invalid Email", "Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        showSuccess("Message Sent!", "Your message has been sent successfully. We'll get back to you soon.")
        setFormData({
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          subject: "",
          message: "",
        })
      } else {
        const errorData = await res.json()
        showError("Failed to Send", errorData.message || "There was an error sending your message. Please try again.")
      }
    } catch (error) {
      showError("Network Error", "Please check your internet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-4 bg-background rounded-2xl mb-8 shadow-lg border border-gray300">
      <h1 className="text-3xl font-bold text-foreground mb-6 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Your Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
          className="border bg-background text-foreground border-gray300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
        />
        <input
          placeholder="Your Email *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          className="border border-gray300 bg-background text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
        />
        <input
          placeholder="Subject *"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          disabled={loading}
          className="border border-gray300 bg-background text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent disabled:opacity-50"
        />
        <textarea
          placeholder="Your Message *"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          disabled={loading}
          className="border border-gray300 p-3 bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent resize-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-background bg-foreground py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" color="text-background" />
              Sending Message...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  )
}
