import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animations/setup'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLenis } from '../hooks/useLenis'
import HanaModal from '../components/ui/HanaModal'
import { ArrowDown, ArrowRight } from 'lucide-react'

// 49 frames (WebP, 374x666) del video de HANA en /img/frame/.
// En reposo se muestra la imagen estática actual; solo durante el
// desplazamiento de la imagen se reproduce la secuencia (scrub de frames).
const FRAME_COUNT = 49
const FRAMES = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/img/frame/frame_${String(i + 1).padStart(3, '0')}.webp`,
)
const HANA_STATIC = '/img/hana.webp'
const HANA_FALLBACK = '/img/hana.png'

/**
 * HERO — Escena de scroll (pin + scrub + matchMedia), fase 2.
 *
 * Solo 3 movimientos principales, todos orquestados por UNA timeline
 * principal scrubeada (scrub: 1):
 *
 *   A. HANA      → deriva en DIAGONAL continua hacia la izquierda (arriba-izq,
 *                  nunca baja); desde el PRIMER instante del movimiento va
 *                  girando suave en 3D y llega mirando hacia el otro lado.
 *   B. TEXTO     → sube y sale como un solo bloque.
 *   C. OUTLINE   → la palabra gigante BNAKAN0 cruza el fondo.
 *
 * Composición y jerarquía están en el markup; el scroll solo transforma
 * (transform + opacity, GPU-friendly). Hana es ~36vw, con más espacio
 * alrededor, y al hacer CLICK abre el panel de HANA.
 *
 * Móvil (<=767px): sin pin, parallax sutil (transform), Hana más pequeña.
 * prefers-reduced-motion: contenido estático, sin animaciones.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const textRef = useRef(null)
  const hanaRef = useRef(null)
  const outlineRef = useRef(null)
  const scrollRef = useRef(null)
  const triggerRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const { scrollTo } = useLenis()
  const [modalOpen, setModalOpen] = useState(false)

  // --- Playback por frames en <canvas> (repintado síncrono = sin parpadeos) ---
  const canvasRef = useRef(null)
  const frameImagesRef = useRef([]) // [estática, f1, f2, …, f30]
  const frameIdxRef = useRef(0) // 0 = estática; 1..FRAME_COUNT = frames
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  const hanaProject = projects.find((p) => p.id === 'hana')
  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href)
  }

  // Dibuja el frame actual con ajuste "contain" (equivalente a object-contain)
  const drawFrame = (idx) => {
    const img = frameImagesRef.current[idx]
    const cv = canvasRef.current
    if (!img || !cv) return
    const ctx = cv.getContext('2d')
    const { w, h, dpr } = sizeRef.current
    if (!w || !h) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const ir = img.width / img.height
    const cr = w / h
    let dw, dh
    if (ir < cr) {
      dh = h
      dw = h * ir
    } else {
      dw = w
      dh = w / ir
    }
    // En móvil, si dh < h, anclar arriba para evitar huecos y cortes extraños
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const dy = (h > dh && isMobile) ? 0 : (h - dh) / 2
    ctx.drawImage(img, (w - dw) / 2, dy, dw, dh)
  }

  // Carga inmediata de la imagen estática + carga diferida en background de los frames
  useEffect(() => {
    let alive = true
    const loader = (src, fb) =>
      new Promise((resolve) => {
        const im = new Image()
        im.onload = () => resolve(im)
        im.onerror = () => (fb ? loader(fb).then(resolve) : resolve(null))
        im.src = src
      })

    // 1. Mostrar de inmediato la imagen principal sin esperar a los 49 frames
    loader(HANA_STATIC, HANA_FALLBACK).then((staticImg) => {
      if (!alive || !staticImg) return
      frameImagesRef.current = [staticImg]
      drawFrame(0)

      // 2. Precargar frames para la animación desktop en segundo plano
      Promise.all(FRAMES.map((src) => loader(src))).then((frames) => {
        if (!alive) return
        frameImagesRef.current = [staticImg, ...frames]
      })
    })

    return () => {
      alive = false
    }
  }, [])

  // Mantiene el canvas al tamaño real del contenedor (× devicePixelRatio)
  useEffect(() => {
    const host = hanaRef.current
    const cv = canvasRef.current
    if (!host || !cv) return
    const observer = new ResizeObserver(() => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(rect.width * dpr)
      const h = Math.round(rect.height * dpr)
      if (cv.width !== w || cv.height !== h) {
        cv.width = w
        cv.height = h
      }
      sizeRef.current = { w: rect.width, h: rect.height, dpr }
      drawFrame(frameIdxRef.current)
    })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      if (reduced) return
      const mm = gsap.matchMedia()

      // ---------------------------------------------------------------
      // DESKTOP — timeline única (3 movimientos + salida de escena)
      // ---------------------------------------------------------------
      mm.add('(min-width: 768px)', () => {
        const vw = window.innerWidth
        const ph = window.innerHeight * 0.01

        // Estado inicial (composición de la escena 1)
        gsap.set(hanaRef.current, { x: vw * 0.045, y: ph * 2, scale: 1.08 })
        gsap.set(outlineRef.current, { xPercent: 12, autoAlpha: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              const t = self.progress * tl.duration()
              // Reposo: imagen estática (sin frames)
              if (t < 1) {
                if (frameIdxRef.current !== 0) {
                  frameIdxRef.current = 0
                  drawFrame(0)
                }
                return
              }
              // Durante el desplazamiento: avance fluido por los frames,
              // sincronizado con la posición del personaje (1.0 → 5.2)
              const p = Math.min(1, Math.max(0, (t - 1) / 4.2))
              const idx = Math.round(p * (FRAME_COUNT - 1)) + 1 // 1..FRAME_COUNT
              if (idx !== frameIdxRef.current) {
                frameIdxRef.current = idx
                drawFrame(idx)
              }
            },
          },
        })

        // Escena 1 — reposo
        tl.to({}, { duration: 1 })

        // Escena 2 — el texto sale; Hana inicia la diagonal hacia la IZQUIERDA (A + B)
        // (mientras se desplaza, el onUpdate del trigger va recorriendo los frames)
        tl.to(textRef.current, { y: -130, autoAlpha: 0, duration: 1.8 }, 1.0)
          .to(hanaRef.current, { x: -vw * 0.38, y: -ph * 5, scale: 1.0, duration: 2.5 }, 1.0)

        // Escena 3 — el outline cruza el fondo; Hana termina la diagonal un poco
        // más hacia la izquierda, más lenta, y se queda ahí (C)
        tl.to(outlineRef.current, { xPercent: 0, autoAlpha: 0.85, duration: 1.2 }, 2.2)
          .to(hanaRef.current, { x: -vw * 0.6, y: -ph * 8, scale: 0.9, duration: 1.6 }, 3.6)

        // Salida de escena — el hero cede el paso a Sobre mí
        tl.to(scrollRef.current, { autoAlpha: 0, duration: 0.4 }, 3.8)
          .to(stageRef.current, { scale: 0.98, autoAlpha: 0.55, duration: 1 }, 4.1)
          .to(outlineRef.current, { xPercent: -4, duration: 1 }, 4.2)
      })

      // ---------------------------------------------------------------
      // MÓVIL — sin pin, parallax sutil y desvanecimiento elegante
      // ---------------------------------------------------------------
      mm.add('(max-width: 767px)', () => {
        gsap.to(hanaRef.current, {
          y: -35,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to(textRef.current, {
          y: 35,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="inicio" className="relative h-svh overflow-hidden">
      <div ref={stageRef} className="hero-stage relative h-full overflow-hidden">
        {/* Fondo escénico (estático) */}
        <div className="hero-grid bg-grid absolute inset-0" aria-hidden="true" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
        <div
          className="hero-glow absolute -right-32 -top-40 h-[36rem] w-[36rem] rounded-full opacity-[0.13] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #5EEAD4 0%, transparent 62%)' }}
          aria-hidden="true"
        />

        {/* Palabra gigante de fondo (movimiento C) */}
        <div
          ref={outlineRef}
          className="hero-outline pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[clamp(4rem,19vw,22rem)] font-bold leading-none text-outline"
          aria-hidden="true"
        >
          {profile.alias.toUpperCase()}
        </div>

        {/* HANA — protagonista visual con adaptación refinada para móviles */}
        <div
          className={`absolute z-[5]
            right-[-3vw] top-[7svh] h-[52svh] w-[56vw] max-w-[300px]
            sm:right-0 sm:top-[4svh] sm:h-[58svh] sm:w-[48vw] sm:max-w-[340px]
            md:right-[7px] md:top-[calc(6svh+10px)] md:h-[min(80svh,708px)] md:w-[min(40vw,528px)] md:max-w-none
            transition-transform duration-300 will-change-transform
            ${modalOpen ? 'scale-[1.04] origin-[70%_45%]' : ''}`}
        >
          <div
            className="hana-halo absolute -inset-6 rounded-full opacity-35 blur-[60px]"
            style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.35) 0%, transparent 68%)' }}
          />
          <div ref={hanaRef} className="hero-hana relative h-full w-full will-change-transform">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setModalOpen(true)}
              className="block h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
              aria-label="Abrir panel de información sobre HANA"
              aria-haspopup="dialog"
              aria-expanded={modalOpen}
            >
              <canvas
                ref={canvasRef}
                className="h-full w-full"
                aria-hidden="true"
              />
            </button>

            {/* Fundidos suaves para móvil: integración cinematográfica sin cortes bruscos */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink via-ink/60 to-transparent md:hidden"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-ink/75 to-transparent md:hidden"
              aria-hidden="true"
            />

            <span className="pointer-events-none absolute -bottom-1 right-1 font-mono text-[9px] uppercase tracking-[0.25em] text-accent/80 md:hidden">
              // HANA
            </span>
            <span className="pointer-events-none absolute bottom-2 right-0 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-dim/80 md:block">
              // HANA — AI personal
            </span>
          </div>
        </div>

        {/* Contenido textual (movimiento B: sale como un bloque) */}
        <div className="relative z-10 flex h-full items-center">
          <div ref={textRef} className="hero-text container-page w-full pb-14 pt-20 will-change-transform sm:pb-16 sm:pt-24">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-accent sm:mb-5 sm:text-[13px]">
              Hola, soy{' '}
              <span className="text-fg/80">{profile.name}</span>
              <span className="hidden text-dim sm:inline"> — haz scroll</span>
            </p>

            {/* NOMBRE PRINCIPAL — Brayan Borja en grande con contraste nítido */}
            <h1
              className="hero-brand font-display font-semibold leading-[0.88] tracking-[-0.03em] text-fg drop-shadow-[0_2px_16px_rgba(8,9,13,0.9)]"
              style={{ fontSize: 'clamp(2.85rem, 11.5vw, 9.5rem)' }}
              aria-label={`Brayan Borja — ${profile.role}`}
            >
              <span className="hero-line block">
                <span className="hero-line-inner">Brayan</span>
              </span>
              <span className="hero-line block">
                <span className="hero-line-inner">
                  Borja
                  <span className="caret text-accent" aria-hidden="true">_</span>
                </span>
              </span>
            </h1>

            <p className="mt-3.5 font-mono text-xs uppercase tracking-[0.28em] text-accent sm:mt-5 sm:text-sm">
              {profile.role}
              <span className="ml-2 hidden text-dim sm:inline">/ {profile.roleExtra}</span>
            </p>

            <p className="mt-3.5 max-w-[260px] text-sm leading-relaxed text-muted sm:max-w-md sm:text-base sm:mt-5 md:text-lg">
              {profile.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
              <a
                href="#projects"
                onClick={(e) => go(e, '#projects')}
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-7 sm:py-3.5 sm:gap-3"
              >
                Ver proyectos
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                onClick={(e) => go(e, '#contact')}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-7 sm:py-3.5"
              >
                Contactar
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-6 inline-flex items-center gap-2.5 font-mono text-xs text-dim sm:mt-9">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {profile.availability || 'Disponible para proyectos'}
            </p>
          </div>
        </div>

        {/* Indicador de scroll */}
        <button
          ref={scrollRef}
          type="button"
          onClick={(e) => go(e, '#about')}
          className="hero-scroll absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-dim transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label="Bajar a la sección Sobre mí"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
          <span className="scroll-line block h-10 w-px bg-accent/70" aria-hidden="true" />
        </button>

        {/* Etiqueta vertical */}
        <span
          className="pointer-events-none absolute bottom-28 right-5 hidden select-none font-mono text-[10px] uppercase tracking-[0.35em] text-dim/70 lg:block"
          style={{ writingMode: 'vertical-rl' }}
          aria-hidden="true"
        >
          Brayan Borja — software developer
        </span>
      </div>

      {/* Panel de HANA al hacer click */}
      <HanaModal open={modalOpen} onClose={() => setModalOpen(false)} project={hanaProject} />
    </section>
  )
}