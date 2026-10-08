import { converterCards } from './tool-pages.js';
import { SIZE_PAGES, resolveVariants } from './size-pages.js';
import { ratioLabel } from './platforms.js';
// Menu of tools: WHAT -> SIZE -> WHAT IT DOES -> ACTION. Sizes are read from the size data so they never drift.
const fromPage = (slug, name, does) => {
  const v = resolveVariants(SIZE_PAGES.find((p) => p.slug === slug));
  const sizes = v.map((x) => {
    return v.length > 1 ? `${x.w} × ${x.h} · ${x.name.replace(/^(Instagram|LinkedIn|Facebook|YouTube)\s+/, '')}` : `${x.w} × ${x.h} · ${ratioLabel(x.w, x.h)}`;
  });
  return { href: `/${slug}`, name, sizes, does };
};
export const PLATFORMS = [
  { name: 'YouTube', icon: '▶', cards: [
    fromPage('youtube-thumbnail-size', 'YouTube Thumbnail', 'Resize, crop and compress'),
    fromPage('youtube-banner-size', 'Channel Banner', 'Resize with a safe-area preview'),
    { href: '/youtube-image-sizes', name: 'All YouTube Sizes', sizes: ['7 sizes in one ZIP'], does: 'Upload once, download every size' },
    { href: '/youtube-thumbnail-tester', name: 'Thumbnail Tester', sizes: ['Compare up to 4'], does: 'Preview in a feed and check contrast' },
  ] },
  { name: 'Instagram', icon: '◎', cards: [
    fromPage('instagram-post-size', 'Instagram Post', 'Resize and crop for the feed'),
    fromPage('instagram-story-size', 'Story / Reel', 'Resize with app-button guides'),
  ] },
  { name: 'TikTok', icon: '♪', cards: [fromPage('tiktok-image-size', 'TikTok Image', 'Resize and preview')] },
  { name: 'Facebook', icon: 'f', cards: [fromPage('facebook-cover-photo-size', 'Cover Photo', 'Resize for desktop and mobile')] },
  { name: 'LinkedIn', icon: 'in', cards: [fromPage('linkedin-banner-size', 'LinkedIn Banner', 'Resize for profile or company page')] },
  { name: 'Image Converter', icon: '⇄', cards: converterCards },
];
