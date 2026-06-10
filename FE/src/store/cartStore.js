import { create } from 'zustand'

export const parsePrice = (price) => {
  if (typeof price === 'number') return price
  const cleaned = String(price).replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => set(state => {
    const numericPrice = parsePrice(product.price)
    const stock = product.stock ?? 9999
    const normalized = { ...product, price: numericPrice, stock }

    const exists = state.items.find(
      i => i.id === normalized.id && i.size === normalized.size && i.color === normalized.color
    )
    if (exists) {
      const newQty = exists.qty + (normalized.qty || 1)
      // Giới hạn theo stock
      const cappedQty = Math.min(newQty, stock)
      return {
        items: state.items.map(i =>
          i.id === normalized.id && i.size === normalized.size && i.color === normalized.color
            ? { ...i, qty: cappedQty, stock }
            : i
        )
      }
    }
    return { items: [...state.items, { ...normalized, qty: normalized.qty || 1 }] }
  }),

  removeItem: (id, size, color) => set(state => ({
    items: state.items.filter(i => !(i.id === id && i.size === size && i.color === color))
  })),

  updateQty: (id, size, color, qty) => set(state => ({
    items: state.items.map(i => {
      if (!(i.id === id && i.size === size && i.color === color)) return i
      const maxQty = i.stock ?? 9999
      return { ...i, qty: Math.min(Math.max(1, qty), maxQty) }
    })
  })),

  // Sync stock từ server sau khi fetch lại product
  updateStock: (id, size, color, stock) => set(state => ({
    items: state.items.map(i =>
      i.id === id && i.size === size && i.color === color
        ? { ...i, stock, qty: Math.min(i.qty, stock) }
        : i
    )
  })),

  clear: () => set({ items: [] }),
  getCount: () => get().items.reduce((s, i) => s + i.qty, 0),
  getTotal: () => get().items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0),
}))

export default useCartStore