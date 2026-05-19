import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import logo from "../assets/logo.jpg";

function TopNav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      toast.success("Dang xuat thanh cong!");
      setShowUserMenu(false);
      navigate("/login");
    } catch (error) {
      toast.error("Dang xuat that bai");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#C3C6D6] bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-5 px-5 md:px-10">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black ring-1 ring-[#041B3C]/10">
              <img
                src={logo}
                alt="ZYRO logo"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span className="font-[Manrope] text-2xl font-bold tracking-[0.22em] text-[#041B3C]">
                ZYRO
              </span>
            </span>
          </Link>
          <nav className="hidden gap-6 lg:flex">
            <Link
              to="/new-arrivals"
              className="border-b-2 border-[#003D9B] pb-1 font-['Hanken_Grotesk'] text-base font-bold text-[#003D9B]"
            >
              New Arrivals
            </Link>
            <Link
              to="/best-sellers"
              className="font-['Hanken_Grotesk'] text-base text-[#434654] transition-colors hover:text-[#003D9B]"
            >
              Best Sellers
            </Link>
            <Link
              to="/categories"
              className="font-['Hanken_Grotesk'] text-base text-[#434654] transition-colors hover:text-[#003D9B]"
            >
              Categories
            </Link>
            <Link
              to="/sale"
              className="font-['Hanken_Grotesk'] text-base text-[#434654] transition-colors hover:text-[#003D9B]"
            >
              Sale
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-[#F1F3FF] px-4 py-2 md:flex">
            <span className="material-symbols-outlined text-[#434654]">
              search
            </span>
            <input
              className="w-44 border-none bg-transparent font-['Hanken_Grotesk'] text-sm text-[#041B3C] focus:ring-0 xl:w-64"
              placeholder="Tim kiem san pham..."
              type="text"
            />
          </div>

          <button className="rounded-full bg-transparent p-2 transition hover:bg-[#F1F3FF]">
            <span className="material-symbols-outlined text-[#003D9B]">
              shopping_cart
            </span>
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                className="rounded-full bg-transparent p-2 transition hover:bg-[#F1F3FF]"
              >
                <span className="material-symbols-outlined text-[#003D9B]">
                  person
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-[#C3C6D6] bg-white py-2 shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#F1F3FF]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-xl text-[#434654]">
                      account_circle
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-base text-[#041B3C]">
                      Tai khoan
                    </span>
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#F1F3FF]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-xl text-[#434654]">
                      shopping_bag
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-base text-[#041B3C]">
                      Don hang
                    </span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#F1F3FF]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-xl text-[#434654]">
                      settings
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-base text-[#041B3C]">
                      Cai dat
                    </span>
                  </Link>

                  <div className="my-2 border-t border-[#C3C6D6]" />

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 rounded-none bg-transparent px-4 py-3 text-left transition hover:bg-[#FFDAD6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin text-[#BA1A1A]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="font-['Hanken_Grotesk'] text-base text-[#BA1A1A]">
                          Dang dang xuat...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl text-[#BA1A1A]">
                          logout
                        </span>
                        <span className="font-['Hanken_Grotesk'] text-base text-[#BA1A1A]">
                          Dang xuat
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full p-2 transition hover:bg-[#F1F3FF]"
            >
              <span className="material-symbols-outlined text-[#003D9B]">
                person
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
