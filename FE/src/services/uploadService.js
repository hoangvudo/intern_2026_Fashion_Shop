import axios from '../utils/axios'

const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': undefined, // ✅ xóa Content-Type để axios tự set multipart/form-data
      },
    })
    return res.data
  },
}

export default uploadService
