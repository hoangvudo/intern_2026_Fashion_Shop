import { Routes, Route } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordExpired from "../pages/ResetPasswordExpired";
import OAuth2Callback from "../pages/OAuth2Callback";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import Story from "../pages/Story";
import Design from "../pages/Design";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import ContactPage from "../pages/Contact";
import Collection from "../pages/Collection";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminBrands from "../pages/admin/AdminBrands"; // 🆕
import AdminOrders from "../pages/admin/AdminOrders";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminContacts from "../pages/admin/AdminContacts";
import AdminReports from "../pages/admin/AdminReports";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminReturns from "../pages/admin/AdminReturns"; // 🆕
import AdminReviews from "../pages/admin/AdminReviews"; // 🆕
import AdminArticles from "../pages/admin/AdminArticles"; // 🆕 Tạp chí
import CheckoutPage from "../pages/Checkout";
import OrderSuccessPage from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";
import VNPayResult from "../pages/VNPayResult";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
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
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/vnpay/result" element={<VNPayResult />} />

        {/* Bộ sưu tập */}
        <Route path="/collections" element={<Collection />} />
        <Route path="/collections/:slug" element={<Collection />} />
        <Route path="*" element={<Home />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="returns" element={<AdminReturns />} /> {/* 🆕 */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} /> {/* 🆕 */}
        <Route path="reviews" element={<AdminReviews />} /> {/* 🆕 */}
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="articles" element={<AdminArticles />} /> {/* 🆕 Tạp chí */}
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
