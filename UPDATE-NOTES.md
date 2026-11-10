# Tool pages + 3 new size pages

Copy the files in this zip into your project folder, keeping the same paths, then run `npm run dev`. No new packages.

NEW files: src/data/utility-pages.js, src/styles/utility.css, src/layouts/UtilityPage.astro,
           src/pages/resize-image.astro, crop-image.astro, compress-image.astro, aspect-ratio-calculator.astro
CHANGED (unedited by you, safe to replace): src/data/platforms.js (4 new presets), src/data/size-pages.js (3 new size pages)

## New pages
/resize-image  /crop-image  /compress-image  /aspect-ratio-calculator
/x-twitter-image-size  /pinterest-pin-size  /facebook-post-size

## Add them to the /size-tools menu (src/data/hub.js, your file, so edit by hand)
1. Under the existing imports at the top, add:
     import { converterCards } from './tool-pages.js';      // skip if you already added it
     import { utilityCards } from './utility-pages.js';

2. In the 'Facebook' group, replace the cards list with:
     cards: [
       fromPage('facebook-cover-photo-size', 'Cover Photo', 'Resize for desktop and mobile'),
       fromPage('facebook-post-size', 'Post Image', 'Resize for the feed'),
     ] },

3. Just before the final `];` of PLATFORMS, add these groups (skip the converter one if you already added it):
     { name: 'X (Twitter)', icon: 'X', cards: [fromPage('x-twitter-image-size', 'X Post and Header', 'Resize for posts and the header')] },
     { name: 'Pinterest', icon: 'P', cards: [fromPage('pinterest-pin-size', 'Pinterest Pin', 'Resize to the standard pin')] },
     { name: 'Image Tools', icon: '▣', cards: utilityCards },
     { name: 'Image Converter', icon: '⇄', cards: converterCards },

4. Optional tidy-up: in the regex inside fromPage, change (Instagram|LinkedIn|Facebook|YouTube) to
   (Instagram|LinkedIn|Facebook|YouTube|Pinterest) so the Pinterest card shows "Pin" and "Square Pin".

## Publish
git add .
git commit -m "Add tool pages and X, Pinterest, Facebook post size pages"
git push
