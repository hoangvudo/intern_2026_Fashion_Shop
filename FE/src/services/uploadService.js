import axios from '../utils/axios'

const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data // { url, fileName }
  },

  uploadImages: async (files) => {
    return Promise.all(Array.from(files).map((file) => uploadService.uploadImage(file)))
  },
}

export default uploadService
