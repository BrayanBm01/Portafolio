import { useState } from 'react'
import { refreshScrollTriggers } from '../../animations/setup'

/**
 * Imagen optimizada (WebP) con fallback automático a la original
 * si la versión WebP no existe o falla al cargar.
 */
export default function OptimizedImage({
  webp,
  fallback,
  alt,
  className = '',
  eager = false,
  sizes,
}) {
  const [src, setSrc] = useState(webp)
  const [failed, setFailed] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      sizes={sizes}
      onError={() => {
        if (!failed && fallback && src !== fallback) {
          setFailed(true)
          setSrc(fallback)
        }
      }}
      onLoad={() => refreshScrollTriggers()}
      className={className}
    />
  )
}