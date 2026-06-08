import axios from "../utils/axios";

const REVIEWS = (productId) => `/products/${productId}/reviews`;

const reviewService = {
  getByProduct: async (productId, params = {}) => {
    const res = await axios.get(REVIEWS(productId), { params });
    return res.data;
  },
  create: async (productId, data) => {
    const res = await axios.post(REVIEWS(productId), data);
    return res.data;
  },
  update: async (reviewId, data) => {
    const res = await axios.put(`/reviews/${reviewId}`, data);
    return res.data;
  },
  delete: async (reviewId) => {
    await axios.delete(`/reviews/${reviewId}`);
  },
  getMyReviews: async (params = {}) => {
    const res = await axios.get("/reviews/me", { params });
    return res.data;
  },
  adminGetByProduct: async (productId, params = {}) => {
    const res = await axios.get(`/admin/products/${productId}/reviews`, {
      params,
    });
    return res.data;
  },
  adminToggleVisible: async (reviewId) => {
    const res = await axios.patch(`/admin/reviews/${reviewId}/toggle-visible`);
    return res.data;
  },
  adminDelete: async (reviewId) => {
    await axios.delete(`/admin/reviews/${reviewId}`);
  },
};

export default reviewService;
