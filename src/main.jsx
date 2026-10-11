import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './animations/setup'
import './index.css'
import App from './App'

// Nota: no se usa <StrictMode> porque GSAP ScrollTrigger y Lenis pueden
// duplicarse con el doble montaje de efectos en desarrollo.
createRoot(document.getElementById('root')).render(<App />)