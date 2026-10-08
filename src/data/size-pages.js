import { SIZE_INDEX } from './platforms.js';
export const UPDATED = '2026-10-08';

// Visual guides drawn on the preview. Approximate UI zones: platforms change them, so labels say so.
export const GUIDES = {
  'youtube-thumbnail': { corner: [0.14, 0.1, 'Timestamp area (approx.)'] },
  'yt-banner': { safe: [1546, 423, 'Safe area for text and logos'] },
  'instagram-story': { bands: [0.14, 0.14, 'App buttons (approx.)'] },
  'tiktok-cover': { bands: [0.14, 0.2, 'App buttons (approx.)'] },
  'facebook-cover': { safe: [1280, 624, 'Safe area (approx.)'] },
  'linkedin-banner': { safe: [1200, 396, 'Mobile-safe width (approx.)'] },
  'linkedin-company-cover': { safe: [900, 191, 'Mobile-safe width (approx.)'] },
};

export const SIZE_PAGES = [
  {
    slug: 'youtube-thumbnail-size', platform: 'YouTube', variants: ['youtube-thumbnail'],
    title: 'YouTube Thumbnail Size 2026: 1280×720 Free Resizer', h1: 'YouTube Thumbnail Size: 1280×720',
    description: 'The correct YouTube thumbnail size is 1280×720 pixels (16:9), under 2 MB. Resize, crop and compress your image to fit, free and in your browser.',
    intro: 'YouTube recommends thumbnails at 1280×720 pixels in a 16:9 ratio, as a JPG or PNG under 2 MB. Upload any image below and Sharesizer crops it to size, then shrinks the file if it goes over the limit.',
    extra: [['Minimum width', '640 px'], ['Formats', 'JPG or PNG (GIF also accepted)']],
    tips: ['Keep faces and text away from the bottom-right corner, where the video length badge sits.', 'Check your thumbnail at about 170 px wide. Most views happen on phones at that size.', 'Use big, high-contrast text of 3–4 words at most. Small text disappears.'],
    mistakes: ['Uploading a 4:3 or square image, so YouTube crops or letterboxes it.', 'Exporting a PNG with lots of detail that goes over 2 MB.', 'Putting important text in the corner under the timestamp.'],
    faq: [['What is the best YouTube thumbnail size?', '1280×720 pixels at 16:9. Larger 16:9 images such as 1920×1080 also work, but the file must stay under 2 MB.'], ['Why is my thumbnail blurry?', 'Usually the source was small and got enlarged, or the file was compressed hard to fit under 2 MB. Start from an image at least 1280 pixels wide.'], ['Can I use a vertical image for Shorts?', 'Shorts use 9:16 video frames, so use the vertical size on our YouTube Pack instead. A 16:9 thumbnail will be cropped.']],
    related: ['youtube-banner-size', 'instagram-story-size'],
    links: [['/youtube-thumbnail-tester', 'YouTube Thumbnail Tester: compare and preview'], ['/youtube-image-sizes', 'All YouTube image sizes in one ZIP']],
  },
  {
    slug: 'youtube-banner-size', platform: 'YouTube', variants: ['yt-banner'],
    title: 'YouTube Banner Size 2026: 2560×1440 with Safe Area', h1: 'YouTube Channel Banner Size: 2560×1440',
    description: 'YouTube channel banners should be 2560×1440 pixels, with text kept inside the central 1546×423 safe area. Free resizer with a safe-area preview.',
    intro: 'Upload your channel banner at 2560×1440 pixels, 6 MB or less. YouTube shows a different slice on TV, desktop and mobile, so only the central safe area is guaranteed to be visible everywhere. The preview below shades everything outside it.',
    extra: [['Safe area', '1546 × 423 px, centered'], ['Formats', 'JPG or PNG']],
    tips: ['Place your channel name, logo and tagline inside the safe area, and use the outer area for background only.', 'On desktop, channel links can overlay the bottom right of the banner, so keep that corner clean.', 'Start from a large source, since TVs show the full 2560-pixel width.'],
    mistakes: ['Putting text near the edges, where it is cropped on phones.', 'Using a wide 16:9 photo with a face off-center, which gets cut out.', 'Uploading a banner over 6 MB.'],
    faq: [['What is the YouTube banner safe area?', 'The central 1546×423 pixel zone of a 2560×1440 banner, which shows on all devices. Some older guides quote a smaller 1235×338 area, so keep key items well inside to be safe.'], ['Why does my banner look cropped on mobile?', 'Phones show only the central strip. Anything outside the safe area may be hidden.'], ['What file size can a banner be?', 'Up to 6 MB. Sharesizer lowers JPEG quality automatically to stay under the limit.']],
    related: ['youtube-thumbnail-size', 'linkedin-banner-size'],
    links: [['/youtube-image-sizes', 'All YouTube image sizes in one ZIP']],
  },
  {
    slug: 'instagram-post-size', platform: 'Instagram', variants: ['instagram-square', 'instagram-portrait'],
    title: 'Instagram Post Size 2026: 1080×1080 and 1080×1350', h1: 'Instagram Post Size: 1080×1080 and 1080×1350',
    description: 'Instagram post sizes: 1080×1080 for square and 1080×1350 for portrait (4:5). Resize and crop any photo to fit, free and private in your browser.',
    intro: 'The two most useful Instagram feed sizes are 1080×1080 (square) and 1080×1350 (portrait, 4:5). Portrait takes up more screen space in the feed, so it often performs better for photos. Pick a size below, upload, and download.',
    extra: [['Formats', 'JPG or PNG'], ['Tip', 'Use JPG for photos, PNG for graphics with text']],
    tips: ['Choose portrait 4:5 when you want your post to take more room in the feed.', 'Leave a small margin around text so edge cropping never cuts it.', 'Export at 1080 px wide. Larger files are scaled down and gain nothing.'],
    mistakes: ['Uploading a landscape photo and letting Instagram crop it unpredictably.', 'Using tiny text that can\'t be read on a phone.', 'Re-saving the same JPG many times, which adds visible compression.'],
    faq: [['What size should an Instagram post be?', '1080×1080 for square or 1080×1350 for portrait. Both are 1080 pixels wide.'], ['Does Instagram lower image quality?', 'Instagram compresses uploads. Starting with a sharp 1080-pixel-wide image keeps results as clean as possible.'], ['Should I use cover or contain?', 'Cover fills the frame by cropping. Contain keeps the whole image and adds padding in a color you choose.']],
    related: ['instagram-story-size', 'facebook-cover-photo-size'],
  },
  {
    slug: 'instagram-story-size', platform: 'Instagram', variants: ['instagram-story'],
    title: 'Instagram Story Size 2026: 1080×1920 Resizer', h1: 'Instagram Story and Reel Size: 1080×1920',
    description: 'Instagram Stories and Reels use 1080×1920 pixels (9:16). Resize your image to fit and preview where app buttons cover the top and bottom.',
    intro: 'Stories and Reels are full-screen vertical, 1080×1920 pixels at 9:16. Instagram places buttons and your profile name over the top and bottom of the screen, so the preview below shades those zones.',
    extra: [['Formats', 'JPG or PNG'], ['Keep clear', 'Roughly 14% at the top and bottom']],
    tips: ['Keep text and logos out of the top and bottom bands shaded in the preview.', 'Use a large, simple background so your subject stays clear when stickers are added.', 'Design vertically from the start rather than cropping a landscape photo.'],
    mistakes: ['Placing a call to action at the very bottom, where the reply bar covers it.', 'Using a horizontal image with black bars.', 'Using tiny text that is unreadable on a phone.'],
    faq: [['What size is an Instagram Story?', '1080×1920 pixels, a 9:16 ratio.'], ['Is the Reel cover the same size?', 'Reels are also 9:16 at 1080×1920, but the profile grid may show a different crop, so check how your cover looks there.'], ['How much space should I leave at the top and bottom?', 'A common guideline is about 14% on each side. The shaded bands here are approximate and can change when Instagram updates its app.']],
    related: ['tiktok-image-size', 'instagram-post-size'],
  },
  {
    slug: 'tiktok-image-size', platform: 'TikTok', variants: ['tiktok-cover'],
    title: 'TikTok Image Size 2026: 1080×1920 Resizer', h1: 'TikTok Image and Cover Size: 1080×1920',
    description: 'TikTok photos and covers work best at 1080×1920 pixels (9:16). Resize and crop any image to fit, with a preview of areas covered by the app interface.',
    intro: '1080×1920 pixels in a 9:16 ratio is the standard full-screen size for TikTok photos and cover images. TikTok overlays buttons, captions and your username on the video, so keep key content away from the edges, especially at the bottom.',
    extra: [['Formats', 'JPG or PNG']],
    tips: ['Keep faces and text in the central part of the frame, away from the bottom caption area.', 'Use sharp, bright images, since phone screens reward contrast.', 'Leave extra room at the bottom for the caption and sound name.'],
    mistakes: ['Using landscape images, which fill only part of the screen.', 'Placing text where the like and share buttons sit on the right.', 'Over-compressing the file until it looks blocky.'],
    faq: [['What is the best size for TikTok photos?', '1080×1920 pixels at 9:16 is the commonly recommended size.'], ['Why is part of my image covered?', 'TikTok shows buttons, captions and the username over the image. The shaded areas in the preview are approximate, so test on your phone.'], ['Can I use the same image for Reels and Stories?', 'Yes, they share the same 9:16 size, but check each app\'s safe zones separately.']],
    related: ['instagram-story-size', 'youtube-thumbnail-size'],
  },
  {
    slug: 'facebook-cover-photo-size', platform: 'Facebook', variants: ['facebook-cover'],
    title: 'Facebook Cover Photo Size 2026: 1640×720 Resizer', h1: 'Facebook Cover Photo Size: 1640×720',
    description: 'Facebook covers display at 820×312 on desktop and 640×360 on mobile. Export at 1640×720 to look sharp on both, with a safe-area preview.',
    intro: 'Facebook shows cover photos at 820×312 pixels on desktop and 640×360 on mobile, and crops them differently on each. Exporting at 1640×720 (double the 820×360 compromise size) keeps the image sharp. Facebook doesn\'t publish one official upload size, so this follows what most current guides recommend.',
    extra: [['Desktop display', '820 × 312 px'], ['Mobile display', '640 × 360 px']],
    tips: ['Keep logos and text inside the area marked in the preview so both desktop and mobile show them.', 'Your profile picture overlaps part of the cover, so avoid important content in that corner.', 'Preview on a phone and a computer after uploading.'],
    mistakes: ['Designing only for desktop, so text gets cut on mobile.', 'Placing text near the top or bottom edge.', 'Using a low-resolution image that looks soft on large screens.'],
    faq: [['What is the best Facebook cover photo size?', 'Most guides suggest 820×360 pixels as a compromise for desktop and mobile. Exporting at 1640×720 gives double the detail.'], ['Why does my cover look different on mobile?', 'Facebook crops covers to a taller shape on phones than on desktop.'], ['Are page and profile covers the same size?', 'Most sources say they use the same dimensions. Check Facebook after uploading, since it can change.']],
    related: ['linkedin-banner-size', 'youtube-banner-size'],
  },
  {
    slug: 'linkedin-banner-size', platform: 'LinkedIn', variants: ['linkedin-banner', 'linkedin-company-cover'],
    title: 'LinkedIn Banner Size 2026: 1584×396 Profile and Company', h1: 'LinkedIn Banner Size: 1584×396 and 1128×191',
    description: 'LinkedIn personal banners are 1584×396 pixels and company page covers are 1128×191. Resize your image to either with a mobile-safe preview.',
    intro: 'Personal profile banners are 1584×396 pixels (4:1). Company page covers are a different shape, 1128×191 (about 6:1), so one image rarely works for both. Choose the right one below. Your profile photo covers the bottom-left of the banner on desktop.',
    extra: [['Personal banner', '1584 × 396 px, 4:1'], ['Company cover', '1128 × 191 px, about 6:1']],
    tips: ['Keep important content right of the profile photo, which covers the bottom-left on desktop.', 'One guide reports phones crop to the center of the banner, so keep text in the middle. Treat that as approximate.', 'Use a simple background, since the banner is wide and short.'],
    mistakes: ['Using the personal banner on a company page, so it looks squashed.', 'Placing text on the left, where the photo overlaps it.', 'Using busy photos that make text hard to read.'],
    faq: [['What size is a LinkedIn banner?', '1584×396 pixels for personal profiles and 1128×191 pixels for company pages.'], ['What is the file size limit?', 'Guides disagree. Many say up to 8 MB, though some list 3 MB for company pages. Sharesizer keeps company covers under 3 MB to be safe.'], ['Why is the company cover so short?', 'Company pages use a wider, shorter shape, so choose a design that still works when heavily cropped.']],
    related: ['facebook-cover-photo-size', 'youtube-banner-size'],
  },
];

// Resolve variants to concrete specs + guides at build time
export function resolveVariants(page) {
  return page.variants.map((key) => {
    const s = SIZE_INDEX[key];
    return { key, name: s.name, w: s.width || s.w, h: s.height || s.h, maxMB: s.maxMB, guide: GUIDES[key] || null };
  });
}
