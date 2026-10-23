import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from '../animations/setup'
import { profile, socialLinks } from '../data/profile'
import { useLenis } from '../hooks/useLenis'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { X } from 'lucide-react'
import Icon from './ui/Icons'

const links = [
  { label: 'About',    href: '#about',    num: '01' },
  { label: 'Skills',   href: '#skills',   num: '02' },
  { label: 'Services', href: '#services', num: '03' },
  { label: 'Projects', href: '#projects', num: '04' },
  { label: 'Contact',  href: '#contact',  num: '05' },
]

/* ─── Variantes del drawer lateral ───────────────────────────── */
const drawerVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

const itemVariants = {
  hidden:  { x: -20, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.06 + i * 0.055, duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ─── Íconos sociales ─────────────────────────────────────────── */
function SocialIcons({ className = '' }) {
  const items = [
    { key: 'github',    name: 'github',    href: socialLinks.github    },
    { key: 'linkedin',  name: 'linkedin',  href: socialLinks.linkedin  },
    { key: 'instagram', name: 'instagram', href: socialLinks.instagram },
  ].filter((s) => s.href)

  if (!items.length) return null
  return (
    <div className={`flex gap-2.5 ${className}`}>
      {items.map(({ key, name, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-surface/40 text-dim transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
          aria-label={key}
        >
          <Icon name={name} className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { scrollTo, lockScroll, unlockScroll } = useLenis()
  const reduced = usePrefersReducedMotion()
  const [active, setActive]     = useState(null)
  const [open,   setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef             = useRef(null)

  /* — Detectar sección activa por scroll — */
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  /* — Barra de progreso vertical (desktop) — */
  useLayoutEffect(() => {
    if (reduced) return
    const el = progressRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      })
    })
    return () => ctx.revert()
  }, [reduced])

  /* — Detectar scroll para estilo del botón móvil — */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* — Bloqueo de scroll y Escape — */
  useEffect(() => {
    if (open) lockScroll()
    else unlockScroll()
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lockScroll, unlockScroll])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          BARRA LATERAL FIJA — Desktop (lg+)
      ══════════════════════════════════════════════════════ */}
      <aside
        className="fixed left-0 top-0 z-40 hidden h-full w-[72px] flex-col items-center justify-between border-r border-line bg-ink/90 py-6 backdrop-blur-xl lg:flex"
        aria-label="Menú lateral"
      >
        {/* Barra de progreso de lectura (borde izquierdo) */}
        <div
          ref={progressRef}
          className="absolute left-0 top-0 w-[2.5px] origin-top bg-accent shadow-[0_0_8px_#5eead4]"
          style={{ height: '100%', transform: 'scaleY(0)' }}
          aria-hidden="true"
        />

        {/* Parte superior: Marca + Botón desplegable */}
        <div className="flex flex-col items-center">
          <a
            href="#inicio"
            onClick={(e) => go(e, '#inicio')}
            className="group flex flex-col items-center text-center transition-transform hover:scale-105"
            aria-label="Ir al inicio"
            title="Inicio"
          >
            <span className="font-display text-sm font-bold tracking-tight text-fg group-hover:text-accent transition-colors">
              B.
            </span>
            <span className="caret text-[9px] text-accent leading-none" aria-hidden="true">_</span>
          </a>

          {/* Botón para desplegar el panel completo */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="group mt-4 flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-line/60 bg-surface/40 text-dim transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            title={open ? 'Cerrar menú' : 'Abrir menú completo'}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú completo'}
          >
            <span className="relative block h-3.5 w-4" aria-hidden="true">
              <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${open ? 'top-[6px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[6px] h-[1.5px] w-full bg-current transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : 'group-hover:w-3'}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${open ? 'top-[6px] -rotate-45' : 'top-[12px]'}`} />
            </span>
          </button>

          <div className="mt-4 h-px w-8 bg-line" aria-hidden="true" />
        </div>

        {/* Centro: Enlaces numéricos con tooltips flotantes horizontales */}
        <nav className="my-auto flex flex-col items-center gap-2.5" aria-label="Navegación principal">
          {links.map((link) => {
            const isActive = active === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                aria-current={isActive ? 'true' : undefined}
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/40 shadow-[0_0_12px_rgba(94,234,212,0.18)]'
                    : 'text-dim hover:bg-surface/80 hover:text-fg border border-transparent hover:border-line'
                }`}
              >
                {/* Indicador luminoso lateral izquierdo */}
                {isActive && (
                  <span
                    className="absolute -left-[1px] top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_8px_#5eead4]"
                    aria-hidden="true"
                  />
                )}

                {/* Número de sección */}
                <span className={`font-mono text-[11px] font-bold tracking-tight transition-colors ${
                  isActive ? 'text-accent' : 'text-dim group-hover:text-fg'
                }`}>
                  {link.num}
                </span>

                {/* Punto sutil de estado */}
                <span className={`mt-0.5 h-1 w-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-accent scale-125' : 'bg-line-strong group-hover:bg-dim'
                }`} />

                {/* Tooltip flotante hacia la derecha al hacer hover */}
                <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 rounded-lg border border-line bg-ink-2/95 px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-accent font-semibold">{link.num} //</span>
                  <span className="font-display text-xs font-semibold text-fg tracking-wide whitespace-nowrap">
                    {link.label}
                  </span>
                </div>
              </a>
            )
          })}
        </nav>

        {/* Parte inferior: Estado de disponibilidad */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-px w-8 bg-line" aria-hidden="true" />
          <button
            type="button"
            onClick={(e) => go(e, '#contact')}
            title={profile.availability || 'Disponible para proyectos'}
            aria-label="Contactar"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-line/60 bg-surface/30 transition-all hover:border-accent/50 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════
          BOTÓN HAMBURGUESA — Móvil y Tablet (< lg)
      ══════════════════════════════════════════════════════ */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        aria-controls="drawer-lateral"
        className={`fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 lg:hidden ${
          open
            ? 'border-accent/50 bg-ink/95 text-accent backdrop-blur-md'
            : scrolled
              ? 'border-line bg-ink/80 text-fg backdrop-blur-md'
              : 'border-transparent bg-ink/40 text-fg backdrop-blur-sm'
        }`}
      >
        <span className="relative block h-4 w-5" aria-hidden="true">
          <span
            className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
              open ? 'top-[7px] rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-[1.5px] w-full bg-current transition-all duration-300 ${
              open ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
              open ? 'top-[7px] -rotate-45' : 'top-[14px]'
            }`}
          />
        </span>
      </button>

      {/* ═══════════════════════════════════════════════════
          DRAWER LATERAL DESPLEGABLE (Móvil y Desktop)
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Fondo oscuro con desenfoque */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[70] bg-ink/75 backdrop-blur-sm"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Panel lateral deslizante */}
            <motion.div
              id="drawer-lateral"
              key="drawer"
              role="dialog"
              aria-label="Panel de navegación"
              className="fixed inset-y-0 left-0 z-[75] flex w-[min(88vw,360px)] flex-col border-r border-line bg-ink-2/95 backdrop-blur-2xl shadow-[16px_0_48px_rgba(0,0,0,0.7)]"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Cabecera del drawer */}
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <div>
                  <a
                    href="#inicio"
                    onClick={(e) => go(e, '#inicio')}
                    className="font-display text-lg font-bold tracking-tight text-fg hover:text-accent transition-colors"
                  >
                    {profile.name}
                    <span className="caret text-accent ml-1" aria-hidden="true">_</span>
                  </a>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-dim mt-0.5">
                    {profile.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface/50 text-dim transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                  aria-label="Cerrar menú"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links principales del drawer */}
              <nav className="flex flex-1 flex-col px-4 py-6" aria-label="Navegación del panel">
                <ul className="space-y-1.5">
                  {links.map((link, i) => {
                    const isActive = active === link.href
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <a
                          href={link.href}
                          onClick={(e) => go(e, link.href)}
                          aria-current={isActive ? 'true' : undefined}
                          className={`group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
                            isActive
                              ? 'bg-accent/15 text-accent border border-accent/30 shadow-[0_0_15px_rgba(94,234,212,0.1)]'
                              : 'text-muted hover:bg-surface/80 hover:text-fg border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="font-mono text-xs text-accent/80 font-semibold">{link.num}</span>
                            <span className="font-display text-lg font-semibold tracking-tight">
                              {link.label}
                            </span>
                          </div>
                          <span
                            className={`font-mono text-sm transition-all duration-200 ${
                              isActive
                                ? 'text-accent translate-x-0 opacity-100'
                                : 'text-dim -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent'
                            }`}
                          >
                            →
                          </span>
                        </a>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>

              {/* Pie del drawer */}
              <div className="border-t border-line px-6 py-5">
                <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-dim">
                  <span className="pulse-dot h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  <span>{profile.availability || 'Disponible para proyectos'}</span>
                </div>

                <SocialIcons className="mb-3" />

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="block font-mono text-xs text-dim hover:text-accent transition-colors"
                  >
                    {profile.email}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}