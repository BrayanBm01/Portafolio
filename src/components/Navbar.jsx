import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from '../animations/setup'
import { profile } from '../data/profile'
import { useLenis } from '../hooks/useLenis'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const overlayVariants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 26, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Navbar() {
  const { scrollTo, lockScroll, unlockScroll } = useLenis()
  const reduced = usePrefersReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const progressRef = useRef(null)

  // Fondo al hacer scroll
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Barra de progreso de lectura
  useLayoutEffect(() => {
    if (reduced) return
    const el = progressRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        },
      )
    })
    return () => ctx.revert()
  }, [reduced])

  // Sección activa
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Bloqueo de scroll mientras el menú móvil está abierto + tecla Escape
  useEffect(() => {
    if (open) lockScroll()
    else unlockScroll()

    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lockScroll, unlockScroll])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-ink/75 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div
        ref={progressRef}
        className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-accent"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />
      <nav className="container-page relative z-10 flex h-16 items-center justify-between" aria-label="Principal">
        <a
          href="#inicio"
          onClick={(e) => go(e, '#inicio')}
          className="group font-display text-lg font-semibold tracking-tight text-fg transition-colors hover:text-accent"
          aria-label="Ir al inicio"
        >
          {profile.brand}
          <span className="caret text-accent" aria-hidden="true">
            _
          </span>
        </a>

        {/* Navegación desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => go(e, link.href)}
                aria-current={active ? (active === link.href ? 'true' : undefined) : undefined}
                className={`group/link relative rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active === link.href ? 'text-accent' : 'text-muted hover:text-fg'
                }`}
              >
                {/* indicador sutil de sección activa */}
                <span
                  className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity duration-300 ${
                    active === link.href ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa (móvil) */}
        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-line-strong lg:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-all duration-300 ${
                open ? 'top-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] h-[2px] w-full bg-current transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] h-[2px] w-full bg-current transition-all duration-300 ${
                open ? 'top-[6px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="container-page flex h-full flex-col justify-center">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {links.map((link) => (
                  <motion.li key={link.href} variants={itemVariants}>
                    <a
                      href={link.href}
                      onClick={(e) => go(e, link.href)}
                      className={`group flex items-baseline gap-4 py-3 font-display text-4xl font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                        active === link.href ? 'text-accent' : 'text-fg'
                      }`}
                    >
                      <span className="font-mono text-xs tracking-[0.2em] text-dim group-hover:text-accent/70">
                        0{links.indexOf(link) + 1}
                      </span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.p
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-10 font-mono text-xs text-dim"
              >
                {profile.email ? (
                  <a href={`mailto:${profile.email}`} className="hover:text-accent transition-colors">
                    {profile.email}
                  </a>
                ) : (
                  'configura tu email en /src/data/profile.js'
                )}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}