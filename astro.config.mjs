// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config';

// https://astro.build/config
export default defineConfig({
  // Cuando compres el dominio, cambia SITE.url en src/config.ts
  site: SITE.url,
  integrations: [sitemap()],
});
