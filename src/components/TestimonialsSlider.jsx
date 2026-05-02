import { FaQuoteLeft, FaAward, FaTruck, FaHeadset, FaHandshake } from 'react-icons/fa'
import SectionHeader from './SectionHeader'

const TESTIMONIALS = [
  {
    text: '"AgriGloria\'s broiler chickens have transformed my poultry business. The growth rate and meat quality are exceptional!"',
    name: 'Chinedu Okoro',
    role: 'Poultry Farmer, Calabar',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: '"The eggs from AgriGloria are always fresh and of premium quality. My restaurant customers can taste the difference!"',
    name: 'John Akpan',
    role: 'Restaurant Owner, Calabar',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: '"As a snail farmer, I appreciate AgriGloria\'s healthy breeding stock. Their snails have high survival rates!"',
    name: 'Emeka Nwosu',
    role: 'Snail Farmer, Port Harcourt',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: '"The pigs we got from AgriGloria were healthy and well-cared for. Their after-sales support is excellent!"',
    name: 'Bisi Adekunle',
    role: 'Pig Farm Manager, Akamkpa',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: '"I ordered goats for a large event and the delivery was on time. AgriGloria is truly reliable and professional."',
    name: 'Fatima Mohammed',
    role: 'Event Caterer, Uyo',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: '"Excellent catfish fingerlings! Strong and healthy. AgriGloria\'s fish farming expertise is second to none."',
    name: 'Tunde Okafor',
    role: 'Fish Farmer, Lagos',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
]

const TRUST = [
  { icon: FaAward, title: 'Quality Certified', text: 'Premium livestock standards' },
  { icon: FaTruck, title: 'Reliable Delivery', text: 'Across Cross River State' },
  { icon: FaHeadset, title: '24/7 Support', text: 'Always here to help' },
  { icon: FaHandshake, title: 'Trusted Partner', text: 'Since 2020' },
]

export default function TestimonialsSlider() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="What Our Clients Say"
          subtitle="Hear from satisfied farmers, businesses, and individuals who trust AgriGloria"
        />

        {/* 3-column testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow reveal"
            >
              <FaQuoteLeft className="text-secondary text-2xl mb-4" />
              <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">{t.text}</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary flex-shrink-0"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-dark-green text-sm">{t.name}</h4>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                  <div className="text-yellow-400 text-xs mt-0.5">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-2xl p-8 reveal">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="text-secondary text-xl" />
              </div>
              <h3 className="font-bold text-dark-green mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
