import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function logAction(action, details, user) {
  if (!db) return
  try {
    await addDoc(collection(db, 'audit_log'), {
      action,
      details,
      performedBy: user?.displayName || user?.email || 'Unknown',
      performedById: user?.uid || '',
      createdAt: serverTimestamp(),
    })
  } catch {
    // Audit failures should never break the main action
  }
}
