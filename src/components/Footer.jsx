import { profile, socialLinks } from '../data/profile'
import { useLenis } from '../hooks/useLenis'
import Icon from './ui/Icons'
import { ArrowUp, Mail } from 'lucide-react'

const socialMeta = [
  { key: 'github', label: 'GitHub', name: 'github' },
  { key: 'linkedin', label: 'LinkedIn', name: 'linkedin' },
  { key: 'instagram', label: 'Instagram', name: 'instagram' },
]

export default function Footer() {
  const { scrollTo } = useLenis()
  const year = new Date().getFullYear()

  const socials = socialMeta
    .map(({ key, label, name }) => ({ key, label, url: socialLinks[key], name }))
    .filter((s) => s.url)

  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          © {year} <span className="text-fg">{profile.brand}</span>
          <span className="mx-2 text-line-strong">·</span>
          <span className="text-muted">{profile.name}</span>
        </p>

        <p className="order-last w-full font-mono text-xs text-dim sm:order-none sm:w-auto">
          Diseñado y desarrollado con React · GSAP · Tailwind
        </p>

        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Icon name={social.name} className="h-[18px] w-[18px]" />
            </a>
          ))}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Mail className="h-[18px] w-[18px]" />
            </a>
          )}

          <button
            type="button"
            onClick={() => scrollTo('#inicio')}
            aria-label="Volver arriba"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-fg text-ink transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </footer>
  )
}