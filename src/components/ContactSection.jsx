import { useState } from 'react'
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock,
  FaDirections, FaPhone, FaPaperPlane, FaCheckCircle,
  FaWhatsapp, FaEdit, FaMapMarkedAlt, FaBolt, FaInfoCircle,
} from 'react-icons/fa'
import SectionHeader from './SectionHeader'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const SUBJECTS = [
  { value: 'poultry', label: 'Poultry (Chickens & Eggs)' },
  { value: 'pigs', label: 'Pig Farming' },
  { value: 'snails', label: 'Snail Farming' },
  { value: 'fish', label: 'Fish Farming' },
  { value: 'goats', label: 'Goat Farming' },
  { value: 'crops', label: 'Crop Farming' },
  { value: 'visit', label: 'Farm Visit Request' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other Inquiry' },
]

const INFO_CARDS = [
  {
    icon: FaMapMarkerAlt,
    title: 'Visit Our Farm',
    lines: ['02 Ayaebam Village, Akamkpa', 'Cross River State, Nigeria'],
    action: { label: 'Get Directions', icon: FaDirections, href: 'https://maps.google.com/?q=Ayaebam+Village+Akamkpa' },
  },
  {
    icon: FaPhoneAlt,
    title: 'Call Us',
    lines: ['+234 803 123 4567', '+234 802 987 6543'],
    action: { label: 'Call Now', icon: FaPhone, href: 'tel:+2348031234567' },
  },
  {
    icon: FaEnvelope,
    title: 'Email Us',
    lines: ['info@agrigloria.com', 'sales@agrigloria.com'],
    action: { label: 'Send Email', icon: FaPaperPlane, href: 'mailto:info@agrigloria.com' },
  },
  {
    icon: FaClock,
    title: 'Working Hours',
    lines: ['Mon – Sat: 8:00 AM – 6:00 PM', 'Sunday: 10:00 AM – 4:00 PM'],
    note: '*Farm visits by appointment',
  },
]

const INITIAL_FORM = { name: '', phone: '', email: '', subject: '', message: '' }

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.subject) e.subject = 'Please select a subject'
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('sending')
    try {
      await addDoc(collection(db, 'contact_submissions'), {
        ...form,
        createdAt: serverTimestamp(),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-200 focus:border-secondary focus:ring-secondary/20'
    }`

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Contact AgriGloria Farms"
          subtitle="Get in touch for inquiries, orders, or farm visits"
        />

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {INFO_CARDS.map(({ icon: Icon, title, lines, action, note }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow reveal">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="text-secondary text-xl" />
              </div>
              <h3 className="font-bold text-dark-green mb-2">{title}</h3>
              {lines.map((l) => <p key={l} className="text-gray-600 text-sm">{l}</p>)}
              {note && <p className="text-gray-400 text-xs mt-1 italic">{note}</p>}
              {action && (
                <a
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-secondary text-sm font-medium mt-3 hover:text-tertiary transition-colors"
                >
                  <action.icon size={12} /> {action.label}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm reveal">
            <h3 className="text-xl font-bold text-dark-green mb-6 flex items-center gap-2">
              <FaEdit className="text-secondary" /> Send Us a Message
            </h3>

            {status === 'success' ? (
              <div className="text-center py-12">
                <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark-green mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-500 mb-6">Thank you for contacting AgriGloria Farms. We'll get back to you shortly.</p>
                <button
                  onClick={() => { setStatus('idle'); setForm(INITIAL_FORM) }}
                  className="bg-secondary hover:bg-tertiary text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="inline text-secondary mr-1" size={10} /> Full Name *
                    </label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" className={inputClass('name')} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="inline text-secondary mr-1" size={10} /> Phone Number *
                    </label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone" className={inputClass('phone')} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="inline text-secondary mr-1" size={10} /> Email Address *
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className={inputClass('email')} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className={inputClass('subject')}>
                    <option value="">Select inquiry type</option>
                    {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Please provide details about your inquiry..." className={inputClass('message')} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">Failed to send. Please try calling us directly.</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <FaInfoCircle /> We typically respond within 2–4 hours during business hours
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    <FaPaperPlane /> {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Map & Quick Contact */}
          <div className="space-y-6 reveal">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
                <FaMapMarkedAlt className="text-secondary" /> Our Location
              </h3>
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mb-4">
                <iframe
                  title="AgriGloria Farm Location"
                  src="https://maps.google.com/maps?q=Ayaebam+Village+Akamkpa+Cross+River+Nigeria&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="text-center">
                <a
                  href="https://maps.google.com/?q=Ayaebam+Village+Akamkpa+Cross+River+Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-secondary hover:text-tertiary text-sm font-medium"
                >
                  <FaDirections /> View on Google Maps
                </a>
              </div>
            </div>

            <div className="bg-dark-green rounded-2xl p-6 text-white" id="get-a-quote">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FaBolt className="text-secondary" /> Quick Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:+2348031234567"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  <FaPhone className="text-secondary" /> Call Now
                </a>
                <a
                  href="https://wa.me/2348031234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
                <a
                  href="mailto:info@agrigloria.com"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  <FaEnvelope className="text-secondary" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
