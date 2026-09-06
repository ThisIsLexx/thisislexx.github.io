import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* Colecciones de contenido: cada ítem es un archivo .md en
   src/content/<colección>/. Añadir un servicio, un testimonio o
   un trabajo = crear un archivo. No se toca ningún componente. */

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    /** Precio de referencia. Usa '' para ocultarlo. */
    desde: z.string().optional(),
    entrega: z.string().optional(),
    incluye: z.array(z.string()),
    /** Color del bloque: red | magenta | blue | ink */
    color: z.enum(['red', 'magenta', 'blue', 'ink']).default('red'),
    /** Figura Bauhaus del ícono: circle | square | triangle | quarter */
    figura: z.enum(['circle', 'square', 'triangle', 'quarter']).default('circle'),
    orden: z.number().default(0),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonios' }),
  schema: z.object({
    nombre: z.string(),
    proyecto: z.string(),
    rol: z.string().optional(),
    /** Ruta dentro de /public (/img/clientes/ana.jpg) o URL completa,
        incluido un enlace de compartir de Google Drive. Ver README. */
    foto: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    orden: z.number().default(0),
  }),
});

const trabajos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trabajos' }),
  schema: z.object({
    titulo: z.string(),
    artista: z.string(),
    anio: z.number(),
    genero: z.union([z.string(), z.array(z.string())]),
    /** Qué hiciste: Producción, Mezcla, Mastering... */
    roles: z.array(z.string()),
    plataforma: z.enum(['spotify', 'youtube', 'soundcloud']),
    /** Solo el ID/URI, no la URL completa. Ver README. */
    embedId: z.string(),
    /** Carátula: ruta dentro de /public (/img/trabajos/ep.jpg) o URL
        completa, incluido un enlace de compartir de Google Drive.
        Si se deja vacío, la tarjeta se queda solo con el reproductor. */
    portada: z.string().optional(),
    portadaAlt: z.string().optional(),
    /**
     * Alto del reproductor de Spotify:
     *   'compacto' → 80px, la barra sin lista de canciones
     *   'lista'    → 352px, la lista completa con scroll
     *   un número  → ese alto exacto en píxeles
     * Spotify no informa de cuánto ocupa de verdad y elige su diseño
     * según el alto que recibe: por debajo de ~170px cae al compacto
     * y esconde la lista. Con pocas canciones, da el número exacto:
     * unos 80px de base + 44px por canción (2 temas → 168).
     */
    reproductor: z
      .union([z.enum(['compacto', 'lista']), z.number().int().min(80).max(720)])
      .default('compacto'),
    destacado: z.boolean().default(false),
    orden: z.number().default(0),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    pregunta: z.string(),
    orden: z.number().default(0),
  }),
});

/* Bloques de "Estudio": una foto grande y un texto al lado, alternando
   el lado en cada bloque. Es lo que le da ritmo de landing page a la
   página. Un archivo = un bloque. */
const estudio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/estudio' }),
  schema: z.object({
    titulo: z.string(),
    /** Ruta dentro de /public (/img/estudio/cabina.jpg) o URL completa,
        incluido un enlace de compartir de Google Drive. Ver README.
        Mientras esté vacía, el bloque no se pinta. */
    imagen: z.string().default(''),
    /** Texto alternativo. Descríbela para quien no la ve. */
    alt: z.string().default(''),
    /** Figura Bauhaus que se solapa con la foto */
    figura: z.enum(['circle', 'square', 'triangle', 'quarter']).default('circle'),
    /** Color de esa figura y del marco */
    color: z.enum(['red', 'magenta', 'blue']).default('magenta'),
    orden: z.number().default(0),
  }),
});

/* Galería de sesiones: retícula de fotos. Un archivo = una foto. */
const galeria = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galeria' }),
  schema: z.object({
    /** Ruta dentro de /public o URL completa, incluido un enlace de
        compartir de Google Drive. Vacía = no se pinta. */
    imagen: z.string().default(''),
    alt: z.string().default(''),
    /** Pie opcional que aparece al pasar el ratón */
    titulo: z.string().optional(),
    /** true = ocupa dos columnas en vez de una */
    ancha: z.boolean().default(false),
    /**
     * Proporción del hueco. La foto se recorta para llenarlo, así que
     * elige el que se parezca al de la foto o se quedará por el camino
     * la mitad de la imagen:
     *   apaisado (4:3, por defecto) · vertical (3:4) · cuadrado (1:1)
     *   original → respeta la proporción de la foto y no recorta nada
     */
    formato: z.enum(['apaisado', 'vertical', 'cuadrado', 'original']).default('apaisado'),
    orden: z.number().default(0),
  }),
});

export const collections = { servicios, testimonios, trabajos, faq, estudio, galeria };
