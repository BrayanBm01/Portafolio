// Iconos SVG en línea (stroke actual = color heredado).
// viewBox 0 0 24 24, trazo 1.5, estilo consistente.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const paths = {
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" {...base} />
      <path d="M8 20h8M12 16v4" {...base} />
      <path d="M7 9h4" {...base} />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" {...base} />
      <path d="M3 13l9 5 9-5" {...base} />
      <path d="M3 17l9 5 9-5" {...base} />
    </>
  ),
  code: (
    <>
      <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5" {...base} />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" {...base} />
      <rect x="3" y="13" width="18" height="7" rx="2" {...base} />
      <path d="M7 7.5h.01M7 16.5h.01" {...base} />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" {...base} />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" {...base} />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" {...base} />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3z" {...base} />
    </>
  ),
  arrowRight: <path d="M4 12h16M13 5l7 7-7 7" {...base} />,
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" {...base} />,
  arrowDown: <path d="M12 4v16M5 13l7 7 7-7" {...base} />,
  arrowUp: <path d="M12 20V4M5 11l7-7 7 7" {...base} />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" {...base} />
      <path d="M3.5 7l8.5 6 8.5-6" {...base} />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" {...base} />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" {...base} />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" {...base} />,
  github: (
    <>
      <path
        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
        {...base}
      />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" {...base} />
      <path d="M8 11v5M8 8v.01M12 16v-5M12 12.5c0-1 .8-2 2-2s2 .8 2 2V16" {...base} />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" {...base} />
      <circle cx="12" cy="12" r="4" {...base} />
      <path d="M17.5 6.5v.01" {...base} />
    </>
  ),
}

export default function Icon({ name, className = 'h-5 w-5', title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths[name] || paths.spark}
    </svg>
  )
}