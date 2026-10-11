// =====================================================================
//  SERVICIOS — lista editorial. Cada servicio tiene un icono de
//  lucide-react (guárdalo como componente, no como string).
// =====================================================================
import { Boxes, Database, Globe, LayoutGrid, Server, Sparkles } from 'lucide-react'

export const services = [
  {
    id: 'web',
    icon: Globe,
    title: 'Desarrollo Web',
    description:
      'Sitios y aplicaciones web accesibles y optimizadas, construidas con React, JavaScript y Tailwind CSS.',
  },
  {
    id: 'apps',
    icon: LayoutGrid,
    title: 'Aplicaciones',
    description:
      'Aplicaciones web completas: interfaces fluidas, gestión de estado, integración con APIs y UX cuidada.',
  },
  {
    id: 'backend',
    icon: Server,
    title: 'Backend',
    description:
      'APIs y servicios con Node.js, PHP y Python: lógica de negocio, autenticación e integraciones.',
  },
  {
    id: 'database',
    icon: Database,
    title: 'Bases de datos',
    description: 'Modelado, consultas y optimización en MySQL, PostgreSQL y MongoDB.',
  },
  {
    id: 'software',
    icon: Boxes,
    title: 'Software',
    description:
      'Aplicaciones y software con Java, Kotlin y C#, incluyendo experiencias con Unity y Arduino.',
  },
  {
    id: 'interactive',
    icon: Sparkles,
    title: 'Experiencias Interactivas',
    description:
      'Prototipos y experiencias digitales con animación, motion design y scroll storytelling.',
  },
]