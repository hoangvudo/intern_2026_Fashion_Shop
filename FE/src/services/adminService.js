import api from './api'

// ── Orders ──────────────────────────────────────────────────
export const getAdminOrders = (params = {}) =>
  api.get('/admin/orders', { params }).then(r => r.data)

export const getAdminOrderDetail = (id) =>
  api.get(`/admin/orders/${id}`).then(r => r.data)

export const updateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status }).then(r => r.data)

// ── Customers ────────────────────────────────────────────────
export const getAdminCustomers = (params = {}) =>
  api.get('/admin/customers', { params }).then(r => r.data)

export const getVipStats = () =>
  api.get('/admin/customers/vip-stats').then(r => r.data)

export const getAdminCustomerDetail = (id) =>
  api.get(`/admin/customers/${id}`).then(r => r.data)

export const toggleCustomerActive = (id) =>
  api.patch(`/admin/customers/${id}/toggle-active`).then(r => r.data)

export const createAdminCustomer = (data) =>
  api.post('/admin/customers', data).then(r => r.data)

// ── Dashboard ────────────────────────────────────────────────
export const getAdminStats = () =>
  api.get('/admin/stats').then(r => r.data)

export const getAdminRevenue = (period = 'month') =>
  api.get('/admin/revenue', { params: { period } }).then(r => r.data)