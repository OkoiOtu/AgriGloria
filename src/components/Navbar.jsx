import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaBars, FaTimes, FaFacebookF, FaInstagram, FaWhatsapp,
  FaMapMarkerAlt, FaEnvelope, FaClock, FaQuestion, FaPhone, FaUser, FaShoppingCart,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { imgUrl } from '../utils/asset'

const NAV_LINKS = [
  { label: 'Home', hash: '#home', section: 'home' },
  { label: 'Livestock', hash: '#livestock', section: 'livestock' },
  { label: 'About Us', hash: '#about', section: 'about' },
  { label: 'Gallery', hash: '#gallery', section: 'gallery' },
  { label: 'News & Updates', hash: '#news', section: 'news' },
  { label: 'Products & Pricing', to: '/products' },
  { label: 'Contact Us', hash: '#contact', section: 'contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { currentUser, logout } = useAuth()
  const { totalItems, setIsOpen: openCart } = useCart()
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      if (!isHome) return
      const sections = ['home', 'livestock', 'about', 'gallery', 'news', 'contact']
      let current = 'home'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const closeMenu = () => setMenuOpen(false)

  const linkTo = (link) => {
    if (link.to) return link.to
    if (isHome) return link.hash
    return { pathname: '/', hash: link.hash }
  }

  const isLinkActive = (link) => {
    if (link.to) return location.pathname === link.to
    return isHome && activeSection === link.section
  }

  const activeClass = 'text-secondary border-b-2 border-secondary'
  const inactiveClass = 'text-farm-dark hover:text-secondary'

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMenu} />
      )}

      <header className="sticky top-0 w-full z-50">
        {/* Top Bar */}
        <div className="bg-dark-green text-white text-xs hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-2">
            <div className="flex items-center gap-5 flex-wrap">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-secondary" />
                02 Ayaebam Village, Akamkpa, Cross River, Nigeria
              </span>
              <a href="mailto:info@agrigloria.com" className="flex items-center gap-1 hover:text-secondary transition-colors">
                <FaEnvelope className="text-secondary" /> info@agrigloria.com
              </a>
              <span className="flex items-center gap-1">
                <FaClock className="text-secondary" /> Mon-Sat: 8:00AM - 6:00PM
              </span>
              <Link to={{ pathname: '/', hash: '#faq' }} className="flex items-center gap-1 hover:text-secondary transition-colors">
                <FaQuestion className="text-secondary" /> FAQs
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span>Follow Us:</span>
              <a href="#" aria-label="Facebook" className="hover:text-secondary transition-colors"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram" className="hover:text-secondary transition-colors"><FaInstagram /></a>
              <span className="text-gray-500">|</span>
              {currentUser ? (
                <button onClick={logout} className="flex items-center gap-1 hover:text-secondary transition-colors">
                  <FaUser /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-1 hover:text-secondary transition-colors">
                  <FaUser /> Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
              <img
                src={imgUrl('AgriGloria_logo.png')}
                alt="AgriGloria Farms & Holdings"
                className="h-10 md:h-14 w-auto"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={linkTo(link)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isLinkActive(link) ? activeClass : inactiveClass
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="text-secondary" />
                <div>
                  <p className="text-xs text-gray-500">Have Questions?</p>
                  <p className="font-bold text-dark-green">+234 803 123 4567</p>
                </div>
              </div>

              {/* Cart */}
              <button onClick={() => openCart(true)} className="relative p-2 text-farm-dark hover:text-secondary transition-colors">
                <FaShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Profile or Login */}
              {currentUser ? (
                <Link to="/profile" className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  <FaUser size={13} /> My Account
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  <FaUser size={13} /> Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-farm-dark"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-dark-green text-white z-50 transform transition-transform duration-300 lg:hidden overflow-y-auto ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <img src={imgUrl('AgriGloria_logo.png')} alt="AgriGloria" className="h-10" />
          <button onClick={closeMenu} aria-label="Close menu">
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="p-5 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={linkTo(link)}
              onClick={closeMenu}
              className="py-3 px-4 rounded hover:bg-white/10 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-white/10">
            {currentUser ? (
              <button
                onClick={() => { logout(); closeMenu() }}
                className="w-full py-3 px-4 rounded hover:bg-white/10 text-left font-medium flex items-center gap-2"
              >
                <FaUser /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full py-3 px-4 rounded bg-secondary hover:bg-tertiary text-center font-semibold block transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        <div className="p-5 border-t border-white/10 text-sm space-y-2 text-gray-300">
          <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-secondary" /> Ayaebam Village, Akamkpa</p>
          <p className="flex items-center gap-2"><FaEnvelope className="text-secondary" /> info@agrigloria.com</p>
          <p className="flex items-center gap-2"><FaClock className="text-secondary" /> Mon-Sat: 8:00AM - 6:00PM</p>
          <div className="flex gap-4 pt-2">
            <a href="#" aria-label="Facebook" className="hover:text-secondary"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="hover:text-secondary"><FaInstagram /></a>
            <a href="https://wa.me/2348031234567" aria-label="WhatsApp" className="hover:text-secondary"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
    </>
  )
}
