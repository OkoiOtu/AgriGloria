import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { FaUser, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaSignOutAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function ProfilePage() {
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ displayName: '', phone: '', address: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setForm({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
      })
    }
  }, [userProfile])

  useEffect(() => {
    if (!currentUser) return
    async function fetchOrders() {
      const q = query(
        collection(db, 'orders'),
        where('customerId', '==', currentUser.uid)
      )
      const snap = await getDocs(q)
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setOrders(list)
      setLoadingOrders(false)
    }
    fetchOrders()
  }, [currentUser])

  const handleSave = async () => {
    setSaving(true)
    await updateDoc(doc(db, 'users', currentUser.uid), {
      displayName: form.displayName,
      phone: form.phone,
      address: form.address,
    })
    setSaving(false)
    setEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString() : '—'

  if (!currentUser) {
    return null // ProtectedRoute handles redirect
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-dark-green px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center">
                  <FaUser className="text-secondary text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{userProfile?.displayName || 'Customer'}</h1>
                  <p className="text-gray-400 text-sm">{currentUser.email}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <FaSignOutAlt /> Logout
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-dark-green">Personal Information</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-2 text-secondary hover:text-tertiary text-sm font-medium transition-colors">
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(false)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"><FaTimes /> Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-1 text-secondary hover:text-tertiary text-sm font-semibold disabled:opacity-60">
                      <FaSave /> {saving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: FaUser, label: 'Full Name', field: 'displayName', placeholder: 'Your full name' },
                  { icon: FaPhone, label: 'Phone Number', field: 'phone', placeholder: '+234 800 000 0000' },
                  { icon: FaMapMarkerAlt, label: 'Delivery Address', field: 'address', placeholder: 'Your delivery address', full: true },
                ].map(({ icon: Icon, label, field, placeholder, full }) => (
                  <div key={field} className={full ? 'sm:col-span-2' : ''}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                      <Icon className="text-secondary" /> {label}
                    </label>
                    {editing ? (
                      <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" />
                    ) : (
                      <p className="text-gray-800 text-sm">{userProfile?.[field] || <span className="text-gray-400 italic">Not provided</span>}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-2">
              <FaShoppingBag className="text-secondary" />
              <h2 className="font-bold text-dark-green">Order History</h2>
              <span className="ml-auto text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>

            {loadingOrders ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-7 h-7 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="px-8 py-12 text-center text-gray-400">
                <FaShoppingBag className="text-4xl mx-auto mb-3 text-gray-200" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm mt-1">Browse our products and place your first order.</p>
                <Link to="/products"
                  className="inline-block mt-4 bg-secondary hover:bg-tertiary text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map(o => (
                  <div key={o.id} className="px-8 py-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 font-mono">{o.paymentRef || o.id.slice(0, 12)}</p>
                        <p className="text-sm font-bold text-dark-green mt-0.5">₦{(o.total || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>
                          {o.status || 'pending'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">{fmt(o.createdAt)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {o.items?.map((item, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          {item.name} × {item.quantity} {item.unit} — ₦{(item.subtotal || item.priceNGN * item.quantity).toLocaleString()}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
