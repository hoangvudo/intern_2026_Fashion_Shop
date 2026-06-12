import axios from '../utils/axios'

const API = '/brands'

const brandService = {
  getAll: async () => {
    const res = await axios.get(`${API}/all`)
    return res.data
  },

  getActive: async () => {
    const res = await axios.get(API)
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

export default brandService