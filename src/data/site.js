// Site-wide settings. Fill in CONTACT_EMAIL before you publish (the Contact page needs it).
export const SITE_NAME = 'Sharesizer';
export const CONTACT_EMAIL = 'hello@sharesizer.com'; // e.g. 'hello@yourdomain.com'

// Your own promo (KitPaper planners). Edit the copy here; it is used by the home-page card and the footer link.
// Spots: 1) card on the home page under the tool grid, 2) text link in the footer of every page,
//        3) small text link inside the Notepad and Planner tools (public/note.html, public/plan.html).
export const PROMO = {
  name: 'KitPaper',
  url: 'https://kitpaper.com',
  eyebrow: 'From the maker of Sharesizer',
  title: 'Love the planner? Get it on real paper.',
  text: 'KitPaper sells printable planner kits for focused days, weeks and months.',
  cta: 'Visit KitPaper',
  footer: 'Planner kits at KitPaper',
};
export const promoUrl = (placement) => `${PROMO.url}/?utm_source=sharesizer&utm_medium=promo&utm_campaign=${placement}`;
