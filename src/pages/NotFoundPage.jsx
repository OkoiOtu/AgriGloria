import { Link } from 'react-router-dom'
import { FaLeaf, FaHome, FaPhone } from 'react-icons/fa'
import { imgUrl } from '../utils/asset'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-green flex flex-col items-center justify-center text-white px-4 text-center">
      <img
        src={imgUrl('Agri_logo.png')}
        alt="AgriGloria"
        className="w-20 mb-8"
      />
      <h1 className="text-8xl md:text-9xl font-black text-secondary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Head back to the farm!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-8 py-3 rounded-lg font-bold transition-colors"
        >
          <FaHome /> Back to Home
        </Link>
        <a
          href="#contact"
          className="flex items-center gap-2 border-2 border-white/30 hover:border-secondary text-white px-8 py-3 rounded-lg font-bold transition-colors"
        >
          <FaPhone /> Contact Us
        </a>
      </div>
    </div>
  )
}
