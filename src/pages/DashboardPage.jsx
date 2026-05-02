import { Link, useNavigate } from 'react-router-dom'
import {
  FaSignOutAlt, FaUser, FaLeaf, FaEnvelope, FaListAlt,
  FaChartBar, FaUsers,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { imgUrl } from '../utils/asset'

const CARDS = [
  { icon: FaListAlt, label: 'Livestock Records', value: '—', color: 'bg-secondary/10 text-secondary' },
  { icon: FaEnvelope, label: 'Contact Submissions', value: '—', color: 'bg-blue-100 text-blue-600' },
  { icon: FaUsers, label: 'Subscribers', value: '—', color: 'bg-green-100 text-green-600' },
  { icon: FaChartBar, label: 'Sales Inquiries', value: '—', color: 'bg-purple-100 text-purple-600' },
]

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-dark-green text-white px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <img src={imgUrl('AgriGloria_logo.png')} alt="AgriGloria" className="h-10" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 hidden sm:block">{currentUser?.displayName || currentUser?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <FaUser className="text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark-green">
                Welcome, {currentUser?.displayName || 'Admin'}
              </h1>
              <p className="text-gray-500 text-sm">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CARDS.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="text-xl" />
              </div>
              <div className="text-3xl font-black text-dark-green mb-1">{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-dark-green text-white rounded-2xl p-10 text-center max-w-2xl mx-auto">
          <FaLeaf className="text-secondary text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Full Dashboard Coming in Part 4</h2>
          <p className="text-gray-300 mb-6">
            The complete admin dashboard — livestock CRUD, contact viewer, subscriber list, and
            analytics — will be built in Part 4 of the migration.
          </p>
          <Link
            to="/"
            className="inline-block bg-secondary hover:bg-tertiary text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Main Site
          </Link>
        </div>
      </main>
    </div>
  )
}
