import { useLayoutEffect } from 'react'
import { gsap } from './setup'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * useScrollReveal — revela hijos (o un selector) progresivamente.
 *
 * @param {object} ref        ref del contenedor
 * @param {object} options
 *   selector   selector CSS de los targets (por defecto: hijos directos)
 *   from/to    estado inicial / final de GSAP
 *   stagger    retardo entre targets
 *   trigger    elemento que dispara (por defecto: el contenedor)
 *   start      posición de ScrollTrigger
 *   scrub      si true, la animación queda atada al scroll (scrub)
 *   once       animar una sola vez (solo si scrub=false)
 */
export function useScrollReveal(
  ref,
  {
    selector,
    from = { y: 30, autoAlpha: 0 },
    to = { y: 0, autoAlpha: 1 },
    stagger = 0.09,
    duration = 0.9,
    ease = 'power3.out',
    delay = 0,
    start = 'top 85%',
    once = true,
    scrub = false,
    trigger,
  } = {},
) {
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let targets
    if (selector) {
      targets = el.querySelectorAll(selector)
    } else {
      targets = Array.from(el.children).filter(
        (n) => n.nodeType === 1 && !n.hasAttribute('data-no-reveal'),
      )
    }
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        from,
        {
          ...to,
          duration,
          ease,
          delay,
          stagger,
          scrollTrigger: scrub
            ? { trigger: trigger || el, start, end: 'top 40%', scrub: true }
            : { trigger: trigger || el, start, once },
        },
      )
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, selector, stagger, duration, delay, start, once, scrub])
}

/**
 * useParallax — parallax vertical suave atado al scroll.
 */
export function useParallax(
  ref,
  { amount = 40, from = amount, to = -amount, trigger, start = 'top bottom', end = 'bottom top', scrub = true } = {},
) {
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: from },
        {
          y: to,
          ease: 'none',
          scrollTrigger: { trigger: trigger || el, start, end, scrub },
        },
      )
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, from, to])
}

/**
 * useScrubWords — revela palabras (.rw-inner) atadas al scroll (scrub).
 * Es la variante "scroll-driven" de RevealWords: el texto se descubre
 * mientras el usuario avanza, no con un trigger de "una sola vez".
 */
export function useScrubWords(
  ref,
  { start = 'top 88%', end = 'top 45%', stagger = 0.03, fromY = 120 } = {},
) {
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const words = el.querySelectorAll('.rw-inner')
    if (!words.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: fromY },
        {
          yPercent: 0,
          ease: 'none',
          stagger,
          scrollTrigger: { trigger: el, start, end, scrub: true },
        },
      )
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, start, end, stagger, fromY])
}