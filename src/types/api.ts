export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sortBy?: "price" | "rating" | "createdAt"
  sortOrder?: "asc" | "desc"
}
