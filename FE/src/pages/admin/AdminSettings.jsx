import { useState } from 'react'
import { FiUser, FiLock, FiBell, FiShield, FiSave, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'

const TABS = [
  { key: 'profile', label: 'Hồ sơ', icon: FiUser },
  { key: 'security', label: 'Bảo mật', icon: FiLock },
  { key: 'notifications', label: 'Thông báo', icon: FiBell },
  { key: 'system', label: 'Hệ thống', icon: FiShield },
]

function SectionCard({ title, children }) {
  return (
    <div className="border border-[#D1C4B9] bg-white p-6">
      <h2 className="mb-5 font-beVietnamPro text-base font-semibold text-[#1B1C19]">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-beVietnamPro text-sm font-medium text-[#4E453D]">{label}</label>
      {children}
      {hint && <p className="font-beVietnamPro text-xs text-[#9E8E7E]">{hint}</p>}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-[#D1C4B9] bg-white px-3 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] placeholder-[#C5B9AE] outline-none focus:border-[#6F583D] transition-colors ${className}`}
      {...props}
    />
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-[#1B1C19]' : 'bg-[#D1C4B9]'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
      <span className="font-beVietnamPro text-sm text-[#4E453D]">{label}</span>
    </label>
  )
}

function SaveButton({ loading, saved }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 bg-[#1B1C19] px-5 py-2.5 font-beVietnamPro text-sm text-white hover:bg-[#2e2f2b] disabled:opacity-60 transition-colors"
    >
      {saved ? <FiCheck className="h-4 w-4" /> : <FiSave className="h-4 w-4" />}
      {loading ? 'Đang lưu...' : saved ? 'Đã lưu' : 'Lưu thay đổi'}
    </button>
  )
}

// ── Tabs ──────────────────────────────────────────────────────

function ProfileTab({ user }) {
  const updateUser = useAuthStore(s => s.updateUser)
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    updateUser({ ...user, ...form })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <SectionCard title="Thông tin cá nhân">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Họ và tên">
            <Input value={form.fullName} onChange={set('fullName')} placeholder="Nguyễn Văn A" />
          </Field>
          <Field label="Email" hint="Email không thể thay đổi sau khi đăng ký">
            <Input value={form.email} onChange={set('email')} type="email" disabled className="cursor-not-allowed bg-[#F7F5F2] text-[#9E8E7E]" />
          </Field>
          <Field label="Số điện thoại">
            <Input value={form.phone} onChange={set('phone')} placeholder="0901 234 567" />
          </Field>
          <Field label="Vai trò">
            <Input value={user?.role === 'ADMIN' ? 'Quản trị viên' : user?.role || 'Admin'} disabled className="cursor-not-allowed bg-[#F7F5F2] text-[#9E8E7E]" />
          </Field>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  )
}

function SecurityTab() {
  const [show, setShow] = useState({ cur: false, new: false, conf: false })
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const toggle = (k) => setShow(s => ({ ...s, [k]: !s[k] }))
  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPw !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    if (form.newPw.length < 8) { setError('Mật khẩu mới phải có ít nhất 8 ký tự.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSaved(true)
    setForm({ current: '', newPw: '', confirm: '' })
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <SectionCard title="Đổi mật khẩu">
        <div className="flex flex-col gap-4 max-w-md">
          {[
            { label: 'Mật khẩu hiện tại', key: 'current', showKey: 'cur', value: form.current },
            { label: 'Mật khẩu mới', key: 'newPw', showKey: 'new', value: form.newPw },
            { label: 'Xác nhận mật khẩu mới', key: 'confirm', showKey: 'conf', value: form.confirm },
          ].map(({ label, key, showKey, value }) => (
            <Field key={key} label={label}>
              <div className="relative">
                <Input
                  type={show[showKey] ? 'text' : 'password'}
                  value={value}
                  onChange={set(key)}
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => toggle(showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E8E7E] hover:text-[#4E453D]"
                >
                  {show[showKey] ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          ))}
          {error && <p className="font-beVietnamPro text-sm text-red-500">{error}</p>}
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  )
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    orderStatus: true,
    weeklyReport: false,
    promotions: false,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const groups = [
    {
      title: 'Đơn hàng',
      items: [
        { key: 'newOrder', label: 'Đơn hàng mới' },
        { key: 'orderStatus', label: 'Thay đổi trạng thái đơn hàng' },
      ],
    },
    {
      title: 'Sản phẩm',
      items: [
        { key: 'lowStock', label: 'Cảnh báo tồn kho thấp' },
      ],
    },
    {
      title: 'Khách hàng & Marketing',
      items: [
        { key: 'newCustomer', label: 'Khách hàng mới đăng ký' },
        { key: 'weeklyReport', label: 'Báo cáo tuần' },
        { key: 'promotions', label: 'Thông báo khuyến mãi' },
      ],
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {groups.map(group => (
        <SectionCard key={group.title} title={group.title}>
          <div className="flex flex-col gap-3">
            {group.items.map(({ key, label }) => (
              <Toggle key={key} checked={prefs[key]} onChange={() => toggle(key)} label={label} />
            ))}
          </div>
        </SectionCard>
      ))}

      <div className="flex justify-end">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  )
}

function SystemTab() {
  const [settings, setSettings] = useState({
    shopName: 'Fashion Shop',
    currency: 'VND',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setSettings(s => ({ ...s, [k]: e.target.value }))
  const toggle = (k) => setSettings(s => ({ ...s, [k]: !s[k] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <SectionCard title="Cài đặt cửa hàng">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tên cửa hàng">
            <Input value={settings.shopName} onChange={set('shopName')} />
          </Field>
          <Field label="Đơn vị tiền tệ">
            <select
              value={settings.currency}
              onChange={set('currency')}
              className="w-full border border-[#D1C4B9] bg-white px-3 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none focus:border-[#6F583D]"
            >
              <option value="VND">VND — Việt Nam Đồng</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </Field>
          <Field label="Ngôn ngữ">
            <select
              value={settings.language}
              onChange={set('language')}
              className="w-full border border-[#D1C4B9] bg-white px-3 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none focus:border-[#6F583D]"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label="Múi giờ">
            <select
              value={settings.timezone}
              onChange={set('timezone')}
              className="w-full border border-[#D1C4B9] bg-white px-3 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] outline-none focus:border-[#6F583D]"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Chế độ bảo trì">
        <div className="flex flex-col gap-3">
          <Toggle
            checked={settings.maintenanceMode}
            onChange={() => toggle('maintenanceMode')}
            label="Kích hoạt chế độ bảo trì (khách hàng sẽ không truy cập được shop)"
          />
          {settings.maintenanceMode && (
            <p className="font-beVietnamPro text-xs text-amber-600 border border-amber-200 bg-amber-50 px-3 py-2">
              ⚠ Chế độ bảo trì đang bật. Khách hàng sẽ thấy trang thông báo bảo trì.
            </p>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  )
}

// ── Main ─────────────────────────────────────────────────────

export default function AdminSettings() {
  const user = useAuthStore(s => s.user)
  const [activeTab, setActiveTab] = useState('profile')

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab user={user} />
      case 'security': return <SecurityTab />
      case 'notifications': return <NotificationsTab />
      case 'system': return <SystemTab />
      default: return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">
      {/* Header */}
      <div>
        <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Cài đặt</h1>
        <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">Quản lý tài khoản và tuỳ chỉnh hệ thống</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar nav */}
        <nav className="flex shrink-0 flex-row gap-1 border border-[#D1C4B9] bg-white p-2 lg:w-52 lg:flex-col">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 font-beVietnamPro text-sm transition-colors ${
                activeTab === key
                  ? 'bg-[#1B1C19] text-white'
                  : 'text-[#4E453D] hover:bg-[#F0EEE9]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">{renderTab()}</div>
      </div>
    </div>
  )
}