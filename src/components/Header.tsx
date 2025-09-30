"use client"

import React, { useEffect, useState, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/cartStore"
import { useProducts } from "@/contexts"
import { useRouter } from "next/navigation"
import UserMenu from "./UserMenu"

// Lazy load ThemeToggle
const ThemeToggle = React.lazy(() => import("./ThemeToggle"))
const Header = memo(() => {
  const [screenWidth, setScreenWidth] = useState<number>(0)
  const { searchProducts, setFilteredProducts } = useProducts()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 🔥 search input state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const totalItems = useCartStore((state) => state.getTotalItems())


  useEffect(() => {
    // Initial width set
    setScreenWidth(window.innerWidth)

    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        const results = searchProducts(searchTerm)
        setSearchResults(results.slice(0, 5)) // Show max 5 results in dropdown
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, searchProducts])

  const handleSearchResultClick = (productId: string) => {
    setSearchTerm("")
    setShowSearchResults(false)
    router.push(`/blog/${productId}`)
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchTerm.trim()) {
      const results = searchProducts(searchTerm)
      setFilteredProducts(results)
      setSearchTerm("")
      setShowSearchResults(false)
      router.push("/blog")
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    } else if (e.key === "Escape") {
      setSearchTerm("")
      setShowSearchResults(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false)
    }

    if (showSearchResults) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showSearchResults])

  const navLinks = [
    { href: "/blog", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact-us", label: "Contact" },
    { href: "/services", label: "Services" },
  ]

  return (
    <header>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 min-h-[80px]">
          {/* LOGO */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/mainlogo.svg"
              alt="Auroxa logo"
              width={200}
              height={60}
              priority
              className="h-10 sm:h-12 md:h-14 w-auto min-w-[100px] object-contain select-none pointer-events-none"
            />
          </Link>

          {/* DESKTOP NAVIGATION (≥769px) */}
          {screenWidth >= 769 && (
            <>
              <nav className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground hover:text-Orange transition-colors font-medium relative group whitespace-nowrap"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-Orange transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              <div
                className="hidden md:flex items-center gap-3 z-[29] glass rounded-full px-4 py-2 flex-grow min-w-[200px] max-w-[400px] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="w-5 h-5 text-gray500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder-gray500"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setShowSearchResults(false)
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray500 hover:bg-gray300 rounded-full h-10 w-10 font-bold text-lg"
                  >
                    <X className="ml-2" />
                  </button>
                )}

                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-gray300 rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSearchResultClick(product._id)}
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
                        onClick={handleSearchSubmit}
                        className="p-3 text-center text-blue-600 hover:bg-lightGray cursor-pointer font-medium border-t border-gray200"
                      >
                        View all results for "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 min-w-[160px] justify-end">
                <React.Suspense fallback={<div className="w-6 h-6" />}>
                  <ThemeToggle />
                </React.Suspense>
                <Link href="/cart" className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button p-3"
                  >
                    <div className="relative">
                      <ShoppingBag className="w-6 h-6 text-foreground" />
                      {mounted && totalItems > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-Orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {totalItems > 99 ? "99+" : totalItems}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </Link>
                <UserMenu />
              </div>
            </>
          )}

          {/* ACTION BUTTONS (≥426px and <769px) */}
          <div className="flex items-center gap-4">
            {screenWidth >= 426 && screenWidth < 769 && (
              <>
                <React.Suspense fallback={<div className="w-6 h-6" />}>
                  <ThemeToggle />
                </React.Suspense>
                <Link href="/cart" className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button p-3"
                  >
                    <div className="relative">
                      <ShoppingBag className="w-6 h-6 text-foreground" />
                      {mounted && totalItems > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-Orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {totalItems > 99 ? "99+" : totalItems}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </Link>
                <UserMenu />
              </>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden glass-button p-3"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (≤768px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-glass-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* ✅ MOBILE SEARCH - Replaced with component */}
              <div
                className="relative flex items-center gap-3 glass rounded-full px-4 py-3 mb-6"
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="w-5 h-5 text-gray500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder-gray500"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setShowSearchResults(false)
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray500 hover:bg-gray300 rounded-full h-10 w-10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-gray300 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          handleSearchResultClick(product._id)
                          setMobileMenuOpen(false)
                        }}
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
                        onClick={() => {
                          handleSearchSubmit()
                          setMobileMenuOpen(false)
                        }}
                        className="p-3 text-center text-blue-600 hover:bg-lightGray cursor-pointer font-medium border-t border-gray200"
                      >
                        View all results for "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* NAVIGATION */}
              <nav className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-foreground hover:text-Orange transition-colors font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* MOBILE BUTTONS (≤425px) */}
              {screenWidth <= 425 && (
                <div className="flex items-center gap-4 mt-6">
                  <React.Suspense fallback={<div className="w-6 h-6" />}>
                    <ThemeToggle />
                  </React.Suspense>

                  <Link href="/cart" className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button p-3"
                    >
                      <div className="relative">
                        <ShoppingBag className="w-6 h-6 text-foreground" />
                        {mounted && totalItems > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-Orange text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                          >
                            {totalItems > 99 ? "99+" : totalItems}
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </Link>

                  <UserMenu />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
})

Header.displayName = "Header"
export default Header