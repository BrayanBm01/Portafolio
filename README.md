# Portafolio — BNakan0 · Brayan Borja

Portafolio profesional moderno construido con **React + Vite + Tailwind CSS + GSAP (ScrollTrigger) + Framer Motion + Lenis + @gsap/react**.

Experiencia de **scroll storytelling**: el scroll controla la composición (pin + scrub + matchMedia + sección horizontal + reveals atados al scroll), con iconos profesionales (lucide-react + simple-icons), interacción al hacer **click en Hana** (panel del proyecto) y accesibilidad (`prefers-reduced-motion` contemplado en toda la app).

---

## Requisitos

- Node.js 18+ (probado con Node 26)
- npm

## Comandos

| Comando            | Qué hace                                              |
| ------------------ | ----------------------------------------------------- |
| `npm install`      | Instala dependencias                                   |
| `npm run dev`      | Servidor de desarrollo (http://localhost:5173)         |
| `npm run build`    | Build de producción en `dist/`                         |
| `npm run preview`  | Sirve el build localmente para verificar               |
| `npm run images`   | Copia y optimiza las imágenes (`img/` → `public/img/`) |

## Estructura

```
src/
  animations/     setup de GSAP/ScrollTrigger + helpers de reveal/parallax/scrub-words
  components/     Navbar, Footer y componentes UI reutilizables (HanaModal, BrandIcon, …)
  data/           profile, skills, services, projects  ← edita el contenido aquí
  hooks/          useLenis (smooth scroll), usePrefersReducedMotion
  sections/       Hero, About, Skills, Services, Projects, Contact
public/img/       imágenes servidas por el sitio (generadas desde /img)
img/              imágenes originales — NO se modifican
dist/             salida de build (se publica en Netlify)
```

## Cómo desplegar en Netlify

1. Sube el repositorio a GitHub / GitLab.
2. En Netlify: **Add new site → Import an existing project** y elige el repo.
3. Configuremos (o usa el `netlify.toml` ya incluido — se detecta solo):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. El SPA fallback (`/* → /index.html`) ya está configurado en `netlify.toml`.

> Alternativa CLI: `npm i -g netlify-cli` → `netlify deploy --prod` desde la raíz del proyecto (usa el `netlify.toml` automáticamente).

## Dónde editar cada cosa

| ¿Qué quieres cambiar?            | Archivo                          |
| -------------------------------- | -------------------------------- |
| **Marca / alias**                | `src/data/profile.js` → `brand`, `alias` |
| **Nombre real**                  | `src/data/profile.js` → `name`   |
| **Rol / cargo**                  | `src/data/profile.js` → `role`, `roleExtra` |
| **Frase del hero / descripción** | `src/data/profile.js` → `tagline`, `about`, `values` |
| **Email**                        | `src/data/profile.js` → `email`  |
| **Ubicación / disponibilidad**   | `src/data/profile.js` → `location`, `availability` |
| **Redes sociales**               | `src/data/profile.js` → `socialLinks` (vacío = no se muestra) |
| **SEO (title, description, OG)** | `index.html` (la app actualiza `document.title` desde `profile`) |
| **Proyectos**                    | `src/data/projects.js` (ver abajo) |
| **Skills (nombre + icono)**      | `src/data/skills.js` (iconos de paquetes de `simple-icons`) |
| **Servicios**                    | `src/data/services.js` (iconos de `lucide-react`) |

### Agregar un proyecto nuevo

Abre `src/data/projects.js` y añade un objeto al array `projects`:

```js
{
  id: 'mi-proyecto',            // único
  name: 'Mi Proyecto',
  category: 'Aplicación web',   // etiqueta corta
  description: 'Descripción breve…',
  featured: false,              // true = aparece como acto destacado en la escena de proyectos
  image: {
    webp: '/img/mi-proyecto.webp',   // optimizada (genera con `npm run images`)
    fallback: '/img/mi-proyecto.png',// original (fallback si el webp falla)
    alt: 'Descripción accesible de la imagen',
  },
  // o image: null  → placeholder elegante automático
  tech: ['React', 'Node.js'],
  links: { github: 'https://…', demo: 'https://…' }, // vacíos = sin botones
}
```

- **Hana**, **DiariX** y **Cordalia** ya están. DiariX y Cordalia usan placeholder porque no tienen información/imagen todavía: solo completa sus campos cuando existan (no inventes URLs ni características).
- Si tu proyecto no tiene imagen, deja `image: null` y se mostrará un placeholder que puedes reemplazar luego. Para regalarle imagen al proyecto pasa por `npm run images` o copia el archivo a `public/img/`.

### Imágenes

- Las **originales viven en `img/`** (`hana.png`, `yo2.jpg`, `pose-hana.png`, `mirando.png`) y jamás se tocan.
- `npm run images` las **copia** a `public/img/` y genera versiones **WebP** optimizadas (el sitio carga el WebP y usa el original como fallback).
- Las rutas se referencian en `src/data/projects.js`, en `src/sections/About.jsx` (imagen `yo2`) y en las figuras decorativas del personaje: `pose-hana` (sección "Quién soy", solo desktop) y `mirando` (junto al formulario de Contacto, solo desktop). Ambas se ocultan por completo en móvil.
- Si reemplazas un original en `img/`, ejecuta `npm run images` para regenerar.

## Tecnologías y decisiones

- **GSAP + ScrollTrigger + @gsap/react**: narrativa de scroll real con `pin`, `scrub` y `gsap.matchMedia()`.
  - **Hero**: escena de ~220vh, UNA timeline principal (`scrub: 1`) y solo 3 movimientos: Hana (del borde al centro, escala y hundimiento), el bloque de texto (sube y sale) y la palabra gigante de fondo. Hana es protagonista a gran tamaño en el inicio (`object-fit: contain`, ancho ~40vw/540px, alto ~80svh/720px) y **al hacer click abre el panel HANA** (Framer Motion, ~0.35s, accesible).
  - **Sobre mí**: composición mínima — imagen + texto + un elemento decorativo estático. La foto (~35-40% de la sección) entra con escala 0.96 → 1 y parallax muy suave (y 30 → -20); solo dos movimientos atados al scroll.
  - **Skills**: sección **horizontal fijada** (pin) controlada por scroll vertical, con distancia calculada en runtime y un recorrido ~25% más corto; iconos reales de marcas (simple-icons).
  - **Proyectos**: escena fijada de ~280vh en tres actos (HANA → DiariX → Cordalia); transiciones limpias (solo opacity + translate), composición ~55% información / 45% imagen (imagen con `max-w`), indicador "01 / 03 · nombre" y barra de progreso.
  - **Servicios**: grid de tarjetas (2 columnas en desktop, 1 en móvil) con entrada por stagger **una sola vez**, icono lucide, número, descripción y hover discreto (sube 4px + borde/glow sutiles).
  - **Contacto**: composición minimalista con reveals por scroll (sin parallax de decoración).
- **Framer Motion**: panel de HANA (click), hover de skills y menú móvil. No se usa para animaciones de scroll (eso es GSAP).
- **Lenis**: smooth scrolling integrado con ScrollTrigger con respuesta inmediata (`lerp: 0.12`, anclas con `duration: 1.1`); se desactiva si `prefers-reduced-motion: reduce`.
- **Iconos profesionales**: `lucide-react` (UI general, tarjetas de servicios) + `simple-icons` (logos de marcas en skills, con chips y color corporativo). Java y C# usan `siOpenjdk` y `siDotnet` (equivalencias de Simple Icons).
- **HanaModal** (`src/components/ui/HanaModal.jsx`): al hacer click en Hana el personaje crece un poco (clase en el wrapper), la escena se oscurece y entra un panel con la información REAL del proyecto (sin botón "Ver proyecto" si no existe URL). Accesible: `role="dialog"`/`aria-modal`, ESC y click fuera cierran, trap de Tab, focus restaurado y scroll bloqueado/restaurado (compatible Lenis).
- **Sin cursor personalizado**: se eliminó `src/components/ui/Cursor.jsx` — solo cursor nativo del sistema.
- **Responsive**: `gsap.matchMedia()` — desktop con grandes movimientos/pins/horizontal; móvil sin pins, parallax sutil y contenido apilado.
- **Accesibilidad**: skip-link, HTML semántico, `aria-label`, focus-visible, `alt` en imágenes, teclado y `prefers-reduced-motion` en CSS y JS (la preferencia se lee de forma síncrona para no crear animaciones innecesarias).
- Sin overflow horizontal: `overflow-x: clip` en body + composiciones controladas.