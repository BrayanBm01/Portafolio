import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLenis } from '../../hooks/useLenis'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import OptimizedImage from './OptimizedImage'

/**
 * HanaModal — panel interactivo que se abre al hacer click en Hana (hero).
 *
 * - Animación corta y elegante (fase 2): Hana crece un poco (lo maneja el
 *   Hero con una clase en el padre), la escena se oscurece (backdrop) y el
 *   panel entra con y + opacity. ~0.35s.
 * - Accesibilidad: role="dialog" + aria-modal, ESC cierra, click fuera
 *   cierra, focus inicial en "Cerrar" y foco restaurado al cerrar, trap de
 *   Tab dentro del panel y scroll bloqueado/restaurado (compatible Lenis).
 * - Framer Motion (no GSAP) porque no está ligado al scroll.
 */
export default function HanaModal({ open, onClose, project }) {
  const { lockScroll, unlockScroll } = useLenis()
  const reduced = usePrefersReducedMotion()
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  const enter = reduced ? false : { opacity: 0, y: 26, scale: 0.98 }
  const show = { opacity: 1, y: 0, scale: 1 }
  const exit = reduced ? undefined : { opacity: 0, y: 20, scale: 0.985 }

  useEffect(() => {
    if (!open) return

    lockScroll()
    const previous = document.activeElement

    // Focus inicial en el botón de cerrar
    requestAnimationFrame(() => closeRef.current?.focus())

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      // Trap de Tab dentro del panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled])',
        )
        const list = Array.from(focusables).filter((el) => el.offsetParent !== null)
        if (!list.length) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
      previous?.focus?.()
    }
  }, [open, onClose, lockScroll, unlockScroll])

  const realLink = project?.links && (project.links.demo || project.links.github)

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={onClose}
          role="presentation"
        >
          {/* Escena oscurecida detrás del panel */}
          <div className="absolute inset-0 bg-ink/80" aria-hidden="true" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hana-modal-title"
            aria-describedby="hana-modal-desc"
            initial={enter}
            animate={show}
            exit={exit}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line-strong bg-ink-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="bg-grid absolute inset-0 opacity-50" aria-hidden="true" />

            <div className="relative grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
              {/* Información */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
                  <span className="mr-2 text-dim">//</span>proyecto 01
                </p>
                <h3
                  id="hana-modal-title"
                  className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-fg"
                >
                  {project.name}
                </h3>
                <p className="mt-2 font-mono text-sm uppercase tracking-[0.22em] text-muted">
                  Personal AI Assistant
                </p>

                <p
                  id="hana-modal-desc"
                  className="mt-6 max-w-md text-[15px] leading-relaxed text-muted"
                >
                  {project.description}
                </p>

                {project.tech?.length > 0 && (
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-line bg-ink/60 px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  {realLink && (
                    <a
                      href={realLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      Ver proyecto
                    </a>
                  )}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Cerrar
                  </button>
                </div>
              </div>

              {/* Hana en pequeño (derecha en desktop, arriba en móvil) */}
              <div className="order-first mx-auto w-40 shrink-0 md:order-none md:mx-0 md:w-52 lg:w-60">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-ink/40">
                  <OptimizedImage
                    webp={project.image?.webp}
                    fallback={project.image?.fallback}
                    alt={project.image?.alt || `Imagen de ${project.name}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}