import axios from '../utils/axios'

const API = '/products'

const productService = {

  // ── PUBLIC ──────────────────────────────────────
  // Tìm kiếm tổng quát — hỗ trợ isNewArrival, isFeatured, isFlashSale, v.v.
  search: async (params = {}) => {
    const res = await axios.get(API, { params })
    return res.data
  },

  // Lấy sản phẩm mới (isNewArrival = true)
  getNewArrivals: async (size = 6) => {
    const res = await axios.get(API, { params: { isNewArrival: true, size, sortBy: 'createdAt' } })
    return res.data
  },

  // Lấy sản phẩm nổi bật (isFeatured = true)
  getFeatured: async (size = 8) => {
    const res = await axios.get(API, { params: { isFeatured: true, size, sortBy: 'popular' } })
    return res.data
  },

  // Lấy sản phẩm theo danh mục
  getByCategory: async (categoryId, size = 8) => {
    const res = await axios.get(API, { params: { categoryId, size, sortBy: 'createdAt' } })
    return res.data
  },

  // Lấy chi tiết sản phẩm theo id
  getById: async (id) => {
    const res = await axios.get(`${API}/${id}`)
    return res.data
  },

  // ── ADMIN ────────────────────────────────────────
  adminList: async (params = {}) => {
    const res = await axios.get(`${API}/admin`, { params })
    return res.data
  },

  adminSearch: async (params = {}) => {
    const res = await axios.get(`${API}/admin`, { params })
    return res.data
  },

  create: async (data) => {
    const res = await axios.post(API, data)
    return res.data
  },

  update: async (id, data) => {
    const res = await axios.put(`${API}/${id}`, data)
    return res.data
  },

  delete: async (id) => {
    const res = await axios.delete(`${API}/${id}`)
    return res.data
  },

  toggleActive: async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle-active`)
    return res.data
  },

getStats: async () => {
  const res = await axios.get('/admin/stats')
  return res.data
},

  // Dùng cho dropdown trong AdminProducts
  getCategories: async () => {
    const res = await axios.get('/categories/all')
    return res.data
  },

  getBrands: async () => {
    const res = await axios.get('/brands/all')
    return res.data
  },
}

export default productService
