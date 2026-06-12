import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiDatabase,
  FiExternalLink,
  FiGlobe,
  FiImage,
  FiLock,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiSave,
  FiServer,
  FiShield,
  FiUnlock,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import brandService from "../../services/brandService";
import {
  getAdminPaymentSettings,
  getAdminStaffSettings,
  getAdminSystemStatus,
  toggleStaffActive,
} from "../../services/settingsService";

const EMPTY_BRAND = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  isActive: true,
};

const STAFF_PAGE_SIZE = 6;

const fmtMoney = (value) => `${Number(value || 0).toLocaleString("vi-VN")} ₫`;

const fmtDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09,
    },
  },
};

const sectionItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function Section({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <motion.section
      variants={sectionItemVariants}
      whileHover={{ y: -2 }}
      className={`w-full overflow-hidden rounded-[28px] border border-[#D1C4B9] bg-white shadow-[0_18px_60px_rgba(27,28,25,0.05)] ${className}`}
    >
      <div className="border-b border-[#E8E0D8] bg-[linear-gradient(135deg,rgba(111,88,61,0.08),rgba(255,255,255,0))] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0E8DD] text-[#6F583D]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-beVietnamPro text-xl font-semibold text-[#1B1C19]">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-1 max-w-2xl font-beVietnamPro text-sm leading-6 text-[#4E453D]">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
          {action}
        </div>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </motion.section>
  );
}

function InfoCard({ label, value, hint, tone = "light" }) {
  const toneClasses =
    tone === "dark"
      ? "border-[#2E241B] bg-[#1B1C19] text-white"
      : "border-[#D1C4B9] bg-[#FBF9F4] text-[#1B1C19]";

  return (
    <motion.div
      variants={sectionItemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`rounded-2xl border p-4 ${toneClasses}`}
    >
      <p
        className={`font-beVietnamPro text-[11px] font-semibold uppercase tracking-[0.18em] ${
          tone === "dark" ? "text-white/65" : "text-[#6F583D]"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 font-beVietnamPro text-2xl font-semibold leading-8">
        {value}
      </p>
      {hint ? (
        <p
          className={`mt-2 font-beVietnamPro text-xs leading-4 ${
            tone === "dark" ? "text-white/70" : "text-[#4E453D]"
          }`}
        >
          {hint}
        </p>
      ) : null}
    </motion.div>
  );
}

function BrandSwatch({ brand }) {
  const fallback = (brand?.name || "ZY").slice(0, 2).toUpperCase();

  if (brand?.logoUrl) {
    return (
      <img
        src={brand.logoUrl}
        alt={brand.name || "Brand logo"}
        className="h-12 w-12 rounded-2xl border border-[#D1C4B9] object-cover"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAE2D4] font-beVietnamPro text-xs font-bold tracking-[0.12em] text-[#6F583D]">
      {fallback}
    </div>
  );
}

function CopyButton({ text, label }) {
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label.toLowerCase()}`);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-3 py-2 font-beVietnamPro text-xs font-medium text-[#4E453D] transition-colors hover:bg-[#F5F3EE]"
    >
      <FiCopy className="h-4 w-4" />
      Sao chép
    </motion.button>
  );
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [savingBrand, setSavingBrand] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [brandForm, setBrandForm] = useState(EMPTY_BRAND);
  const [payment, setPayment] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [staffTotalElements, setStaffTotalElements] = useState(0);
  const [staffPage, setStaffPage] = useState(0);
  const [staffKeywordInput, setStaffKeywordInput] = useState("");
  const [staffKeyword, setStaffKeyword] = useState("");
  const [stats, setStats] = useState(null);
  const selectedBrandIdRef = useRef(null);

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.id === selectedBrandId) || null,
    [brands, selectedBrandId],
  );

  useEffect(() => {
    selectedBrandIdRef.current = selectedBrandId;
  }, [selectedBrandId]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [brandData, paymentData, staffData, statsData] = await Promise.all([
        brandService.getAll(),
        getAdminPaymentSettings(),
        getAdminStaffSettings({
          page: staffPage,
          size: STAFF_PAGE_SIZE,
          keyword: staffKeyword,
        }),
        getAdminSystemStatus(),
      ]);

      setBrands(Array.isArray(brandData) ? brandData : []);
      setPayment(paymentData || null);
      setStaff(Array.isArray(staffData?.content) ? staffData.content : []);
      setStaffTotalPages(Number(staffData?.totalPages || 1));
      setStaffTotalElements(Number(staffData?.totalElements || 0));
      setStats(statsData || null);

      if (
        !selectedBrandIdRef.current &&
        Array.isArray(brandData) &&
        brandData.length > 0
      ) {
        setSelectedBrandId(brandData[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không tải được dữ liệu cài đặt");
    } finally {
      setLoading(false);
    }
  }, [staffKeyword, staffPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!selectedBrand) {
      setBrandForm(EMPTY_BRAND);
      return;
    }

    setBrandForm({
      name: selectedBrand.name || "",
      slug: selectedBrand.slug || "",
      description: selectedBrand.description || "",
      logoUrl: selectedBrand.logoUrl || "",
      isActive: Boolean(selectedBrand.isActive),
    });
  }, [selectedBrand]);

  const handleSelectBrand = (brandId) => {
    setSelectedBrandId(brandId);
  };

  const handleNewBrand = () => {
    setSelectedBrandId(null);
    setBrandForm(EMPTY_BRAND);
  };

  const handleStaffSearch = () => {
    setStaffPage(0);
    setStaffKeyword(staffKeywordInput.trim());
  };

  const handleStaffToggle = async (member) => {
    try {
      const updated = await toggleStaffActive(member.id);
      toast.success(
        updated?.isActive ? "Đã mở khoá tài khoản" : "Đã khoá tài khoản",
      );
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Không cập nhật được trạng thái tài khoản");
    }
  };

  const handleBrandChange = (field, value) => {
    setBrandForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBrand = async () => {
    const name = brandForm.name.trim();
    if (!name) {
      toast.error("Tên thương hiệu không được để trống");
      return;
    }

    const payload = {
      name,
      slug: brandForm.slug.trim(),
      description: brandForm.description.trim(),
      logoUrl: brandForm.logoUrl.trim(),
      isActive: Boolean(brandForm.isActive),
    };

    setSavingBrand(true);
    try {
      if (selectedBrand) {
        await brandService.update(selectedBrand.id, payload);
        toast.success("Đã cập nhật thương hiệu");
      } else {
        const created = await brandService.create(payload);
        if (created?.id) {
          selectedBrandIdRef.current = created.id;
          setSelectedBrandId(created.id);
        }
        toast.success("Đã tạo thương hiệu mới");
      }

      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Không lưu được thương hiệu");
    } finally {
      setSavingBrand(false);
    }
  };

  const heroStats = [
    {
      label: "Doanh thu tháng này",
      value: fmtMoney(stats?.totalRevenue),
      hint: `Tăng trưởng ${Number(stats?.revenueGrowthPercent || 0).toFixed(1)}% so với tháng trước`,
    },
    {
      label: "Đơn chờ xử lý",
      value: Number(stats?.pendingOrders || 0).toLocaleString("vi-VN"),
      hint: `${Number(stats?.newOrdersToday || 0).toLocaleString("vi-VN")} đơn trong hôm nay`,
    },
    {
      label: "Khách mới",
      value: Number(stats?.newCustomersThisMonth || 0).toLocaleString("vi-VN"),
      hint: "Dữ liệu lấy từ bảng users",
    },
    {
      label: "Sắp hết hàng",
      value: Number(stats?.lowStockCount || 0).toLocaleString("vi-VN"),
      hint: "Sản phẩm có tồn kho dưới ngưỡng",
    },
  ];

  const paymentRows = [
    { label: "Gateway", value: payment?.gateway || "VNPay" },
    {
      label: "Trạng thái",
      value: payment?.configured ? "Đã cấu hình" : "Chưa cấu hình",
    },
    {
      label: "Môi trường",
      value: payment?.sandbox ? "Sandbox" : "Production",
    },
    { label: "Tmn code", value: payment?.tmnCodeMasked || "—" },
    { label: "Version", value: payment?.version || "—" },
    { label: "Currency", value: payment?.currencyCode || "—" },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(111,88,61,0.12),transparent_34%),linear-gradient(180deg,#FBF9F4_0%,#F6F1E8_100%)] px-6 py-8 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-[#6F583D]/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#1B1C19]/5 blur-3xl"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-stretch gap-8">
        <motion.div
          variants={sectionItemVariants}
          className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
        >
          <div className="max-w-3xl">
            <h1 className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.28em] text-[#8A6F4F]">
              Cài đặt hệ thống
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={loadData}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#D1C4B9] bg-white px-5 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F5F3EE]"
            >
              <FiRefreshCw
                className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
              />
              Làm mới
            </motion.button>
            <motion.button
              type="button"
              onClick={handleSaveBrand}
              disabled={savingBrand}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#6F583D] px-5 py-3 font-beVietnamPro text-sm font-medium text-white transition-colors hover:bg-[#5E4A33] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave className="h-4 w-4" />
              {savingBrand ? "Đang lưu..." : "Lưu thương hiệu"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={sectionItemVariants}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {heroStats.map((item) => (
            <InfoCard
              key={item.label}
              label={item.label}
              value={item.value}
              hint={item.hint}
            />
          ))}
        </motion.div>

        <motion.div
          variants={sectionItemVariants}
          className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-start"
        >
          <div className="flex flex-col gap-6">
            <Section
              icon={FiDatabase}
              title="Thông tin thương hiệu"
              subtitle="Quản lý dữ liệu từ bảng brands. Có thể chọn một brand để chỉnh sửa hoặc tạo brand mới."
              action={
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    type="button"
                    onClick={handleNewBrand}
                    whileHover={{ y: -1, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-2 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F5F3EE]"
                  >
                    <FiPlus className="h-4 w-4" />
                    Thêm mới
                  </motion.button>
                </div>
              }
            >
              <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
                <div className="space-y-3 self-start">
                  <div className="rounded-2xl border border-[#D1C4B9] bg-[#FBF9F4] p-3.5">
                    <p className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.16em] text-[#6F583D]">
                      Danh sách brand
                    </p>
                    <p className="mt-1 font-beVietnamPro text-xs text-[#4E453D]">
                      {brands.length} bản ghi từ cơ sở dữ liệu
                    </p>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <div className="rounded-2xl border border-[#D1C4B9] bg-white p-3.5">
                        <div className="h-16 animate-pulse rounded-xl bg-[#F0E8DD]" />
                      </div>
                    ) : brands.length > 0 ? (
                      brands.map((brand) => {
                        const active = selectedBrandId === brand.id;
                        return (
                          <motion.button
                            key={brand.id}
                            type="button"
                            onClick={() => handleSelectBrand(brand.id)}
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                              active
                                ? "border-[#6F583D] bg-[#F7F1E8]"
                                : "border-[#D1C4B9] bg-white hover:bg-[#FBF9F4]"
                            }`}
                          >
                            <BrandSwatch brand={brand} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                                  {brand.name}
                                </p>
                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 font-beVietnamPro text-[11px] font-semibold ${
                                    brand.isActive
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-[#F0E8DD] text-[#6F583D]"
                                  }`}
                                >
                                  {brand.isActive ? "Hoạt động" : "Tạm ẩn"}
                                </span>
                              </div>
                              <p className="mt-1 truncate font-beVietnamPro text-xs text-[#4E453D]">
                                /{brand.slug || "khong-co-slug"}
                              </p>
                              <p className="mt-2 line-clamp-2 font-beVietnamPro text-xs leading-5 text-[#6B5B4B]">
                                {brand.description || "Chưa có mô tả"}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#D1C4B9] bg-[#FBF9F4] p-6 text-center">
                        <FiImage className="mx-auto h-8 w-8 text-[#BDAE9B]" />
                        <p className="mt-3 font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                          Chưa có brand nào trong database
                        </p>
                        <p className="mt-1 font-beVietnamPro text-xs text-[#4E453D]">
                          Tạo brand đầu tiên để bắt đầu quản lý thương hiệu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-[#D1C4B9] bg-[#FBF9F4] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <BrandSwatch brand={selectedBrand || brandForm} />
                        <div>
                          <p className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                            Chi tiết brand
                          </p>
                          <h3 className="mt-1 font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">
                            {selectedBrand
                              ? selectedBrand.name
                              : "Thương hiệu mới"}
                          </h3>
                          <p className="mt-1 font-beVietnamPro text-xs text-[#4E453D]">
                            {selectedBrand
                              ? `Cập nhật trực tiếp bản ghi #${selectedBrand.id}`
                              : "Điền thông tin để tạo brand mới trong bảng brands."}
                          </p>
                        </div>
                      </div>

                      <label className="inline-flex items-center gap-3 rounded-2xl border border-[#D1C4B9] bg-white px-3 py-2.5">
                        <span className="font-beVietnamPro text-sm font-medium text-[#4E453D]">
                          Đang hoạt động
                        </span>
                        <input
                          type="checkbox"
                          checked={brandForm.isActive}
                          onChange={(e) =>
                            handleBrandChange("isActive", e.target.checked)
                          }
                          className="h-5 w-5 accent-[#6F583D]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-3.5 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="block font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                        Tên hiển thị
                      </span>
                      <input
                        value={brandForm.name}
                        onChange={(e) =>
                          handleBrandChange("name", e.target.value)
                        }
                        placeholder="Ví dụ: ZYRO Couture"
                        className="w-full rounded-2xl border border-[#D1C4B9] bg-white px-3.5 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none transition-colors placeholder:text-[#9E8E7E] focus:border-[#6F583D]"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="block font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                        Slug
                      </span>
                      <input
                        value={brandForm.slug}
                        onChange={(e) =>
                          handleBrandChange("slug", e.target.value)
                        }
                        placeholder="zyro-couture"
                        className="w-full rounded-2xl border border-[#D1C4B9] bg-white px-3.5 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none transition-colors placeholder:text-[#9E8E7E] focus:border-[#6F583D]"
                      />
                    </label>
                  </div>

                  <label className="space-y-1.5">
                    <span className="block font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                      Mô tả
                    </span>
                    <textarea
                      value={brandForm.description}
                      onChange={(e) =>
                        handleBrandChange("description", e.target.value)
                      }
                      placeholder="Mô tả ngắn về thương hiệu"
                      rows={3}
                      className="w-full rounded-2xl border border-[#D1C4B9] bg-white px-3.5 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none transition-colors placeholder:text-[#9E8E7E] focus:border-[#6F583D]"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="block font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                      Logo URL
                    </span>
                    <input
                      value={brandForm.logoUrl}
                      onChange={(e) =>
                        handleBrandChange("logoUrl", e.target.value)
                      }
                      placeholder="/uploads/logo.png"
                      className="w-full rounded-2xl border border-[#D1C4B9] bg-white px-3.5 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none transition-colors placeholder:text-[#9E8E7E] focus:border-[#6F583D]"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2.5">
                    <motion.button
                      type="button"
                      onClick={handleSaveBrand}
                      disabled={savingBrand}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#6F583D] px-5 py-3 font-beVietnamPro text-sm font-medium text-white transition-colors hover:bg-[#5E4A33] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSave className="h-4 w-4" />
                      {savingBrand
                        ? "Đang lưu..."
                        : selectedBrand
                          ? "Cập nhật brand"
                          : "Tạo brand mới"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={loadData}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#D1C4B9] bg-white px-5 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F5F3EE]"
                    >
                      <FiRefreshCw
                        className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                      />
                      Đồng bộ lại
                    </motion.button>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              icon={FiServer}
              title="Trạng thái hệ thống"
              subtitle="Đây là phần tổng hợp từ backend stats và dữ liệu runtime để bạn kiểm tra nhanh tình trạng vận hành."
              action={
                <span className="inline-flex items-center gap-2 rounded-full bg-[#1B1C19] px-3 py-1.5 font-beVietnamPro text-xs font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Stable
                </span>
              }
            >
              <motion.div
                variants={sectionItemVariants}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              >
                <InfoCard
                  label="Bản ghi brands"
                  value={Number(brands.length || 0).toLocaleString("vi-VN")}
                  hint="Đọc từ bảng brands"
                />
                <InfoCard
                  label="Tài khoản staff"
                  value={Number(staff.length || 0).toLocaleString("vi-VN")}
                  hint="Đọc từ endpoint /admin/staff"
                />
                <InfoCard
                  label="Khách hàng"
                  value={Number(stats?.totalCustomers || 0).toLocaleString(
                    "vi-VN",
                  )}
                  hint="Thống kê từ /admin/stats"
                />
                <InfoCard
                  label="Thanh toán"
                  value={payment?.sandbox ? "Sandbox" : "Production"}
                  hint={
                    payment?.configured
                      ? "Config đã sẵn sàng"
                      : "Cần cấu hình VNPay"
                  }
                />
              </motion.div>

              <motion.div
                variants={sectionItemVariants}
                className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="rounded-2xl border border-[#E8E0D8] bg-[#FBF9F4] p-5">
                  <div className="flex items-center gap-2">
                    <FiBarChart2 className="h-4 w-4 text-[#6F583D]" />
                    <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                      Chú thích dữ liệu
                    </p>
                  </div>
                  <p className="mt-2 font-beVietnamPro text-sm leading-6 text-[#4E453D]">
                    Brand, staff và stats được đọc từ database. Payment config
                    được đọc từ `VNPayConfig` trong backend, nên giao diện phản
                    ánh đúng môi trường đang chạy.
                  </p>
                </div>

                <motion.a
                  href="/admin"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D1C4B9] bg-white px-5 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F5F3EE]"
                >
                  <FiExternalLink className="h-4 w-4" />
                  Quay lại tổng quan
                </motion.a>
              </motion.div>
            </Section>
          </div>

          <div className="flex flex-col gap-6">
            <Section
              icon={FiShield}
              title="Cấu hình thanh toán"
              subtitle="Đọc từ VNPayConfig trong backend. Dữ liệu này là runtime config, không phải mock UI."
              action={
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-beVietnamPro text-xs font-semibold ${
                    payment?.configured
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      payment?.configured ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {payment?.configured ? "Đã cấu hình" : "Chưa cấu hình"}
                </span>
              }
            >
              <div className="space-y-4">
                {paymentRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8E0D8] bg-[#FBF9F4] px-4 py-3"
                  >
                    <div>
                      <p className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                        {row.label}
                      </p>
                      <p className="mt-1 font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                        {row.value}
                      </p>
                    </div>
                    {(row.label === "Gateway" ||
                      row.label === "Tmn code" ||
                      row.label === "Version") && (
                      <CopyButton text={row.value} label={row.label} />
                    )}
                  </div>
                ))}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#D1C4B9] bg-[#1B1C19] p-5 text-white">
                    <p className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                      Payment URL
                    </p>
                    <p className="mt-2 break-all font-beVietnamPro text-sm leading-6 text-white/90">
                      {payment?.paymentUrl || "—"}
                    </p>
                    <div className="mt-4">
                      <CopyButton
                        text={payment?.paymentUrl || ""}
                        label="payment URL"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#D1C4B9] bg-white p-5">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="h-4 w-4 text-[#6F583D]" />
                      <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                        Return / IPN
                      </p>
                    </div>
                    <p className="mt-3 break-all font-beVietnamPro text-sm text-[#4E453D]">
                      Return: {payment?.returnUrl || "—"}
                    </p>
                    <p className="mt-2 break-all font-beVietnamPro text-sm text-[#4E453D]">
                      IPN: {payment?.ipnUrl || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              icon={FiUsers}
              title="Tài khoản nhân sự"
              subtitle="Danh sách lấy từ bảng users qua endpoint admin/staff. Hiển thị các tài khoản ngoài nhóm USER."
              action={
                <span className="rounded-full bg-[#F5F3EE] px-3 py-1.5 font-beVietnamPro text-xs font-semibold text-[#6F583D]">
                  {staffTotalElements} tài khoản
                </span>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[#D1C4B9] bg-white px-4 py-3">
                    <FiSearch className="h-4 w-4 shrink-0 text-[#8A7A69]" />
                    <input
                      value={staffKeywordInput}
                      onChange={(e) => setStaffKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleStaffSearch();
                      }}
                      placeholder="Tìm theo tên, email hoặc số điện thoại"
                      className="w-full bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      type="button"
                      onClick={handleStaffSearch}
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1B1C19] px-4 py-2.5 font-beVietnamPro text-sm font-medium text-white transition-colors hover:bg-[#111]"
                    >
                      <FiSearch className="h-4 w-4" />
                      Tìm kiếm
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setStaffKeywordInput("");
                        setStaffKeyword("");
                        setStaffPage(0);
                      }}
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] bg-white px-4 py-2.5 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F5F3EE]"
                    >
                      Làm sạch
                    </motion.button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E8E0D8]">
                  <div className="grid grid-cols-[1.3fr_0.8fr_0.6fr_0.7fr_0.6fr] border-b border-[#E8E0D8] bg-[#FBF9F4] px-4 py-3 font-beVietnamPro text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F583D]">
                    <span>Nhân sự</span>
                    <span>Vai trò</span>
                    <span>Trạng thái</span>
                    <span className="text-right">Gia nhập</span>
                    <span className="text-right">Thao tác</span>
                  </div>

                  <div className="divide-y divide-[#F1EBE4] bg-white">
                    {loading ? (
                      <div className="px-4 py-8">
                        <div className="h-12 animate-pulse rounded-xl bg-[#F0E8DD]" />
                      </div>
                    ) : staff.length > 0 ? (
                      staff.map((member) => (
                        <div
                          key={member.id}
                          className="grid grid-cols-[1.3fr_0.8fr_0.6fr_0.7fr_0.6fr] items-center gap-4 px-4 py-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                              {member.fullName || "Chưa đặt tên"}
                            </p>
                            <p className="truncate font-beVietnamPro text-xs text-[#4E453D]">
                              {member.email}
                            </p>
                          </div>

                          <div>
                            <span className="inline-flex rounded-full bg-[#EAE2D4] px-3 py-1 font-beVietnamPro text-xs font-semibold text-[#1F1B17]">
                              {member.role || "USER"}
                            </span>
                          </div>

                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 font-beVietnamPro text-xs font-semibold ${
                                member.isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {member.isActive ? "Hoạt động" : "Đã khoá"}
                            </span>
                          </div>

                          <p className="text-right font-beVietnamPro text-sm text-[#4E453D]">
                            {fmtDate(member.createdAt)}
                          </p>

                          <div className="flex justify-end">
                            <motion.button
                              type="button"
                              onClick={() => handleStaffToggle(member)}
                              whileHover={{ y: -1, scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-beVietnamPro text-xs font-medium transition-colors ${
                                member.isActive
                                  ? "border border-red-200 text-red-600 hover:bg-red-50"
                                  : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {member.isActive ? (
                                <FiLock className="h-4 w-4" />
                              ) : (
                                <FiUnlock className="h-4 w-4" />
                              )}
                              {member.isActive ? "Khoá" : "Mở khoá"}
                            </motion.button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-10 text-center">
                        <p className="font-beVietnamPro text-sm text-[#4E453D]">
                          Chưa có tài khoản nhân sự nào được trả về từ backend.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-[#E8E0D8] bg-[#FBF9F4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-beVietnamPro text-sm text-[#4E453D]">
                    Trang {staffPage + 1} / {Math.max(staffTotalPages, 1)}
                  </p>
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      disabled={staffPage === 0}
                      onClick={() =>
                        setStaffPage((prev) => Math.max(prev - 1, 0))
                      }
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] bg-white px-3 py-2 font-beVietnamPro text-sm text-[#4E453D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiChevronLeft className="h-4 w-4" />
                      Trước
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={staffPage >= staffTotalPages - 1}
                      onClick={() =>
                        setStaffPage((prev) =>
                          Math.min(prev + 1, Math.max(staffTotalPages - 1, 0)),
                        )
                      }
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] bg-white px-3 py-2 font-beVietnamPro text-sm text-[#4E453D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Sau
                      <FiChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
