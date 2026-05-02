import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { FaBell, FaSearch, FaDownload, FaTrash, FaWhatsapp } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'

function exportCSV(subscribers) {
  const headers = ['Name', 'Email', 'Subscribed Date']
  const rows = subscribers.map(s => [
    s.name || '', s.email || '',
    s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString() : '',
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url
  a.download = `agrigloria_subscribers_${new Date().toISOString().slice(0, 10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchSubscribers = async () => {
    const snap = await getDocs(collection(db, 'subscribers'))
    const list = snap.docs
      .map(d => ({ ...d.data(), id: d.id }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    setSubscribers(list)
    setLoading(false)
  }

  useEffect(() => { fetchSubscribers() }, [])

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'subscribers', id))
    setSubscribers(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
  }

  const filtered = subscribers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString() : '—'

  // Build mailto link with all subscriber emails
  const mailtoAll = `mailto:${filtered.map(s => s.email).filter(Boolean).join(',')}`

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          {filtered.length > 0 && (
            <a href={mailtoAll}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-secondary text-gray-600 hover:text-secondary rounded-lg text-sm font-semibold transition-colors">
              Email All ({filtered.length})
            </a>
          )}
          <button onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-green hover:bg-dark-green/90 text-white rounded-lg text-sm font-semibold transition-colors">
            <FaDownload size={12} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaBell className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>{subscribers.length === 0 ? 'No subscribers yet.' : 'No results found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['#', 'Name', 'Email', 'Subscribed', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-dark-green">{s.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{fmt(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${s.email}`}
                          className="text-xs text-secondary hover:underline font-medium">Email</a>
                        {deleting === s.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(s.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-semibold">Confirm</button>
                            <button onClick={() => setDeleting(null)} className="text-xs text-gray-400">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleting(s.id)}
                            className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                            <FaTrash size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
