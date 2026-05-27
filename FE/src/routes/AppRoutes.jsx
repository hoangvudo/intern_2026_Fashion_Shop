import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import VerifyEmail from '../pages/VerifyEmail'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import ResetPasswordExpired from '../pages/ResetPasswordExpired'
import OAuth2Callback from '../pages/OAuth2Callback'
import Cart from '../pages/Cart'
import ProductDetail from '../pages/ProductDetail'
import Story from '../pages/Story'
import Design from '../pages/Design'
import ContactPage from '../pages/Contact'
import AdminLayout from '../components/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminPlaceholder from '../pages/admin/AdminPlaceholder'
import AdminRoute from './AdminRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/reset-password-expired"
        element={<ResetPasswordExpired />}
      />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/design" element={<Design />} />
      <Route path="/story" element={<Story />} />
      <Route path="/stories" element={<Story />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route
          path="orders"
          element={
            <AdminPlaceholder
              title="Quản lý đơn hàng"
              description="Trang quản lý đơn hàng đang được phát triển."
            />
          }
        />
        <Route
          path="products"
          element={
            <AdminPlaceholder
              title="Quản lý sản phẩm"
              description="Trang quản lý sản phẩm đang được phát triển."
            />
          }
        />
        <Route
          path="customers"
          element={
            <AdminPlaceholder
              title="Quản lý khách hàng"
              description="Trang quản lý khách hàng đang được phát triển."
            />
          }
        />
        <Route
          path="reports"
          element={
            <AdminPlaceholder
              title="Báo cáo"
              description="Trang báo cáo đang được phát triển."
            />
          }
        />
        <Route
          path="settings"
          element={
            <AdminPlaceholder
              title="Cài đặt"
              description="Trang cài đặt đang được phát triển."
            />
          }
        />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes
