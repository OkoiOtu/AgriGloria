import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import LivestockSection from '../components/LivestockSection'
import AboutSection from '../components/AboutSection'
import WhyChooseUs from '../components/WhyChooseUs'
import TestimonialsSlider from '../components/TestimonialsSlider'
import GallerySection from '../components/GallerySection'
import NewsSection from '../components/NewsSection'
import FAQSection from '../components/FAQSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import BackToTop from '../components/BackToTop'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <LivestockSection />
        <AboutSection />
        <WhyChooseUs />
        <TestimonialsSlider />
        <GallerySection />
        <NewsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
