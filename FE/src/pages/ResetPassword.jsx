import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import authService from "../services/authService";
import { resetPasswordSchema } from "../schemas/passwordResetSchema";
import { calculatePasswordStrength } from "../utils/passwordStrength";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("loading");
  const [passwordStrength, setPasswordStrength] = useState({
    label: "",
    percentage: 0,
  });

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const watchedPassword = watch("newPassword", "");

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchedPassword));
  }, [watchedPassword]);

  useEffect(() => {
    if (!token) {
      navigate("/reset-password-expired", { replace: true });
      return;
    }

    const validateToken = async () => {
      try {
        await authService.validateResetToken(token);
        setTokenStatus("valid");
      } catch (error) {
        navigate("/reset-password-expired", { replace: true });
      }
    };

    validateToken();
  }, [navigate, token]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Token đặt lại mật khẩu không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(
        token,
        data.newPassword,
        data.confirmPassword,
      );
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      navigate("/login");
    } catch (error) {
      if (error.status === 410 || error.status === 404) {
        navigate("/reset-password-expired", { replace: true });
      } else {
        toast.error(error.message || "Đặt lại mật khẩu thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenStatus !== "valid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1F3FF] px-6 py-20">
        <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-xl border border-[#C3C6D6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-16 text-center">
          <p className="text-[#434654]">Đang kiểm tra liên kết...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1F3FF] px-6 py-20">
      <div className="flex w-full max-w-[480px] flex-col gap-16 rounded-xl border border-[#C3C6D6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-16">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-[#041B3C] font-manrope text-[28px] font-semibold leading-9">
            Đặt lại mật khẩu mới
          </h1>
          <p className="text-[#434654] font-hankenGrotesk text-base leading-6">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[#041B3C] font-hankenGrotesk text-sm font-semibold leading-5">
              Mật khẩu mới
            </label>
            <div className="relative w-full">
              <input
                {...register("newPassword")}
                type="password"
                placeholder="Nhập ít nhất 8 ký tự"
                className={`w-full h-12 rounded-lg border px-6 text-sm text-[#041B3C] outline-none transition ${
                  errors.newPassword ? "border-[#ba1a1a]" : "border-[#C3C6D6]"
                } bg-[#F1F3FF]`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737685]">
                <svg
                  width="22"
                  height="15"
                  viewBox="0 0 22 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z"
                    fill="#737685"
                  />
                </svg>
              </div>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-[#ba1a1a]">
                {errors.newPassword.message}
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center">
                <p className="text-[#434654] font-hankenGrotesk text-sm leading-5">
                  Độ mạnh mật khẩu
                </p>
                <p className="text-[#851800] font-hankenGrotesk text-sm font-semibold leading-5">
                  {passwordStrength.label || "Chưa đánh giá"}
                </p>
              </div>
              <div className="flex items-start gap-0.5 rounded-full bg-[#E1E2E4] w-full h-1.5 overflow-hidden">
                <div
                  className={`rounded-full h-full ${passwordStrength.percentage >= 33 ? "bg-[#851800] w-full" : "w-0"}`}
                />
                <div
                  className={`rounded-full h-full ${passwordStrength.percentage >= 66 ? "bg-[#851800] w-full" : "w-0"}`}
                />
                <div
                  className={`rounded-full h-full ${passwordStrength.percentage >= 100 ? "bg-[#E1E2E4] w-full" : "w-0"}`}
                />
              </div>
              <p className="text-[#434654] font-hankenGrotesk text-sm leading-5">
                Gợi ý: Sử dụng kết hợp chữ hoa, chữ thường và ký hiệu.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-[#041B3C] font-hankenGrotesk text-sm font-semibold leading-5">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative w-full">
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className={`w-full h-12 rounded-lg border px-6 text-sm text-[#041B3C] outline-none transition ${
                  errors.confirmPassword
                    ? "border-[#ba1a1a]"
                    : "border-[#C3C6D6]"
                } bg-[#F1F3FF]`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737685]">
                <svg
                  width="22"
                  height="15"
                  viewBox="0 0 22 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z"
                    fill="#737685"
                  />
                </svg>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-[#ba1a1a]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 items-center justify-center rounded-lg bg-[#003D9B] text-white transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-[#003D9B] font-hankenGrotesk text-sm leading-5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.86875 6.75L7.06875 10.95L6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875Z"
              fill="#003D9B"
            />
          </svg>
          Quay lại trang Đăng nhập
        </Link>
      </div>
    </main>
  );
}

export default ResetPassword;
