import { converterCards } from './tool-pages.js';
import { utilityCards } from './utility-pages.js';
import { SIZE_PAGES, resolveVariants } from './size-pages.js';
import { ratioLabel } from './platforms.js';
// Menu of tools: WHAT -> SIZE -> WHAT IT DOES -> ACTION. Sizes are read from the size data so they never drift.
const fromPage = (slug, name, does) => {
  const v = resolveVariants(SIZE_PAGES.find((p) => p.slug === slug));
  const sizes = v.map((x) => {
    return v.length > 1 ? `${x.w} × ${x.h} · ${x.name.replace(/^(Instagram|LinkedIn|Facebook|YouTube|Pinterest)\s+/, '')}` : `${x.w} × ${x.h} · ${ratioLabel(x.w, x.h)}`;
  });
  return { href: `/${slug}`, name, sizes, does };
};
export const PLATFORMS = [
  { name: 'YouTube', icon: 'youtube', cards: [
    fromPage('youtube-thumbnail-size', 'YouTube Thumbnail', 'Resize, crop and compress'),
    fromPage('youtube-banner-size', 'Channel Banner', 'Resize with a safe-area preview'),
  ] },
  { name: 'Instagram', icon: 'instagram', cards: [
    fromPage('instagram-post-size', 'Instagram Post', 'Resize and crop for the feed'),
    fromPage('instagram-story-size', 'Story / Reel', 'Resize with app-button guides'),
  ] },
  { name: 'TikTok', icon: 'tiktok', cards: [fromPage('tiktok-image-size', 'TikTok Image', 'Resize and preview')] },
  { name: 'Facebook', icon: 'facebook', 
     cards: [
       fromPage('facebook-cover-photo-size', 'Cover Photo', 'Resize for desktop and mobile'),
       fromPage('facebook-post-size', 'Post Image', 'Resize for the feed'),
     ] },
  { name: 'LinkedIn', icon: 'linkedin', cards: [fromPage('linkedin-banner-size', 'LinkedIn Banner', 'Resize for profile or company page')] },
     { name: 'X (Twitter)', icon: 'x', cards: [fromPage('x-twitter-image-size', 'X Post and Header', 'Resize for posts and the header')] },
     { name: 'Pinterest', icon: 'pinterest', cards: [fromPage('pinterest-pin-size', 'Pinterest Pin', 'Resize to the standard pin')] },
     { name: 'Image Converter', icon: 'converter', cards: converterCards },
];
