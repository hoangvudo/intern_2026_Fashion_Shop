import api from "./api";

const contactService = {
  // Public
  submitContact: async (data) => {
    const response = await api.post("/contacts", data);
    return response.data;
  },

  // Admin
  getAdminContacts: async (params) => {
    const response = await api.get("/contacts/admin", { params });
    return response.data;
  },

  getContactDetail: async (id) => {
    const response = await api.get(`/contacts/admin/${id}`);
    return response.data;
  },

  updateContactStatus: async (id, data) => {
    const response = await api.patch(`/contacts/admin/${id}`, data);
    return response.data;
  },

  replyContact: async (id, data) => {
    const response = await api.post(`/contacts/admin/${id}/reply`, data);
    return response.data;
  },

  deleteContact: async (id) => {
    await api.delete(`/contacts/admin/${id}`);
  },

  getUnreadCount: async () => {
    const response = await api.get("/contacts/admin/unread-count");
    return response.data;
  },
};

export default contactService;
