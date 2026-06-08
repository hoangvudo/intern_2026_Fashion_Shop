import axios from "../utils/axios";

const API = "/products";

const productService = {
  // ── PUBLIC ──────────────────────────────────────
  // Tìm kiếm tổng quát — hỗ trợ isNewArrival, isFeatured, isFlashSale, v.v.
  search: async (params = {}) => {
    const res = await axios.get(API, { params });
    return res.data;
  },

  getNewArrivals: async (size = 6) => {
    const res = await axios.get(API, {
      params: { isNewArrival: true, size, sortBy: "createdAt" },
    });
    return res.data;
  },

  getFeatured: async (size = 8) => {
    const res = await axios.get(API, {
      params: { isFeatured: true, size, sortBy: "popular" },
    });
    return res.data;
  },

  getByCategory: async (categoryId, size = 8) => {
    const res = await axios.get(API, {
      params: { categoryId, size, sortBy: "createdAt" },
    });
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
  },

  adminList: async (params = {}) => {
    const res = await axios.get(`${API}/admin`, { params });
    return res.data;
  },

  adminSearch: async (params = {}) => {
    const res = await axios.get(`${API}/admin`, { params });
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(API, data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API}/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${API}/${id}`);
    return res.data;
  },

  toggleActive: async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle-active`);
    return res.data;
  },

  getStats: async () => {
    const res = await axios.get('/admin/product-stats')
    return res.data
  },

  getCategories: async () => {
    const res = await axios.get("/categories/all");
    return res.data;
  },

  getBrands: async () => {
    const res = await axios.get("/brands/all");
    return res.data;
  },
};

export default productService;
