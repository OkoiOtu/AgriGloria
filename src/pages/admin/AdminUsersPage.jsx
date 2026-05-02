import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { FaUserShield, FaSearch } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'

const ROLES = ['admin', 'super_admin']
const ROLE_COLOR = {
  admin: 'bg-blue-100 text-blue-700',
  super_admin: 'bg-secondary/10 text-secondary',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const { currentUser } = useAuth()

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'))
    const list = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      // Only show admin and super_admin — not customers
      .filter(u => u.role === 'admin' || u.role === 'super_admin')
      .sort((a, b) => {
        const order = { super_admin: 0, admin: 1 }
        return (order[a.role] ?? 2) - (order[b.role] ?? 2)
      })
    setUsers(list)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const changeRole = async (userId, role) => {
    setUpdating(userId)
    await updateDoc(doc(db, 'users', userId), { role })
    await fetchUsers()
    setUpdating(null)
  }

  const filtered = users.filter(u =>
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString() : '—'

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-green">Manage Admin Users</h1>
        <p className="text-gray-500 text-sm mt-1">Promote or demote staff access. Super admins cannot be changed.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
        <strong>Note:</strong> Only admin and super_admin accounts are shown here. To grant admin access to a customer, go to the <strong>Customers</strong> page and promote them from there, or ask them to register and promote directly in Firestore.
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaUserShield className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>No admin users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Current Role', 'Change Role', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => {
                  const isSuperAdmin = u.role === 'super_admin'
                  const isMe = u.id === currentUser?.uid
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-dark-green">
                        {u.displayName || '—'}
                        {isMe && <span className="ml-2 text-xs text-secondary">(you)</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_COLOR[u.role] || 'bg-gray-100 text-gray-600'}`}>
                          {u.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isSuperAdmin ? (
                          <span className="text-xs text-gray-400 italic">Protected — cannot change</span>
                        ) : (
                          <>
                            <select
                              value={u.role || 'admin'}
                              onChange={e => changeRole(u.id, e.target.value)}
                              disabled={updating === u.id}
                              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-secondary capitalize disabled:opacity-50"
                            >
                              {ROLES.map(r => (
                                <option key={r} value={r} className="capitalize">
                                  {r.replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                            {updating === u.id && (
                              <span className="ml-2 text-xs text-gray-400">Saving…</span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{fmt(u.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
