# README

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

# Sharesizer

Free, private image tools and guides for content creators. Everything runs **in the visitor's browser**: no backend, no database, no API, no uploads.

- Stack: Astro (static) + vanilla JS tools. Hosting: Cloudflare Pages. Repo: `github.com/qeii/sharesizer`.
- Live address today: the `*.pages.dev` URL. Target domain: `sharesizer.com` (not connected yet, see Checklist).
- Requires **Node 22.12+** (Astro 7). `.node-version` pins 22 for Cloudflare.

```
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs ./dist
```

Publish = `git add .`, `git commit -m "what changed"`, `git push`. Cloudflare rebuilds automatically.

---

## 1. Status (what exists)

**30 pages**, all static.

| Group | URLs |
|---|---|
| Home (10 tool tabs) | `/` : Photo Editor, Resizer, Compressor, Cropper, Converter, Aspect Ratio, Social Maker, Social Checker, Color Picker, QR Code |
| Menu / hubs | `/size-tools`, `/blog` |
| YouTube | `/youtube-thumbnail-size`, `/youtube-banner-size`, `/youtube-image-sizes` (YouTube Pack, 7 sizes in one ZIP), `/youtube-thumbnail-tester` |
| Social size pages | `/instagram-post-size`, `/instagram-story-size`, `/tiktok-image-size`, `/facebook-cover-photo-size`, `/facebook-post-size`, `/linkedin-banner-size`, `/x-twitter-image-size`, `/pinterest-pin-size` |
| Tool pages | `/resize-image`, `/crop-image`, `/compress-image`, `/aspect-ratio-calculator` |
| Converters | `/jpg-to-png`, `/png-to-jpg`, `/webp-to-jpg`, `/jpg-to-webp`, `/png-to-webp`, `/webp-to-png` |
| Content | `/blog/faceless-quiet-luxury-fashion-channel-ai` |
| Site pages | `/about`, `/privacy`, `/contact`, `404`, `robots.txt`, sitemap |

Keyword coverage: of the original 40 target keywords, 39 have a working tool and a page or tab. The exception is **YouTube Thumbnail Maker** (see Backlog). The weak PNG compressor was deliberately set aside.

---

## 2. Checklist: what is left (in this order)

### A. Domain and email (needs the owner; ~1 hour)
- [ ] Check that the **.com** is free and that the YouTube / Instagram / TikTok handles are free. Search the name in quotes on Google and in a trademark database (USPTO search for the US).
- [ ] Buy **sharesizer.com** in Cloudflare (Domain Registration). Turn on auto-renew.
- [ ] Cloudflare > Workers & Pages > the Pages project > **Custom domains** > set up `sharesizer.com`. Wait until it shows *Active*. Optional: add `www` and redirect it to the main address.
- [ ] Confirm `site: 'https://sharesizer.com'` in `astro.config.mjs`. Sitemap, canonical links, Open Graph URLs and `robots.txt` all read from it. Commit and push if you change it.
- [ ] **Email:** Cloudflare > the domain > Email > Email Routing. Add your Gmail as a *verified destination address* (click the link Cloudflare emails you), create the custom address `hello`, accept the MX/SPF records it offers, then send a test message from another account.
- [ ] Put the address in `src/data/site.js` (`CONTACT_EMAIL`). **The Contact page shows no email until this is set, and the build prints a warning.** Commit and push.
- [ ] Optional later: reply *as* `hello@` from Gmail ("Send mail as") needs an SMTP service. Gmail's own SMTP with an app password works for low volume but may land in spam; a free sending service avoids that.

### B. Search visibility (after the domain is Active)
- [ ] Google Search Console: add `sharesizer.com` as a **domain property**, verify with the DNS record in Cloudflare, submit `https://sharesizer.com/sitemap-index.xml`.
- [ ] Bing Webmaster Tools: import from Search Console.
- [ ] Open every page on the real domain on a phone (see manual test list in section 6).
- [ ] Until the domain is live, do **not** promote the `pages.dev` address widely (canonical links point to the future domain).

### C. Test before announcing
- [ ] **Safari / iPhone:** JPG to WebP and the Converter tab. Some browsers cannot encode WebP; the tool now shows a message instead of returning the wrong format, but this has only been simulated.
- [ ] Android Chrome: upload, crop, download on a size page.
- [ ] Dark and light mode on every page type.

### D. Content (articles that link to the tools)
Write in `src/pages/blog/` (see section 5). Planned, in this order:
- [ ] **YouTube thumbnail safe area**
- [ ] **WebP vs JPG vs PNG**
- [ ] **How to make a thumbnail readable on mobile**

### E. Money (only after there is traffic and content)
- [ ] Apply to affiliate programs for tools actually used in the guides (section 7).
- [ ] Add a plain "Tools I use" page with a disclosure line.
- [ ] AdSense: apply only when there is real traffic and several more articles. Update `/privacy`, add cookie consent for EU/UK visitors, and re-read AdSense content policies first.

---

## 3. Project structure

