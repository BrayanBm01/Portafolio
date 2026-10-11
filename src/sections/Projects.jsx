import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animations/setup'
import { projects } from '../data/projects'
import SectionHeading from '../components/ui/SectionHeading'
import OptimizedImage from '../components/ui/OptimizedImage'
import { ArrowUpRight } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * PROJECTS — storytelling en tres actos.
 *
 * Desktop: una escena fijada (~300vh) donde el scroll cambia entre slides
 * (HANA → DiariX → Cordalia): el proyecto anterior sale, el siguiente entra,
 * la imagen cambia de tamaño/posición. Un indicador "01 / 03 · nombre"
 * muestra el acto actual.
 *
 * Móvil: los tres proyectos fluyen apilados con reveals por scroll.
 * prefers-reduced-motion: lista estática, todo visible.
 */

function SlideMedia({ project }) {
  if (project.image) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink-2/40">
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-20"
          style={{ background: 'radial-gradient(65% 55% at 50% 60%, rgba(94,234,212,0.16) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <OptimizedImage
          webp={project.image.webp}
          fallback={project.image.fallback}
          alt={project.image.alt}
          className="relative z-20 h-full w-full object-contain"
        />
        <span className="absolute bottom-4 left-4 z-30 rounded-full border border-line bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg/80 backdrop-blur-sm">
          {project.category}
        </span>
      </div>
    )
  }

  // Placeholder elegante para proyectos sin preview todavía
  return (
    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface/30">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <span
        className="pointer-events-none absolute right-[-0.5rem] top-1/2 select-none -translate-y-1/2 whitespace-nowrap font-display text-[clamp(3.6rem,11vw,7.5rem)] font-bold leading-none text-outline-soft"
        aria-hidden="true"
      >
        {project.name}
      </span>
      <span className="relative rounded-full border border-line bg-ink/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        preview pendiente
      </span>
    </div>
  )
}

export default function Projects() {
  const stageRef = useRef(null)
  const sectionRef = useRef(null)
  const numRef = useRef(null)
  const nameRef = useRef(null)
  const barRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const slides = gsap.utils.toArray('.p-slide')

        // Estados iniciales: solo el primer acto visible
        slides.forEach((slide, i) => {
          if (i > 0) gsap.set(slide.querySelectorAll('.p-enter, .p-media'), { autoAlpha: 0 })
        })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(slides.length, Math.floor(self.progress * slides.length) + 1)
              if (numRef.current) numRef.current.textContent = String(idx).padStart(2, '0')
              if (nameRef.current) nameRef.current.textContent = projects[idx - 1]?.name || ''
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        slides.forEach((slide, i) => {
          const enter = slide.querySelectorAll('.p-enter')
          const media = slide.querySelector('.p-media')
          const startT = i * 2.0
          // Transiciones limpias: solo opacity + translate (nada de scale/rotate)
          tl.fromTo(enter, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 }, startT)
            .fromTo(media, { x: 56, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, startT + 0.12)
            .to(enter, { y: -36, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, startT + 1.5)
            .to(media, { x: -56, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, startT + 1.65)
        })
      })

      mm.add('(max-width: 767px)', () => {
        // Móvil: el contenido NUNCA se oculta (mismo root cause que Skills:
        // fromTo + autoAlpha:0 + refrescos tardíos dejaban slides a opacidad 0).
        // La lista fluye completamente visible, sin animación de entrada.
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="projects" className="relative border-y border-line bg-ink">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      {/* Intro de la sección */}
      <div className="container-page relative pt-28 md:pt-36">
        <SectionHeading
          index="04"
          eyebrow="Proyectos"
          title="Trabajo seleccionado"
          description="Tres piezas, tres historias. El scroll gobierna la escena: cada acto presenta un proyecto. Datos en src/data/projects.js."
        />
      </div>

      {/* Escena fijada (desktop) / apilada (móvil) */}
      <div ref={stageRef} className="relative md:h-svh md:overflow-hidden">
        {projects.map((project, i) => (
          <article
            key={project.id}
            className={`p-slide relative flex items-center px-6 py-16 sm:px-10 md:absolute md:inset-0 md:px-0 md:py-0 ${
              i < projects.length - 1 ? 'mb-24 md:mb-0' : ''
            }`}
            aria-label={`Proyecto ${i + 1}: ${project.name}`}
          >
            <div className="container-page grid w-full items-center gap-10 md:grid-cols-12 md:gap-8">
              {/* Información */}
              <div className="md:col-span-6 lg:col-span-7">
                <p className="p-enter font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</p>
                <p className="p-enter mt-3 font-mono text-xs uppercase tracking-[0.28em] text-dim">
                  {project.category}
                </p>
                <h3 className="p-enter mt-4 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-fg">
                  {project.name}
                </h3>

                {project.description ? (
                  <p className="p-enter mt-6 max-w-md text-[15px] leading-relaxed text-muted">
                    {project.description}
                  </p>
                ) : (
                  <p className="p-enter mt-6 max-w-md font-mono text-sm text-dim">
                    Información del proyecto pendiente — se completará pronto.
                  </p>
                )}

                {project.tech?.length > 0 && (
                  <ul className="p-enter mt-6 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-line bg-ink/50 px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                {project.pending && (
                  <span className="p-enter mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    próximamente
                  </span>
                )}
              </div>

              {/* Visual / imagen */}
              <div className="p-media md:col-span-6 lg:col-span-5 md:mt-12">
                <div className="lg:mx-auto lg:w-full lg:max-w-[400px]">
                  <SlideMedia project={project} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Indicador de acto + barra de progreso (desktop) */}
      <div className="pointer-events-none relative z-10 -mt-24 hidden pb-10 md:block">
        <div className="container-page flex items-center justify-between gap-6">
          <p className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.25em] text-dim">
            <span ref={numRef} className="text-lg text-accent">
              01
            </span>
            <span>
              / {String(projects.length).padStart(2, '0')} · <span ref={nameRef} className="text-fg/80">{projects[0].name}</span>
            </span>
          </p>
          <div className="h-px w-40 bg-line" aria-hidden="true">
            <div ref={barRef} className="h-full w-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>

      {/* Cierre */}
      <div className="container-page relative pb-24 md:pb-28">
        <p className="flex items-center gap-2 font-mono text-xs text-dim">
          <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden="true" />
          ¿Tienes un proyecto en mente?{' '}
          <a href="#contact" className="text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent">
            Hablemos
          </a>
        </p>
      </div>
    </section>
  )
}