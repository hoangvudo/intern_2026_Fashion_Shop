import api from './api'

const articleService = {
  // ── ADMIN ──
  adminSearch: async (params = {}) => {
    const res = await api.get('/articles/admin', { params })
    return res.data
  },

  getById: async (id) => {
    const res = await api.get(`/articles/admin/${id}`)
    return res.data
  },

  create: async (data) => {
    const res = await api.post('/articles', data)
    return res.data
  },

  update: async (id, data) => {
    const res = await api.put(`/articles/${id}`, data)
    return res.data
  },

  delete: async (id) => {
    const res = await api.delete(`/articles/${id}`)
    return res.data
  },

  togglePublish: async (id) => {
    const res = await api.patch(`/articles/${id}/toggle-publish`)
    return res.data
  },

  // ── PUBLIC ──
  getPublished: async (params = {}) => {
    const res = await api.get('/articles', { params })
    return res.data
  },

  getFeatured: async () => {
    const res = await api.get('/articles/featured')
    return res.data
  },

  getRecent: async () => {
    const res = await api.get('/articles/recent')
    return res.data
  },

  getBySlug: async (slug) => {
    const res = await api.get(`/articles/slug/${slug}`)
    return res.data
  },

  incrementView: async (id) => {
    await api.post(`/articles/${id}/view`)
  },
}

export default articleService
