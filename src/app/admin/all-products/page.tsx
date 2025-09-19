"use client"

import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth, useProducts } from "@/contexts"
import { Edit, Trash2, Package, AlertTriangle, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { Product } from "@/types/product"

export default function AllProducts() {
  const { user, isLoaded, isAdmin, redirectIfNotAdmin } = useAuth()
  const { products, loading, deleteProduct } = useProducts()
  const router = useRouter()

  redirectIfNotAdmin()

  const handleEditProduct = (product: Product) => {
    localStorage.setItem("editProduct", JSON.stringify(product))
    if (product._id) router.push(`/admin/edit-product/${product._id}`)
  }

  const handleViewProduct = (productId?: string) => {
    if (productId) router.push(`/blog/${productId}`)
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
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    )
  }

  return (
    <div className="bg-background p-6 rounded-lg shadow border border-gray300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-8 h-8" />
            All Products
          </h1>
          <p className="text-gray500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-foreground bg-lightGray px-4 py-2 rounded-full text-sm font-medium">
            {products?.length ?? 0} Products
          </span>
          <button
            onClick={() => router.push("/admin/add-product")}
            className="bg-blue hover:bg-blue text-primaryWhite px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add New Product
          </button>
        </div>
      </div>

      {(!products || products.length === 0) ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray600 mb-2">No Products Found</h2>
          <p className="text-gray500 mb-6">Add your first product to get started</p>
          <button
            onClick={() => router.push("/admin/add-product")}
            className="bg-blue hover:bg-blue text-primaryWhite px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add First Product
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => {
            const price = product.price ?? 0
            const discountPrice = product.discountPrice ?? 0
            const finalPrice = discountPrice < price && discountPrice > 0 ? discountPrice : price
            const discountPercentage = discountPrice < price && discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0
            const stock = product.stock ?? 0

            return (
              <div
                key={product._id}
                className="flex items-center border border-gray300 p-6 rounded-lg hover:shadow-md transition-all bg-background group"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 mr-6">
                  <img
                    src={product.images?.[0] || "/placeholder.svg?height=150&width=150"}
                    alt={product.title || "Product"}
                    className="w-32 h-32 object-cover rounded-lg border border-gray300"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-foreground group-hover:text-blue transition-colors">
                          {product.title || "Untitled Product"}
                        </h3>
                        {product.isFeatured && (
                          <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-blue text-primaryWhite px-3 py-1 rounded-full text-sm font-medium">
                          {product.category?.replace("-", " ") || "Category"}
                        </span>
                        <span className="bg-gray200 text-gray700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {product.targetAudience || "Unisex"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-Orange font-bold text-lg">${finalPrice}</span>
                          {discountPercentage > 0 && (
                            <>
                              <span className="text-gray500 line-through text-sm">${price}</span>
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{discountPercentage}%
                              </span>
                            </>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${stock > 10
                            ? "bg-green-100 text-green-800"
                            : stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </div>

                      <p className="text-gray500 text-sm mb-3 line-clamp-2">
                        {product.description?.substring(0, 150) || "No description available"}...
                      </p>

                      {/* Colors & Sizes */}
                      <div className="flex items-center gap-6 mb-3">
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray500">Colors:</span>
                            <div className="flex gap-1">
                              {product.colors.slice(0, 5).map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-gray300"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                  title={color}
                                />
                              ))}
                              {product.colors.length > 5 && (
                                <span className="text-xs text-gray500">+{product.colors.length - 5}</span>
                              )}
                            </div>
                          </div>
                        )}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray500">Sizes:</span>
                            <span className="text-xs text-foreground">
                              {product.sizes.slice(0, 4).join(", ")}
                              {product.sizes.length > 4 && ` +${product.sizes.length - 4}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Extra Info */}
                      <div className="flex items-center gap-4 text-sm text-gray400">
                        <span>Slug: {product.slug ?? "N/A"}</span>
                        <span>•</span>
                        <span>
                          Added: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                        <span className="text-yellow-600">
                          ⭐ {product.rating ?? 0} ({product.reviewCount ?? 0} reviews)
                        </span>
                        {product.stock != null && product.stock < 5 && product.stock > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-Orange flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              Low Stock
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 ml-6">
                      <button
                        onClick={() => handleViewProduct(product._id)}
                        className="bg-blue hover:bg-blue text-primaryWhite px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-Orange hover:bg-Orange text-primaryWhite px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => product._id && deleteProduct(product._id)}
                        className="bg-red-600 hover:bg-red-700 text-primaryWhite px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
