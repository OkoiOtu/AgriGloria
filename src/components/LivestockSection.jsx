import { useRef } from 'react'
import { FaCheckCircle, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa'
import SectionHeader from './SectionHeader'
import { galleryUrl } from '../utils/asset'

const LIVESTOCK = [
  {
    name: 'Layer Chickens', badge: 'Egg Production',
    image: 'Layers.webp', alt: 'Layer Chickens',
    description: 'High-quality laying hens producing fresh, nutritious eggs daily. Raised in spacious, hygienic coops with optimal conditions.',
    features: ['High egg yield', 'Antibiotic-free', 'Free-range options'],
  },
  {
    name: 'Pigs', badge: 'Pork Production',
    image: 'Pigs.avif', alt: 'Pigs',
    description: 'Quality pig breeds raised for premium pork. Following ethical farming practices with proper nutrition and care.',
    features: ['Various breeds available', 'Disease-resistant stock', 'Bulk purchase options'],
  },
  {
    name: 'Snails', badge: 'Heliculture',
    image: 'Snail.avif', alt: 'Snails',
    description: 'Premium edible snails (Heliculture) raised in controlled environments. A nutritious and sustainable protein source.',
    features: ['High protein content', 'Low cholesterol', 'Export quality'],
  },
  {
    name: 'Fishes', badge: 'Aquaculture',
    image: 'Fish.jpg', alt: 'Catfish and Tilapia',
    description: 'Freshwater fish farming with species like Catfish and Tilapia. Clean water systems ensuring healthy growth.',
    features: ['Multiple species', 'Live fish delivery', 'Processing available'],
  },
  {
    name: 'Goats', badge: 'Dairy & Meat',
    image: 'Goat.avif', alt: 'Goats',
    description: 'Healthy goats for both meat and dairy production. Raised on natural forage with proper veterinary care.',
    features: ['Dual-purpose breeds', 'Healthy breeding stock', 'Wholesale available'],
  },
  {
    name: 'Broiler Chickens', badge: 'Meat Production',
    image: 'Chicken.jpg', alt: 'Broiler Chickens',
    description: 'Premium quality meat chickens raised for tender, flavorful poultry. Grown with optimal nutrition for healthy development.',
    features: ['Fast-growing breeds', 'Tender, juicy meat', 'Antibiotic-free rearing'],
  },
]

function AnimalCard({ animal, index }) {
  const ref = useRef(null)
  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 reveal"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={galleryUrl(animal.image)}
          alt={animal.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
          {animal.badge}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-dark-green mb-2">{animal.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{animal.description}</p>
        <ul className="space-y-2 mb-5">
          {animal.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-secondary flex-shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <a
            href="#contact"
            className="flex-1 text-center bg-secondary hover:bg-tertiary text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            Inquire Now
          </a>
          <a
            href="#gallery"
            className="flex-1 text-center border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-sm font-semibold py-2.5 rounded-lg transition-all"
          >
            View Gallery
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LivestockSection() {
  return (
    <section id="livestock" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Our Premium Livestock"
          subtitle="Healthy, well-cared animals raised with sustainable practices"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {LIVESTOCK.map((animal, i) => (
            <AnimalCard key={animal.name} animal={animal} index={i} />
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-green text-white rounded-2xl px-8 py-6">
          <p className="flex items-center gap-2 text-sm">
            <FaInfoCircle className="text-secondary flex-shrink-0" />
            All livestock available for bulk orders. Contact us for pricing, delivery, and custom requirements.
          </p>
          <a
            href="#contact"
            className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          >
            <FaPhoneAlt /> Contact for All Livestock
          </a>
        </div>
      </div>
    </section>
  )
}
