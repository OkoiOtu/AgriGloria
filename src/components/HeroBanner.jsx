import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { imgUrl, videoUrl } from '../utils/asset'

const VIDEOS = [
  'Banner1.mp4', 'Banner2.mp4', 'Banner3.mp4', 'Banner4.mp4',
  'Banner5.mp4', 'Banner6.mp4', 'Banner7.mp4', 'Banner8.mp4',
]

const QUOTES = [
  'Leading the way in sustainable livestock farming for healthier communities',
  'Raising premium quality animals with care, compassion, and innovation',
  'Transforming agriculture through ethical practices and modern technology',
  'Your trusted partner in providing nutritious, farm-fresh animal products',
  'Committed to animal welfare and environmental sustainability in every step',
  'Bridging traditional farming wisdom with cutting-edge agricultural science',
  'Nurturing livestock excellence for a food-secure and prosperous future',
  'Where quality meets responsibility in modern animal husbandry',
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)
  const videoRefs = useRef([])
  const timerRef = useRef(null)

  const goTo = (index) => {
    const next = (index + VIDEOS.length) % VIDEOS.length
    setQuoteVisible(false)
    setTimeout(() => {
      if (videoRefs.current[current]) {
        videoRefs.current[current].pause()
        videoRefs.current[current].currentTime = 0
      }
      setCurrent(next)
      setQuoteVisible(true)
      if (videoRefs.current[next]) {
        videoRefs.current[next].play().catch(() => {})
      }
    }, 500)
  }

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % VIDEOS.length
        goTo(next)
        return prev
      })
    }, 10000)
  }

  useEffect(() => {
    if (videoRefs.current[0]) {
      videoRefs.current[0].play().catch(() => {})
    }
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const handleVideoEnded = (index) => {
    if (index === current) {
      goTo(current + 1)
      resetTimer()
    }
  }

  return (
    <section id="home" className="relative h-screen min-h-[500px] overflow-hidden bg-black">
      {/* Video Slides */}
      {VIDEOS.map((v, i) => (
        <div
          key={v}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <video
            ref={(el) => (videoRefs.current[i] = el)}
            muted
            playsInline
            preload={i === 0 ? 'auto' : 'none'}
            onEnded={() => handleVideoEnded(i)}
            className="w-full h-full object-cover"
          >
            <source src={videoUrl(v)} type="video/mp4" />
          </video>
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <img
          src={imgUrl('AgriGloria.png')}
          alt="AgriGloria Farms & Holdings"
          className="w-48 sm:w-64 md:w-80 mb-6 drop-shadow-2xl"
        />
        <h1
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-2xl leading-relaxed mb-8 transition-all duration-500 ${
            quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {QUOTES[current]}
        </h1>
        <Link
          to="/products"
          className="relative overflow-hidden bg-secondary hover:bg-tertiary text-white font-bold px-10 py-4 rounded-lg text-lg transition-colors duration-200 shadow-xl"
        >
          View Our Products
        </Link>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetTimer() }}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-8 h-3 bg-secondary' : 'w-3 h-3 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
