# Sharesizer
Free browser-based image tools (Astro, static, no backend).

    npm install
    npm run dev       # http://localhost:4321
    npm run build     # outputs ./dist  (deploy to Cloudflare Pages)

Cloudflare Pages: build command `npm run build`, output directory `dist`.

## Structure
    src/data/platforms.js      size presets (social + YouTube) - edit specs here
    src/data/tools.js          tab order on the home page
    src/components/tools/*     one component per tool (markup)
    src/scripts/tools/*        one script per tool (logic); index.js loads them all
    src/scripts/shared.js      helpers shared by the tools
    src/pages/blog/*.md        Creator Guides articles
To add a tool: add a component, a script, import both (index.astro, tools/index.js), and add it to data/tools.js.
