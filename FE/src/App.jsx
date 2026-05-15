import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import TopNav from './components/TopNav'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-background">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <TopNav />
        <div className="flex-1">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
