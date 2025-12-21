


import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/landing/Hero'
import FeaturedEvents from './components/landing/FeaturedEvents'
import HowItWorks from './components/landing/HowItWorks'
import Stats from './components/landing/Stats'
import Testimonials from './components/landing/Testimonials'
import Categories from './components/landing/Categories'
import CallToAction from './components/landing/CallToAction'


export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedEvents />
      <HowItWorks />
      <Stats />
      <Categories />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  )
}