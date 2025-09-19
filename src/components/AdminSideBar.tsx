"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, Package, ShoppingCart, Bell } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

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
    <aside className="bg-background sticky top-0 h-screen">
      {/* 🔥 STICKY SIDEBAR */}
      <div className="w-64 bg-background text-foreground shadow-lg flex flex-col mt-6 ml-2 rounded-lg border border-gray300 h-[calc(100vh-2rem)]">
        <div className="p-4 border-b border-gray300">
          <h1 className="text-2xl font-bold text-center tracking-wide text-foreground">Admin Panel</h1>
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-foreground
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
  )
}
