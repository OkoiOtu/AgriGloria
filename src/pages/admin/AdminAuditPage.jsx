import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { FaShieldAlt, FaSearch } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'

const ACTION_STYLE = {
  product_created:    { label: 'Product Created',    color: 'bg-green-100 text-green-700' },
  product_updated:    { label: 'Product Updated',    color: 'bg-blue-100 text-blue-700' },
  product_deleted:    { label: 'Product Deleted',    color: 'bg-red-100 text-red-700' },
  order_status_changed: { label: 'Order Status',     color: 'bg-purple-100 text-purple-700' },
  payment_confirmed:  { label: 'Payment Confirmed',  color: 'bg-secondary/10 text-secondary' },
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchLogs() {
      const snap = await getDocs(collection(db, 'audit_log'))
      const list = snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setLogs(list)
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const filtered = logs.filter(l =>
    l.details?.toLowerCase().includes(search.toLowerCase()) ||
    l.performedBy?.toLowerCase().includes(search.toLowerCase()) ||
    l.action?.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString() : '—'

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-green flex items-center gap-2">
          <FaShieldAlt className="text-secondary" /> Audit Log
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track all admin actions across the system.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by action or admin name…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaShieldAlt className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>{logs.length === 0 ? 'No actions recorded yet.' : 'No results found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Action', 'Details', 'Performed By', 'Date & Time'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(log => {
                  const style = ACTION_STYLE[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${style.color}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs">{log.details}</td>
                      <td className="px-4 py-3 font-medium text-dark-green whitespace-nowrap">{log.performedBy}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(log.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Last login section from admin users */}
      <LastLoginSection />
    </AdminLayout>
  )
}

function LastLoginSection() {
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(collection(db, 'users'))
      const list = snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter(u => u.role === 'admin' || u.role === 'super_admin')
        .sort((a, b) => (b.lastLoginAt?.seconds || 0) - (a.lastLoginAt?.seconds || 0))
      setAdmins(list)
    }
    fetch()
  }, [])

  if (!admins.length) return null

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString() : 'Never recorded'

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-dark-green">Admin Last Login</h2>
      </div>
      <div className="divide-y divide-gray-50">
        {admins.map(a => (
          <div key={a.id} className="px-6 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-dark-green text-sm">{a.displayName || a.email}</p>
              <p className="text-xs text-gray-400 capitalize">{a.role?.replace('_', ' ')}</p>
            </div>
            <p className="text-xs text-gray-500">{fmt(a.lastLoginAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
