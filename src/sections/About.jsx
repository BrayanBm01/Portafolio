import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animations/setup'
import { profile } from '../data/profile'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from '../components/ui/SectionHeading'
import OptimizedImage from '../components/ui/OptimizedImage'

/**
 * ABOUT — composición limpia (fase 2):
 * "imagen + texto + un elemento decorativo". Nada más.
 * Solo DOS movimientos en desktop, atados al scroll (scrub, transform + opacity):
 *   - foto: entrada + parallax muy suave (y 30 → -20, escala 0.96 → 1)
 *   - párrafos: reveal (y 26 → 0)
 * La foto ocupa ~35-40% de la sección (texto 7/12, foto 5/12 con max-w).
 * Móvil: reveals simples. prefers-reduced-motion: contenido estático.
 */
export default function About() {
  const sectionRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const q = gsap.utils.selector(sectionRef)

        // Foto: entrada + parallax muy suave (solo transform + opacity)
        gsap.fromTo(
          q('.about-photo'),
          { y: 30, scale: 0.96, autoAlpha: 0.4 },
          {
            y: -20,
            scale: 1,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.about-media')[0], start: 'top 92%', end: 'bottom 35%', scrub: 0.8 },
          },
        )

        // Texto: reveal único
        gsap.fromTo(
          q('.about-copy'),
          { y: 26, autoAlpha: 0.2 },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.about-copy')[0], start: 'top 88%', end: 'top 40%', scrub: 0.6 },
          },
        )
      })

      mm.add('(max-width: 767px)', () => {
        const q = gsap.utils.selector(sectionRef)
        gsap.fromTo(
          q('.about-photo'),
          { y: 26, autoAlpha: 0.4 },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.about-media')[0], start: 'top 92%', end: 'top 50%', scrub: true },
          },
        )
        gsap.fromTo(
          q('.about-copy'),
          { y: 18, autoAlpha: 0.3 },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.about-copy')[0], start: 'top 90%', end: 'top 55%', scrub: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const facts = [
    { label: 'rol', value: profile.role },
    { label: 'alias', value: profile.alias },
    { label: 'estado', value: profile.availability },
    { label: 'ubicación', value: profile.location },
  ].filter((f) => f.value)

  return (
    <section ref={sectionRef} id="about" className="relative py-28 md:py-40">
      {/* Fondo + palabra gigante recortados en su propio contenedor, para que
          el personaje pueda asomarse por el borde inferior de la sección. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="bg-grid absolute inset-0 opacity-40" />

        {/* Único elemento decorativo (estático, sin animación) */}
        <div className="about-word absolute left-0 top-16 select-none whitespace-nowrap font-display text-[clamp(5rem,16vw,15rem)] font-bold leading-none text-outline">
          ABOUT
        </div>
      </div>

      <div className="container-page relative grid items-center gap-16 lg:grid-cols-12">
        {/* Columna izquierda: información */}
        <div className="lg:col-span-7">
          <SectionHeading
            index="01"
            eyebrow="Sobre mí"
            title="Quién soy"
            description={`${profile.name} — ${profile.alias}. Desarrollador de software enfocado en productos digitales reales.`}
          />

          <div className="about-copy mt-8 space-y-5">
            {profile.about.map((paragraph, i) => (
              <p key={i} className="max-w-xl leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            {facts.map((fact) => (
              <li
                key={fact.label}
                className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface/40 px-4 py-3"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-dim">{fact.label}</span>
                <span className="truncate text-sm text-fg">{fact.value}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-10 max-w-xl space-y-3">
            {profile.values.map((value, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px] text-fg/90">
                <span className="font-mono text-xs text-accent" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {value}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: foto yo2 con Hana (pose) apoyada encima */}
        <div className="lg:col-span-5">
          <div className="about-media relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto lg:max-w-[400px] lg:-translate-x-24">
            <div className="relative">
              <div
                className="about-photo relative overflow-hidden rounded-2xl border border-line"
                style={{ aspectRatio: '4 / 5' }}
              >
                <OptimizedImage
                  webp="/img/yo2.webp"
                  fallback="/img/yo2.jpg"
                  alt={`Fotografía de ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Hana (pose) solapada sobre la foto — SOLO desktop (>=1024px) */}
              <figure
                className="char-figure right-[-10.25rem] top-1/2 z-[2] hidden w-[83%] -translate-y-1/2 rotate-2 lg:block lg:right-[-11rem]"
                aria-hidden="true"
              >
                <span className="char-halo" aria-hidden="true" />
                <OptimizedImage
                  webp="/img/pose-hana.webp"
                  fallback="/img/pose-hana.png"
                  alt=""
                  className="char-img w-full"
                />
              </figure>
            </div>

            <p className="mt-4 text-right font-mono text-[11px] tracking-wide text-dim">
              <span className="text-accent/70">~</span> yo2.jpg — {profile.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}