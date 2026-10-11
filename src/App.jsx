import { useEffect } from 'react'
import { ScrollTrigger, refreshScrollTriggers } from './animations/setup'
import { LenisProvider } from './hooks/useLenis'
import { profile } from './data/profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  // Título SEO dinámico (los metadatos estáticos viven en index.html)
  useEffect(() => {
    document.title = `${profile.brand} | ${profile.name} - ${profile.role}`
  }, [])

  // Recalcular triggers cuando imágenes/fuentes terminan de cargar
  useEffect(() => {
    const timers = [
      setTimeout(() => ScrollTrigger.refresh(), 350),
      setTimeout(() => ScrollTrigger.refresh(), 1200),
    ]
    const onLoad = () => refreshScrollTriggers()
    const onFonts = () => refreshScrollTriggers()

    window.addEventListener('load', onLoad)
    if (document.fonts?.ready) document.fonts.ready.then(onFonts)

    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <LenisProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Saltar al contenido
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </LenisProvider>
  )
}