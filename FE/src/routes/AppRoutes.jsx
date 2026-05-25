  import { Routes, Route } from "react-router-dom";
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
  import ContactPage from "../pages/Contact";

  

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
        <Route path="*" element={<Home />} />
      </Routes>
    );
  }

  export default AppRoutes;
