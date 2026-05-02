import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { imgUrl } from '../utils/asset'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Livestock', href: '#livestock' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'News & Updates', href: '#news' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'subscribers'), {
        email: email.trim(),
        source: 'footer',
        createdAt: serverTimestamp(),
      })
      setMsg('success')
      setEmail('')
    } catch {
      setMsg('error')
    } finally {
      setSubmitting(false)
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="bg-farm-dark text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link to="/">
            <img
              src={imgUrl('AgriGloria_logo.png')}
              alt="AgriGloria Farms & Holdings"
              className="h-14 mb-4"
            />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            Located in Ayaebam Village, Akamkpa, Cross River State, Nigeria.
          </p>
          <p className="text-gray-500 text-xs">Open Mon–Sat: 8:00AM – 6:00PM</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-5 uppercase text-sm tracking-wider">Quick Links</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-gray-400 hover:text-secondary text-sm transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/products" className="text-gray-400 hover:text-secondary text-sm transition-colors">
                Products & Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-5 uppercase text-sm tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400 mb-5">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-secondary mt-0.5 flex-shrink-0" />
              02 Ayaebam Village, Akamkpa, Cross River, Nigeria
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-secondary flex-shrink-0" />
              <a href="tel:+2348031234567" className="hover:text-secondary transition-colors">+234 803 123 4567</a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-secondary flex-shrink-0" />
              <a href="mailto:info@agrigloria.com" className="hover:text-secondary transition-colors">info@agrigloria.com</a>
            </li>
          </ul>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="w-9 h-9 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
              <FaFacebookF size={14} />
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
              <FaInstagram size={14} />
            </a>
            <a href="https://wa.me/2348031234567" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
              <FaWhatsapp size={14} />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-white mb-5 uppercase text-sm tracking-wider">Subscribe</h4>
          <p className="text-gray-400 text-sm mb-4">Get weekly updates, pricing, and exclusive offers.</p>
          {msg === 'success' ? (
            <p className="text-green-400 text-sm">✓ Subscribed! Thank you.</p>
          ) : (
            <form onSubmit={handleSubscribe} noValidate>
              <div className="flex gap-2 mb-2">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" required
                  aria-label="Newsletter email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                />
                <button
                  type="submit" disabled={submitting}
                  className="bg-secondary hover:bg-tertiary text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  {submitting ? '...' : 'Go'}
                </button>
              </div>
              {msg === 'error' && <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {year} AgriGloria Farms &amp; Holdings. All rights reserved.</p>
          <nav className="flex gap-5">
            <a href="#" className="hover:text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms</a>
            <a href="#contact" className="hover:text-secondary transition-colors">Support</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
