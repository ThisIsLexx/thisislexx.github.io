// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE } from './src/config';

/**
 * Borra de la publicación las imágenes que ninguna página usa.
 *
 * src/lib/imagen.ts importa todas las fotos de src/assets/img para
 * poder encontrarlas por su ruta /img/..., y Vite copia a dist/ todo lo
 * que se importa: también los JPG originales de varios megas y las
 * fotos que ningún .md nombra. Lo que se sirve de verdad son las
 * versiones AVIF/WebP/JPG que Astro genera a cada ancho. Al terminar
 * la compilación, cualquier imagen de dist/_astro que no aparezca en
 * ningún HTML, CSS, JS o XML generado sobra y se elimina.
 */
function limpiarImagenesSinUso() {
  return {
    name: 'limpiar-imagenes-sin-uso',
    hooks: {
      /** @param {{ dir: URL, logger: import('astro').AstroIntegrationLogger }} opciones */
      'astro:build:done': async ({ dir, logger }) => {
        const raiz = fileURLToPath(dir);
        const carpeta = join(raiz, '_astro');

        const todos = /** @type {string[]} */ (await readdir(raiz, { recursive: true }));
        const textos = await Promise.all(
          todos
            .filter((ruta) => /\.(html|css|js|mjs|xml|json|webmanifest)$/i.test(ruta))
            .map((ruta) => readFile(join(raiz, ruta), 'utf8'))
        );
        const referencias = textos.join('\n');

        let borradas = 0;
        let bytes = 0;

        for (const nombre of await readdir(carpeta)) {
          if (!/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(nombre)) continue;
          if (referencias.includes(nombre)) continue;

          const ruta = join(carpeta, nombre);
          bytes += (await stat(ruta)).size;
          await unlink(ruta);
          borradas++;
        }

        logger.info(
          `${borradas} imágenes sin uso fuera de la publicación (${(bytes / 1048576).toFixed(1)} MB)`
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Cuando compres el dominio, cambia SITE.url en src/config.ts
  site: SITE.url,
  integrations: [sitemap(), limpiarImagenesSinUso()],
});
