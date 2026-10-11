import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const LenisContext = createContext({ scrollTo: () => {} })

export const useLenis = () => useContext(LenisContext)

/**
 * Provee smooth scrolling (Lenis) integrado con ScrollTrigger.
 * Si el usuario tiene prefers-reduced-motion: reduce, no se crea Lenis
 * y el scroll nativo resuelve los anclajes.
 */
export function LenisProvider({ children }) {
  const reduced = usePrefersReducedMotion()
  const lenisRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      // lerp más alto = respuesta más inmediata; mantiene el glide sin
      // sensación de retraso (fase 2: fluidez > cantidad de efectos)
      lerp: 0.12,
      wheelMultiplier: 1,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setReady(true)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
      setReady(false)
    }
  }, [reduced])

  const api = useMemo(
    () => ({
      ready,
      stop() {
        lenisRef.current?.stop()
        document.documentElement.style.overflow = ''
      },
      start() {
        lenisRef.current?.start()
      },
      lockScroll() {
        lenisRef.current?.stop()
        document.documentElement.style.overflow = 'hidden'
      },
      unlockScroll() {
        lenisRef.current?.start()
        document.documentElement.style.overflow = ''
      },
      scrollTo(target, opts = {}) {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, {
            offset: -72,
            duration: 1.1,
            ...opts,
          })
          return
        }
        // Sin Lenis (reduced motion o aún no inicializado): scroll nativo
        el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      },
    }),
    [reduced, ready],
  )

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>
}