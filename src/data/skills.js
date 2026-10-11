// =====================================================================
//  HABILIDADES — con iconos reales de marcas (Simple Icons).
//  Para cambiar un icono: importa otro de 'simple-icons' y cambia el
//  valor `icon`. No se muestran niveles: solo nombre + icono.
// =====================================================================
import {
  siArduino,
  siBlender,
  siCss,
  siDotnet,
  siGit,
  siGithub,
  siGitlab,
  siHtml5,
  siJavascript,
  siKotlin,
  siMongodb,
  siMysql,
  siNodedotjs,
  siOpenjdk,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siUnity,
} from 'simple-icons'

export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML', icon: siHtml5 },
      { name: 'CSS', icon: siCss },
      { name: 'JavaScript', icon: siJavascript },
      { name: 'Tailwind CSS', icon: siTailwindcss },
      { name: 'React', icon: siReact },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'PHP', icon: siPhp },
      { name: 'Python', icon: siPython },
      { name: 'Java', icon: siOpenjdk },
    ],
  },
  {
    id: 'databases',
    label: 'Bases de datos',
    skills: [
      { name: 'MySQL', icon: siMysql },
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'MongoDB', icon: siMongodb },
    ],
  },
  {
    id: 'tools',
    label: 'Herramientas',
    skills: [
      { name: 'Git', icon: siGit },
      { name: 'GitLab', icon: siGitlab },
      { name: 'GitHub', icon: siGithub },
    ],
  },
  {
    id: 'development',
    label: 'Desarrollo',
    skills: [
      { name: 'Kotlin', icon: siKotlin },
      { name: 'C#', icon: siDotnet },
      { name: 'Arduino', icon: siArduino },
      { name: 'Blender', icon: siBlender },
      { name: 'Unity', icon: siUnity },
    ],
  },
]