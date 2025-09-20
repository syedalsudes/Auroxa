"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, Package, ShoppingCart, Bell, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const fetchUnreadCount = async () => {
    const res = await fetch("/api/contact")
    const data = await res.json()
    const count = data.filter((msg: any) => msg.status === "unread").length
    setUnreadCount(count)
  }

  useEffect(() => {
    fetchUnreadCount()

    const handleUpdate = () => fetchUnreadCount()
    window.addEventListener("updateUnreadCount", handleUpdate)

    return () => {
      window.removeEventListener("updateUnreadCount", handleUpdate)
    }
  }, [])

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/add-product", label: "Add Product", icon: <PlusCircle size={18} /> },
    { href: "/admin/all-products", label: "All Products", icon: <Package size={18} /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    {
      href: "/admin/notifications",
      label: "Notifications",
      icon: (
        <div className="mt-[2px] flex relative">
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute bg-red-500 text-primaryWhite text-xs -top-2 left-3 font-bold px-1.5 py-0.5 rounded-full shadow">
              {unreadCount}
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed left-4 z-50 p-2 bg-background border border-gray300 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside
        className={`
        bg-background sticky top-0 h-screen transition-transform duration-300 z-40
        lg:translate-x-0 lg:relative lg:z-auto
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        fixed lg:static w-80 lg:w-64
      `}
      >
        {/* 🔥 RESPONSIVE SIDEBAR */}
        <div className="w-full bg-background text-foreground shadow-lg flex flex-col mt-6 ml-2 mr-2 lg:mr-0 rounded-lg border border-gray300 h-[calc(100vh-2rem)]">
          <div className="p-4 border-b border-gray300">
            <h1 className="text-xl lg:text-2xl font-bold text-center tracking-wide text-foreground">Admin Panel</h1>
          </div>

          <nav className="flex flex-col p-4 space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 lg:py-2 rounded-lg transition-all text-foreground text-base lg:text-sm
                                    ${
                                      isActive
                                        ? "bg-lightGray shadow-lg border border-gray300"
                                        : "hover:bg-lightGray hover:pl-5"
                                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray300 text-center text-xs text-gray400">
            © {new Date().getFullYear()} Admin Panel
          </div>
        </div>
      </aside>
    </>
  )
}
