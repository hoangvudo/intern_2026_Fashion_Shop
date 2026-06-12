import { useState, useEffect, useCallback } from 'react'
import productService from '../services/productService'
import toast from 'react-hot-toast'

export function useAdminProducts() {
  const [products, setProducts]     = useState([])
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading]       = useState(false)
  const [filters, setFilters]       = useState({
    keyword: '', categoryId: '', brandId: '',
    isActive: '', sortBy: 'newest', page: 0, size: 10,
  })

  const fetchProducts = useCallback(async (f) => {
    setLoading(true)
    try {
      // Lọc bỏ các param rỗng trước khi gửi lên BE
      const params = Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
      // ✅ SỬA: gọi đúng tên method adminList()
      const data = await productService.adminList(params)
      setProducts(data.content ?? [])
      setTotal(data.totalElements ?? 0)
      setTotalPages(data.totalPages ?? 0)
    } catch (err) {
      console.error('useAdminProducts error:', err)
      toast.error('Không tải được danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ SỬA: truyền filters vào fetchProducts, tránh stale closure
  useEffect(() => {
    fetchProducts(filters)
  }, [filters])  // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = (key, value) =>
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset về trang 0 khi đổi filter (trừ khi đang chuyển trang)
      page: key === 'page' ? value : 0,
    }))

  const refresh = useCallback(() => {
    fetchProducts(filters)
  }, [filters, fetchProducts])

  return { products, total, totalPages, loading, filters, updateFilter, refresh }
}

// Hook public search (cho trang chủ, danh mục...)
export function usePublicProducts(initialParams = {}) {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const fetchProducts = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const data = await productService.search(params)
      setProducts(data.content ?? data ?? [])
      setTotalPages(data.totalPages ?? 0)
      setTotalElements(data.totalElements ?? (data.content?.length ?? data?.length ?? 0))
    } catch (err) {
      console.error('usePublicProducts error:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(initialParams)
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return { products, totalPages, totalElements, loading, error, refetch: fetchProducts }
}