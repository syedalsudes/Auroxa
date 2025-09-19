import type React from "react"
import AdminSidebar from "@/components/AdminSideBar"
import { ProductsProvider, OrdersProvider } from "@/contexts"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductsProvider>
      <OrdersProvider>
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <main className="flex-1 p-6 overflow-y-auto bg-background">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </OrdersProvider>
    </ProductsProvider>
  )
}