```
src/data/platforms.js      size presets (SOCIAL_SPECS + YOUTUBE_SIZES). Edit specs HERE.
src/data/size-pages.js     content for the 10 platform size pages (tips, FAQ, guides)
src/data/tool-pages.js     content for the 6 converter pages
src/data/utility-pages.js  content for resize / crop / compress / aspect-ratio pages
src/data/tools.js          tab order on the home page
src/data/hub.js            the /size-tools menu groups
src/data/site.js           CONTACT_EMAIL and site name
src/components/tools/*     one component (markup) per tool
src/scripts/tools/*        one script (logic) per tool; index.js loads them on the home page
src/scripts/shared.js      helpers shared by tools
src/scripts/thumb-analysis.js   pure image measurements for the Thumbnail Tester
src/scripts/size-tool.js        the upload/crop/download tool on size pages
src/layouts/               Base (head, nav, footer, SEO tags), Post, Page, ConverterPage, UtilityPage
src/pages/                 routes. [slug].astro generates the size pages from size-pages.js
src/pages/blog/*.md        Creator Guides articles
public/favicon.svg
```

**To add a size page:** add an entry to `SIZE_PAGES` in `size-pages.js` (and a preset in `platforms.js` if the size is new). The page, sitemap entry and structured data are generated.
**To add a converter / tool page:** add data, plus a 5-line file in `src/pages/`. Copy an existing one.
**To add a tool tab:** component + script + import in `src/pages/index.astro` and `src/scripts/tools/index.js` + entry in `src/data/tools.js`.
**Home page quick links and `/size-tools`:** the owner edited these by hand (hub layout, grouped 3-column list). Do not overwrite `src/pages/index.astro`, `src/pages/size-tools/index.astro`, `src/styles/hub.css` or `src/data/hub.js` from an old copy. New pages appear in the menu only after editing `hub.js` (add a `fromPage(...)` card).

---

## 4. Key decisions (and why)

- **No meta keywords.** Google ignores them. Each keyword group maps to **one page** with the keyword in the title, H1, intro and headings.
- **One page per search intent.** Do not create near-duplicate pages ("resize jpg", "image resizer free"). Many thin pages compete with each other and risk being treated as low-value.
- **Tool pages for tool searches** (e.g. "JPG to PNG"); **articles for how/why searches**.
- **Static, client-side only.** No server cost, nothing to scale, strong privacy claim. Do not add features that need an upload.
- **Honest wording.** The Thumbnail Tester measures images; it does not predict clicks, read text or detect faces. The comparator is a measurement comparison, not a real viewer A/B test.
- **Specs carry a "Checked" date.** Platforms change sizes often. Where sources disagree, the page says so.
- **Titles contain "2026".** Update titles and the `UPDATED` constants each year (or drop the year).

---

## 5. Article plan (Creator Guides)

New article = new file `src/pages/blog/<slug>.md`:

```md
---
layout: ../../layouts/Post.astro
title: "Title (keep under ~60 characters if possible)"
description: "One or two sentences, ~150 characters."
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
readTime: "6 min read"
---
Intro paragraph, then ## headings.
```
It appears on `/blog` and in the sitemap automatically. Link to tools with normal markdown links. Verify every factual claim before writing; where sources disagree, say so.

**1. YouTube thumbnail safe area** (strongest topic; ties to the tester)
- Cover: the video-length badge in the bottom-right corner, why to keep faces and text away from it, the 1280×720 / 16:9 / under 2 MB basics, the banner safe area (1546×423 centered; some older guides say 1235×338).
- Verify first: YouTube's current thumbnail guidance, whether thumbnails look different in Shorts, TV and the mobile app, and any exact badge dimensions (the tools use an approximate zone; do not state exact numbers unless sourced).
- Link to: `/youtube-thumbnail-size`, `/youtube-thumbnail-tester`, `/youtube-banner-size`, `/youtube-image-sizes`.

**2. WebP vs JPG vs PNG**
- Cover: lossy vs lossless, transparency, animation, typical use (photos vs logos/text vs web pages), browser and upload-form support, what happens when converting between them.
- Verify first: current browser support, any "X% smaller" claims (avoid numbers unless sourced), WebP encoding behavior in Safari (test it).
- Link to the six converter pages and `/compress-image`.

**3. How to make a thumbnail readable on mobile**
- Cover: testing at small size (the tester previews 168 px and 100 px as rough stand-ins for small cards), big high-contrast 3-4 word text, simplifying, dark mode, keeping clear of the corner badge.
- Be honest that the tool measures contrast and detail, not whether text is readable.
- Link to `/youtube-thumbnail-tester` and `/youtube-thumbnail-size`.

Later ideas: how to resize without losing quality, what is aspect ratio (link to the calculator), best sizes for Shorts/Reels/TikTok covers, and one article per new YouTube video.

---

## 6. Manual test list (no automated tests are in the repo)

During development the assistant checked tools with a temporary simulated-browser script that is **not** part of this repo. Before launches, check by hand:

