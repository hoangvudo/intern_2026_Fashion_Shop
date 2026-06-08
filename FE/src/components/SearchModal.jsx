import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function SearchModal({ open, onClose }){
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if(open){
      setTimeout(()=> inputRef.current?.focus(), 50)
      const onKey = (e) => { if(e.key === 'Escape') onClose() }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  function handleSubmit(e){
    e.preventDefault()
    const query = q.trim()
    if(!query) return
    onClose()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const suggestions = [
    'áo dài', 'váy đầm', 'quần tây', 'áo sơ mi'
  ].filter(s => s.includes(q.toLowerCase()))

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div initial={{ y: -10 }} animate={{ y: 0 }} exit={{ y: -10 }} className="relative w-full max-w-2xl mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm kiếm sản phẩm, bộ sưu tập..." className="flex-1 px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900" />
                <button type="submit" className="px-4 py-2 bg-black text-white rounded">Tìm</button>
              </form>

              {q && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="mb-2 text-xs text-gray-400">Gợi ý</div>
                  <div className="flex gap-2 flex-wrap">
                    {suggestions.length ? suggestions.map(s => (
                      <button key={s} onClick={() => { setQ(s); inputRef.current?.focus() }} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">{s}</button>
                    )) : <div className="text-sm text-gray-500">Không có gợi ý</div>}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
