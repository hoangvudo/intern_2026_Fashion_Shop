import axios from '../utils/axios'

const API = '/categories'

const categoryService = {

  // Public — chỉ lấy danh mục đang active
  getAll: async () => {
    const res = await axios.get(API)
    return res.data
  },

  // ✅ SỬA: đổi tên thành adminList() để khớp với useCategories.js
  adminList: async () => {
    const res = await axios.get(`${API}/all`)
    return res.data
  },

  // Giữ tên cũ để backward compat
  getAllAdmin: async () => {
    const res = await axios.get(`${API}/all`)
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
}

export default categoryService