- Home: every tab opens one panel; Photo Editor loads an image, rotate/flip/crop/filter/export work; QR code scans from a phone.
- Size pages: upload, drag on the preview to change the crop, download, file name correct; the "enlarged and may look soft" warning appears for small images.
- Converters: preset format is selected; PNG target disables the quality slider; downloaded file opens.
- Thumbnail Tester: add 2-4 thumbnails, summary appears, all four feed layouts show, dark mode, competitor screenshots appear.
- YouTube Pack: ZIP downloads with 7 files.
- Contact page shows the email; Privacy page matches what the site actually does.

---

## 7. Monetization notes

- **YouTube Partner Program** (verify on YouTube's official page): at last check, 1,000 subscribers plus 4,000 public watch hours (12 months) or 10M Shorts views (90 days). A 500-subscriber tier unlocks fan funding, not ads. YouTube announced that from **1 Feb 2027** new applicants need 8,000 watch hours or 20M Shorts views.
- **Affiliate programs worth checking** (read each official page; third-party directories disagree on rates and terms): ElevenLabs (official creator program), Canva, Epidemic Sound or Envato, vidIQ / TubeBuddy (sources conflict, one says TubeBuddy is closed to new affiliates), Amazon Associates / LTK for fashion content (approval and activity rules apply).
- **Placement rules:** only in Creator Guides articles, video descriptions and a "Tools I use" page, never inside the tools. Always add a visible disclosure line. Only recommend tools actually used; never claim a cheap item is "identical" to an expensive one.
- **Every video:** one natural sentence plus a description link to Sharesizer.
- **AdSense:** needs original content, privacy/about/contact pages (done), and consent handling for EU/UK when ads or analytics are added. Update `/privacy` the same day.
- Cloudflare Web Analytics (free, privacy-friendly) can show whether videos send traffic. Add it, then update `/privacy`.
- Expect little income until there is steady traffic. Image tools are a very competitive niche; target specific searches (safe area, platform sizes), not "image resizer".

---

## 8. Backlog and known limitations

**Features not built**
- **YouTube Thumbnail Maker** (templates, text, shapes): the Photo Editor can place text on an image but is not a maker. The only target keyword without a tool.
- Face detection and automatic text-readability (OCR) in the Thumbnail Tester: need heavy extra libraries.
- Real PNG compression (needs color quantization, e.g. a WebAssembly pngquant). The Compressor is honest about PNG, and the page says so.
- Optional: a `/resources` ("Tools I use") page, an Open Graph share image, a "don't index" tag if you ever want to hide staging.

**Facts to re-verify (specs change, sources disagree)**
- Safe-area and app-button zones are **approximate**: YouTube timestamp corner, Instagram Story/TikTok top and bottom bands (~14%), Facebook cover (1280×624 shown), LinkedIn mobile-safe widths. Platform text says "approx.".
- Facebook has no single official cover size (1640×720 = 2x of the common 820×360 compromise).
- LinkedIn company cover limit: sources say 3 to 8 MB; the preset uses the cautious 3 MB.
- X post image size varies by source (1200×675 to 1600×900); the 5 MB limit comes from one source.
- YouTube Pack: watermark limit (1 MB) and the community-post size are less clearly documented than thumbnail, banner and profile.
- TikTok and Instagram file-size values are the site's own targets, not confirmed platform rules.

**Things that changed outside the assistant's work** (owner edits, keep them): hub redesign (`/size-tools`, `hub.js`, `hub.css`), the YouTube Pack moved from the Social Maker tab to `/youtube-image-sizes`, the removal of the card icon and the "Choose your platform" line, and the 3-column home quick links.

---

## 9. Other assets outside the repo

- The faceless fashion channel **video script** (corrected 12-minute version, with description template and upload checklist) was created as a document in the owner's Claude account, not in this repo. Copy it somewhere safe.
- Reference article already published here: `/blog/faceless-quiet-luxury-fashion-channel-ai`.

---

## 10. Legal and policy reminders

- `/privacy` is a plain-language draft, **not legal advice**. It currently says: files stay in the browser, only the light/dark choice is stored, the host may log technical data, no analytics/ads/cookies. **Update it before adding ads, analytics or any tracking.**
- Use affiliate disclosures wherever affiliate links appear.
- Do not copy text from other sites. Write original explanations and cite sources in your own words.
- YouTube rules for the channel: label realistic AI content that could be mistaken for real; avoid mass-produced repetitive videos; check music and AI-tool licenses for commercial use.


## Standalone tools (public/*.html)
`note`, `plan` (Planner), `pdf-viewer`, `calculator` (Calculator + USD Rates), `snip-to-text`, `speak-english` are single HTML files served as-is. They are listed in `src/data/tool-list.js`. Dark is the default theme everywhere; the choice is stored under the `theme` key (Notepad keeps its own `notepad_theme`).

## Home page and design layer
`src/pages/index.astro` is the home page (hero words, big clock, Quick convert box, tools, sizes, converters, guides, FAQ). Shared styles: `src/styles/ui.css` (header, footer, cards) and `src/styles/home.css` (home only). Quick convert: `src/components/HeroConvert.astro` + `src/scripts/hero-convert.js`. Find & Replace: `src/components/tools/FindReplace.astro` + `src/scripts/tools/findreplace.js`.
