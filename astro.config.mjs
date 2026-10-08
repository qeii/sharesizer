import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
// Set `site` to your real domain after buying it (needed for sitemap/canonical URLs).
export default defineConfig({ site: 'https://sharesizer.com', integrations: [sitemap()] });
