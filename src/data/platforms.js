// Single source of truth for image-size presets. Re-check specs periodically.
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const SOCIAL_SPECS = [
  { id: "instagram-square", name: "Instagram Square", width: 1080, height: 1080, maxMB: 8, types: IMAGE_TYPES },
  { id: "instagram-portrait", name: "Instagram Portrait", width: 1080, height: 1350, maxMB: 8, types: IMAGE_TYPES },
  { id: "instagram-story", name: "Instagram Story / Reel", width: 1080, height: 1920, maxMB: 8, types: IMAGE_TYPES },
  { id: "facebook-feed", name: "Facebook Feed", width: 1200, height: 630, maxMB: 8, types: IMAGE_TYPES },
  { id: "facebook-cover", name: "Facebook Cover Photo", width: 1640, height: 720, maxMB: 8, types: IMAGE_TYPES },
  { id: "linkedin-feed", name: "LinkedIn Feed", width: 1200, height: 627, maxMB: 8, types: IMAGE_TYPES },
  { id: "linkedin-banner", name: "LinkedIn Profile Banner", width: 1584, height: 396, maxMB: 8, types: IMAGE_TYPES },
  { id: "linkedin-company-cover", name: "LinkedIn Company Cover", width: 1128, height: 191, maxMB: 3, types: IMAGE_TYPES },
  { id: "x-post", name: "X / Twitter Post", width: 1600, height: 900, maxMB: 5, types: IMAGE_TYPES },
  { id: "youtube-thumbnail", name: "YouTube Thumbnail", width: 1280, height: 720, maxMB: 2, types: ["image/jpeg", "image/png"] },
  { id: "pinterest-pin", name: "Pinterest Pin", width: 1000, height: 1500, maxMB: 8, types: IMAGE_TYPES },
  { id: "tiktok-cover", name: "TikTok Cover", width: 1080, height: 1920, maxMB: 8, types: IMAGE_TYPES }
];


// YouTube Pack sizes (used by the YouTube Pack tool and, later, YouTube pages)
export const YOUTUBE_SIZES = [
  { id: "thumbnail", name: "Thumbnail", w: 1280, h: 720, max: 2, note: "16:9 · under 2 MB" },
  { id: "banner", name: "Channel banner", w: 2560, h: 1440, max: 6, note: "Keep text in the 1546×423 safe area", overlay: "banner" },
  { id: "profile", name: "Profile picture", w: 800, h: 800, max: 4, note: "Shown as a circle", overlay: "circle" },
  { id: "shorts", name: "Shorts / vertical", w: 1080, h: 1920, max: 0, note: "9:16" },
  { id: "video", name: "Full HD frame", w: 1920, h: 1080, max: 0, note: "16:9 video or end screen" },
  { id: "community", name: "Community post", w: 1080, h: 1080, max: 0, note: "Square" },
  { id: "watermark", name: "Video watermark", w: 150, h: 150, max: 1, note: "Simple logo, under 1 MB" },
];

// Lookup used by the size pages: SOCIAL_SPECS by id, YouTube Pack sizes as "yt-<id>"
export const SIZE_INDEX = {
  ...Object.fromEntries(SOCIAL_SPECS.map((s) => [s.id, s])),
  ...Object.fromEntries(YOUTUBE_SIZES.map((s) => [`yt-${s.id}`, { ...s, maxMB: s.max || 8 }])),
};

// "16:9" for clean ratios, "2.28:1" when the reduced ratio would be awkward (e.g. 41:18)
export function ratioLabel(w, h) {
  const g = (a, b) => (b ? g(b, a % b) : a), d = g(w, h), rw = w / d, rh = h / d;
  return rw <= 21 && rh <= 21 ? `${rw}:${rh}` : `${(w / h).toFixed(2).replace(/\.?0+$/, '')}:1`;
}
