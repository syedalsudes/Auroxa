export interface CartItem {
  variantId: string
  _id: string
  title: string
  price: number
  image: string
  stock: number
  color?: string | null
  size?: string | null
  quantity: number
}

export interface CartStore {
  items: CartItem[]
  addItem: (product: Omit<CartItem, "quantity" | "variantId"> & { color?: string | null; size?: string | null }) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
