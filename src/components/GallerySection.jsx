import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpandAlt, FaSearch, FaImage } from 'react-icons/fa'
import SectionHeader from './SectionHeader'
import { db } from '../firebase/config'

const PAGE_SIZE = 8

export default function GallerySection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!db) { setLoading(false); return }
    getDocs(collection(db, 'gallery')).then(snap => {
      const list = snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setItems(list)
      setLoading(false)
    })
  }, [])

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category))).filter(Boolean)]

  const filtered = items.filter(item => {
    const matchCat = activeFilter === 'all' || item.category === activeFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      item.name?.toLowerCase().includes(q) ||
      (item.breed || '').toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      (item.tags || []).some(t => t.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  const openLightbox = (idx) => { setLightbox(idx); document.body.style.overflow = 'hidden' }
  const closeLightbox = () => { setLightbox(null); document.body.style.overflow = '' }
  const prevLightbox = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length)
  const nextLightbox = () => setLightbox(i => (i + 1) % filtered.length)

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'ArrowLeft') prevLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const catCounts = {}
  categories.forEach(c => {
    catCounts[c] = c === 'all' ? items.length : items.filter(i => i.category === c).length
  })

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Our Livestock Gallery"
          subtitle="Premium quality livestock, documented with care and precision"
        />

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaImage className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>Gallery coming soon.</p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex flex-wrap gap-2 flex-1">
                {categories.map(c => (
                  <button key={c} onClick={() => { setActiveFilter(c); setPage(1) }}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                      activeFilter === c
                        ? 'bg-secondary text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-secondary hover:text-secondary'
                    }`}>
                    {c}
                    <span className={`ml-1.5 text-xs ${activeFilter === c ? 'text-white/80' : 'text-gray-400'}`}>
                      ({catCounts[c]})
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="search" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search livestock, breeds..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" />
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No results found. Try a different filter or search term.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {visible.map((item, idx) => (
                  <div key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer reveal"
                    onClick={() => openLightbox(idx)}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {item.image ? (
                        <img src={item.image} alt={item.name} loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200"><FaImage size={40} /></div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <FaExpandAlt className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="absolute top-2 right-2 bg-secondary/90 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-dark-green text-sm mb-1">{item.name}</h3>
                      {item.breed && <p className="text-xs text-gray-500 mb-2">{item.breed}</p>}
                      <div className="flex flex-wrap gap-1">
                        {(item.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-10 reveal">
                <button onClick={() => setPage(p => p + 1)}
                  className="bg-secondary hover:bg-tertiary text-white px-10 py-3 rounded-lg font-semibold transition-colors">
                  Load More Livestock
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={e => e.stopPropagation()}>
            <button onClick={closeLightbox}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center">
              <FaTimes />
            </button>
            <div className="md:w-2/3 bg-black flex items-center justify-center relative min-h-64">
              {filtered[lightbox].image ? (
                <img src={filtered[lightbox].image} alt={filtered[lightbox].name}
                  className="max-h-[60vh] md:max-h-[80vh] w-full object-contain" />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-600"><FaImage size={48} /></div>
              )}
              <button onClick={prevLightbox}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center">
                <FaChevronLeft />
              </button>
              <button onClick={nextLightbox}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center">
                <FaChevronRight />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {lightbox + 1} / {filtered.length}
              </span>
            </div>
            <div className="md:w-1/3 p-6 overflow-y-auto">
              <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full uppercase mb-3 capitalize">
                {filtered[lightbox].category}
              </span>
              <h3 className="text-xl font-bold text-dark-green mb-2">{filtered[lightbox].name}</h3>
              <p className="text-gray-600 text-sm mb-4">{filtered[lightbox].description}</p>
              <dl className="space-y-2 text-sm">
                {filtered[lightbox].breed && <div className="flex gap-2"><dt className="font-medium text-gray-500 w-20">Breed:</dt><dd>{filtered[lightbox].breed}</dd></div>}
                {filtered[lightbox].age && <div className="flex gap-2"><dt className="font-medium text-gray-500 w-20">Age:</dt><dd>{filtered[lightbox].age}</dd></div>}
                {filtered[lightbox].weight && <div className="flex gap-2"><dt className="font-medium text-gray-500 w-20">Weight:</dt><dd>{filtered[lightbox].weight}</dd></div>}
                {filtered[lightbox].location && <div className="flex gap-2"><dt className="font-medium text-gray-500 w-20">Location:</dt><dd>{filtered[lightbox].location}</dd></div>}
              </dl>
              <div className="flex flex-wrap gap-2 mt-4">
                {(filtered[lightbox].tags || []).map(tag => (
                  <span key={tag} className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
