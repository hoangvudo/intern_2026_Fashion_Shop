import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <ScrollToTop behavior="smooth" />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App