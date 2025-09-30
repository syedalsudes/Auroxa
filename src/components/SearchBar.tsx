"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProducts } from "@/contexts"
import { createPortal } from "react-dom"

interface SearchBarProps {
  onSearchSubmit?: (term: string) => void
  className?: string
  placeholder?: string
}

const SearchBar = ({ onSearchSubmit, className = "", placeholder = "Search products..." }: SearchBarProps) => {
  const { searchProducts, setFilteredProducts } = useProducts()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        const results = searchProducts(searchTerm)
        setSearchResults(results.slice(0, 5))
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, searchProducts])

  const handleResultClick = (productId: string) => {
    setSearchTerm("")
    setShowResults(false)
    router.push(`/blog/${productId}`)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchTerm.trim()) {
      const results = searchProducts(searchTerm)
      setFilteredProducts(results)
      if (onSearchSubmit) {
        onSearchSubmit(searchTerm)
      } else {
        router.push("/blog")
      }
      setSearchTerm("")
      setShowResults(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Escape") {
      setSearchTerm("")
      setShowResults(false)
    }
  }

  // Close results on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showResults])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-3 glass rounded-full px-4 py-2 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Search className="w-5 h-5 text-gray500 flex-shrink-0" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none text-foreground placeholder-gray500"
      />

      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("")
            setShowResults(false)
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray500 hover:bg-gray300 rounded-full h-10 w-10 flex items-center justify-center"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 &&
        createPortal(
          <div className="fixed top-[70px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[350px] bg-background border border-gray300 rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-auto">
            {searchResults.map((product) => (
              <div
                key={product._id}
                onClick={() => handleResultClick(product._id)}
                className="flex items-center gap-3 p-3 hover:bg-lightGray cursor-pointer border-b border-gray200 last:border-b-0"
              >
                <img
                  src={product.images?.[0] || "/placeholder.svg?height=40&width=40"}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{product.title}</p>
                  <p className="text-xs text-gray500">{product.category}</p>
                </div>
                <p className="font-semibold text-Orange text-sm">${product.price}</p>
              </div>
            ))}

            {searchTerm && (
              <div
                onClick={handleSubmit}
                className="p-3 text-center text-blue-600 hover:bg-lightGray cursor-pointer font-medium border-t border-gray200"
              >
                View all results for "{searchTerm}"
              </div>
            )}
          </div>,
          document.body
        )
      }

    </div>
  )
}

export default SearchBar