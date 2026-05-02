import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

async function fetchOrCreateProfile(user) {
  if (!db) return null
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const data = snap.data()
    if (data.role === 'admin' || data.role === 'super_admin') {
      updateDoc(ref, { lastLoginAt: serverTimestamp() }).catch(() => {})
    }
    return { id: user.uid, ...data }
  }
  const profile = {
    displayName: user.displayName || '',
    email: user.email,
    role: 'customer',
    phone: '',
    address: '',
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, profile)
  return { id: user.uid, ...profile }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) { setLoading(false); return }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await fetchOrCreateProfile(user)
        setCurrentUser(user)
        setUserProfile(profile)
      } else {
        setCurrentUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email, password) {
    if (!auth) throw new Error('Firebase not configured.')
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email, password, displayName) {
    if (!auth) throw new Error('Firebase not configured.')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    if (db) {
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName,
        email,
        role: 'customer',
        phone: '',
        address: '',
        createdAt: serverTimestamp(),
      })
    }
    return cred
  }

  function logout() {
    if (!auth) return Promise.resolve()
    setUserProfile(null)
    return signOut(auth)
  }

  const value = {
    currentUser,
    userProfile,
    userRole: userProfile?.role || null,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
