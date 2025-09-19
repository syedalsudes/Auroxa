"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Star, User, MessageCircle, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import LoadingSpinner from "./LoadingSpinner"
import { useToast } from "./ToastContainer"
import type { Review, ProductReviewsProps } from "@/types"

export default function ProductReviews({ productId, productName, currentRating, reviewCount }: ProductReviewsProps) {
  const { isSignedIn, user } = useUser()
  const { showSuccess, showError } = useToast()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })

  // ✅ Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`)
        const data = await response.json()

        if (data.success) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchReviews()
  }, [productId])

  // ✅ Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      showError("Login Required", "Please login to submit a review")
      return
    }

    if (!newReview.comment.trim()) {
      showError("Comment Required", "Please write a comment for your review")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          userId: user.id,
          userAvatar: user.imageUrl,
          userName: user.fullName || user.username || "Anonymous",
          userEmail: user.primaryEmailAddress?.emailAddress,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })

      const data = await response.json()

      if (data.success) {
        showSuccess("Review Submitted!", "Thank you for your feedback")
        setReviews([data.data, ...reviews])
        setNewReview({ rating: 5, comment: "" })
        setShowReviewForm(false)
      } else {
        showError("Error", data.error || "Failed to submit review")
      }
    } catch (error) {
      showError("Error", "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ✅ Render stars
  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  )


  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading reviews..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ✅ Reviews Summary */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-foreground">Reviews</h3>
          {!isSignedIn ? (
            <p>
              Please sign in to add a review.
            </p>
          ) : (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-Orange text-primaryWhite px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              {showReviewForm ? "Cancel" : "Write Review"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">{currentRating.toFixed(1)}</div>
            <div className="flex justify-center mb-1">{renderStars(Math.round(currentRating))}</div>
            <div className="text-sm text-gray500">{reviewCount} reviews</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length
              const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0

              return (
                <div className="flex items-center gap-2 mb-1" key={rating}>
                  <span className="text-sm w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray300 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray500 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ✅ Review Form */}
      {showReviewForm && user && (
        <div className="glass-card p-6">
          <h4 className="text-xl font-semibold mb-4">Share Your Experience</h4>

          <form onSubmit={handleSubmitReview} className="space-y-5">
            {/* Rating */}
            <div>
              <label className="block text-sm mb-2">Rating</label>
              {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm mb-2">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Write your thoughts..."
                rows={4}
                required
                className="w-full p-3 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-Orange"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="bg-Orange text-primaryWhite px-6 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* ✅ Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray400 mx-auto mb-4" />
            <h4 className="text-lg text-gray600 font-semibold mb-2">No Reviews Yet</h4>
            <p className="text-gray500">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="glass-card p-6 space-y-3 mb-9">
              <div className="flex items-start gap-3">
                {/* ✅ Show reviewer's avatar (not logged-in user's) */}
                {review.userAvatar ? (
                  <Image
                    src={review.userAvatar}
                    alt={review.userName}
                    width={44}
                    height={44}
                    className="w-10 h-10 rounded-full mb-4 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-Orange text-primaryWhite rounded-full flex items-center justify-center font-semibold">
                    {review.userName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">{review.userName}</h5>
                      <span className="text-xs text-gray500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray600 mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

}
