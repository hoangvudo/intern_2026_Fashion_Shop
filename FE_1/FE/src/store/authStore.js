import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      logout: async () => {
        const { refreshToken, accessToken } = get()
        // Clear state trước
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        // Gọi API logout với token đã lưu, dùng axios trực tiếp (không qua interceptor)
        if (refreshToken) {
          try {
            const { default: axios } = await import('axios')
            await axios.post('/api/auth/logout',
              { refreshToken },
              { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
            )
          } catch {
            // Bỏ qua — state đã clear, không cần xử lý
          }
        }
      },

      initializeAuth: async () => {
        const { refreshToken, isAuthenticated } = get()
        // Không có token hoặc chưa đăng nhập → bỏ qua, không clear
        if (!refreshToken || !isAuthenticated) return

        try {
          const { default: axios } = await import('axios')
          const response = await axios.post('/api/auth/refresh', { refreshToken })
          const { accessToken, refreshToken: newRefreshToken, user } = response.data
          set({ accessToken, refreshToken: newRefreshToken, user, isAuthenticated: true })
        } catch {
          // Refresh thất bại → clear state
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        }
      },

      updateAccessToken: (accessToken) => set({ accessToken }),
      updateUser: (user) => set({ user }),
      getUser: () => get().user,
      getAccessToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore