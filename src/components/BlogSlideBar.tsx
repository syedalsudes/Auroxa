"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"
import { useProducts } from "@/contexts"
import { CATEGORIES } from "@/constants/categories"
import { useSearchParams, useRouter } from "next/navigation"

const TARGET_AUDIENCES = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
]

interface BlogSlideBarProps {
  showFilter?: boolean
  setShowFilter?: (show: boolean) => void
}

export default function BlogSlideBar({ showFilter, setShowFilter }: BlogSlideBarProps) {
  const searchParams = useSearchParams()
  const router = useRouter() // ✅ add router
  const initialCategory = searchParams.get("category") || ""

  const { products, setFilteredProducts } = useProducts()
  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    audiences: [] as string[],
    priceRange: [0, 1000],
    featuredOnly: false,
    inStockOnly: false,
  })

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryFromUrl],
      }))
    }
  }, [searchParams])

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    audiences: true,
    price: true,
    features: true,
  })

  // Apply filters whenever filters or products change
  useEffect(() => {
    let filtered = [...products]

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => filters.categories.includes(product.category || ""))
    }

    // Audience filter
    if (filters.audiences.length > 0) {
      filtered = filtered.filter((product) => filters.audiences.includes(product.targetAudience || ""))
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const finalPrice =
        product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price
      return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1]
    })

    // Featured filter
    if (filters.featuredOnly) {
      filtered = filtered.filter((product) => product.isFeatured)
    }

    // In stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => (product.stock || 0) > 0)
    }

    setFilteredProducts(filtered)
  }, [filters, products, setFilteredProducts])

  // ✅ updated category change with URL push
  const handleCategoryChange = (category: string) => {
    const alreadySelected = filters.categories.includes(category)

    const updatedCategories = alreadySelected
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]

    setFilters((prev) => ({
      ...prev,
      categories: updatedCategories,
    }))

    // ✅ URL update karega
    if (updatedCategories.length === 0) {
      router.push("/blog") // reset to all products
    } else {
      router.push(`/blog?category=${encodeURIComponent(updatedCategories[0])}`)
    }
  }

  const handleAudienceChange = (audience: string) => {
    setFilters((prev) => ({
      ...prev,
      audiences: prev.audiences.includes(audience)
        ? prev.audiences.filter((a) => a !== audience)
        : [...prev.audiences, audience],
    }))
  }

  const handlePriceChange = (index: number, value: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange.map((price, i) => (i === index ? value : price)) as [number, number],
    }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      audiences: [],
      priceRange: [0, 1000],
      featuredOnly: false,
      inStockOnly: false,
    })
    router.push("/blog") // ✅ URL bhi reset ho
  }

  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowFilter?.(false)
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.audiences.length +
    (filters.featuredOnly ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  return (
    <div
      className="sidebar w-64 bg-background h-full border-r border-gray300 p-4 overflow-y-auto"
      onClick={handleSidebarClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-Orange text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <button
          onClick={handleCloseClick}
          className="xl:hidden p-1 hover:bg-gray200 rounded-full transition-colors"
          aria-label="Close filters"
        >
          <X className="w-6 h-6 translate-x-3 text-gray700" />
        </button>
      </div>

      {/* ✅ Clear All → Title ke thik niche */}
      {activeFiltersCount > 0 && (
        <div className="mb-4">
          <button
            onClick={clearAllFilters}
            className="text-xs text-Orange hover:text-Orange underline"
          >
            Clear All
          </button>
        </div>
      )}


      <div className="space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="font-medium text-foreground">Categories</h3>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4 text-gray500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray500" />
            )}
          </button>
          {expandedSections.categories && (
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleCheckboxClick}
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    className="w-4 h-4 text-Orange bg-background border-gray300 rounded focus:ring-Orange"
                  />
                  <span className="text-sm text-foreground">{category.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <button
            onClick={() => toggleSection("audiences")}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="font-medium text-foreground">For</h3>
            {expandedSections.audiences ? (
              <ChevronUp className="w-4 h-4 text-gray500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray500" />
            )}
          </button>
          {expandedSections.audiences && (
            <div className="space-y-2">
              {TARGET_AUDIENCES.map((audience) => (
                <label
                  key={audience.value}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleCheckboxClick}
                >
                  <input
                    type="checkbox"
                    checked={filters.audiences.includes(audience.value)}
                    onChange={() => handleAudienceChange(audience.value)}
                    className="w-4 h-4 text-Orange bg-background border-gray300 rounded focus:ring-Orange"
                  />
                  <span className="text-sm text-foreground">{audience.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="font-medium text-foreground">Price Range</h3>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-3" onClick={handleCheckboxClick}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-20 p-2 text-sm border border-gray300 rounded bg-background text-foreground"
                  placeholder="Min"
                />
                <span className="text-gray500">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-20 p-2 text-sm border border-gray300 rounded bg-background text-foreground"
                  placeholder="Max"
                />
              </div>
              <div className="text-xs text-gray500">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <button
            onClick={() => toggleSection("features")}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="font-medium text-foreground">Features</h3>
            {expandedSections.features ? (
              <ChevronUp className="w-4 h-4 text-gray500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray500" />
            )}
          </button>
          {expandedSections.features && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer" onClick={handleCheckboxClick}>
                <input
                  type="checkbox"
                  checked={filters.featuredOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, featuredOnly: e.target.checked }))}
                  className="w-4 h-4 text-Orange bg-background border-gray300 rounded focus:ring-Orange"
                />
                <span className="text-sm text-foreground">Featured Products</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer" onClick={handleCheckboxClick}>
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                  className="w-4 h-4 text-Orange bg-background border-gray300 rounded focus:ring-Orange"
                />
                <span className="text-sm text-foreground">In Stock Only</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
