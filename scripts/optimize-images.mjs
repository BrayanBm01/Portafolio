/**
 * Genera versiones WebP optimizadas de las imágenes fuente (carpeta /img)
 * hacia public/img/ para que el sitio cargue rápido.
 *
 * Las imágenes originales de /img NO se modifican:
 *  - se copian tal cual a public/img/ (sirven de fallback si el WebP falla)
 *  - se genera además su versión WebP optimizada
 *
 * Ejecuta:  npm run images
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { basename } from 'node:path'

const jobs = [
  {
    src: 'img/hana.png',
    out: 'public/img/hana',
    convertArgs: ['-resize', '1024x>', '-strip', '-quality', '84'],
  },
  {
    src: 'img/yo2.jpg',
    out: 'public/img/yo2',
    convertArgs: ['-resize', '1100x>', '-strip', '-quality', '82'],
  },
  {
    // Hana de pie/pose → sección "Quién soy"
    src: 'img/pose-hana.png',
    out: 'public/img/pose-hana',
    convertArgs: ['-resize', '860x>', '-strip', '-quality', '84'],
  },
  {
    // Hana mirando → sección "Proyectos"
    src: 'img/mirando.png',
    out: 'public/img/mirando',
    convertArgs: ['-resize', '860x>', '-strip', '-quality', '84'],
  },
]

const tool = existsSync('/usr/bin/magick') ? 'magick' : 'convert'

mkdirSync('public/img', { recursive: true })

for (const job of jobs) {
  if (!existsSync(job.src)) {
    console.warn(`! no existe ${job.src}, se omite`)
    continue
  }

  // 1) copia del original, para servir como fallback
  const copyTarget = `${job.out}${basename(job.src).slice(basename(job.src).lastIndexOf('.'))}`
  copyFileSync(job.src, copyTarget)
  console.log(`✓ ${job.src}  ->  ${copyTarget} (original)`)

  // 2) versión WebP optimizada
  const webpTarget = `${job.out}.webp`
  execFileSync(tool, [job.src, ...job.convertArgs, webpTarget], { stdio: 'inherit' })
  console.log(`✓ ${job.src}  ->  ${webpTarget} (webp)`)
}