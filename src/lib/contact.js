// =====================================================================
//  CONTACTO — validación y envío del formulario.
//
//  Estado actual: NO hay backend ni servicio de correo configurado.
//  - validateContact(): validación 100% frontend (name, email, message).
//  - submitContact():   prepara la carga útil (payload) y decide el envío:
//      · si hay `profile.email` configurado → abre el cliente de correo
//        del usuario con el mensaje pre-rellenado (mailto; envío real,
//        sin simulaciones).
//      · si NO hay email configurado → devuelve { notConfigured: true }
//        con el payload listo. La UI muestra un aviso honesto.
//
//  Para conectar un backend/servicio real más adelante, sustituye el
//  cuerpo de submitContact() por un fetch() a tu endpoint:
//
//    const res = await fetch('https://tu-api.example/contact', {
//      method: 'POST',
//      headers: { 'Content-Type': 'application/json' },
//      body: JSON.stringify(payload),
//    })
//    if (!res.ok) return { ok: false, error: 'No se pudo enviar.' }
//    return { ok: true, delivered: true, payload }
// =====================================================================
import { profile } from '../data/profile'

export function validateContact(values) {
  const errors = {}

  const name = (values.name || '').trim()
  if (!name) {
    errors.name = 'Escribe tu nombre.'
  } else if (name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.'
  }

  const email = (values.email || '').trim()
  if (!email) {
    errors.email = 'Escribe tu correo electrónico.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Escribe un correo válido (ej. hola@dominio.com).'
  }

  const message = (values.message || '').trim()
  if (!message) {
    errors.message = 'Cuéntame en qué podríamos trabajar.'
  } else if (message.length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.'
  }

  return errors
}

export function buildContactPayload(values) {
  return {
    to: profile.email || '',
    from: (values.email || '').trim(),
    name: (values.name || '').trim(),
    message: (values.message || '').trim(),
    subject: `Contacto desde el portafolio — ${(values.name || '').trim()}`,
    sentAt: new Date().toISOString(),
  }
}

/**
 * Envía el formulario. Devuelve siempre un resultado estructurado:
 *   { ok, delivered, notConfigured?, error?, payload }
 */
export async function submitContact(values) {
  const payload = buildContactPayload(values)

  if (!payload.to) {
    // Sin destino configurado: no se simula ningún envío.
    return { ok: false, delivered: false, notConfigured: true, payload }
  }

  // Abre el cliente de correo con el mensaje listo (envío real del usuario).
  const mailto = [
    `mailto:${payload.to}`,
    `subject=${encodeURIComponent(payload.subject)}`,
    `body=${encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.from})`)}`,
  ].join('?')

  window.location.href = mailto
  return { ok: true, delivered: true, payload }
}