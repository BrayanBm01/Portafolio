import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../animations/setup'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Revela un texto palabra a palabra.
 *
 * mode="once"  (por defecto) — se anima una vez al entrar en viewport.
 * mode="scrub" — la revelación queda atada al scroll (más narrativa).
 *
 * accentWords: array de cadenas (comparación en minúsculas) que se
 * pintarán con el color de acento.
 */
export default function RevealWords({
  as: Tag = 'span',
  text,
  className = '',
  wordClassName = '',
  accentWords = [],
  stagger = 0.05,
  delay = 0,
  start = 'top 88%',
  mode = 'once',
}) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('.rw-inner')
    if (!words.length) return

    const isScrub = mode === 'scrub'

    const ctx = gsap.context(() => {
      if (isScrub) {
        gsap.fromTo(
          words,
          { yPercent: 120 },
          {
            yPercent: 0,
            ease: 'none',
            stagger,
            scrollTrigger: { trigger: el, start, end: 'top 45%', scrub: true },
          },
        )
      } else {
        gsap.fromTo(
          words,
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'power4.out',
            stagger,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          },
        )
      }
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, text, stagger, delay, start, mode])

  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\?/g, '')}>
      {words.map((word, i) => {
        const isAccent = accentWords.some((a) => a.toLowerCase() === word.toLowerCase())
        return (
          <span key={`${word}-${i}`} className={`rw ${wordClassName}`} aria-hidden="true">
            <span className={`rw-inner ${isAccent ? 'text-accent' : ''}`}>
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}