// Uses the `site` value from astro.config.mjs, so changing your domain updates this automatically.
export const GET = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
