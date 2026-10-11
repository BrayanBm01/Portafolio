import { useEffect, useState } from 'react'

/**
 * Detecta la preferencia del usuario por reducir el movimiento.
 * La lectura inicial es SÍNCRONA (evita que GSAP cree animaciones para
 * usuarios con la preferencia activa) y se re-evalúa si cambia en vivo.
 */
const query = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(query)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}