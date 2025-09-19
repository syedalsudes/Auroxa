import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartStore } from "@/types"

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const variantId = `${product._id}-${product.color || "default"}-${product.size || "default"}`
        const items = get().items
        const existingItem = items.find((item) => item.variantId === variantId)

        if (existingItem) {
          if (existingItem.quantity < product.stock) {
            set({
              items: items.map((item) =>
                item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            })
          }
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                variantId,
                quantity: 1,
              },
            ],
          })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity: Math.min(quantity, item.stock) } : item,
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
