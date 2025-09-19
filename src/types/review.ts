export interface Review {
  _id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  isVerified: boolean
  userAvatar?: string
  createdAt: string
  productName:string
}

export interface ProductReviewsProps {
  productId: string
  currentRating: number
  reviewCount: number
  productName:string
}
