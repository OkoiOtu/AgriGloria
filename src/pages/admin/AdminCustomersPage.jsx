import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { FaUsers, FaSearch, FaDownload, FaWhatsapp, FaTimes, FaCheckCircle } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'

function exportCSV(customers) {
  const headers = ['Name', 'Email', 'Phone', 'Address', 'Orders', 'Total Spent (NGN)', 'Last Order', 'Joined']
  const rows = customers.map(c => [
    c.displayName || '',
    c.email || '',
    c.phone || '',
    c.address || '',
    c.orderCount,
    c.totalSpent,
    c.lastOrderDate || '',
    c.joinedDate || '',
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agrigloria_customers_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [checked, setChecked] = useState([])
  const [waModal, setWaModal] = useState(false)
  const [waMessage, setWaMessage] = useState('Hello, this is AgriGloria Farms. We have a special offer for you!')

  useEffect(() => {
    async function fetchAll() {
      const [usersSnap, ordersSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'orders')),
      ])

      // Build per-customer order stats
      const orderStats = {}
      ordersSnap.docs.forEach(d => {
        const o = d.data()
        const cid = o.customerId
        if (!cid) return
        if (!orderStats[cid]) orderStats[cid] = { count: 0, spent: 0, lastTs: 0 }
        orderStats[cid].count += 1
        if (o.paymentStatus === 'paid') orderStats[cid].spent += o.total || 0
        const ts = o.createdAt?.seconds || 0
        if (ts > orderStats[cid].lastTs) orderStats[cid].lastTs = ts
      })

      const list = usersSnap.docs
        .map(d => {
          const data = d.data()
          const stats = orderStats[d.id] || { count: 0, spent: 0, lastTs: 0 }
          return {
            id: d.id,
            ...data,
            orderCount: stats.count,
            totalSpent: stats.spent,
            lastOrderDate: stats.lastTs ? new Date(stats.lastTs * 1000).toLocaleDateString() : null,
            joinedDate: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '—',
          }
        })
        .filter(u => u.role === 'customer')
        .sort((a, b) => b.totalSpent - a.totalSpent)

      setCustomers(list)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = useMemo(() => customers.filter(c =>
    c.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  ), [customers, search])

  const allChecked = filtered.length > 0 && checked.length === filtered.length
  const toggleAll = () => setChecked(allChecked ? [] : filtered.map(c => c.id))
  const toggleOne = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectedCustomers = customers.filter(c => checked.includes(c.id))
  const withPhone = selectedCustomers.filter(c => c.phone)

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">{customers.length} registered customer{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-green hover:bg-dark-green/90 text-white rounded-lg text-sm font-semibold transition-colors">
          <FaDownload size={12} /> Export CSV ({filtered.length})
        </button>
      </div>

      {/* Bulk WhatsApp bar */}
      {checked.length > 0 && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
          <FaWhatsapp className="text-green-600" />
          <span className="text-sm font-medium text-green-800">{checked.length} selected</span>
          <span className="text-gray-400 text-sm">·</span>
          <span className="text-sm text-green-700">{withPhone.length} have phone numbers</span>
          <button
            onClick={() => setWaModal(true)}
            disabled={withPhone.length === 0}
            className="ml-2 flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
          >
            <FaWhatsapp /> Send WhatsApp Message
          </button>
          <button onClick={() => setChecked([])} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or phone…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaUsers className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>{customers.length === 0 ? 'No registered customers yet.' : 'No customers match your search.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-secondary" />
                  </th>
                  {['Customer', 'Phone', 'Orders', 'Total Spent', 'Last Order', 'Joined', 'WhatsApp'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className={`hover:bg-gray-50 ${checked.includes(c.id) ? 'bg-secondary/5' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={checked.includes(c.id)} onChange={() => toggleOne(c.id)} className="accent-secondary" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-dark-green">{c.displayName || '—'}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                        {c.orderCount > 1 && (
                          <span className="flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                            <FaCheckCircle size={9} /> Repeat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          c.orderCount === 0 ? 'bg-gray-100 text-gray-500'
                          : c.orderCount === 1 ? 'bg-blue-100 text-blue-700'
                          : 'bg-secondary/10 text-secondary'
                        }`}>{c.orderCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-dark-green">
                      {c.totalSpent > 0 ? `₦${c.totalSpent.toLocaleString()}` : <span className="text-gray-400 font-normal">₦0</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.lastOrderDate || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-400">{c.joinedDate}</td>
                    <td className="px-4 py-3">
                      {c.phone ? (
                        <a
                          href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hello ' + (c.displayName || '') + ', this is AgriGloria Farms.')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                        >
                          <FaWhatsapp size={14} />
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">No phone</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk WhatsApp modal */}
      {waModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark-green flex items-center gap-2">
                <FaWhatsapp className="text-green-600" /> Bulk WhatsApp Message
              </h2>
              <button onClick={() => setWaModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={waMessage}
                  onChange={e => setWaMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary resize-none"
                />
              </div>
              <p className="text-sm text-gray-500">Click a link below to open WhatsApp for each customer:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {withPhone.map(c => (
                  <a
                    key={c.id}
                    href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-2.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-medium text-green-900 text-sm">{c.displayName || c.email}</p>
                      <p className="text-xs text-green-700">{c.phone}</p>
                    </div>
                    <FaWhatsapp className="text-green-600" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
