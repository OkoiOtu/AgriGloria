import { useEffect, useRef, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaSeedling } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { logAction } from '../../utils/audit'

const CATEGORIES = ['poultry', 'pigs', 'snails', 'fish', 'goats', 'other']
const EMPTY = { name: '', category: 'poultry', description: '', breed: '', age: '', weight: '', location: '', tags: '', image: '' }

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 800
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

export default function AdminGalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [compressing, setCompressing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterCat, setFilterCat] = useState('all')
  const fileInputRef = useRef(null)
  const { currentUser } = useAuth()

  const fetchItems = async () => {
    const snap = await getDocs(collection(db, 'gallery'))
    setItems(snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setSaveError(''); setShowModal(true) }
  const openEdit = (item) => {
    setEditing(item)
    setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '' })
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
      const data = {
        ...formData,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      }
      if (editing) {
        await updateDoc(doc(db, 'gallery', editing.id), data)
        await logAction('gallery_updated', `Updated gallery item: ${data.name}`, currentUser)
      } else {
        await addDoc(collection(db, 'gallery'), { ...data, createdAt: serverTimestamp() })
        await logAction('gallery_created', `Added gallery item: ${data.name}`, currentUser)
      }
      await fetchItems()
      setShowModal(false)
    } catch (err) {
      setSaveError(err.code === 'invalid-argument' ? 'Image too large. Try a smaller photo.' : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    await deleteDoc(doc(db, 'gallery', item.id))
    await logAction('gallery_deleted', `Deleted gallery item: ${item.name}`, currentUser)
    setDeleteConfirm(null)
    await fetchItems()
  }

  const visible = filterCat === 'all' ? items : items.filter(i => i.category === filterCat)

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
          <FaPlus /> Add Photo
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filterCat === c ? 'bg-secondary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-secondary'}`}>
            {c} {c !== 'all' && `(${items.filter(i => i.category === c).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-16 text-center text-gray-400">
          <FaImage className="text-5xl mx-auto mb-4 text-gray-200" />
          <p>No gallery items yet. Click "Add Photo" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group relative">
              <div className="h-40 overflow-hidden bg-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={32} /></div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-dark-green text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400 capitalize">{item.category}{item.breed ? ` · ${item.breed}` : ''}</p>
              </div>
              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow">
                  <FaEdit size={11} />
                </button>
                <button onClick={() => setDeleteConfirm(item)}
                  className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow">
                  <FaTrash size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-dark-green">{editing ? 'Edit Gallery Item' : 'Add New Photo'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <div className="flex items-start gap-4">
                    <div onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-secondary flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-50 cursor-pointer transition-colors group">
                      {form.image
                        ? <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        : <div className="flex flex-col items-center text-gray-300 group-hover:text-secondary transition-colors"><FaImage size={22} /><span className="text-xs mt-1">Upload</span></div>
                      }
                    </div>
                    <div className="flex-1 pt-1 space-y-2">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={compressing}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50">
                        {compressing ? 'Processing…' : form.image ? 'Change Photo' : 'Choose Photo'}
                      </button>
                      <p className="text-xs text-gray-400">JPG, PNG or WebP — auto-compressed</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Broiler Chickens — Batch 12"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary capitalize">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                  <input value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                    placeholder="e.g. Cobb 500"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    placeholder="e.g. 6 weeks"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                    placeholder="e.g. 2.5 kg"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Pen A, Block 2"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2} placeholder="Short description of this photo"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary resize-none" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="Vaccinated, Free-range, High-yield"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>
              </div>

              {saveError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{saveError}</div>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-secondary hover:bg-tertiary text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Photo'}
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
            <h3 className="font-bold text-dark-green text-lg mb-2">Delete Photo?</h3>
            <p className="text-gray-500 text-sm mb-6">"{deleteConfirm.name}" will be permanently removed.</p>
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
