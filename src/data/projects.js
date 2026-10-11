// =====================================================================
//  PROYECTOS
//  - image:  { webp, fallback, alt }  → rutas dentro de /public
//    · webp:     imagen optimizada (public/img/…)
//    · fallback: imagen original (img/…)
//    Si el proyecto no tiene imagen todavía, deja image: null y se
//    mostrará un placeholder elegante.
//  - links:  { github: '', demo: '' } → si están vacíos, no se muestran
//    botones falsos.
//  - pending: true  → muestra la etiqueta "próximamente".
// =====================================================================

export const projects = [
  {
    id: 'hana',
    name: 'HANA',
    category: 'Asistente personal con IA',
    description:
      'IA personal de tipo “Jarvis” que conversa por WhatsApp: memoria permanente, gestión de documentos y contexto a largo plazo, ejecutada 24/7 en un servidor remoto.',
    featured: true,
    image: {
      webp: '/img/hana.webp',
      fallback: '/img/hana.png',
      alt: 'HANA — asistente personal con inteligencia artificial',
    },
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Qdrant', 'WhatsApp'],
    links: { github: '', demo: '' },
  },
  {
    id: 'diarix',
    name: 'DiariX',
    category: 'Aplicación',
    pending: true,
    description: '',
    image: null,
    tech: [],
    links: { github: '', demo: '' },
  },
  {
    id: 'cordalia',
    name: 'Cordalia',
    category: 'Proyecto',
    pending: true,
    description: '',
    image: null,
    tech: [],
    links: { github: '', demo: '' },
  },
]

export const projectLinkLabels = {
  github: 'GitHub',
  demo: 'Demo',
}