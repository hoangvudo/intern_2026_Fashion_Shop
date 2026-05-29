import { useState, useEffect, useCallback } from 'react'
import categoryService from '../services/categoryService'
import toast from 'react-hot-toast'

// Hook cho admin — lấy TẤT CẢ danh mục (cả ẩn)
export function useAdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      // ✅ SỬA: gọi đúng tên method adminList()
      const data = await categoryService.adminList()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('useAdminCategories error:', err)
      toast.error('Không tải được danh mục')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, refresh: fetchCategories }
}

// Hook public — chỉ lấy danh mục đang active (cho menu, filter...)
export function usePublicCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const data = await categoryService.getAll()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('usePublicCategories error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, refresh: fetchCategories }
}