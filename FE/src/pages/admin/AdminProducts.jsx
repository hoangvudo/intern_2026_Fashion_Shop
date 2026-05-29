import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiMoreVertical,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiTrendingUp,
  FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAdminProducts } from '../../hooks/useProducts'
import productService from '../../services/productService'
import ProductFormModal from '../../components/admin/products/ProductFormModal'
import DeleteConfirmModal from '../../components/admin/products/DeleteConfirmModal'

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function getProductImage(product) {
  return (
    product.thumbnailUrl ||
    product.imageUrl ||
    product.image ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    ''
  )
}

function getTotalStock(product) {
  if (typeof product.stock === 'number') return product.stock
  if (typeof product.totalStock === 'number') return product.totalStock
  if (typeof product.quantity === 'number') return product.quantity
  if (Array.isArray(product.variants)) {
    return product.variants.reduce((sum, item) => sum + (Number(item.stock) || 0), 0)
  }
  return 0
}

function ProductImage({ product }) {
  const src = getProductImage(product)
  const initials = product.name
    ?.split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden border border-[#E5DED6] bg-[#F4F0EA]">
      {src ? (
        <img src={src} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-beVietnamPro text-xs font-semibold tracking-wide text-[#8A745B]">
          {initials || 'ZY'}
        </span>
      )}
    </div>
  )
}

function StatusBadge({ active, stock }) {
  if (!active) {
    return (
      <span className="inline-flex items-center gap-2 border border-[#D8DCE2] bg-[#F7F7F8] px-3 py-1.5 font-beVietnamPro text-xs font-medium text-[#69707A]">
        <span className="h-2 w-2 rounded-full bg-[#9AA1AA]" />
        Tạm ẩn
      </span>
    )
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-2 border border-[#F2C9C9] bg-[#FFF5F5] px-3 py-1.5 font-beVietnamPro text-xs font-medium text-[#B42318]">
        <span className="h-2 w-2 rounded-full bg-[#D92D20]" />
        Sắp hết
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 border border-[#CFE8D7] bg-[#F3FBF5] px-3 py-1.5 font-beVietnamPro text-xs font-medium text-[#1F7A3F]">
      <span className="h-2 w-2 rounded-full bg-[#2E9E55]" />
      Đang bán
    </span>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center border border-dashed border-[#D7C9BD] bg-[#FBFAF7] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center bg-white text-[#8A745B] shadow-sm">
        <FiPackage className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-beVietnamPro text-lg font-semibold text-[#1F1B17]">
        Chưa có sản phẩm phù hợp
      </h3>
      <p className="mt-2 max-w-md font-beVietnamPro text-sm leading-6 text-[#6F6257]">
        Thử đổi bộ lọc hoặc thêm sản phẩm mới vào danh mục quản trị.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 bg-[#1F1B17] px-5 py-3 font-beVietnamPro text-sm font-medium text-white hover:bg-[#3A332C]"
      >
        <FiPlus className="h-4 w-4" />
        Thêm sản phẩm
      </button>
    </div>
  )
}

function SummaryCard({ card }) {
  const Icon = card.icon

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F5F3EE] p-6">
      <p className="font-beVietnamPro text-sm font-medium uppercase leading-5 tracking-[0.08em] text-[#4E453D]">
        {card.label}
      </p>
      <p className={`mt-2 font-beVietnamPro text-2xl font-semibold leading-8 ${card.tone}`}>
        {card.value}
      </p>
      <div className="mt-2 flex items-center gap-1">
        {Icon && <Icon className={`h-3.5 w-3.5 ${card.tone}`} />}
        <p className={`font-beVietnamPro text-xs leading-4 ${card.tone}`}>
          {card.note}
        </p>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { products, total, totalPages, loading, filters, updateFilter, refresh } = useAdminProducts()
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [stats, setStats] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadMeta() {
      try {
        const [categoryData, brandData, productStats] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
          productService.getStats(),
        ])
        if (!mounted) return
        setCategories(Array.isArray(categoryData) ? categoryData : categoryData?.content ?? [])
        setBrands(Array.isArray(brandData) ? brandData : brandData?.content ?? [])
        setStats(productStats)
      } catch (error) {
        console.error('Load product filters error:', error)
      }
    }

    loadMeta()
    return () => {
      mounted = false
    }
  }, [])

  const refreshAll = async () => {
    refresh()
    try {
      const productStats = await productService.getStats()
      setStats(productStats)
    } catch (error) {
      console.error('Refresh product stats error:', error)
    }
  }

  const openCreate = () => {
    setEditProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const openDelete = (product) => {
    setDeleteTarget(product)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productService.delete(deleteTarget.id)
      toast.success('Đã xoá sản phẩm')
      setDeleteOpen(false)
      setDeleteTarget(null)
      refreshAll()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Xoá sản phẩm thất bại')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (product) => {
    setToggling(product.id)
    try {
      if (productService.toggleActive) {
        await productService.toggleActive(product.id)
      } else {
        await productService.update(product.id, { ...product, isActive: !product.isActive })
      }
      toast.success(product.isActive === false ? 'Đã hiển thị sản phẩm' : 'Đã ẩn sản phẩm')
      refreshAll()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại')
    } finally {
      setToggling(null)
    }
  }

  const page = Number(filters.page || 0)
  const pageCount = Math.max(totalPages || 1, 1)

  return (
    <div className="min-h-screen bg-[#F5F3EE] px-4 pb-12 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#8A745B]">
              ZYRO Admin
            </p>
            <h1 className="mt-2 font-beVietnamPro text-3xl font-semibold tracking-tight text-[#1F1B17]">
              Quản lý sản phẩm
            </h1>
            <p className="mt-2 max-w-2xl font-beVietnamPro text-sm leading-6 text-[#6F6257]">
              Theo dõi tồn kho, cập nhật giá bán và quản lý trạng thái hiển thị của bộ sưu tập thời trang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex h-11 items-center gap-2 border border-[#D7C9BD] bg-white px-4 font-beVietnamPro text-sm font-medium text-[#4E453D] hover:bg-[#FBFAF7]"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 items-center gap-2 bg-[#1F1B17] px-5 font-beVietnamPro text-sm font-medium text-white shadow-sm hover:bg-[#3A332C]"
            >
              <FiPlus className="h-4 w-4" />
              Thêm sản phẩm
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            card={{
              label: 'Tổng sản phẩm',
              value: typeof stats?.totalProducts === 'number'
                ? stats.totalProducts.toLocaleString('vi-VN')
                : typeof total === 'number' ? total.toLocaleString('vi-VN') : '--',
              note: loading ? 'Đang tải dữ liệu' : 'Theo dữ liệu hệ thống',
              tone: 'text-[#6F583D]',
              icon: FiTrendingUp,
            }}
          />
          <SummaryCard
            card={{
              label: 'Giá trị kho',
              value: stats?.inventoryValue != null ? money.format(Number(stats.inventoryValue)) : '--',
              note: stats?.inventoryValue != null ? 'Theo giá bán và tồn kho' : 'Chưa có dữ liệu',
              tone: 'text-[#4E453D]',
            }}
          />
          <SummaryCard
            card={{
              label: 'Sắp hết hàng',
              value: typeof stats?.lowStockCount === 'number'
                ? stats.lowStockCount.toLocaleString('vi-VN')
                : '--',
              note: typeof stats?.lowStockCount === 'number' ? 'Tồn kho dưới 5' : 'Chưa có dữ liệu',
              tone: 'text-[#BA1A1A]',
            }}
          />
          <SummaryCard
            card={{
              label: 'Lượt xem sản phẩm',
              value: '--',
              note: 'Chưa có dữ liệu',
              tone: 'text-[#6F583D]',
              icon: FiEye,
            }}
          />
        </section>

        <section className="border border-[#E4D8CD] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#E4D8CD] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 border border-[#D7C9BD] bg-[#FBFAF7] px-4 py-3">
              <FiSearch className="h-4 w-4 shrink-0 text-[#8A745B]" />
              <input
                value={filters.keyword}
                onChange={(event) => updateFilter('keyword', event.target.value)}
                placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
                className="min-w-0 flex-1 bg-transparent font-beVietnamPro text-sm text-[#1F1B17] outline-none placeholder:text-[#8A745B]"
              />
              {filters.keyword && (
                <button type="button" onClick={() => updateFilter('keyword', '')} aria-label="Xoá tìm kiếm">
                  <FiX className="h-4 w-4 text-[#8A745B]" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              className="inline-flex items-center justify-center gap-2 border border-[#D7C9BD] px-4 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] lg:hidden"
            >
              <FiFilter className="h-4 w-4" />
              Bộ lọc
            </button>

            <div className={`${mobileFiltersOpen ? 'grid' : 'hidden'} gap-3 lg:grid lg:grid-cols-4`}>
              <select
                value={filters.categoryId}
                onChange={(event) => updateFilter('categoryId', event.target.value)}
                className="h-11 border border-[#D7C9BD] bg-white px-3 font-beVietnamPro text-sm text-[#1F1B17] outline-none"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                value={filters.brandId}
                onChange={(event) => updateFilter('brandId', event.target.value)}
                className="h-11 border border-[#D7C9BD] bg-white px-3 font-beVietnamPro text-sm text-[#1F1B17] outline-none"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>

              <select
                value={filters.isActive}
                onChange={(event) => updateFilter('isActive', event.target.value)}
                className="h-11 border border-[#D7C9BD] bg-white px-3 font-beVietnamPro text-sm text-[#1F1B17] outline-none"
              >
                <option value="">Mọi trạng thái</option>
                <option value="true">Đang bán</option>
                <option value="false">Tạm ẩn</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(event) => updateFilter('sortBy', event.target.value)}
                className="h-11 border border-[#D7C9BD] bg-white px-3 font-beVietnamPro text-sm text-[#1F1B17] outline-none"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-[#E4D8CD] bg-[#FBFAF7]">
                  {['Sản phẩm', 'SKU', 'Danh mục', 'Giá bán', 'Tồn kho', 'Trạng thái', 'Thao tác'].map((heading) => (
                    <th key={heading} className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-[0.12em] text-[#8A745B]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <tr key={index} className="border-b border-[#EEE6DE]">
                        {Array.from({ length: 7 }).map((__, cell) => (
                          <td key={cell} className="px-5 py-5">
                            <div className="h-4 animate-pulse bg-[#EEE6DE]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6">
                        <EmptyState onCreate={openCreate} />
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const stock = getTotalStock(product)
                      const categoryName = product.categoryName || product.category?.name || 'Chưa phân loại'
                      const brandName = product.brandName || product.brand?.name || 'ZYRO'

                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-[#EEE6DE] bg-white hover:bg-[#FBFAF7]"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-4">
                              <ProductImage product={product} />
                              <div className="min-w-0">
                                <p className="max-w-[260px] truncate font-beVietnamPro text-sm font-semibold text-[#1F1B17]">
                                  {product.name}
                                </p>
                                <p className="mt-1 font-beVietnamPro text-xs text-[#8A745B]">{brandName}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {product.isFeatured && (
                                    <span className="bg-[#F0E6D6] px-2 py-1 font-beVietnamPro text-[11px] font-medium text-[#6F583D]">
                                      Nổi bật
                                    </span>
                                  )}
                                  {product.isNewArrival && (
                                    <span className="bg-[#E9F2F4] px-2 py-1 font-beVietnamPro text-[11px] font-medium text-[#386A75]">
                                      Hàng mới
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <code className="bg-[#F5F3EE] px-2.5 py-1.5 font-beVietnamPro text-xs text-[#6F6257]">
                              {product.sku || product.code || `#${product.id}`}
                            </code>
                          </td>
                          <td className="px-5 py-5 font-beVietnamPro text-sm text-[#4E453D]">{categoryName}</td>
                          <td className="px-5 py-5">
                            <div>
                              <p className="font-beVietnamPro text-sm font-semibold text-[#6F583D]">
                                {money.format(Number(product.salePrice || product.price || 0))}
                              </p>
                              {product.salePrice && (
                                <p className="mt-1 font-beVietnamPro text-xs text-[#9AA1AA] line-through">
                                  {money.format(Number(product.price || 0))}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <span className={`font-beVietnamPro text-sm font-semibold ${stock <= 5 ? 'text-[#BA1A1A]' : 'text-[#1F1B17]'}`}>
                              {stock}
                            </span>
                          </td>
                          <td className="px-5 py-5">
                            <StatusBadge active={product.isActive !== false} stock={stock} />
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(product)}
                                disabled={toggling === product.id}
                                title={product.isActive === false ? 'Hiển thị sản phẩm' : 'Ẩn sản phẩm'}
                                className="flex h-9 w-9 items-center justify-center text-[#8A745B] hover:bg-[#F0EEE9] disabled:opacity-50"
                              >
                                {toggling === product.id ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D7C9BD] border-t-[#6F583D]" />
                                ) : product.isActive === false ? (
                                  <FiEye className="h-4 w-4" />
                                ) : (
                                  <FiEyeOff className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEdit(product)}
                                title="Chỉnh sửa"
                                className="flex h-9 w-9 items-center justify-center text-[#8A745B] hover:bg-[#F0EEE9] hover:text-[#1F1B17]"
                              >
                                <FiEdit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDelete(product)}
                                title="Xoá"
                                className="flex h-9 w-9 items-center justify-center text-[#8A745B] hover:bg-[#FFF1F1] hover:text-[#BA1A1A]"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                title="Tác vụ khác"
                                className="flex h-9 w-9 items-center justify-center text-[#8A745B] hover:bg-[#F0EEE9]"
                              >
                                <FiMoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E4D8CD] bg-[#FBFAF7] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-beVietnamPro text-sm text-[#6F6257]">
              Trang <span className="font-semibold text-[#1F1B17]">{page + 1}</span> trên{' '}
              <span className="font-semibold text-[#1F1B17]">{pageCount}</span>
              {typeof total === 'number' && total > 0 && (
                <span> · {total.toLocaleString('vi-VN')} sản phẩm</span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={filters.size}
                onChange={(event) => updateFilter('size', Number(event.target.value))}
                className="h-10 border border-[#D7C9BD] bg-white px-3 font-beVietnamPro text-sm text-[#4E453D] outline-none"
              >
                {[10, 12, 20, 30].map((size) => (
                  <option key={size} value={size}>{size} / trang</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => updateFilter('page', Math.max(page - 1, 0))}
                disabled={page === 0}
                className="flex h-10 w-10 items-center justify-center border border-[#D7C9BD] bg-white text-[#4E453D] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Trang trước"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => updateFilter('page', Math.min(page + 1, pageCount - 1))}
                disabled={page >= pageCount - 1}
                className="flex h-10 w-10 items-center justify-center border border-[#D7C9BD] bg-white text-[#4E453D] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Trang sau"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editProduct}
        categories={categories}
        brands={brands}
        onSaved={refreshAll}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        product={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </div>
  )
}
