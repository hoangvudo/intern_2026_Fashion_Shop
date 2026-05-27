import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import authService from "../services/authService";
import { forgotPasswordSchema } from "../schemas/passwordResetSchema";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setIsSent(true);
      toast.success(
        "Nếu email tồn tại, chúng tôi đã gửi liên kết đặt lại mật khẩu.",
      );
    } catch (error) {
      toast.error(error.message || "Gửi liên kết đặt lại mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1F3FF] px-6 py-20">
      <div className="flex w-full max-w-[448px] flex-col gap-16 rounded-xl border border-[#C3C6D6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-16">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex justify-center items-center rounded-full bg-[#0052CC] w-16 h-16">
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3333 26.6667C11.4889 26.6667 9.75556 26.3167 8.13333 25.6167C6.51111 24.9167 5.1 23.9667 3.9 22.7667C2.7 21.5667 1.75 20.1556 1.05 18.5333C0.35 16.9111 0 15.1778 0 13.3333H2.66667C2.66667 14.8 2.94444 16.1833 3.5 17.4833C4.05556 18.7833 4.81667 19.9167 5.78333 20.8833C6.75 21.85 7.88333 22.6167 9.18333 23.1833C10.4833 23.75 11.8667 24.0333 13.3333 24.0333C16.3111 24.0333 18.8333 23 20.9 20.9333C22.9667 18.8667 24 16.3444 24 13.3667C24 10.3889 22.9667 7.86667 20.9 5.8C18.8333 3.73333 16.3111 2.7 13.3333 2.7C11.3556 2.7 9.56111 3.18333 7.95 4.15C6.33889 5.11667 5.06667 6.4 4.13333 8H8V10.6667H0V2.66667H2.66667V5.33333C3.88889 3.71111 5.42222 2.41667 7.26667 1.45C9.11111 0.483333 11.1333 0 13.3333 0C15.1778 0 16.9111 0.35 18.5333 1.05C20.1556 1.75 21.5667 2.7 22.7667 3.9C23.9667 5.1 24.9167 6.51111 25.6167 8.13333C26.3167 9.75556 26.6667 11.4889 26.6667 13.3333C26.6667 15.1778 26.3167 16.9111 25.6167 18.5333C24.9167 20.1556 23.9667 21.5667 22.7667 22.7667C21.5667 23.9667 20.1556 24.9167 18.5333 25.6167C16.9111 26.3167 15.1778 26.6667 13.3333 26.6667ZM10.6667 18.6667C10.2889 18.6667 9.97222 18.5389 9.71667 18.2833C9.46111 18.0278 9.33333 17.7111 9.33333 17.3333V13.3333C9.33333 12.9556 9.46111 12.6389 9.71667 12.3833C9.97222 12.1278 10.2889 12 10.6667 12V10.6667C10.6667 9.93333 10.9278 9.30556 11.45 8.78333C11.9722 8.26111 12.6 8 13.3333 8C14.0667 8 14.6944 8.26111 15.2167 8.78333C15.7389 9.30556 16 9.93333 16 10.6667V12C16.3778 12 16.6944 12.1278 16.95 12.3833C17.2056 12.6389 17.3333 12.9556 17.3333 13.3333V17.3333C17.3333 17.7111 17.2056 18.0278 16.95 18.2833C16.6944 18.5389 16.3778 18.6667 16 18.6667H10.6667ZM12 12H14.6667V10.6667C14.6667 10.2889 14.5389 9.97222 14.2833 9.71667C14.0278 9.46111 13.7111 9.33333 13.3333 9.33333C12.9556 9.33333 12.6389 9.46111 12.3833 9.71667C12.1278 9.97222 12 10.2889 12 10.6667V12Z"
                fill="#C4D2FF"
              />
            </svg>
          </div>
          <h1 className="text-[#041B3C] font-manrope text-[28px] font-semibold leading-9">
            Quên mật khẩu?
          </h1>
          <p className="text-[#434654] font-hankenGrotesk text-base leading-6">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {!isSent ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 w-full"
            >
              <div className="flex flex-col gap-2">
                <label className="text-[#041B3C] font-hankenGrotesk text-sm font-semibold leading-5">
                  Email
                </label>
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]">
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z"
                        fill="#737685"
                      />
                    </svg>
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="username@example.com"
                    className={`w-full h-12 rounded-lg border px-12 text-sm text-[#041B3C] outline-none transition ${
                      errors.email ? "border-[#ba1a1a]" : "border-[#C3C6D6]"
                    } bg-[#F1F3FF]`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-[#ba1a1a]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative flex h-12 items-center justify-center rounded-lg bg-[#003D9B] text-white transition-opacity disabled:opacity-50"
              >
                <span className="relative z-10">
                  {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              <div className="rounded-xl bg-[#F1F3FF] p-5 text-left">
                <p className="text-[#041B3C] font-hankenGrotesk text-base font-semibold leading-6">
                  Yêu cầu đặt lại mật khẩu đã được gửi
                </p>
                <p className="text-[#434654] font-hankenGrotesk text-sm leading-5 pt-2">
                  Nếu email <span className="font-semibold">{email}</span> tồn
                  tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu
                  trong vài phút.
                </p>
              </div>
              <Link
                to="/login"
                className="flex h-12 items-center justify-center rounded-lg bg-[#003D9B] text-white"
              >
                Quay lại Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
