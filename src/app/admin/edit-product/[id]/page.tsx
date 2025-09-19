"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useProducts } from "@/contexts"
import LoadingSpinner from "@/components/LoadingSpinner"
import { ArrowLeft, Save, X } from "lucide-react"
import { useToast } from "@/components/ToastContainer"
import { CATEGORIES } from "@/constants/categories"


const TARGET_AUDIENCES = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
]

const COMMON_COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Gray",
  "Navy",
  "Beige",
  "Maroon",
  "Teal",
]

const COMMON_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "One Size",
  "Free Size",
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter()
  const { user, isLoaded, isAdmin, redirectIfNotAdmin } = useAuth()
  const { updateProduct, uploadImages, generateSlug } = useProducts()
  const { showSuccess, showError } = useToast()

  const [productId, setProductId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [featuredCount, setFeaturedCount] = useState(0)


  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    targetAudience: "",
    price: "",
    discountPrice: "",
    stock: "1",
    isFeatured: false,
  })

  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null])
  const [previews, setPreviews] = useState<string[]>(["", "", "", ""])

  redirectIfNotAdmin()

  useEffect(() => {
    const fetchFeaturedCount = async () => {
      const res = await fetch("/api/product?featured=true")
      const data = await res.json()
      setFeaturedCount(data.length)
    }
    fetchFeaturedCount()
  }, [])


  // Get product ID from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Load product data
  useEffect(() => {
    if (!productId) return

    const loadProductData = () => {
      try {
        // Try to get from localStorage first (from all-products page)
        const storedProduct = localStorage.getItem("editProduct")
        if (storedProduct) {
          const product = JSON.parse(storedProduct)
          if (product._id === productId) {
            setForm({
              title: product.title || "",
              slug: product.slug || "",
              description: product.description || "",
              category: product.category || "",
              targetAudience: product.targetAudience || "",
              price: product.price?.toString() || "",
              discountPrice: product.discountPrice?.toString() || "",
              stock: product.stock?.toString() || "1",
              isFeatured: product.isFeatured || false,
            })

            setColors(product.colors || [])
            setSizes(product.sizes || [])

            const images = product.images || [product.image].filter(Boolean)
            setExistingImages(images)
            setPreviews([...images, "", "", ""].slice(0, 4))

            localStorage.removeItem("editProduct") // Clean up
            setInitialLoading(false)
            return
          }
        }

        // If not in localStorage, fetch from API
        fetchProductFromAPI()
      } catch (error) {
        console.error("Error loading product data:", error)
        fetchProductFromAPI()
      }
    }

    const fetchProductFromAPI = async () => {
      try {
        const response = await fetch(`/api/product/${productId}`)
        const data = await response.json()

        if (data.success && data.data) {
          const product = data.data
          setForm({
            title: product.title || "",
            slug: product.slug || "",
            description: product.description || "",
            category: product.category || "",
            targetAudience: product.targetAudience || "",
            price: product.price?.toString() || "",
            discountPrice: product.discountPrice?.toString() || "",
            stock: product.stock?.toString() || "1",
            isFeatured: product.isFeatured || false,
          })

          setColors(product.colors || [])
          setSizes(product.sizes || [])

          const images = product.images || [product.image].filter(Boolean)
          setExistingImages(images)
          setPreviews([...images, "", "", ""].slice(0, 4))
        } else {
          showError("Product Not Found", "Could not load product data")
          router.push("/admin/all-products")
        }
      } catch (error) {
        showError("Error", "Failed to load product data")
        router.push("/admin/all-products")
      } finally {
        setInitialLoading(false)
      }
    }

    loadProductData()
  }, [productId, router, showError])

  // Auto-generate slug when title changes
  useEffect(() => {
    if (form.title && !form.slug) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.title) }))
    }
  }, [form.title, generateSlug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleArrayInput = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setter(items)
  }

  const toggleArrayItem = (item: string, array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const handleFileChange = (index: number, file?: File | null) => {
    const newFiles = [...files]
    newFiles[index] = file ?? null
    setFiles(newFiles)

    const newPreviews = [...previews]
    if (file) {
      newPreviews[index] = URL.createObjectURL(file)
    } else {
      // If removing a file, check if there was an existing image
      if (index < existingImages.length) {
        newPreviews[index] = existingImages[index]
      } else {
        newPreviews[index] = ""
      }
    }
    setPreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]
    const newExistingImages = [...existingImages]

    newFiles[index] = null
    newPreviews[index] = ""

    // If this was an existing image, remove it from existing images array
    if (index < existingImages.length) {
      newExistingImages.splice(index, 1)
      setExistingImages(newExistingImages)
    }

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      // Prepare images array
      let finalImages = [...existingImages]

      // Upload new files if any
      const newFiles = files.filter(Boolean) as File[]
      if (newFiles.length > 0) {
        const uploadResult = await uploadImages(newFiles)
        if (!uploadResult.success) {
          setLoading(false)
          return
        }
        finalImages = [...finalImages, ...uploadResult.uploaded!]
      }

      // Remove empty slots and limit to 4 images
      finalImages = finalImages.filter(Boolean).slice(0, 4)

      if (finalImages.length === 0) {
        showError("Images Required", "At least one image is required")
        setLoading(false)
        return
      }

      const productData = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        description: form.description,
        category: form.category,
        targetAudience: form.targetAudience,
        price: Number.parseFloat(form.price),
        discountPrice: form.discountPrice ? Number.parseFloat(form.discountPrice) : null,
        stock: Number.parseInt(form.stock || "1", 10),
        isFeatured: form.isFeatured,
        colors,
        sizes,
        images: finalImages,
        image: finalImages[0], // First image as main image
      }

      const result = await updateProduct(productId, productData)

      if (result.success) {
        showSuccess("Product Updated!", "Product has been updated successfully")
        router.push("/admin/all-products")
      }
    } catch (error) {
      showError("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [previews])

  if (!isLoaded || !user || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading product data..." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-background p-6 rounded-lg shadow-md border border-gray300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/all-products")}
          className="p-2 hover:bg-lightGray rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Edit Product</h2>
          <p className="text-gray500">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Product Title *</label>
            <input
              name="title"
              onChange={handleChange}
              value={form.title}
              placeholder="Enter product title"
              required
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">URL Slug</label>
            <input
              name="slug"
              onChange={handleChange}
              value={form.slug}
              placeholder="auto-generated-from-title"
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Description *</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={form.description}
            placeholder="Enter detailed product description"
            required
            disabled={loading}
            rows={4}
            className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
          />
        </div>

        {/* Category & Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Category *</label>
            <select
              name="category"
              onChange={handleChange}
              value={form.category}
              required
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Target Audience *</label>
            <select
              name="targetAudience"
              onChange={handleChange}
              value={form.targetAudience}
              required
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            >
              <option value="">Select Audience</option>
              {TARGET_AUDIENCES.map((aud) => (
                <option key={aud.value} value={aud.value}>
                  {aud.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Price ($) *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              onChange={handleChange}
              value={form.price}
              placeholder="0.00"
              required
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Discount Price ($)</label>
            <input
              name="discountPrice"
              type="number"
              step="0.01"
              onChange={handleChange}
              value={form.discountPrice}
              placeholder="Optional"
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Stock Quantity *</label>
            <input
              name="stock"
              type="number"
              onChange={handleChange}
              value={form.stock}
              placeholder="1"
              required
              disabled={loading}
              className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Available Colors</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleArrayItem(color, colors, setColors)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${colors.includes(color)
                  ? "bg-Orange text-white border-Orange"
                  : "bg-background text-foreground border-gray300 hover:border-Orange"
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
          <input
            placeholder="Or type custom colors separated by commas"
            value={colors.join(", ")}
            onChange={(e) => handleArrayInput(e.target.value, setColors)}
            disabled={loading}
            className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Available Sizes</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleArrayItem(size, sizes, setSizes)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${sizes.includes(size)
                  ? "bg-Orange text-white border-Orange"
                  : "bg-background text-foreground border-gray300 hover:border-Orange"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
          <input
            placeholder="Or type custom sizes separated by commas"
            value={sizes.join(", ")}
            onChange={(e) => handleArrayInput(e.target.value, setSizes)}
            disabled={loading}
            className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
          />
        </div>

        {/* Featured Product */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            disabled={loading || (!form.isFeatured && featuredCount >= 4)}
            className="w-4 h-4 text-Orange bg-background border-gray300 rounded focus:ring-Orange"
          />
          <label className="text-sm font-medium text-foreground">
            Mark as Featured Product (Max 4 allowed)
          </label>

        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Product Images</label>
          <p className="text-xs text-gray500 mb-4">Upload up to 4 images. First image will be the main image.</p>

          <div className="grid grid-cols-4 gap-3">
            {previews.map((preview, idx) => (
              <div key={idx} className="relative">
                <label
                  className={`relative block border-2 border-dashed border-gray300 rounded-lg p-2 text-center cursor-pointer hover:border-blue transition-colors ${loading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    className="hidden"
                    onChange={(e) => handleFileChange(idx, e.target.files?.[0] ?? null)}
                  />
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-28 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          removeImage(idx)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue text-white text-xs px-2 py-1 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-28 flex flex-col items-center justify-center text-sm text-gray500">
                      <div>Image {idx + 1}</div>
                      <div className="text-xs mt-1">{idx === 0 ? "required" : "optional"}</div>
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/all-products")}
            disabled={loading}
            className="flex-1 bg-gray500 text-primaryWhite p-3 rounded-full font-semibold disabled:opacity-50 hover:bg-gray600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-Orange text-primaryWhite p-3 rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="text-primaryWhite" />
                Updating Product...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
