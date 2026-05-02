import { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { FaLeaf, FaPlus, FaTrash, FaTimes } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'

const TAGS = ['Restocking', 'Health Check', 'Sale', 'Delivery', 'Maintenance', 'Feed', 'Staff', 'Other']

const TAG_COLOR = {
  Restocking: 'bg-green-100 text-green-700',
  'Health Check': 'bg-blue-100 text-blue-700',
  Sale: 'bg-secondary/10 text-secondary',
  Delivery: 'bg-purple-100 text-purple-700',
  Maintenance: 'bg-orange-100 text-orange-700',
  Feed: 'bg-lime-100 text-lime-700',
  Staff: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-600',
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [note, setNote] = useState('')
  const [tag, setTag] = useState('Other')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const { currentUser } = useAuth()

  const fetchLogs = async () => {
    const snap = await getDocs(collection(db, 'activity_log'))
    const list = snap.docs
      .map(d => ({ ...d.data(), id: d.id }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    setLogs(list)
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!note.trim()) return
    setSaving(true)
    await addDoc(collection(db, 'activity_log'), {
      note: note.trim(),
      tag,
      addedBy: currentUser?.displayName || currentUser?.email || 'Admin',
      createdAt: serverTimestamp(),
    })
    setNote('')
    setTag('Other')
    setShowForm(false)
    await fetchLogs()
    setSaving(false)
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'activity_log', id))
    setLogs(prev => prev.filter(l => l.id !== id))
    setDeleting(null)
  }

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString() : '—'

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Farm Activity Log</h1>
          <p className="text-gray-500 text-sm mt-1">Record daily farm events, restocking, health checks, and more.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
          <FaPlus /> Add Entry
        </button>
      </div>

      {/* Add entry form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-dark-green">New Activity Entry</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(t => (
                  <button key={t} type="button" onClick={() => setTag(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      tag === t ? TAG_COLOR[t] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note *</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                required
                placeholder="e.g. Restocked 200 broiler chicks from Calabar supplier. Cost: ₦180,000."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-5 py-2 bg-secondary hover:bg-tertiary text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-16 text-center text-gray-400">
          <FaLeaf className="text-5xl mx-auto mb-4 text-gray-200" />
          <p className="font-medium">No activity logged yet.</p>
          <p className="text-sm mt-1">Click "Add Entry" to record your first farm activity.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLOR[log.tag] || TAG_COLOR.Other}`}>
                  {log.tag}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-green leading-relaxed">{log.note}</p>
                <p className="text-xs text-gray-400 mt-1">{fmt(log.createdAt)} · by {log.addedBy}</p>
              </div>
              <div className="flex-shrink-0">
                {deleting === log.id ? (
                  <div className="flex items-center gap-2 text-xs">
                    <button onClick={() => handleDelete(log.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                    <button onClick={() => setDeleting(null)} className="text-gray-400">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleting(log.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
