import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { FaEnvelope, FaSearch, FaDownload, FaEye, FaTimes, FaCheck } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'

const SUBJECT_LABELS = {
  poultry: 'Poultry', pigs: 'Pig Farming', snails: 'Snail Farming',
  fish: 'Fish Farming', goats: 'Goat Farming', crops: 'Crop Farming',
  visit: 'Farm Visit', partnership: 'Partnership', other: 'Other',
}

function exportCSV(submissions) {
  const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date']
  const rows = submissions.map(s => [
    s.name, s.email, s.phone, SUBJECT_LABELS[s.subject] || s.subject,
    s.message, s.read ? 'Read' : 'Unread',
    s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString() : '',
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url
  a.download = `agrigloria_contact_${new Date().toISOString().slice(0, 10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchSubmissions = async () => {
    const snap = await getDocs(collection(db, 'contact_submissions'))
    const list = snap.docs
      .map(d => ({ ...d.data(), id: d.id }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    setSubmissions(list)
    setLoading(false)
  }

  useEffect(() => { fetchSubmissions() }, [])

  const markRead = async (id) => {
    await updateDoc(doc(db, 'contact_submissions', id), { read: true })
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: true } : s))
  }

  const openSubmission = (s) => {
    setSelected(s)
    if (!s.read) markRead(s.id)
  }

  const filtered = submissions.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.subject?.toLowerCase().includes(search.toLowerCase())
  )

  const unread = submissions.filter(s => !s.read).length
  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString() : '—'

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green flex items-center gap-2">
            Contact Submissions
            {unread > 0 && <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">{unread} new</span>}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{submissions.length} total message{submissions.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-green hover:bg-dark-green/90 text-white rounded-lg text-sm font-semibold transition-colors">
          <FaDownload size={12} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, subject…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaEnvelope className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>{submissions.length === 0 ? 'No contact submissions yet.' : 'No results found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Subject', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className={`hover:bg-gray-50 ${!s.read ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-3 font-medium text-dark-green">
                      {!s.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />}
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-secondary/10 text-secondary text-xs font-medium px-2 py-0.5 rounded-full capitalize">
                        {SUBJECT_LABELS[s.subject] || s.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                        {s.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openSubmission(s)}
                        className="flex items-center gap-1 text-secondary hover:underline text-xs font-medium">
                        <FaEye size={11} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark-green">Message from {selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-500">Name</p><p className="font-semibold">{selected.name}</p></div>
                <div><p className="text-gray-500">Phone</p><p className="font-semibold">{selected.phone || '—'}</p></div>
                <div><p className="text-gray-500">Email</p><p className="font-semibold break-all">{selected.email}</p></div>
                <div><p className="text-gray-500">Subject</p><p className="font-semibold capitalize">{SUBJECT_LABELS[selected.subject] || selected.subject}</p></div>
                <div className="col-span-2"><p className="text-gray-500">Date</p><p className="font-semibold">{fmt(selected.createdAt)}</p></div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed">{selected.message}</div>
              </div>
              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}?subject=Re: AgriGloria Inquiry`}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-tertiary text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  <FaEnvelope size={12} /> Reply by Email
                </a>
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hello ' + selected.name + ', thank you for contacting AgriGloria Farms.')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                    Reply via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
