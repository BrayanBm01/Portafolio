import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animations/setup'
import { services } from '../data/services'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * SERVICES — grid de tarjetas (fase 2).
 * - Desktop: 2 columnas · Móvil: 1 columna.
 * - Entrada con stagger UNA sola vez (y 28 → 0 + opacity), sin scrub y sin
 *   animaciones permanentes.
 * - Hover discreto: la tarjeta sube ~4px, borde + glow muy sutiles y la
 *   flecha se desplaza. Solo transform/colors.
 * - Iconos lucide pequeños dentro de un chip + número mono.
 * - prefers-reduced-motion: tarjetas visibles sin animación.
 */
export default function Services() {
  const sectionRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.utils.toArray('.service-card').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="services" className="relative overflow-hidden py-28 md:py-40">
      <div
        className="pointer-events-none absolute right-[-10rem] top-32 h-[30rem] w-[30rem] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #818CF8 0%, transparent 62%)' }}
        aria-hidden="true"
      />

      <div className="container-page relative">
        <SectionHeading
          index="03"
          eyebrow="Servicios"
          title="Lo que construyo"
          description="Del frontend a la base de datos: seis áreas que cubren el ciclo completo de una aplicación."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <li
                key={service.id}
                className="service-card group relative overflow-hidden rounded-2xl border border-line bg-surface/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_44px_-18px_rgba(94,234,212,0.22)] md:p-9"
              >
                <div className="relative flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-dim" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink/50 text-accent transition-colors duration-300 group-hover:border-accent/40">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 translate-y-1 text-dim opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-7 font-display text-2xl font-semibold tracking-tight text-fg md:text-[1.75rem]">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{service.description}</p>
              </li>
            )
          })}
        </ul>

        <p className="mt-10 font-mono text-xs text-dim">
          <span className="text-accent/70" aria-hidden="true">
            →
          </span>{' '}
          edita los servicios en <span className="text-muted">src/data/services.js</span>
        </p>
      </div>
    </section>
  )
}