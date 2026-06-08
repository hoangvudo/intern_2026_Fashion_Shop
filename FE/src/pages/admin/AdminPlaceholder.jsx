function AdminPlaceholder({ title, description }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-10">
      <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">{title}</h1>
      <p className="max-w-md text-center font-beVietnamPro text-base text-[#4E453D]">
        {description}
      </p>
    </div>
  )
}

export default AdminPlaceholder
