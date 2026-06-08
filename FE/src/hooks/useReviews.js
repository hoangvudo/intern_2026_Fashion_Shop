import { useState, useEffect, useCallback } from 'react'
import reviewService from '../services/reviewService'
import toast from 'react-hot-toast'

export function useReviews(productId) {
  const [reviews, setReviews]     = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [params, setParams]       = useState({
    page: 0, size: 10, sortBy: 'newest'
  })

  const fetchReviews = useCallback(async (p) => {
    if (!productId) return
    setLoading(true)
    try {
      const data = await reviewService.getByProduct(productId, p)
      setReviews(data.content ?? [])
      setTotal(data.totalElements ?? 0)
      setTotalPages(data.totalPages ?? 0)
    } catch (err) {
      console.error('useReviews fetch error:', err)
      toast.error('Không tải được đánh giá')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews(params)
  }, [params, fetchReviews])

  const updateParam = (key, value) =>
    setParams(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 0,
    }))

  const submitReview = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await reviewService.create(productId, formData)
      toast.success('Đánh giá của bạn đã được gửi!')
      fetchReviews(params)
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Gửi đánh giá thất bại'
      toast.error(msg)
      return false
    } finally {
      setSubmitting(false)
    }
  }, [productId, params, fetchReviews])

  const deleteReview = useCallback(async (reviewId) => {
    try {
      await reviewService.delete(reviewId)
      toast.success('Đã xoá đánh giá')
      fetchReviews(params)
    } catch {
      toast.error('Xoá thất bại')
    }
  }, [params, fetchReviews])

  return {
    reviews, total, totalPages, loading, submitting,
    params, updateParam,
    submitReview, deleteReview,
    refresh: () => fetchReviews(params),
  }
}
