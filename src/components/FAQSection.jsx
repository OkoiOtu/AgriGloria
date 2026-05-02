import { useState } from 'react'
import {
  FaShippingFast, FaPaw, FaMoneyBillWave,
  FaQuestionCircle, FaChevronDown, FaComments, FaPhoneAlt,
} from 'react-icons/fa'
import SectionHeader from './SectionHeader'

const FAQ_CATEGORIES = [
  {
    icon: FaShippingFast,
    title: 'Orders & Delivery',
    items: [
      {
        q: 'How do I place an order for livestock?',
        a: 'You can place an order by calling our sales lines at <strong>+234 803 123 4567</strong>, sending a WhatsApp message, or using the contact form on this website. Our team will guide you through availability, pricing, and delivery options.',
      },
      {
        q: 'What areas do you deliver to, and what are the costs?',
        a: 'We provide reliable delivery primarily across <strong>Cross River State</strong>. Delivery to neighboring states can be arranged. Costs vary based on distance and order size; we will provide a clear quote before you confirm your order.',
      },
      {
        q: 'Can I visit the farm to see the animals before purchasing?',
        a: 'Absolutely! We encourage farm visits by <strong>prior appointment</strong> (see our contact section for hours). It\'s the best way to see our sustainable practices and healthy livestock firsthand.',
      },
    ],
  },
  {
    icon: FaPaw,
    title: 'Livestock & Quality',
    items: [
      {
        q: 'Are your animals vaccinated and disease-free?',
        a: 'Yes. Animal welfare is our priority. All our livestock receive proper veterinary care, including necessary vaccinations and regular health checks, to ensure they are healthy and robust.',
      },
      {
        q: 'Do you offer advice on housing and care for the animals after purchase?',
        a: 'Yes, we do! We provide basic <strong>after-sales guidance</strong> on care, feeding, and housing. We want you and your new animals to thrive.',
      },
      {
        q: 'What breeds of goats, pigs, and chickens do you raise?',
        a: 'We raise quality, productive breeds suited to our region. For specific breed information and recommendations for your needs, please contact our team directly.',
      },
    ],
  },
  {
    icon: FaMoneyBillWave,
    title: 'Pricing & Payment',
    items: [
      {
        q: 'Do you offer discounts for bulk or wholesale orders?',
        a: 'Yes, we have special pricing for <strong>bulk purchases</strong> and established partnerships with businesses and cooperatives. Contact our sales team for a customized wholesale quote.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers and cash. Payment details are confirmed at the time of order. For large orders, we require a 50% deposit with the balance due before delivery.',
      },
      {
        q: 'What is your return or replacement policy?',
        a: 'We stand by the quality of our livestock. If there are any health issues upon delivery, please contact us immediately. We\'ll arrange a replacement or refund according to our quality assurance policy.',
      },
    ],
  },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-gray-100 rounded-xl overflow-hidden transition-all ${open ? 'shadow-sm' : ''}`}>
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <FaQuestionCircle className="text-secondary flex-shrink-0" />
          <span className="font-medium text-dark-green text-sm md:text-base">{item.q}</span>
        </div>
        <FaChevronDown
          className={`text-secondary flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48' : 'max-h-0'}`}
      >
        <div
          className="px-5 pb-5 pt-0 text-gray-600 text-sm leading-relaxed pl-12"
          dangerouslySetInnerHTML={{ __html: item.a }}
        />
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Common questions about ordering, delivery, and our livestock"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {FAQ_CATEGORIES.map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-white rounded-2xl p-6 md:p-8 reveal">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Icon className="text-secondary text-xl" />
                </div>
                <h3 className="text-xl font-bold text-dark-green">{title}</h3>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <FAQItem key={item.q} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-dark-green rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white reveal">
          <div className="flex items-start gap-3">
            <FaQuestionCircle className="text-secondary text-xl flex-shrink-0 mt-1" />
            <p>Didn't find your answer? Our team is ready to help with any specific questions about our livestock or services.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="#contact"
              className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              <FaComments /> Contact Us
            </a>
            <a
              href="tel:+2348031234567"
              className="flex items-center gap-2 border-2 border-white/30 hover:border-secondary text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              <FaPhoneAlt /> Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
