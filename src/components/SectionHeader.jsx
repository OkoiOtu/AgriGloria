import { imgUrl } from '../utils/asset'

export default function SectionHeader({ title, subtitle, dark = false }) {
  return (
    <div className="text-center mb-12 reveal">
      <div className="flex justify-center mb-4">
        <div className="relative inline-block">
          <img
            src={imgUrl('Agri_logo.png')}
            alt="AgriGloria Farms Logo"
            width={90}
            className="relative z-10"
          />
          <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ping" />
        </div>
      </div>
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${dark ? 'text-white' : 'text-dark-green'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
