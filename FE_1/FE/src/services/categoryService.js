import axios from '../utils/axios'

const API = '/categories'

const categoryService = {

  // ── PUBLIC: chỉ lấy danh mục active (cho user) ──
  getAll: async () => {
    const res = await axios.get(API)
    return res.data
  },

  // ── ADMIN: lấy tất cả kể cả ẩn ──
  adminList: async () => {
    const res = await axios.get(`${API}/all`)
    return res.data
  },

  // ── ADMIN: tạo mới ──
  create: async (data) => {
    const res = await axios.post(API, data)
    return res.data
  },

  // ── ADMIN: cập nhật ──
  update: async (id, data) => {
    const res = await axios.put(`${API}/${id}`, data)
    return res.data
  },

  // ── ADMIN: toggle active (dùng PATCH endpoint mới) ──
  toggleActive: async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle`)
    return res.data
  },

  // ── ADMIN: xoá ──
  delete: async (id) => {
    const res = await axios.delete(`${API}/${id}`)
    return res.data
  },
}

export default categoryService