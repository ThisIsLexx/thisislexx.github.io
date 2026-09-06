/**
 * ─────────────────────────────────────────────────────────────
 *  IMÁGENES POR ENLACE
 *  Convierte lo que escribas en el campo `imagen`, `foto` o
 *  `portada` de un .md en una URL que un <img> pueda pintar.
 *
 *  Admite tres cosas:
 *    1. Rutas locales:  /img/galeria/sesion-01.jpg   (van en public/)
 *    2. Enlaces normales: https://.../foto.jpg
 *    3. Enlaces de "compartir" de Google Drive o Dropbox, que NO
 *       apuntan a la imagen sino a una página web con visor. Esos
 *       se traducen aquí al enlace directo del archivo.
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

  // Vacío, ruta local (/img/...) o dato incrustado: se usa tal cual.
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
