/**
 * BrandIcon — icono de marca (Simple Icons) renderizado como SVG con su
 * color corporativo. Los logos oscuros (p. ej. OpenJDK o GitHub) se
 * dibujan sobre un chip blanco para no perderse en el fondo oscuro.
 */
function luminance(hex) {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export default function BrandIcon({
  icon,
  size = 26,
  className = '',
  chipClassName = '',
}) {
  const dark = luminance(icon.hex) < 90
  return (
    <span
      className={`inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-line bg-surface/50 ${chipClassName} ${className}`}
      aria-hidden="true"
    >
      <span
        className={`flex items-center justify-center rounded-md ${dark ? 'bg-white p-[5px]' : ''}`}
      >
        <svg viewBox="0 0 24 24" width={size} height={size} fill={dark ? '#0b0f16' : `#${icon.hex}`}>
          <path d={icon.path} />
        </svg>
      </span>
    </span>
  )
}