import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaLeaf } from 'react-icons/fa'
import { setPersistence, browserSessionPersistence } from 'firebase/auth'
import { useAuth } from '../../context/AuthContext'
import { auth } from '../../firebase/config'
import { imgUrl } from '../../utils/asset'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const { login, logout, currentUser, userRole } = useAuth()
  const navigate = useNavigate()

  // Once authenticated, check role and redirect or deny
  useEffect(() => {
    if (!checking || !currentUser) return
    if (userRole === null) return // still loading profile
    if (userRole === 'admin' || userRole === 'super_admin') {
      navigate('/admin/dashboard', { replace: true })
    } else {
      logout()
      setError('You do not have admin access. Contact the super admin.')
      setChecking(false)
      setLoading(false)
    }
  }, [checking, currentUser, userRole])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await setPersistence(auth, browserSessionPersistence)
      await login(email, password)
      setChecking(true)
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }
      setError(msgs[err.code] || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-green flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={imgUrl('AgriGloria_logo.png')} alt="AgriGloria" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">AgriGloria Farms & Holdings — Staff Access Only</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@agrigloria.com" autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required placeholder="Enter password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-secondary hover:bg-tertiary text-white py-3 rounded-lg font-bold text-sm transition-colors disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-500 text-xs flex items-center justify-center gap-1">
          <FaLeaf className="text-secondary" /> AgriGloria Farms & Holdings — Admin Portal
        </p>
      </div>
    </div>
  )
}
