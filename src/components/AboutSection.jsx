import {
  FaBullseye, FaEye, FaSeedling, FaHeart, FaUsers, FaGem,
  FaCheck, FaMapMarkerAlt,
} from 'react-icons/fa'
import SectionHeader from './SectionHeader'
import { imgUrl, galleryUrl } from '../utils/asset'

const TEAM = [
  {
    name: 'Okoi Otu',
    role: 'Farm Manager & Veterinarian',
    bio: '10+ years experience in animal husbandry and veterinary care. Specializes in poultry and swine management.',
    image: 'Team_1.webp',
  },
  {
    name: 'Glory Okoi',
    role: 'Operations Manager',
    bio: 'Oversees daily farm operations and customer relations. Expert in logistics and supply chain management.',
    image: 'Team_2.webp',
  },
  {
    name: 'Success',
    role: 'Senior Livestock Farmer',
    bio: '15 years of traditional and modern farming experience. Expert in goat and sheep rearing.',
    image: 'Team_3.webp',
  },
]

const VALUES = [
  { icon: FaSeedling, title: 'Sustainability', text: 'Eco-friendly farming methods' },
  { icon: FaHeart, title: 'Animal Welfare', text: 'Humane treatment and care' },
  { icon: FaUsers, title: 'Community', text: 'Supporting local farmers' },
  { icon: FaGem, title: 'Quality', text: 'Premium livestock standards' },
]

const LOCATION_FEATURES = [
  'Rich, fertile soil for natural grazing',
  'Clean water sources for animals',
  'Optimal climate for livestock health',
  'Proximity to major markets',
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="About AgriGloria Farms"
          subtitle="Our journey in sustainable farming and animal husbandry"
        />

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-dark-green text-white rounded-2xl p-8 reveal">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-5">
              <FaBullseye className="text-secondary text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To provide high-quality, healthy livestock through sustainable farming practices
              that contribute to food security and economic growth in Cross River State and beyond.
            </p>
          </div>
          <div className="bg-light-green text-white rounded-2xl p-8 reveal">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-5">
              <FaEye className="text-secondary text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-200 leading-relaxed">
              To become the leading agricultural enterprise in Southern Nigeria, setting standards
              in animal welfare, sustainable farming, and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 reveal">
          <div className="flex justify-center">
            <img
              src={imgUrl('Agri_logo_with_text.png')}
              alt="AgriGloria Farm"
              className="max-w-xs w-full rounded-2xl shadow-xl object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-dark-green mb-5">Our Story</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2020, AgriGloria Farms began as a small family-owned venture in Ayaebam Village,
              Akamkpa. What started with a few chickens and goats has grown into a reputable livestock farm
              serving individuals, businesses, and communities across Cross River State.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our name "AgriGloria" combines Agriculture and Glory, reflecting our commitment to bringing
              glory to farming through excellence, innovation, and sustainable practices. We believe in
              farming that honors both the land and the people it serves.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-green">{title}</h4>
                    <p className="text-sm text-gray-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16 reveal">
          <h3 className="text-3xl font-bold text-dark-green text-center mb-2">Meet Our Team</h3>
          <p className="text-gray-500 text-center mb-10">Passionate professionals dedicated to agricultural excellence</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow reveal">
                <div className="h-56 overflow-hidden">
                  <img
                    src={galleryUrl(member.image)}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-dark-green">{member.name}</h4>
                  <p className="text-secondary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-2xl p-8 lg:p-12 reveal">
          <div>
            <h3 className="text-3xl font-bold text-dark-green mb-4">Located in Cross River State</h3>
            <p className="text-gray-600 mb-5 leading-relaxed">
              Our farm is situated in the fertile lands of Ayaebam Village, Akamkpa, Cross River State.
              This strategic location provides:
            </p>
            <ul className="space-y-3 mb-8">
              {LOCATION_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-700">
                  <FaCheck className="text-secondary flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FaMapMarkerAlt /> Visit Our Farm
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={galleryUrl('Farm_location.webp')}
              alt="Farm Location — Ayaebam Village, Akamkpa"
              loading="lazy"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
