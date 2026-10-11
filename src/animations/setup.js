import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Configuración global de GSAP + ScrollTrigger, importada una sola vez.
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

let raf = null
let timer = null

/**
 * Recalcula los triggers cuando el layout cambia (imágenes cargadas, fuentes…).
 * Está debounce para no sobrecargar el hilo principal.
 */
export function refreshScrollTriggers() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = null
    clearTimeout(timer)
    timer = setTimeout(() => ScrollTrigger.refresh(), 90)
  })
}