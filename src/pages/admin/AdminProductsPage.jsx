import { useEffect, useRef, useState } from 'react'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSeedling, FaImage } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { db } from '../../firebase/config'
import { logAction } from '../../utils/audit'
import { productsData } from '../../data/productsData'
import { imgUrl } from '../../utils/asset'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = ['poultry', 'pigs', 'snails', 'fish', 'goats', 'other']

const CATEGORY_UNITS = {
  poultry: ['per bird', 'per dozen', 'per kg', 'per carton', 'per tray'],
  pigs:    ['per pig', 'per kg', 'per pair'],
  snails:  ['per snail', 'per kg', 'per dozen', 'per basket'],
  fish:    ['per fish', 'per kg', 'per basket', 'per carton'],
  goats:   ['per goat', 'per kg', 'per pair'],
  other:   ['per unit', 'per kg', 'per bag', 'per piece'],
}

const EMPTY = {
  title: '', category: 'poultry', description: '',
  priceNGN: '', priceUSD: '', unit: 'per bird', stock: '',
  image: '', features: '', featured: false,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef(null)
  const { currentUser } = useAuth()

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, 'products'))
    setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })))
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setSaveError('')
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ ...p, features: Array.isArray(p.features) ? p.features.join(', ') : p.features || '' })
    setSaveError('')
    setShowModal(true)
  }

  const handleCategoryChange = (cat) => {
    const units = CATEGORY_UNITS[cat] || CATEGORY_UNITS.other
    setForm(f => ({ ...f, category: cat, unit: units[0] }))
  }

  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 600
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.65))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })

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
        priceNGN: Number(form.priceNGN),
        priceUSD: Number(form.priceUSD),
        stock: Number(form.stock),
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      }

      if (editing) {
        await updateDoc(doc(db, 'products', editing.id), data)
        await logAction('product_updated', `Updated product: ${data.title}`, currentUser)
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
        await logAction('product_created', `Created product: ${data.title}`, currentUser)
      }

      await fetchProducts()
      setShowModal(false)
    } catch (err) {
      console.error('Save failed:', err)
      setSaveError(
        err.code === 'not-found' ? 'Product record not found. Try deleting and re-adding it.' :
        err.code === 'invalid-argument' ? 'Image is too large. Try a smaller photo.' :
        'Failed to save. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id)
    await deleteDoc(doc(db, 'products', id))
    await logAction('product_deleted', `Deleted product: ${product?.title || id}`, currentUser)
    setDeleteConfirm(null)
    await fetchProducts()
  }

  const seedProducts = async () => {
    for (const p of productsData) {
      await addDoc(collection(db, 'products'), {
        ...p, features: p.features || [], createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      })
    }
    await fetchProducts()
  }

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const unitOptions = CATEGORY_UNITS[form.category] || CATEGORY_UNITS.other

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} in database</p>
        </div>
        <div className="flex gap-3">
          {products.length === 0 && !loading && (
            <button onClick={seedProducts}
              className="flex items-center gap-2 px-4 py-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-lg text-sm font-semibold transition-colors">
              <FaSeedling /> Import Default Products
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <FaSeedling className="text-5xl mx-auto mb-4 text-gray-200" />
            <p className="font-medium">No products found</p>
            <p className="text-sm mt-1">{products.length === 0 ? 'Click "Import Default Products" to get started.' : 'Try a different search.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Image', 'Name', 'Category', 'Price (NGN)', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={imgUrl(p.image)} alt={p.title} className="w-12 h-10 object-cover rounded-lg"
                        onError={e => { e.target.src = imgUrl('Agri_logo.png') }} />
                    </td>
                    <td className="px-4 py-3 font-medium text-dark-green max-w-[180px]">
                      <p className="truncate">{p.title}</p>
                      <p className="text-xs text-gray-400 truncate">{p.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">₦{Number(p.priceNGN).toLocaleString()}</td>
                    <td className="px-4 py-3">{p.stock ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></button>
                        <button onClick={() => setDeleteConfirm(p)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-dark-green">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Layer Chicken (Point-of-lay)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={form.category} onChange={e => handleCategoryChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary capitalize">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>

                {/* Unit — smart dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select required value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary">
                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                    {/* Keep the current value if it's a custom one not in the list */}
                    {form.unit && !unitOptions.includes(form.unit) && (
                      <option value={form.unit}>{form.unit}</option>
                    )}
                  </select>
                </div>

                {/* Price NGN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN) *</label>
                  <input required type="number" min="0" value={form.priceNGN} onChange={e => setForm(f => ({ ...f, priceNGN: e.target.value }))}
                    placeholder="4500"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                {/* Price USD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input type="number" min="0" step="0.01" value={form.priceUSD} onChange={e => setForm(f => ({ ...f, priceUSD: e.target.value }))}
                    placeholder="8.50"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="120"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                {/* Image — client-side compress + base64 */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="flex items-start gap-4">
                    {/* Preview box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-secondary flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-50 cursor-pointer transition-colors group"
                    >
                      {form.image ? (
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-300 group-hover:text-secondary transition-colors">
                          <FaImage size={22} />
                          <span className="text-xs mt-1">Click to upload</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 pt-1 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={compressing}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50"
                      >
                        {compressing ? 'Processing…' : form.image ? 'Change Image' : 'Choose Image'}
                      </button>
                      {form.image && !compressing && (
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, image: '' }))}
                          className="ml-2 text-xs text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-400">JPG, PNG or WebP. Auto-compressed to under 100 KB.</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2} placeholder="Short product description"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary resize-none" />
                </div>

                {/* Features */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <input value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                    placeholder="Vaccinated, High egg yield, Adapted to local climate"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary" />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-secondary" />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured</label>
                </div>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {saveError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-secondary hover:bg-tertiary text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}
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
            <h3 className="font-bold text-dark-green text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">"{deleteConfirm.title}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
