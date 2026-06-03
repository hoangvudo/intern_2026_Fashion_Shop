import { create } from 'zustand'

/**
 * Parse giá từ string VN ("1.250.000đ", "399.000đ") hoặc số về integer
 * "1.250.000đ" → 1250000
 */
export const parsePrice = (price) => {
  if (typeof price === 'number') return price
  const cleaned = String(price).replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => set(state => {
    const numericPrice = parsePrice(product.price)
    const normalized = { ...product, price: numericPrice }
    const exists = state.items.find(
        i => i.id === normalized.id && i.size === normalized.size && i.color === normalized.color
      )
    if (exists) {
      return { items: state.items.map(i =>
          i.id === normalized.id && i.size === normalized.size && i.color === normalized.color
            ? { ...i, qty: i.qty + 1 }
            : i
        ) }
    }
    return { items: [...state.items, { ...normalized, qty: 1 }] }
  }),

  removeItem: (id, size, color) => set(state => ({
    items: state.items.filter(i => !(i.id === id && i.size === size && i.color === color))
  })),

  updateQty: (id, size, color, qty) => set(state => ({
    items: state.items.map(i =>
      i.id === id && i.size === size && i.color === color ? { ...i, qty } : i
    )
  })),

  clear: () => set({ items: [] }),

  getCount: () => get().items.reduce((s, i) => s + i.qty, 0),

  // parsePrice ở đây để handle item cũ trong store chưa được normalize
  getTotal: () => get().items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0),
}))

export default useCartStore