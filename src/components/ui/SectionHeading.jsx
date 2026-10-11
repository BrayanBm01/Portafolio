import RevealWords from './RevealWords'

/**
 * Encabezado de sección consistente:
 *   // 01 · eyebrow
 *   Título (revelado palabra a palabra, atado al scroll por defecto)
 *   descripción opcional (se revela con scrub también)
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  accentWords = [],
  className = '',
  descriptionClassName = '',
  mode = 'scrub',
}) {
  return (
    <div className={className}>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent">
        <span className="mr-2 text-dim">//</span>
        {index && (
          <>
            <span className="text-dim">{index}</span>
            <span className="mx-1.5 text-dim">·</span>
          </>
        )}
        {eyebrow}
      </p>
      <RevealWords
        as="h2"
        text={title}
        accentWords={accentWords}
        mode={mode}
        className="font-display text-[clamp(2.3rem,6vw,4.3rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-fg"
      />
      {description && (
        <p className={`mt-6 max-w-xl text-base leading-relaxed text-muted ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  )
}