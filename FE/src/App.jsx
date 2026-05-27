import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import useAuthStore from './store/authStore'  // ← bỏ { }
import ScrollToTop from './components/ScrollToTop'

function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <ScrollToTop behavior="smooth" />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App