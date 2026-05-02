import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTimes, FaTrash, FaMinus, FaPlus, FaShoppingCart, FaLock } from 'react-icons/fa'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { usePaystackPayment } from 'react-paystack'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'
import { imgUrl } from '../utils/asset'

function CheckoutButton({ onSuccess, onClose, disabled }) {
  const { totalPrice, items } = useCart()
  const { currentUser } = useAuth()

  const config = {
    reference: `agrigloria_${Date.now()}`,
    email: currentUser?.email || '',
    amount: Math.round(totalPrice * 100),
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    currency: 'NGN',
    channels: ['card', 'bank', 'ussd', 'bank_transfer'],
  }

  const initPayment = usePaystackPayment(config)

  return (
    <button
      onClick={() => initPayment({ onSuccess, onClose })}
      disabled={disabled || !currentUser || !import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.startsWith('pk_')}
      className="w-full bg-secondary hover:bg-tertiary text-white py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      <FaLock size={12} /> Pay ₦{totalPrice.toLocaleString()} with Paystack
    </button>
  )
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart()
  const { currentUser, userProfile } = useAuth()
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState('cart') // 'cart' | 'details'
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSuccess = async (reference) => {
    setProcessing(true)
    await addDoc(collection(db, 'orders'), {
      customerId: currentUser.uid,
      customerName: currentUser.displayName || userProfile?.displayName || '',
      customerEmail: currentUser.email,
      customerPhone: phone || userProfile?.phone || '',
      items: items.map(i => ({
        productId: i.id,
        name: i.title,
        priceNGN: i.priceNGN,
        quantity: i.quantity,
        unit: i.unit,
        subtotal: i.priceNGN * i.quantity,
      })),
      total: totalPrice,
      paymentRef: reference.reference,
      paymentStatus: 'paid',
      status: 'pending',
      deliveryAddress: address || userProfile?.address || '',
      notes,
      createdAt: serverTimestamp(),
    })
    clearCart()
    setSuccess(true)
    setProcessing(false)
    setStep('cart')
  }

  const close = () => { setIsOpen(false); setStep('cart'); setSuccess(false) }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={close} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-dark-green text-white">
          <div className="flex items-center gap-2 font-bold">
            <FaShoppingCart /> Cart {totalItems > 0 && <span className="bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>}
          </div>
          <button onClick={close} className="text-gray-300 hover:text-white"><FaTimes /></button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark-green mb-2">Order Placed!</h3>
            <p className="text-gray-500 text-sm mb-6">Your payment was successful. We'll confirm your order shortly.</p>
            <button onClick={() => { close(); navigate('/profile') }}
              className="bg-secondary hover:bg-tertiary text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
              View Order History
            </button>
          </div>
        ) : step === 'cart' ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-16">
                  <FaShoppingCart className="text-5xl mb-4 text-gray-200" />
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm mt-1">Add some livestock products to get started.</p>
                  <button onClick={close}
                    className="mt-4 text-secondary hover:text-tertiary font-semibold text-sm">Browse Products</button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                    <img src={imgUrl(item.image)} alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark-green text-sm truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                      <p className="text-secondary font-bold text-sm mt-1">₦{item.priceNGN.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-xs"><FaTrash /></button>
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="text-gray-500 hover:text-secondary"><FaMinus size={10} /></button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-gray-500 hover:text-secondary"><FaPlus size={10} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t bg-gray-50 space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Subtotal</span><span>₦{totalPrice.toLocaleString()}</span>
                </div>
                {!currentUser ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Please log in to checkout</p>
                    <Link to="/login" onClick={close}
                      className="block w-full bg-secondary hover:bg-tertiary text-white py-3 rounded-xl font-bold text-sm transition-colors text-center">
                      Log In to Checkout
                    </Link>
                  </div>
                ) : (
                  <button onClick={() => setStep('details')}
                    className="w-full bg-secondary hover:bg-tertiary text-white py-3.5 rounded-xl font-bold text-sm transition-colors">
                    Proceed to Checkout
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <button onClick={() => setStep('cart')} className="text-sm text-secondary hover:text-tertiary font-medium">← Back to cart</button>
              <h3 className="font-bold text-dark-green">Delivery Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 800 000 0000"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                  placeholder="Full delivery address"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Special requests or instructions"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary resize-none" />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{i.title} × {i.quantity}</span>
                    <span className="font-medium">₦{(i.priceNGN * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span><span>₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <CheckoutButton
                onSuccess={handleSuccess}
                onClose={() => {}}
                disabled={processing || !phone || !address}
              />
              {(!phone || !address) && (
                <p className="text-xs text-center text-gray-400 mt-2">Please fill in your phone and address to continue</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
