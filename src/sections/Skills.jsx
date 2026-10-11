import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { gsap } from '../animations/setup'
import { skillGroups } from '../data/skills'
import { ArrowRight } from 'lucide-react'
import BrandIcon from '../components/ui/BrandIcon'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * SKILLS — escena horizontal controlada por scroll vertical (desktop).
 * - La sección se fija (pin) y, mientras el usuario baja, el track avanza
 *   en horizontal. La distancia total se calcula en runtime
 *   (scrollWidth - clientWidth) para no romper en ninguna resolución.
 * - El contenido de cada panel se revela mientras entra (containerAnimation).
 * - Móvil: misma información apilada verticalmente con reveals por scroll.
 * - prefers-reduced-motion: columna estática, todo visible.
 */
export default function Skills() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current
        const panels = gsap.utils.toArray('.skills-panel')
        const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const horizontalTween = gsap.to(track, {
          x: () => -getAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + getAmount(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) {
                const total = panels.length
                const idx = Math.min(total, Math.floor(self.progress * total) + 1)
                progressRef.current.textContent = `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
              }
            },
          },
        })

        // Contenido interno de cada panel revelado mientras viaja horizontal
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll('[data-skill], .skills-panel-head'),
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.05,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: 'left 92%',
                end: 'left 38%',
                scrub: true,
              },
            },
          )
        })
      })

      mm.add('(max-width: 1023px)', () => {
        // Móvil/tablet: el contenido NUNCA se oculta.
        // (root cause del bug: el fromTo con autoAlpha:0 pre-ocultaba los
        // paneles y con refrescos tardíos de ScrollTrigger (fuentes/imágenes)
        // el once:true ya consumido re-aplicaba el from y dejaba paneles a
        // opacidad 0. Prioridad contenido > animación: aquí no hay entrada.)
        // Reset defensivo: garantiza que ningún estado inline residual
        // (opacity/visibility/transform) oculte los paneles en móvil.
        gsap.utils.toArray('.skills-panel').forEach((panel) => {
          gsap.set(panel, { clearProps: 'all' })
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const total = skillGroups.length + 1
  const horizontal = !reduced

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`relative overflow-hidden border-y border-line bg-ink-2/50 ${horizontal ? 'lg:h-svh' : ''}`}
    >
      <div className="bg-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className={`pointer-events-none absolute inset-0 opacity-60`}
        style={{ background: 'radial-gradient(60% 50% at 50% 50%, rgba(94,234,212,0.05) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* Track: columna en móvil / fila horizontal en desktop */}
      <div
        ref={trackRef}
        className={`relative flex h-full flex-col ${
          horizontal ? 'lg:h-full lg:w-max lg:min-w-full lg:flex-row' : ''
        }`}
      >
        {/* Panel intro */}
        <div className="skills-panel relative flex min-h-svh w-full flex-col justify-center px-6 py-20 sm:px-10 lg:h-full lg:w-[min(56vw,720px)] lg:px-16 lg:py-0">
          <div className="skills-panel-head">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent">
              <span className="mr-2 text-dim">//</span>
              <span className="text-dim">02</span>
              <span className="mx-1.5 text-dim">·</span>
              Habilidades
            </p>
            <h2 className="font-display text-[clamp(2.3rem,6vw,4.3rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-fg">
              El stack, en{' '}
              <span className="text-accent">movimiento</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              Tecnologías y herramientas con las que construyo, organizadas por área. Solo nombre e
              icono: sin niveles inventados.
            </p>
            {horizontal && (
              <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-dim">
                baja y desliza <ArrowRight className="h-4 w-4 text-accent" />
              </p>
            )}
          </div>
        </div>

        {/* Paneles por grupo */}
        {skillGroups.map((group, gi) => (
          <div
            key={group.id}
            className="skills-panel relative flex min-h-svh w-full flex-col justify-center px-6 py-16 sm:px-10 lg:h-full lg:w-[min(64vw,820px)] lg:px-16 lg:py-0"
          >
            <div className="skills-panel-head mb-8 flex items-end justify-between gap-6 border-b border-line pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  {String(gi + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">
                  {group.label}
                </h3>
              </div>
              <span className="font-mono text-xs text-dim">{group.skills.length} tecnologías</span>
            </div>

            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {group.skills.map((skill) => (
                <motion.li
                  key={skill.name}
                  data-skill
                  whileHover={reduced ? undefined : { y: -5, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface/30 p-5 text-center transition-colors duration-300 hover:border-accent/40 focus-within:border-accent/40"
                >
                  <span>
                    <BrandIcon icon={skill.icon} />
                  </span>
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-fg">
                    {skill.name}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Progreso de la sección (solo desktop horizontal) */}
      {horizontal && (
        <p className="pointer-events-none absolute bottom-6 right-6 z-10 hidden font-mono text-xs text-dim lg:block">
          <span ref={progressRef}>01 / 0{total}</span>
        </p>
      )}
    </section>
  )
}