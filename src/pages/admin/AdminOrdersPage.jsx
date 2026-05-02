import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { FaShoppingCart, FaTimes, FaDownload, FaPrint, FaCheckSquare } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'
import { logAction } from '../../utils/audit'
import { useAuth } from '../../context/AuthContext'

const STATUSES = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function exportCSV(orders) {
  const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Items', 'Total (NGN)', 'Payment', 'Status', 'Date', 'Delivery Address']
  const rows = orders.map(o => [
    o.id,
    o.customerName || '',
    o.customerEmail || '',
    o.customerPhone || '',
    (o.items || []).map(i => `${i.name} x${i.quantity}`).join(' | '),
    o.total || 0,
    o.paymentStatus || 'unpaid',
    o.status || 'pending',
    o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString() : '',
    o.deliveryAddress || '',
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agrigloria_orders_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function printReceipt(order) {
  const fmt = (n) => `₦${Number(n).toLocaleString()}`
  const date = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : '—'
  const win = window.open('', '_blank', 'width=480,height=700')
  win.document.write(`
    <html><head><title>AgriGloria Receipt</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 13px; padding: 24px; color: #222; }
      h1 { font-size: 20px; color: #353C1F; margin: 0 0 4px; }
      .sub { color: #888; font-size: 12px; margin-bottom: 20px; }
      .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
      .row { display: flex; justify-content: space-between; padding: 4px 0; }
      .label { color: #666; }
      .total { font-weight: bold; font-size: 15px; margin-top: 4px; }
      .badge { background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:99px; font-size:11px; }
      @media print { body { padding: 0; } }
    </style></head><body>
    <h1>AgriGloria Farms & Holdings</h1>
    <p class="sub">Order Receipt &nbsp;|&nbsp; ${date}</p>
    <div class="divider"></div>
    <div class="row"><span class="label">Customer</span><span>${order.customerName || '—'}</span></div>
    <div class="row"><span class="label">Email</span><span>${order.customerEmail || '—'}</span></div>
    <div class="row"><span class="label">Phone</span><span>${order.customerPhone || '—'}</span></div>
    <div class="row"><span class="label">Delivery Address</span><span>${order.deliveryAddress || '—'}</span></div>
    <div class="row"><span class="label">Payment Ref</span><span>${order.paymentRef || '—'}</span></div>
    <div class="row"><span class="label">Payment</span><span class="badge">${order.paymentStatus || 'unpaid'}</span></div>
    <div class="divider"></div>
    <p style="font-weight:bold;margin-bottom:8px;">Items Ordered</p>
    ${(order.items || []).map(i => `
      <div class="row">
        <span>${i.name} × ${i.quantity} ${i.unit || ''}</span>
        <span>${fmt(i.subtotal || (i.priceNGN * i.quantity))}</span>
      </div>`).join('')}
    <div class="divider"></div>
    <div class="row total"><span>Total</span><span>${fmt(order.total || 0)}</span></div>
    <div class="divider"></div>
    <p style="color:#888;font-size:11px;text-align:center;margin-top:16px;">Thank you for choosing AgriGloria Farms & Holdings</p>
    <script>window.onload = () => { window.print(); }<\/script>
    </body></html>
  `)
  win.document.close()
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState([])
  const [bulkStatus, setBulkStatus] = useState('confirmed')
  const [updating, setUpdating] = useState(false)
  const [confirmingPay, setConfirmingPay] = useState(false)
  const { currentUser } = useAuth()

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, 'orders'))
    const list = snap.docs
      .map(d => ({ ...d.data(), id: d.id }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    setOrders(list)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? orders : orders.filter(o => o.status === filter)
    if (dateFrom) list = list.filter(o => o.createdAt?.seconds && new Date(o.createdAt.seconds * 1000) >= new Date(dateFrom))
    if (dateTo) list = list.filter(o => o.createdAt?.seconds && new Date(o.createdAt.seconds * 1000) <= new Date(dateTo + 'T23:59:59'))
    return list
  }, [orders, filter, dateFrom, dateTo])

  const allChecked = filtered.length > 0 && checked.length === filtered.length
  const toggleAll = () => setChecked(allChecked ? [] : filtered.map(o => o.id))
  const toggleOne = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const updateStatus = async (orderId, status) => {
    setUpdating(true)
    await updateDoc(doc(db, 'orders', orderId), { status })
    await logAction('order_status_changed', `Order ${orderId} → ${status}`, currentUser)
    await fetchOrders()
    if (selected?.id === orderId) setSelected(prev => ({ ...prev, status }))
    setUpdating(false)
  }

  const applyBulk = async () => {
    if (!checked.length) return
    setUpdating(true)
    await Promise.all(checked.map(id => updateDoc(doc(db, 'orders', id), { status: bulkStatus })))
    setChecked([])
    await fetchOrders()
    setUpdating(false)
  }

  const confirmPayment = async (order) => {
    setConfirmingPay(true)
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'paid',
      paymentRef: `MANUAL_${Date.now()}`,
      paymentConfirmedAt: serverTimestamp(),
    })
    await logAction('payment_confirmed', `Manual payment confirmed for order ${order.id} (${order.customerName || order.customerEmail})`, currentUser)
    await fetchOrders()
    setSelected(prev => prev ? { ...prev, paymentStatus: 'paid' } : null)
    setConfirmingPay(false)
  }

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString() : '—'

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-green hover:bg-dark-green/90 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <FaDownload size={12} /> Export CSV ({filtered.length})
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => { setFilter(s); setChecked([]) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-sm text-gray-500 font-medium">Date range:</span>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-secondary" />
        <span className="text-gray-400 text-sm">to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-secondary" />
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo('') }}
            className="text-xs text-red-400 hover:text-red-600 font-medium">Clear</button>
        )}
      </div>

      {/* Bulk action bar */}
      {checked.length > 0 && (
        <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-3 mb-4">
          <FaCheckSquare className="text-secondary" />
          <span className="text-sm font-medium text-dark-green">{checked.length} selected</span>
          <span className="text-gray-400 text-sm">→ Change to:</span>
          <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-secondary capitalize">
            {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <button onClick={applyBulk} disabled={updating}
            className="px-4 py-1.5 bg-secondary hover:bg-tertiary text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
            {updating ? 'Applying…' : 'Apply'}
          </button>
          <button onClick={() => setChecked([])} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaShoppingCart className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>No {filter !== 'all' ? filter : ''} orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-secondary" />
                  </th>
                  {['Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className={`hover:bg-gray-50 ${checked.includes(o.id) ? 'bg-secondary/5' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={checked.includes(o.id)} onChange={() => toggleOne(o.id)} className="accent-secondary" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark-green">{o.customerName || '—'}</p>
                      <p className="text-xs text-gray-400">{o.customerEmail}</p>
                      {o.customerPhone && <p className="text-xs text-gray-400">{o.customerPhone}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">₦{(o.total || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{o.paymentStatus || 'unpaid'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={o.status || 'pending'} onChange={e => updateStatus(o.id, e.target.value)}
                        disabled={updating}
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer capitalize ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(o)}
                        className="text-secondary hover:underline text-xs font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark-green">Order Details</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => printReceipt(selected)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-dark-green border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                  <FaPrint size={11} /> Print Receipt
                </button>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-500">Customer</p><p className="font-semibold">{selected.customerName || '—'}</p></div>
                <div><p className="text-gray-500">Email</p><p className="font-semibold break-all">{selected.customerEmail || '—'}</p></div>
                <div><p className="text-gray-500">Phone</p><p className="font-semibold">{selected.customerPhone || '—'}</p></div>
                <div><p className="text-gray-500">Date</p><p className="font-semibold">{fmt(selected.createdAt)}</p></div>
                <div><p className="text-gray-500">Payment Ref</p><p className="font-mono text-xs break-all">{selected.paymentRef || '—'}</p></div>
                <div>
                  <p className="text-gray-500 mb-1">Payment Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selected.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selected.paymentStatus || 'unpaid'}
                  </span>
                </div>
              </div>

              {/* Manual payment confirm */}
              {selected.paymentStatus !== 'paid' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 mb-3 font-medium">Payment not yet confirmed. Did this customer pay via bank transfer or USSD?</p>
                  <button onClick={() => confirmPayment(selected)} disabled={confirmingPay}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
                    {confirmingPay ? 'Confirming…' : '✓ Mark as Paid (Manual)'}
                  </button>
                </div>
              )}

              {selected.deliveryAddress && (
                <div><p className="text-gray-500">Delivery Address</p><p className="font-semibold">{selected.deliveryAddress}</p></div>
              )}
              {selected.notes && (
                <div><p className="text-gray-500">Notes</p><p className="text-gray-700">{selected.notes}</p></div>
              )}

              <div>
                <p className="text-gray-500 mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span>{item.name} × {item.quantity} {item.unit}</span>
                      <span className="font-semibold">₦{(item.subtotal || item.priceNGN * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between font-bold text-base border-t pt-3">
                <span>Total</span>
                <span>₦{(selected.total || 0).toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Update Status</label>
                <select value={selected.status || 'pending'} onChange={e => updateStatus(selected.id, e.target.value)}
                  disabled={updating}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary capitalize">
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
