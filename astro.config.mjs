// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://vasprisin.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    hmr: {
      protocol: 'wss',
      clientPort: 443,
    },
  },
});
