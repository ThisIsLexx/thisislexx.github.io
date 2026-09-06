/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN GLOBAL DEL SITIO
 *  Todo lo editable "de negocio" vive aquí. No hace falta tocar
 *  ningún componente para cambiar datos de contacto o textos base.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE = {
  /** URL final con tu dominio. Mientras no lo tengas: https://thisislexx.github.io */
  url: 'https://thisislexx.github.io',
  name: 'LEXX',
  role: 'Productor Musical',
  /** Aparece en el <title> por defecto y en los resultados de búsqueda */
  tagline: 'Producción, mezcla y mastering',
  description:
    'Productor musical. Producción, mezcla y mastering para artistas independientes. Sonido con carácter, entregas puntuales y proceso claro.',
  city: 'Guadalajara, México',
  locale: 'es_MX',
  lang: 'es',
} as const;

export const CONTACT = {
  /** Formato internacional SIN espacios, +, ni guiones. Ej. México: 52 + LADA + número */
  whatsapp: '523312861625',
  whatsappMessage: 'Hola Lexx!, vi tu página y me interesa trabajar contigo en un proyecto.',
  email: 'thisislexxb@gmail.com',
  emailSubject: 'Cotización de producción musical',
  emailBody:
    'Hola Lexx,\n\nMi proyecto es:\nGénero:\nCanciones:\nFecha límite:\nPresupuesto aproximado:\n\nGracias.',
} as const;

/**
 * ─────────────────────────────────────────────────────────────
 *  HERO — la portada: una foto de fondo, atenuada, con las
 *  partículas por encima. Todo lo de aquí se cambia sin tocar
 *  ningún componente.
 * ─────────────────────────────────────────────────────────────
 */
export const HERO = {
  /** Foto de fondo. Ruta en /public o URL completa (vale un enlace
      de Google Drive, ver README). Vacío = fondo liso, sin foto. */
  imagen: '/img/hero/estudio-ancho.webp',
  /** Versión vertical para móviles. Un recorte apaisado en una
      pantalla de pie se queda en nada. Vacío = usa la de arriba. */
  imagenMovil: '/img/hero/estudio-alto.webp',
  /** Qué parte de la foto se conserva al recortar: 'center 55%'
      baja el encuadre, 'center top' lo sube. Igual que object-position. */
  encuadre: 'center 52%',
  /** Cuánto se atenúa la foto. 0 = foto limpia · 1 = negro. */
  oscurecer: 0.5,
  /** Viñeta: cuánto se oscurecen las esquinas. 0 = sin viñeta · 1 = mucha. */
  vineta: 0.9,
  /** Partículas interactivas encima de la foto. false = solo la foto. */
  particulas: true,
} as const;

export const SOCIAL = [
  { label: 'Instagram', url: 'https://www.instagram.com/_thisislexx_/' },
  { label: 'Spotify', url: 'https://open.spotify.com/intl-es/artist/7CiJ0rMQiUhhAWLtrqcTQf?si=hoy8LxW0QBudzIQzkIgJYA' },
  { label: 'YouTube', url: 'https://www.youtube.com/@ProducedByLexx' },
  { label: 'SoundCloud', url: 'https://soundcloud.com/' },
] as const;

/**
 * Menú. `requiere` marca las entradas cuya sección solo existe si su
 * colección tiene alguna imagen: el Header las esconde mientras esté
 * vacía, para no dejar un enlace que no lleva a ninguna parte.
 */
export const NAV = [
  { label: 'Estudio', href: '#estudio', requiere: 'estudio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Trabajos', href: '#trabajos' },
  { label: 'Sesiones', href: '#sesiones', requiere: 'galeria' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Clientes', href: '#testimonios' },
  { label: 'FAQ', href: '#faq' },
] as const satisfies readonly { label: string; href: string; requiere?: 'estudio' | 'galeria' }[];

/** Enlaces de acción construidos a partir de CONTACT */
export const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;
export const mailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.emailSubject)}&body=${encodeURIComponent(CONTACT.emailBody)}`;
