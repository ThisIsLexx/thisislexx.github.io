import type { ImageMetadata } from 'astro';

/**
 * ─────────────────────────────────────────────────────────────
 *  IMÁGENES
 *  Convierte lo que escribas en el campo `imagen`, `foto` o
 *  `portada` de un .md (o en src/config.ts) en algo que la página
 *  pueda pintar.
 *
 *  Admite tres cosas:
 *    1. Rutas locales:  /img/galeria/sesion-01.jpg
 *       El archivo vive en src/assets/img/galeria/sesion-01.jpg. Al
 *       compilar, Astro saca de él versiones en AVIF y WebP a varios
 *       anchos, y cada pantalla descarga solo la que necesita.
 *    2. Enlaces normales: https://.../foto.jpg
 *    3. Enlaces de "compartir" de Google Drive o Dropbox, que NO
 *       apuntan a la imagen sino a una página web con visor. Esos
 *       se traducen aquí al enlace directo del archivo.
 *  Los enlaces (2 y 3) se usan tal cual: Astro no puede optimizar
 *  lo que no está en el proyecto.
 *
 *  Lee el README (§ "Secciones con imágenes") antes de apoyarte en
 *  Drive: funciona, pero no es un servidor de imágenes.
 * ─────────────────────────────────────────────────────────────
 */

/** Hosts de Google donde vive un enlace de Drive */
const DRIVE = ['drive.google.com', 'docs.google.com', 'drive.usercontent.google.com'];

/**
 * Saca el ID del archivo de cualquiera de las formas que reparte Drive:
 *   https://drive.google.com/file/d/ID/view?usp=sharing   ← el de "Compartir"
 *   https://drive.google.com/open?id=ID
 *   https://drive.google.com/uc?export=view&id=ID
 *   https://drive.usercontent.google.com/download?id=ID
 */
function idDeDrive(url: URL): string | null {
  const enLaRuta = url.pathname.match(/\/(?:file\/)?d\/([A-Za-z0-9_-]{10,})/);
  if (enLaRuta) return enLaRuta[1];

  const enLaQuery = url.searchParams.get('id');
  if (enLaQuery && /^[A-Za-z0-9_-]{10,}$/.test(enLaQuery)) return enLaQuery;

  return null;
}

/**
 * Traduce un enlace de compartir a una URL que sirve el archivo.
 *
 * @param src   Lo escrito en el .md. Vacío o indefinido → ''.
 * @param ancho Ancho máximo que se le pide al servidor, en píxeles.
 *              Solo lo respeta Drive; el resto lo ignora.
 */
export function resolverImagen(src: string | undefined, ancho = 1600): string {
  const valor = (src ?? '').trim();

  // Vacío, ruta absoluta o dato incrustado: se usa tal cual.
  if (valor === '' || valor.startsWith('/') || valor.startsWith('data:')) return valor;

  let url: URL;
  try {
    url = new URL(valor);
  } catch {
    // Ni URL ni ruta absoluta: lo devolvemos sin tocar y que se vea
    // el fallo en la página, que es más fácil de encontrar que un
    // hueco silencioso.
    return valor;
  }

  if (DRIVE.includes(url.hostname)) {
    const id = idDeDrive(url);
    // `thumbnail` es el único punto de entrada de Drive que devuelve
    // la imagen y no una página HTML, y además la redimensiona.
    // `sz=w1600` = 1600 px de ancho como mucho.
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w${ancho}`;
  }

  // Dropbox entrega una página de previsualización salvo que se le
  // pida el archivo crudo.
  if (url.hostname.endsWith('dropbox.com')) {
    url.searchParams.delete('dl');
    url.searchParams.set('raw', '1');
    return url.toString();
  }

  return url.toString();
}

/**
 * Todas las fotos de src/assets/img, indexadas por su ruta pública:
 * "/img/galeria/piano.jpg" → la imagen que Astro sabe optimizar.
 * `eager` porque solo se lee su ficha (ancho, alto, formato); los
 * píxeles se procesan al compilar y únicamente los de las fotos que
 * de verdad se usan.
 */
const LOCALES = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: ImageMetadata }>(
      '../assets/img/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
      { eager: true }
    )
  ).map(([ruta, modulo]) => [ruta.replace('../assets', ''), modulo.default])
);

export type Foto =
  | { tipo: 'local'; imagen: ImageMetadata }
  | { tipo: 'remota'; url: string };

/**
 * Busca la foto que nombra un campo de contenido.
 *
 * @returns `null` si el campo está vacío (la pieza no se pinta),
 *          la imagen local si la ruta empieza por /img/, o la URL ya
 *          traducida si es un enlace.
 * @throws  Si la ruta es local y el archivo no existe: mejor que la
 *          compilación pare con un mensaje claro a publicar un hueco.
 */
export function buscarFoto(src: string | undefined, anchoRemoto = 1600): Foto | null {
  const valor = (src ?? '').trim();
  if (valor === '') return null;

  if (valor.startsWith('/')) {
    const imagen = LOCALES[valor];
    if (!imagen) {
      throw new Error(
        `No encuentro la imagen "${valor}". Las fotos van en src/assets${valor} ` +
          `(la ruta del .md es la misma sin "src/assets").`
      );
    }
    return { tipo: 'local', imagen };
  }

  return { tipo: 'remota', url: resolverImagen(valor, anchoRemoto) };
}
