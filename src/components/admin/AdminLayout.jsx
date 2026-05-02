import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaChartBar, FaBoxOpen, FaShoppingCart, FaUsers, FaUserShield,
  FaBars, FaTimes, FaSignOutAlt, FaEnvelope, FaBell, FaLeaf, FaShieldAlt,
  FaImage, FaNewspaper,
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { imgUrl } from '../../utils/asset'

const NAV = [
  { to: '/admin/dashboard', icon: FaChartBar, label: 'Dashboard' },
  { to: '/admin/products', icon: FaBoxOpen, label: 'Products' },
  { to: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: FaUsers, label: 'Customers' },
  { to: '/admin/gallery', icon: FaImage, label: 'Gallery' },
  { to: '/admin/news', icon: FaNewspaper, label: 'News & Updates' },
  { to: '/admin/contact', icon: FaEnvelope, label: 'Contact Messages' },
  { to: '/admin/newsletter', icon: FaBell, label: 'Newsletter' },
  { to: '/admin/activity', icon: FaLeaf, label: 'Activity Log' },
  { to: '/admin/audit', icon: FaShieldAlt, label: 'Audit Log', superAdminOnly: true },
]

function SidebarContent({ onClose, location, navItems, currentUser, userRole, handleLogout }) {
  return (
    <div className="flex flex-col h-full bg-dark-green text-white w-64">
      {/* Logo — centered, bigger */}
      <div className="flex flex-col items-center py-8 px-4 border-b border-white/10">
        <img
          src={imgUrl('AgriGloria_logo.png')}
          alt="AgriGloria"
          className="h-20 w-auto object-contain mb-3"
        />
        <p className="text-xs text-gray-400 tracking-widest uppercase">Admin Portal</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout — at bottom */}
      <div className="p-4 border-t border-white/10">
        {/* Name & role above logout — bright white text */}
        <div className="px-4 pb-3">
          <p className="text-sm font-semibold text-white">
            {currentUser?.displayName || currentUser?.email}
          </p>
          <p className="text-xs text-secondary capitalize mt-0.5 font-medium">
            {userRole?.replace('_', ' ')}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser, userRole, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const navItems = [
    ...NAV.filter(n => !n.superAdminOnly || userRole === 'super_admin'),
    ...(userRole === 'super_admin' ? [{ to: '/admin/users', icon: FaUserShield, label: 'Manage Users' }] : []),
  ]

  const sidebarProps = { location, navItems, currentUser, userRole, handleLogout }

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      {/* Fixed sidebar — desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30 shadow-xl">
        <SidebarContent {...sidebarProps} onClose={() => {}} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden shadow-2xl">
          <SidebarContent {...sidebarProps} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-dark-green text-white px-4 py-3 flex items-center justify-between shadow-md">
        <img src={imgUrl('AgriGloria_logo.png')} alt="AgriGloria" className="h-9" />
        <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <FaBars size={20} />
        </button>
      </header>

      {/* Main content — offset for mobile top bar */}
      <main className="p-6 pt-20 lg:pt-6 min-h-screen">
        {children}
      </main>
    </div>
  )
}
