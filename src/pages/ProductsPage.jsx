import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { FaWhatsapp, FaCalculator, FaFilter, FaStar, FaCheckCircle, FaShoppingCart } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import BackToTop from '../components/BackToTop'
import { imgUrl } from '../utils/asset'
import { deliveryOptions, getDeliveryCost, getDiscountPercent } from '../data/productsData'
import { db } from '../firebase/config'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'poultry', label: 'Poultry' },
  { key: 'pigs', label: 'Pigs' },
  { key: 'snails', label: 'Snails' },
  { key: 'fish', label: 'Fish' },
  { key: 'goats', label: 'Goats' },
]

const CURRENCY_RATE = 4200

function formatPrice(value, currency) {
  if (currency === 'NGN') return `₦ ${Number(value).toLocaleString()}`
  return `$ ${Number(value).toFixed(2)}`
}

function ProductCard({ product, currency }) {
  const { addItem } = useCart()
  const { currentUser } = useAuth()
  const [added, setAdded] = useState(false)

  const price = currency === 'NGN' ? product.priceNGN : (product.priceUSD || +(product.priceNGN / CURRENCY_RATE).toFixed(2))
  const stockLabel = product.stock > 50 ? 'In stock' : product.stock > 0 ? 'Low stock' : 'Out of stock'
  const stockColor = product.stock > 50 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-500'
  const outOfStock = product.stock <= 0

  const waMsg = encodeURIComponent(`Hello AgriGloria, I would like to order: ${product.title}. Please advise availability and pricing.`)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative">
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <FaStar size={10} /> Featured
        </div>
      )}
      <div className="h-48 overflow-hidden">
        <img
          src={imgUrl(product.image)}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={e => { e.target.src = imgUrl('Agri_logo.png') }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-dark-green text-lg mb-1">{product.title}</h3>
        <p className="text-gray-500 text-sm mb-3">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-black text-secondary">{formatPrice(price, currency)}</div>
            <div className="text-gray-400 text-xs">{product.unit}</div>
          </div>
          <span className={`text-xs font-semibold ${stockColor}`}>{stockLabel}</span>
        </div>
        <ul className="space-y-1 mb-4">
          {(product.features || []).map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
              <FaCheckCircle className="text-secondary flex-shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          {currentUser ? (
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex-1 flex items-center justify-center gap-1.5 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                added ? 'bg-green-600' : outOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-secondary hover:bg-tertiary'
              }`}
            >
              <FaShoppingCart size={12} /> {added ? 'Added!' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          ) : (
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-1.5 bg-secondary hover:bg-tertiary text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              <FaShoppingCart size={12} /> Login to Order
            </Link>
          )}
          <a
            href={`https://wa.me/2348031234567?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaWhatsapp /> Quote
          </a>
        </div>
      </div>
    </div>
  )
}

function BulkCalculator({ products, currency }) {
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState(50)
  const [location, setLocation] = useState('within-akamkpa')

  useEffect(() => { if (products.length && !productId) setProductId(products[0].id) }, [products])

  const product = products.find(p => p.id === productId) || products[0]
  if (!product) return null

  const unitPrice = currency === 'NGN' ? product.priceNGN : (product.priceUSD || +(product.priceNGN / CURRENCY_RATE).toFixed(2))
  const discountPercent = getDiscountPercent(qty)
  const subtotal = unitPrice * qty
  const discountAmount = (discountPercent / 100) * subtotal
  const deliveryCost = getDeliveryCost(qty, location)
  const total = subtotal - discountAmount + (currency === 'NGN' ? deliveryCost : +(deliveryCost / CURRENCY_RATE).toFixed(2))

  return (
    <div className="bg-dark-green text-white rounded-2xl p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaCalculator className="text-secondary" /> Bulk Purchase Calculator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Product</label>
          <select value={productId} onChange={e => setProductId(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-secondary">
            {products.map(p => <option key={p.id} value={p.id} className="text-black">{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Quantity</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-10 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">–</button>
            <input type="number" min="1" max="10000" value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm text-center focus:outline-none focus:border-secondary" />
            <button onClick={() => setQty(Math.min(10000, qty + 1))}
              className="w-9 h-10 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">+</button>
          </div>
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Delivery Location</label>
          <select value={location} onChange={e => setLocation(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-secondary">
            {deliveryOptions.map(o => <option key={o.value} value={o.value} className="text-black">{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-5 space-y-2 text-sm mb-5">
        {[
          ['Unit Price', formatPrice(unitPrice, currency)],
          ['Quantity', `${qty} ${product.unit}`],
          ['Discount', `${discountPercent}% — -${formatPrice(discountAmount, currency)}`],
          ['Delivery', formatPrice(currency === 'NGN' ? deliveryCost : +(deliveryCost / CURRENCY_RATE).toFixed(2), currency)],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-gray-300"><span>{label}</span><span>{value}</span></div>
        ))}
        <div className="flex justify-between font-bold text-white text-lg border-t border-white/20 pt-2">
          <span>Total</span><span className="text-secondary">{formatPrice(total, currency)}</span>
        </div>
      </div>

      <a href={`mailto:sales@agrigloria.com?subject=${encodeURIComponent(`Bulk Quote: ${product.title}`)}&body=${encodeURIComponent(`Product: ${product.title}\nQty: ${qty}\nLocation: ${location}\nCurrency: ${currency}`)}`}
        className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-tertiary text-white py-3 rounded-lg font-semibold transition-colors">
        Get Formal Quote
      </a>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [currency, setCurrency] = useState('NGN')

  useEffect(() => {
    getDocs(collection(db, 'products')).then(snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(
    () => products.filter(p => category === 'all' || p.category === category),
    [products, category]
  )

  return (
    <>
      <Navbar />
      <main>
        <div className="bg-dark-green text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Products & Pricing</h1>
          <p className="text-primary text-lg max-w-2xl mx-auto">
            Transparent pricing on premium, farm-fresh livestock. Bulk discounts available.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2 items-center">
              <FaFilter className="text-secondary" />
              {CATS.map(({ key, label }) => (
                <button key={key} onClick={() => setCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === key ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-secondary hover:text-secondary'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['NGN', 'USD'].map(cur => (
                <button key={cur} onClick={() => setCurrency(cur)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currency === cur ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No products found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filtered.map(product => <ProductCard key={product.id} product={product} currency={currency} />)}
            </div>
          )}

          {products.length > 0 && <BulkCalculator products={products} currency={currency} />}

          {products.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-dark-green mb-6">Price Comparison</h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-dark-green text-white">
                    <tr>
                      {['Product', 'AgriGloria Price', 'Market Average', 'You Save', 'Quality'].map(h => (
                        <th key={h} className="px-5 py-4 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => {
                      const ourPrice = currency === 'NGN' ? p.priceNGN : (p.priceUSD || +(p.priceNGN / CURRENCY_RATE).toFixed(2))
                      const marketPrice = currency === 'NGN' ? Math.round(p.priceNGN * 1.12) : +((p.priceNGN * 1.12) / CURRENCY_RATE).toFixed(2)
                      const savings = marketPrice - ourPrice
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium text-dark-green">{p.title}</td>
                          <td className="px-5 py-4 font-bold text-secondary">{formatPrice(ourPrice, currency)}</td>
                          <td className="px-5 py-4 text-gray-400 line-through">{formatPrice(marketPrice, currency)}</td>
                          <td className="px-5 py-4 text-green-600 font-medium">{formatPrice(savings, currency)}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.featured ? 'bg-secondary/10 text-secondary' : 'bg-green-100 text-green-700'}`}>
                              {p.featured ? 'Excellent' : 'Good'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
