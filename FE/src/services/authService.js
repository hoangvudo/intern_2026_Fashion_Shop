import api from "./api";

const authService = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw authService.extractError(error, "Đăng nhập thất bại");
    }
  },

  // Helper to extract error message safely
  extractError: (error, defaultMsg) => {
    let errorMessage = defaultMsg;
    const data = error.response?.data;
    if (data) {
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = typeof data.message === "string" ? data.message : JSON.stringify(data.message);
      } else if (data.error && typeof data.error === "string") {
        errorMessage = data.error;
      } else {
        const values = Object.values(data);
        if (values.length > 0 && typeof values[0] === "string") {
          errorMessage = values.join(", ");
        } else {
          errorMessage = JSON.stringify(data);
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    };
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log("Calling register API with:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("Register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      console.error("Error response:", error.response);
      throw authService.extractError(error, "Đăng ký thất bại");
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw {
        message:
          error.response?.data?.message ||
          "Gửi liên kết đặt lại mật khẩu thất bại",
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  },

  // Validate reset token
  validateResetToken: async (token) => {
    try {
      const response = await api.get("/auth/reset-password/validate", {
        params: { token },
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Token không hợp lệ",
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Làm mới token thất bại",
        status: error.response?.status,
      };
    }
  },

  // Logout
  logout: async (refreshToken) => {
    try {
      await api.post("/auth/logout", {
        refreshToken,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Check email exists
  checkEmail: async (email) => {
    try {
      const response = await api.get("/auth/check-email", {
        params: { email },
      });
      // Backend returns { exists: true/false }
      // Frontend needs { available: true/false }
      return { available: !response.data.exists };
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Kiểm tra email thất bại",
        status: error.response?.status,
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Không lấy được thông tin user",
        status: error.response?.status,
      };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get("/auth/verify", {
        params: { token },
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Xác thực email thất bại",
        status: error.response?.status,
      };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put("/auth/profile", data);
      return response.data;
    } catch (error) {
      throw authService.extractError(error, "Cập nhật thông tin thất bại");
    }
  },

  changePassword: async (data) => {
    try {
      const response = await api.put("/auth/change-password", data);
      return response.data;
    } catch (error) {
      throw authService.extractError(error, "Thay đổi mật khẩu thất bại");
    }
  },
};

export default authService;
