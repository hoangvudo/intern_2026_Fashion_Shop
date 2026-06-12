export function getImageUrl(imagePath) {
  if (!imagePath) return ''

  if (
    /^(https?:)?\/\//.test(imagePath) ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath
  }

  let cleanPath = imagePath.replace(/^\//, '')
  if (cleanPath.startsWith('api/uploads/')) {
    return `http://localhost:8080/${cleanPath}`
  }
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.replace(/^uploads\//, '')
  }

  return `http://localhost:8080/api/uploads/${cleanPath}`
}
