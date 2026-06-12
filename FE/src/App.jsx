import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{ duration: 1500 }} 
      />
      <ScrollToTop behavior="smooth" />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App