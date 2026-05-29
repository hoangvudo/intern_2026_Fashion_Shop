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

  const fetchProducts = useCallback(async (f = filters) => {
    setLoading(true)
    try {
      const params = Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
      const data = await productService.adminList(params)
      setProducts(data.content)
      setTotal(data.totalElements)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Không tải được danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 0 }))

  const refresh = () => fetchProducts(filters)

  return { products, total, totalPages, loading, filters, updateFilter, refresh }
}
