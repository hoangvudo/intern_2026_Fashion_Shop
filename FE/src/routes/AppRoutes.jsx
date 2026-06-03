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
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminCategories from '../pages/admin/AdminCategories'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminCustomers from '../pages/admin/AdminCustomers'
import AdminReports from '../pages/admin/AdminReports'
import AdminSettings from '../pages/admin/AdminSettings'
import CheckoutPage from '../pages/Checkout'
import OrderSuccessPage from '../pages/OrderSuccess'
import MyOrders from '../pages/MyOrders'
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
      <Route path="/reset-password-expired" element={<ResetPasswordExpired />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/design" element={<Design />} />
      <Route path="/story" element={<Story />} />
      <Route path="/stories" element={<Story />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />

      <Route path="/my-orders" element={<MyOrders />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes