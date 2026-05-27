import { Link } from "react-router-dom";

function ResetPasswordExpired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(70.71%70.71%at50%50%,#D7E2FF1.77%,rgba(215,226,255,0.00)1.77%),radial-gradient(70.71%70.71%at50%50%,#D7E2FF1.77%,#F9F9FF1.77%)] px-6 py-20">
      <div className="flex w-full max-w-[480px] flex-col items-center rounded-xl border border-[#C3C6D6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-16 gap-6">
        <div className="flex p-6 items-start rounded-full bg-[#FFDAD6]">
          <svg
            width="32"
            height="40"
            viewBox="0 0 32 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 36H24V30C24 27.8 23.2167 25.9167 21.65 24.35C20.0833 22.7833 18.2 22 16 22C13.8 22 11.9167 22.7833 10.35 24.35C8.78333 25.9167 8 27.8 8 30V36ZM16 18C18.2 18 20.0833 17.2167 21.65 15.65C23.2167 14.0833 24 12.2 24 10V4H8V10C8 12.2 8.78333 14.0833 10.35 15.65C11.9167 17.2167 13.8 18 16 18ZM0 40V36H4V30C4 27.9667 4.475 26.0583 5.425 24.275C6.375 22.4917 7.7 21.0667 9.4 20C7.7 18.9333 6.375 17.5083 5.425 15.725C4.475 13.9417 4 12.0333 4 10V4H0V0H32V4H28V10C28 12.0333 27.525 13.9417 26.575 15.725C25.625 17.5083 24.3 18.9333 22.6 20C24.3 21.0667 25.625 22.4917 26.575 24.275C27.525 26.0583 28 27.9667 28 30V36H32V40H0Z"
              fill="#93000A"
            />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-[#041B3C] font-manrope text-[28px] font-semibold leading-9">
            Liên kết đã hết hạn
          </h1>
          <p className="text-[#434654] font-hankenGrotesk text-base leading-6 pt-4">
            Rất tiếc, liên kết đặt lại mật khẩu của bạn đã hết hạn sau 1 giờ
            hoặc đã được sử dụng. Vui lòng yêu cầu một liên kết mới.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Link
            to="/forgot-password"
            className="flex h-12 items-center justify-center rounded-lg bg-[#003D9B] text-white"
          >
            Yêu cầu liên kết mới
          </Link>
          <Link
            to="/login"
            className="flex h-12 items-center justify-center gap-2 text-[#003D9B] font-hankenGrotesk text-sm leading-5"
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
            Quay lại Đăng nhập
          </Link>
        </div>

        <div className="w-full h-[66px] pt-16">
          <div className="h-0.5 w-full bg-[#F1F3FF] rounded-full" />
        </div>

        <p className="text-[#003D9B] font-hankenGrotesk text-sm leading-5">
          Gặp sự cố? Liên hệ Hỗ trợ khách hàng
        </p>
      </div>
    </main>
  );
}

export default ResetPasswordExpired;
