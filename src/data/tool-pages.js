// Landing pages for single-purpose tools. Add an entry + a tiny file in src/pages to publish a new one.
export const UPDATED = '2026-10-08';
const MIME = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' };
const NAME = { png: 'PNG', jpg: 'JPG', webp: 'WebP' };
const PRIVACY = 'Yes. The conversion runs in your browser on your own device, so your image is never uploaded. The new file also does not carry over the original\'s embedded metadata, such as camera details or location.';

export const CONVERTERS = [
  {
    slug: 'jpg-to-png', from: 'jpg', to: 'png',
    title: 'JPG to PNG Converter: Free, Private, No Upload', h1: 'JPG to PNG Converter',
    description: 'Convert JPG to PNG free in your browser. No upload, no signup. Learn what changes, when PNG is the right choice, and why the file gets bigger.',
    intro: 'Choose a JPG and download it as a PNG in seconds. The conversion happens on your own device, so your image is never uploaded.',
    changes: ['PNG is lossless, so saving as PNG will not damage the image any further. It cannot bring back detail that JPG compression already removed.', 'The file usually gets much larger, because PNG stores photos without lossy compression.', 'JPG has no transparency, so the PNG will not have a transparent background. Removing a background needs an editor.'],
    tips: ['Choose PNG for screenshots, graphics, text and logos that you will edit again.', 'For photos you only need to share, keep JPG. It is far smaller.', 'If a website asks for PNG, check its file-size limit after converting.'],
    faq: [['Does converting JPG to PNG improve quality?', 'No. PNG avoids further quality loss, but it cannot restore detail that was already lost when the JPG was made.'], ['Why is my PNG bigger than the JPG?', 'JPG uses lossy compression to shrink photos. PNG keeps every pixel exactly, which takes much more space.'], ['Is it safe to convert private photos?', PRIVACY]],
    related: ['png-to-jpg', 'jpg-to-webp'],
  },
  {
    slug: 'png-to-jpg', from: 'png', to: 'jpg',
    title: 'PNG to JPG Converter: Free, Private, No Upload', h1: 'PNG to JPG Converter',
    description: 'Convert PNG to JPG free in your browser to make files much smaller. Choose the quality, see the result size, and keep your image private.',
    intro: 'Turn a PNG into a smaller JPG. Pick the quality you want, check the new file size, and download. Nothing is uploaded.',
    changes: ['JPG files are usually much smaller than PNG, especially for photos.', 'JPG cannot be transparent, so transparent areas become white.', 'JPG uses lossy compression, so lower quality settings can show blur or artifacts around sharp text and logo edges.'],
    tips: ['Use JPG for photos and PNG for logos, screenshots and text.', 'A quality of about 0.85 to 0.92 is a good balance for photos.', 'Keep your original PNG, since converting back will not restore lost quality.'],
    faq: [['What happens to transparent areas?', 'They are filled with white, because JPG has no transparency.'], ['What quality should I choose?', 'For photos, roughly 0.85 to 0.92 keeps them looking clean at a much smaller size. Lower values shrink the file further but can show artifacts.'], ['Will I lose quality?', 'Yes, a little, because JPG is lossy. Keep the original PNG if you may need it later.']],
    related: ['jpg-to-png', 'png-to-webp'],
  },
  {
    slug: 'webp-to-jpg', from: 'webp', to: 'jpg',
    title: 'WebP to JPG Converter: Free, Private, No Upload', h1: 'WebP to JPG Converter',
    description: 'Convert WebP to JPG free in your browser for maximum compatibility. No upload, no signup, with a quality slider and file size shown.',
    intro: 'WebP is common on the web, but not every app, email client or upload form accepts it. Convert it to JPG for the widest compatibility. Your file stays on your device.',
    changes: ['JPG opens almost everywhere, including older software and most upload forms.', 'Transparent areas in a WebP become white, because JPG has no transparency.', 'Only a still image is saved. Animated WebP files will not keep their animation.'],
    tips: ['If an upload form rejects your image, converting to JPG or PNG usually fixes it.', 'Use a quality of about 0.9 for photos.', 'Need a transparent result? Convert to PNG instead.'],
    faq: [['Why did I download a WebP file?', 'Many websites serve WebP because it loads faster, so browsers often save images in that format.'], ['Is WebP better than JPG?', 'WebP files are often smaller at similar quality, but JPG works in more places.'], ['Will the converted JPG look the same?', 'It should look very close at a high quality setting, though JPG is lossy so tiny differences are possible.']],
    related: ['webp-to-png', 'jpg-to-webp'],
  },
  {
    slug: 'jpg-to-webp', from: 'jpg', to: 'webp',
    title: 'JPG to WebP Converter: Free, Private, No Upload', h1: 'JPG to WebP Converter',
    description: 'Convert JPG to WebP free in your browser to shrink images for websites. See the new file size, choose the quality, and keep your image private.',
    intro: 'WebP files are often smaller than JPG at similar visual quality, which helps web pages load faster. Convert here and compare the sizes. Your image is never uploaded.',
    changes: ['The file is often noticeably smaller, though results vary by image. Compare the size shown after converting.', 'WebP works in all current major browsers, but some older software and print services cannot open it.', 'If your browser cannot create WebP files, this tool tells you instead of giving you the wrong format.'],
    tips: ['Use WebP for images on your own website, and keep your original JPG.', 'Check that the place you upload to accepts WebP. YouTube thumbnails, for example, use JPG or PNG.', 'A quality of about 0.8 to 0.9 is a good starting point.'],
    faq: [['How much smaller will the WebP be?', 'It depends on the image. Often it is noticeably smaller than the JPG, but the result size is shown so you can compare.'], ['Will every site accept WebP?', 'No. Many accept it, but some forms only take JPG or PNG. Check before you upload.'], ['Can I convert it back later?', 'Yes, but each conversion between lossy formats can lose a little quality, so keep your original.']],
    related: ['webp-to-jpg', 'png-to-webp'],
  },
  {
    slug: 'png-to-webp', from: 'png', to: 'webp',
    title: 'PNG to WebP Converter: Free, Private, No Upload', h1: 'PNG to WebP Converter',
    description: 'Convert PNG to WebP free in your browser. Keep transparency and cut file size for faster websites, with nothing uploaded.',
    intro: 'WebP can keep a PNG\'s transparency at a much smaller file size, which makes it popular for websites. Convert here and compare. Your image never leaves your device.',
    changes: ['Transparency is kept, unlike JPG.', 'Files are often much smaller than PNG, especially for photos.', 'Browser-made WebP is still compressed, even at the highest quality, so it is not a perfect copy of the PNG.'],
    tips: ['Use a quality of 1.0 or close to it for logos and graphics.', 'Keep the original PNG as your master copy.', 'Check that the site you upload to accepts WebP.'],
    faq: [['Will transparency stay?', 'Yes. WebP supports transparent backgrounds.'], ['Is the conversion lossless?', 'Not guaranteed. This tool uses your browser\'s WebP encoder, which compresses the image even at high quality.'], ['When should I use WebP instead of PNG?', 'For images on websites where file size matters. For editing or archiving, PNG is safer.']],
    related: ['webp-to-png', 'png-to-jpg'],
  },
  {
    slug: 'webp-to-png', from: 'webp', to: 'png',
    title: 'WebP to PNG Converter: Free, Private, No Upload', h1: 'WebP to PNG Converter',
    description: 'Convert WebP to PNG free in your browser and keep transparency. Works with apps that do not support WebP, with nothing uploaded.',
    intro: 'Need a WebP in a format your editing app understands? Convert it to PNG and keep any transparency. The conversion runs on your device.',
    changes: ['PNG is accepted by nearly every editor and upload form.', 'Transparency is kept.', 'The PNG will be larger, and it cannot restore detail already lost in the WebP. Animated WebP files save as a single still image.'],
    tips: ['Choose PNG when you need to edit the image or keep a transparent background.', 'Choose JPG instead if you only need a small photo to share.', 'Keep the original WebP if you still need it for a website.'],
    faq: [['Does WebP to PNG keep the transparent background?', 'Yes, PNG supports transparency.'], ['Why is the PNG so much bigger?', 'PNG stores every pixel without lossy compression, while WebP is usually much more compact.'], ['Will an animated WebP stay animated?', 'No. Only a single still image is saved.']],
    related: ['webp-to-jpg', 'png-to-webp'],
  },
].map((c) => ({ ...c, fromLabel: NAME[c.from], toLabel: NAME[c.to], fromMime: MIME[c.from], toMime: MIME[c.to] }));

export const converterCards = CONVERTERS.map((c) => ({ href: `/${c.slug}`, name: `${c.fromLabel} to ${c.toLabel}`, sizes: ['Convert format'], does: 'Free, private, no upload' }));
