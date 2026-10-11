import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../animations/setup'
import { profile, socialLinks } from '../data/profile'
import RevealWords from '../components/ui/RevealWords'
import OptimizedImage from '../components/ui/OptimizedImage'
import Icon from '../components/ui/Icons'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { validateContact, submitContact } from '../lib/contact'
import { ArrowUpRight, Check, Copy, Loader2, Mail, Send } from 'lucide-react'

const socialMeta = [
  { key: 'github', label: 'GitHub', name: 'github' },
  { key: 'linkedin', label: 'LinkedIn', name: 'linkedin' },
  { key: 'instagram', label: 'Instagram', name: 'instagram' },
]

const initialValues = { name: '', email: '', message: '' }

const fieldClasses = (hasError) =>
  `w-full rounded-lg border bg-ink/40 px-4 py-3 text-sm text-fg placeholder:text-dim outline-none transition-colors duration-200 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 ${
    hasError ? 'border-red-400/70' : 'border-line'
  }`

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = email
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? '¡Copiado!' : 'copiar email'}
    </button>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(sectionRef)

      gsap.fromTo(
        q('.contact-block'),
        { y: 34, autoAlpha: 0.1 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: q('.contact-block')[0], start: 'top 88%', end: 'top 45%', scrub: 0.6 },
        },
      )
    },
    { scope: sectionRef },
  )

  const socials = socialMeta
    .map(({ key, label, name }) => ({ key, label, url: socialLinks[key], name }))
    .filter((s) => s.url)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    // Limpia el error del campo en cuanto el usuario vuelve a escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((prev) => ({ ...prev, ...validateContact({ ...values, [name]: values[name] }) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    setTouched({ name: true, email: true, message: true })

    const firstInvalid = ['name', 'email', 'message'].find((f) => nextErrors[f])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)
    const result = await submitContact(values)
    setSubmitting(false)

    if (result.notConfigured) {
      setStatus({
        type: 'notice',
        text: 'Formulario válido y listo ✅. El envío automático aún no está conectado: activa un servicio de correo en src/lib/contact.js y este mensaje se enviará desde aquí.',
      })
    } else if (result.delivered) {
      setStatus({
        type: 'success',
        text: 'Se abrió tu cliente de correo con el mensaje preparado. Solo queda enviarlo desde allí.',
      })
    } else {
      setStatus({
        type: 'error',
        text: result.error || 'No se pudo preparar el envío. Inténtalo de nuevo.',
      })
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 md:py-44">
      {/* decoración de fondo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="contact-glow absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[140px]"
          style={{ background: 'radial-gradient(circle, #5EEAD4 0%, transparent 62%)' }}
        />
        <div className="bg-grid absolute inset-0 opacity-40" />
      </div>

      <div className="container-page relative flex flex-col items-center text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent">
          <span className="mr-2 text-dim">//</span>
          <span className="text-dim">05</span>
          <span className="mx-1.5 text-dim">·</span>
          Contacto
        </p>

        <RevealWords
          as="h2"
          text="¿Trabajamos juntos?"
          accentWords={['juntos?']}
          mode="scrub"
          className="font-display text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-fg"
        />

        <div className="contact-block mt-6 flex flex-col items-center">
          <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Si tienes un proyecto en mente o quieres hablar de ideas, escríbeme. Respondo tan pronto
            como puedo.
          </p>
        </div>

        <div className="contact-block mt-10 flex flex-wrap items-center justify-center gap-4">
          {profile.email ? (
            <>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-3 rounded-full bg-fg px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Mail className="h-4 w-4" />
                {profile.email}
                <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <CopyEmail email={profile.email} />
            </>
          ) : (
            <p className="font-mono text-sm text-dim">
              ✎ configura tu email en <span className="text-muted">src/data/profile.js</span>
            </p>
          )}
        </div>

        {socials.length > 0 && (
          <div className="contact-block mt-12 flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Icon name={social.name} className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}

        {/* ============ Formulario de contacto ============ */}
        <div className="contact-block relative mt-14 w-full max-w-2xl text-left">
          {/* mirando del lado izquierdo del contenedor — SOLO desktop (>=1024px) */}
          <figure
            className="char-figure right-[calc(100%-3.5rem-34px)] top-1/2 z-[2] hidden w-[308px] -translate-y-1/2 rotate-0 lg:block xl:w-[388px] 2xl:w-[428px]"
            aria-hidden="true"
          >
            <span className="char-halo" aria-hidden="true" />
            <OptimizedImage
              webp="/img/mirando.webp"
              fallback="/img/mirando.png"
              alt=""
              className="char-img w-full"
            />
          </figure>

          <div className="overflow-hidden rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
              <span className="mr-2 text-dim">//</span>
              Formulario
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              HABLEMOS
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Cuéntame tu idea. Los campos validan en el momento y el mensaje queda listo para enviar
              cuando configures el servicio de correo.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-6">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted"
                >
                  Nombre <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  required
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-required="true"
                  aria-invalid={Boolean(errors.name) && touched.name}
                  aria-describedby={errors.name && touched.name ? 'contact-name-error' : undefined}
                  className={fieldClasses(Boolean(errors.name) && touched.name)}
                />
                {errors.name && touched.name && (
                  <p id="contact-name-error" role="alert" className="mt-2 font-mono text-xs text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted"
                >
                  Correo <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="correo@ejemplo.com"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-required="true"
                  aria-invalid={Boolean(errors.email) && touched.email}
                  aria-describedby={errors.email && touched.email ? 'contact-email-error' : undefined}
                  className={fieldClasses(Boolean(errors.email) && touched.email)}
                />
                {errors.email && touched.email && (
                  <p id="contact-email-error" role="alert" className="mt-2 font-mono text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted"
                >
                  Mensaje <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Cuéntame sobre tu proyecto, idea o consulta…"
                  required
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-required="true"
                  aria-invalid={Boolean(errors.message) && touched.message}
                  aria-describedby={errors.message && touched.message ? 'contact-message-error' : undefined}
                  className={`${fieldClasses(Boolean(errors.message) && touched.message)} resize-y`}
                />
                {errors.message && touched.message && (
                  <p id="contact-message-error" role="alert" className="mt-2 font-mono text-xs text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-fg px-8 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-accent active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                  {submitting ? 'Enviando…' : 'Enviar'}
                </button>

                <p className="font-mono text-[11px] leading-relaxed text-dim">
                  validación local · sin backend todavía
                </p>
              </div>

              {/* Estado del formulario (aria-live para lectores de pantalla) */}
              {status && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${
                    status.type === 'notice'
                      ? 'border-accent/30 bg-accent/5 text-accent'
                      : status.type === 'error'
                        ? 'border-red-400/30 bg-red-400/5 text-red-300'
                        : 'border-line-strong bg-ink/40 text-muted'
                  }`}
                >
                  {status.text}
                </div>
              )}
            </form>
          </div>
        </div>

        <p className="mt-16 font-mono text-xs text-dim">
          <span className="text-accent">{profile.brand}</span>
          <span className="mx-2 text-line-strong">·</span>
          <span className="caret text-accent" aria-hidden="true">
            ▍
          </span>{' '}
          {profile.availability || 'Disponible para proyectos'}
        </p>
      </div>
    </section>
  )
}