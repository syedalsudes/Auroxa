"use client"

import React, { useEffect, useState, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/cartStore"
import { useProducts } from "@/contexts"
import { useRouter } from "next/navigation"
import UserMenu from "./UserMenu"
import SearchBar from "./SearchBar"

// Lazy load ThemeToggle
const ThemeToggle = React.lazy(() => import("./ThemeToggle"))

const Header = memo(() => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { searchProducts, setFilteredProducts } = useProducts()

  // Screen breakpoints
  const [screenWidth, setScreenWidth] = useState<number>(0)
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle global search submit (redirect to /blog with filtered results)
  // ✅ Sahi
  const handleSearchSubmit = (term: string) => {
    const results = searchProducts(term) // ✅ `searchProducts` already destructured above
    setFilteredProducts(results)
    router.push("/blog")
  }

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

              {/* Adjust SearchBar width based on screen */}
              <SearchBar
                onSearchSubmit={handleSearchSubmit}
                className={screenWidth >= 1024 ? "w-[350px]" : "w-[250px]"}
                placeholder="Search products..."
              />

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
              <SearchBar
                onSearchSubmit={handleSearchSubmit}
                className="mb-6"
                placeholder="Search products..."
              />

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