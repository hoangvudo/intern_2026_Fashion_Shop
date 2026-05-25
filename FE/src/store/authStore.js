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

      logout: () => {
        const refreshToken = get().refreshToken
        if (refreshToken) {
          import('../services/authService').then(module => {
            module.default.logout(refreshToken).catch(console.error)
          })
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      // ✅ Thêm hàm này: dùng refreshToken để lấy accessToken mới
      initializeAuth: async () => {
        const { refreshToken, isAuthenticated } = get()
        if (!refreshToken || !isAuthenticated) return

        try {
          const { default: authService } = await import('../services/authService')
          const response = await authService.refreshToken(refreshToken)
           set({ 
             accessToken: response.accessToken,
             user: response.user 
           })
        } catch {
          // refreshToken hết hạn → logout
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