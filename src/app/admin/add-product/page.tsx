"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth, useProducts } from "@/contexts"
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
  "XXXL", // Clothing
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12", // Shoes
  "One Size",
  "Free Size", // Universal
]

export default function AddProductPage() {
  const router = useRouter()
  const { user, isLoaded, isAdmin, redirectIfNotAdmin } = useAuth()
  const { createProduct, uploadImages, generateSlug } = useProducts()

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
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null])
  const [previews, setPreviews] = useState<string[]>(["", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [featuredCount, setFeaturedCount] = useState(0)

  redirectIfNotAdmin()

  useEffect(() => {
    const fetchFeaturedCount = async () => {
      const res = await fetch("/api/product?featured=true")
      const data = await res.json()
      setFeaturedCount(data.length)
    }
    fetchFeaturedCount()
  }, [])

  useEffect(() => {
    if (form.title && !form.slug) {
      setForm((p) => ({ ...p, slug: generateSlug(form.title) }))
    }
  }, [form.title, generateSlug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setForm((p) => ({ ...p, [name]: checked }))
    } else {
      setForm((p) => ({ ...p, [name]: value }))
    }
  }

  const handleFileChange = (index: number, file?: File | null) => {
    const copy = [...files]
    copy[index] = file ?? null
    setFiles(copy)

    const copyPrev = [...previews]
    if (file) {
      copyPrev[index] = URL.createObjectURL(file)
    } else {
      copyPrev[index] = ""
    }
    setPreviews(copyPrev)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const selected = files.filter(Boolean) as File[]
    if (selected.length === 0) {
      return
    }

    setLoading(true)

    const uploadResult = await uploadImages(selected)
    if (!uploadResult.success) {
      setLoading(false)
      return
    }

    const productData = {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description,
      category: form.category,
      targetAudience: form.targetAudience,
      price: Number.parseFloat(form.price),
      discountPrice: form.discountPrice ? Number.parseFloat(form.discountPrice) : null,
      stock: Number.parseInt(form.stock || "1", 10),
      isFeatured: form.isFeatured,
      colors,
      sizes,
      images: uploadResult.uploaded,
      image: uploadResult.uploaded![0],
    }

    const result = await createProduct(productData)

    if (result.success) {
      router.push("/admin/all-products")
    }

    setLoading(false)
  }

  if (!isLoaded || !user || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl border border-gray300 mx-auto bg-background p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-foreground">Add New Product</h2>

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
            onChange={(e) => handleArrayInput(e.target.value, setColors)}
            disabled={loading}
            className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
          />
          {colors.length > 0 && <p className="text-sm text-gray500 mt-1">Selected: {colors.join(", ")}</p>}
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
            onChange={(e) => handleArrayInput(e.target.value, setSizes)}
            disabled={loading}
            className="w-full bg-background text-foreground p-3 border border-gray300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue focus:border-transparent"
          />
          {sizes.length > 0 && <p className="text-sm text-gray500 mt-1">Selected: {sizes.join(", ")}</p>}
        </div>

        {/* Featured Product */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            disabled={loading || featuredCount >= 4}
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
            {files.map((f, idx) => (
              <label
                key={idx}
                className={`relative block border border-dashed border-gray300 rounded-lg p-2 text-center cursor-pointer ${loading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  disabled={loading}
                  className="hidden"
                  onChange={(e) => handleFileChange(idx, e.target.files?.[0] ?? null)}
                />
                {previews[idx] ? (
                  <img
                    src={previews[idx] || "/placeholder.svg"}
                    alt={`preview-${idx}`}
                    className="w-full h-28 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-28 flex flex-col items-center justify-center text-sm text-gray500">
                    <div>Image {idx + 1}</div>
                    <div className="text-xs mt-1">{idx === 0 ? "required" : "optional"}</div>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background p-3 rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" color="text-background" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  )
}
