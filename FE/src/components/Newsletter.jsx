import { useState } from 'react'

export default function Newsletter(){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      setStatus('Vui lòng nhập email hợp lệ')
      return
    }
    // Placeholder: integrate with API later
    setStatus('Cảm ơn! Đã đăng ký nhận tin.')
    setEmail('')
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Đăng ký nhận tin</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Nhận mã giảm giá và thông báo bộ sưu tập mới nhất.</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus('') }}
            placeholder="Nhập email của bạn"
            className="w-full sm:w-auto min-w-[260px] px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button className="px-5 py-2 bg-black text-white rounded-md">Đăng ký</button>
        </form>

        {status && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{status}</p>}
      </div>
    </section>
  )
}
