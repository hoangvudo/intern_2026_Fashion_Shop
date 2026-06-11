import api from './api';

const brandService = {
  // Public
  getActiveBrands: async () => {
    const res = await api.get('/brands');
    return res.data;
  },

  getBrandBySlug: async (slug) => {
    const res = await api.get(`/brands/slug/${slug}`);
    return res.data;
  },

  getBrandById: async (id) => {
    const res = await api.get(`/brands/${id}`);
    return res.data;
  },

  // Admin
  getAllBrands: async () => {
    const res = await api.get('/brands/all');
    return res.data;
  },

  createBrand: async (data) => {
    const res = await api.post('/brands', data);
    return res.data;
  },

  updateBrand: async (id, data) => {
    const res = await api.put(`/brands/${id}`, data);
    return res.data;
  },

  toggleActive: async (id) => {
    const res = await api.patch(`/brands/${id}/toggle-active`);
    return res.data;
  },

  deleteBrand: async (id) => {
    const res = await api.delete(`/brands/${id}`);
    return res.data;
  }
};

export default brandService;