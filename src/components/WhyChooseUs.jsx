import { useEffect, useRef, useState } from 'react'
import {
  FaLeaf, FaShieldAlt, FaHeartbeat, FaTruck, FaGraduationCap, FaHandshake,
} from 'react-icons/fa'
import SectionHeader from './SectionHeader'

const FEATURES = [
  {
    icon: FaLeaf,
    title: 'Sustainable Farming',
    text: 'We practice eco-friendly farming methods that protect the environment while producing high-quality livestock and crops.',
  },
  {
    icon: FaShieldAlt,
    title: 'Quality Assurance',
    text: 'Rigorous quality checks at every stage ensure our animals are healthy, well-cared for, and meet the highest standards.',
  },
  {
    icon: FaHeartbeat,
    title: 'Animal Welfare',
    text: 'Our animals receive proper veterinary care, nutrition, and spacious living conditions for optimal health and wellbeing.',
  },
  {
    icon: FaTruck,
    title: 'Reliable Delivery',
    text: 'Timely delivery across Cross River State and beyond with proper handling to ensure livestock arrive healthy and stress-free.',
  },
  {
    icon: FaGraduationCap,
    title: 'Expert Knowledge',
    text: 'Our team consists of experienced farmers and agricultural experts with decades of combined experience in animal husbandry.',
  },
  {
    icon: FaHandshake,
    title: 'Customer Support',
    text: 'Dedicated support from inquiry to after-sales. We provide guidance on animal care and maintenance for your success.',
  },
]

const STATS = [
  { label: 'Satisfied Clients', target: 500, suffix: '+' },
  { label: 'Years Experience', target: 5, suffix: '+' },
  { label: 'Livestock Types', target: 6, suffix: '' },
  { label: '24/7 Support', target: 24, suffix: '/7' },
]

function StatCounter({ stat, started }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let startTime = null
    const duration = 2000
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * stat.target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, stat.target])

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {count}{stat.suffix}
      </div>
      <div className="text-primary text-sm font-medium uppercase tracking-wide">{stat.label}</div>
    </div>
  )
}

export default function WhyChooseUs() {
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Why Choose AgriGloria?"
          subtitle="Excellence in every aspect of farming and animal husbandry"
        />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 group reveal"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-secondary transition-colors duration-300">
                <Icon className="text-secondary text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* Stats Counter */}
        <div
          ref={statsRef}
          className="bg-dark-green rounded-2xl py-12 px-8 grid grid-cols-2 md:grid-cols-4 gap-8 reveal"
        >
          {STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} started={statsStarted} />
          ))}
        </div>
      </div>
    </section>
  )
}
