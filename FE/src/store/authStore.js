import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Login action
      login: ({ user, accessToken, refreshToken }) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true
        })
      },

      // Logout action
      logout: () => {
        // Call logout API with refresh token before clearing state
        const refreshToken = get().refreshToken
        if (refreshToken) {
          // Fire and forget - don't wait for response
          import('../services/authService').then(module => {
            module.default.logout(refreshToken).catch(console.error)
          })
        }
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        })
      },

      // Update access token (for refresh token flow)
      updateAccessToken: (accessToken) => {
        set({ accessToken })
      },

      // Update user info
      updateUser: (user) => {
        set({ user })
      },

      // Get current user
      getUser: () => get().user,

      // Get access token
      getAccessToken: () => get().accessToken,

      // Get refresh token
      getRefreshToken: () => get().refreshToken
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
        // accessToken is NOT persisted for security (stored in memory only)
      })
    }
  )
)

export default useAuthStore
