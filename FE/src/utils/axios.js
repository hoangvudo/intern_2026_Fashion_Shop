import axios from "axios";
import useAuthStore from "../store/authStore";

const instance = axios.create({
  baseURL: "/api", // ✅ relative → Vite proxy forward sang localhost:8080
  headers: {
    "Content-Type": "application/json",
  },
  // bỏ withCredentials vì dùng Bearer token rồi, không cần cookie
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        // ✅ dùng relative URL luôn
        const res = await axios.post("/api/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken, user } = res.data;
        useAuthStore
          .getState()
          .login({ user, accessToken, refreshToken: newRefreshToken });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
