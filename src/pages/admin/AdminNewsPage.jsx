import { useEffect, useRef, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaNewspaper, FaEye, FaEyeSlash } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { logAction } from '../../utils/audit'

const CATEGORIES = ['Farm Update', 'Tips & Guides', 'Market News', 'Health & Vet', 'Events', 'General']
const EMPTY = { title: '', excerpt: '', content: '', category: 'Farm Update', author: '', image: '', published: true }

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 900
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.72))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

export default function AdminNewsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [compressing, setCompressing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileInputRef = useRef(null)
  const { currentUser } = useAuth()

  const fetchPosts = async () => {
    const snap = await getDocs(collection(db, 'news'))
    setPosts(snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY, author: currentUser?.displayName || currentUser?.email || '' })
    setSaveError('')
    setShowModal(true)
  }

  const openEdit = (post) => {
    setEditing(post)
    setForm({ ...post })
    setSaveError('')
    setShowModal(true)
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCompressing(true)
    const base64 = await compressImage(file)
    setForm(f => ({ ...f, image: base64 }))
    setCompressing(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      const { id: _id, ...formData } = form
      const data = { ...formData, updatedAt: serverTimestamp() }
      if (editing) {
        await updateDoc(doc(db, 'news', editing.id), data)
        await logAction('news_updated', `Updated post: ${data.title}`, currentUser)
      } else {
        await addDoc(collection(db, 'news'), { ...data, views: 0, likedBy: [], createdAt: serverTimestamp() })
        await logAction('news_created', `Published post: ${data.title}`, currentUser)
      }
      await fetchPosts()
      setShowModal(false)
    } catch (err) {
      setSaveError(err.code === 'invalid-argument' ? 'Cover image too large. Try a smaller photo.' : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (post) => {
    await deleteDoc(doc(db, 'news', post.id))
    await logAction('news_deleted', `Deleted post: ${post.title}`, currentUser)
    setDeleteConfirm(null)
    await fetchPosts()
  }

  const togglePublished = async (post) => {
    await updateDoc(doc(db, 'news', post.id), { published: !post.published })
    await fetchPosts()
  }

  const fmt = (ts) => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString() : '—'

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">News & Updates</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
          <FaPlus /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-16 text-center text-gray-400">
          <FaNewspaper className="text-5xl mx-auto mb-4 text-gray-200" />
          <p>No posts yet. Click "New Post" to publish your first update.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Cover', 'Title', 'Category', 'Author', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {post.image
                        ? <img src={post.image} alt={post.title} className="w-14 h-10 object-cover rounded-lg" />
                        : <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><FaImage /></div>
                      }
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="font-medium text-dark-green truncate">{post.title}</p>
                      <p className="text-xs text-gray-400 truncate">{post.excerpt}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-secondary/10 text-secondary text-xs font-medium px-2 py-0.5 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{post.author || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{fmt(post.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(post)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          post.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        {post.published ? <><FaEye size={10} /> Published</> : <><FaEyeSlash size={10} /> Draft</>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(post)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></button>
                        <button onClick={() => setDeleteConfirm(post)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-dark-green">{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">

              {/* Cover image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="flex items-start gap-4">
                  <div onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-secondary flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-50 cursor-pointer group transition-colors">
                    {form.image
                      ? <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
                      : <div className="flex flex-col items-center text-gray-300 group-hover:text-secondary transition-colors"><FaImage size={20} /><span className="text-xs mt-1">Upload</span></div>
                    }
                  </div>
                  <div className="pt-1 space-y-1">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={compressing}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50">
                      {compressing ? 'Processing…' : form.image ? 'Change Image' : 'Choose Image'}
                    </button>
                    <p className="text-xs text-gray-400">Auto-compressed on upload</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Post title"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="Author name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt * <span className="text-gray-400 font-normal">(short summary shown on card)</span></label>
                <textarea required value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2} placeholder="Brief summary of the post..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content * <span className="text-gray-400 font-normal">(shown when customer opens the post)</span></label>
                <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={8} placeholder="Write the full article here..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary resize-y" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-secondary" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately (uncheck to save as draft)</label>
              </div>

              {saveError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{saveError}</div>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-secondary hover:bg-tertiary text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="font-bold text-dark-green text-lg mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-6">"{deleteConfirm.title}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
