import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  FaBoxOpen, FaShoppingCart, FaUsers, FaMoneyBillWave,
  FaClock, FaLeaf, FaExclamationTriangle, FaTrophy,
} from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const PIE_COLORS = ['#EAB308', '#3B82F6', '#A855F7', '#22C55E', '#EF4444']
const LOW_STOCK_THRESHOLD = 10

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildMonthlyRevenue(orders) {
  const now = new Date()
  const result = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({ month: MONTHS[d.getMonth()], revenue: 0, _year: d.getFullYear(), _month: d.getMonth() })
  }
  for (const o of orders) {
    if (o.paymentStatus !== 'paid') continue
    const ts = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000) : null
    if (!ts) continue
    const slot = result.find(r => r._year === ts.getFullYear() && r._month === ts.getMonth())
    if (slot) slot.revenue += o.total || 0
  }
  return result
}

function buildStatusBreakdown(orders) {
  const counts = {}
  for (const o of orders) {
    const s = o.status || 'pending'
    counts[s] = (counts[s] || 0) + 1
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

function buildTopProducts(orders) {
  const tally = {}
  for (const o of orders) {
    for (const item of o.items || []) {
      const key = item.title || item.id
      if (!tally[key]) tally[key] = { title: key, qty: 0, revenue: 0 }
      tally[key].qty += item.qty || item.quantity || 1
      tally[key].revenue += (item.priceNGN || 0) * (item.qty || item.quantity || 1)
    }
  }
  return Object.values(tally).sort((a, b) => b.qty - a.qty).slice(0, 5)
}

const fmt = (n) => `₦${Number(n).toLocaleString()}`

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [statusBreakdown, setStatusBreakdown] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const [prodSnap, ordersSnap, custSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'users')),
      ])

      const products = prodSnap.docs.map(d => ({ ...d.data(), id: d.id }))
      const orders = ordersSnap.docs.map(d => ({ ...d.data(), id: d.id }))
      const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.total || 0), 0)
      const customers = custSnap.docs.filter(d => d.data().role === 'customer').length

      setStats({ products: prodSnap.size, orders: orders.length, customers, revenue })

      const sorted = [...orders].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setRecentOrders(sorted.slice(0, 6))
      setMonthlyRevenue(buildMonthlyRevenue(orders))
      setStatusBreakdown(buildStatusBreakdown(orders))
      setTopProducts(buildTopProducts(orders))
      setLowStock(products.filter(p => (p.stock ?? 999) <= LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock))
      setLoading(false)
    }
    fetchAll()
  }, [])

  const CARDS = [
    { icon: FaBoxOpen, label: 'Total Products', value: stats.products, color: 'text-secondary bg-secondary/10' },
    { icon: FaShoppingCart, label: 'Total Orders', value: stats.orders, color: 'text-blue-600 bg-blue-100' },
    { icon: FaUsers, label: 'Registered Customers', value: stats.customers, color: 'text-green-600 bg-green-100' },
    { icon: FaMoneyBillWave, label: 'Total Revenue (NGN)', value: fmt(stats.revenue), color: 'text-purple-600 bg-purple-100' },
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-green">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening on your farm.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {CARDS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="text-xl" />
                </div>
                <div className="text-3xl font-black text-dark-green mb-1">{value}</div>
                <div className="text-gray-500 text-sm">{label}</div>
              </div>
            ))}
          </div>

          {/* Low stock alert */}
          {lowStock.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FaExclamationTriangle className="text-orange-500" />
                <h2 className="font-bold text-orange-800">Low Stock Alert — {lowStock.length} product{lowStock.length !== 1 ? 's' : ''} need restocking</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {lowStock.map(p => (
                  <div key={p.id} className="bg-white border border-orange-200 rounded-xl px-4 py-2 flex items-center gap-3">
                    <span className="text-sm font-medium text-dark-green">{p.title}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Revenue chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-dark-green mb-6">Revenue — Last 6 Months (Paid Orders)</h2>
              {monthlyRevenue.every(m => m.revenue === 0) ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No paid orders yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyRevenue} barSize={32}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip formatter={(v) => [fmt(v), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#CBA05A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Order status pie */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-dark-green mb-6">Orders by Status</h2>
              {statusBreakdown.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No orders yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {statusBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top products + Recent orders row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Top selling products */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FaTrophy className="text-secondary" />
                <h2 className="font-bold text-dark-green">Top Selling Products</h2>
              </div>
              {topProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No order data yet.</div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={p.title} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-green truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.qty} sold · {fmt(p.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent orders */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaClock className="text-secondary" />
                <h2 className="font-bold text-dark-green">Recent Orders</h2>
              </div>
              {recentOrders.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  <FaLeaf className="text-4xl mx-auto mb-3 text-gray-200" />
                  No orders yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                          <th key={h} className="px-6 py-3 text-left font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-dark-green">{o.customerName || o.customerEmail}</td>
                          <td className="px-6 py-4 text-gray-500">{o.items?.length || 0} item(s)</td>
                          <td className="px-6 py-4 font-semibold">{fmt(o.total || 0)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>
                              {o.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  )
}
