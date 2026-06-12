import api from "../utils/axios";

export const getAdminPaymentSettings = () =>
  api.get("/admin/settings/payment").then((r) => r.data);

export const getAdminSystemStatus = () =>
  api.get("/admin/stats").then((r) => r.data);

export const getAdminStaffSettings = (params = {}) =>
  api.get("/admin/staff", { params }).then((r) => r.data);

export const toggleStaffActive = (id) =>
  api.patch(`/admin/staff/${id}/toggle-active`).then((r) => r.data);
