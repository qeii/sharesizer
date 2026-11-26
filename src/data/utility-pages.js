// Landing pages that wrap an existing tool (Resizer, Cropper, Compressor, Aspect Ratio).
export const UPDATED = '2026-10-08';
const PRIVATE = { h: 'Is my image private?', p: ['Yes. Everything runs in your browser on your own device. Your image is not uploaded to any server, and there is no account, watermark or limit.'] };

export const UTILITIES = [
  {
    slug: 'resize-image', crumb: 'Image resizer',
    title: 'Resize Image Online Free: Exact Pixels, Private, No Upload', h1: 'Resize Image Online',
    description: 'Resize any image to exact pixel dimensions in your browser. Keep the proportions, choose JPEG, PNG or WebP, and download. Free, private, no upload.',
    intro: 'Enter the width and height you need, keep the proportions locked if you want, and download the result. Use it as a photo resizer for websites, forms, email and ads. Your image is processed on your device and never uploaded.',
    steps: ['Click the upload box and choose your image, or drop it there.', 'Type a new width or height in pixels. With the lock on, the other value follows so the image is not stretched.', 'Choose a format (JPEG, PNG or WebP) and, for JPEG and WebP, a quality.', 'Click Resize image, then download the result.'],
    sections: [
      { h: 'Resizing vs compressing', p: ['Resizing changes how many pixels the image has. Compressing keeps the pixels but makes the file smaller. If you need a smaller file, you can often do both: shrink the dimensions first, then compress.'] },
      { h: 'Will resizing hurt quality?', p: ['Making an image smaller usually keeps it looking sharp. Making it larger cannot add detail, so it will look softer. Start from the largest original you have.'] },
    ],
    faq: [['How do I resize an image without stretching it?', 'Keep "Lock aspect ratio" on and change only the width or the height. The other value updates automatically.'], ['Can I resize to an exact size for a form or an ad?', 'Yes. Turn the lock off, type the exact width and height, and resize. If the proportions differ from your original, the image will be stretched, so crop it first if you need to keep its shape.'], ['Which formats can I save as?', 'JPEG, PNG or WebP. Which files you can open depends on your browser, but current browsers handle all three.'], ['Is there a limit?', 'There is no account, watermark or daily limit. Very large photos depend on your device\'s memory.']],
    related: [['/compress-image', 'Compress an image'], ['/crop-image', 'Crop an image'], ['/aspect-ratio-calculator', 'Aspect ratio calculator'], ['/#size-tools', 'Social media image sizes']],
  },
  {
    slug: 'crop-image', crumb: 'Image cropper',
    title: 'Crop Image Online Free: Drag to Crop, Private, No Upload', h1: 'Crop Image Online',
    description: 'Crop any image in your browser by dragging a box over the part you want to keep. Free, private and no upload. Download as PNG, JPEG or WebP.',
    intro: 'Drag the box over the part of the picture you want to keep, adjust it with the corner handles, then download the cropped image. Your photo is never uploaded.',
    steps: ['Click the upload box and choose your image, or drop it there.', 'Drag the box to position it, and use the corner handles to change its size.', 'Choose a format (PNG, JPEG or WebP).', 'Click Crop & download.'],
    sections: [
      { h: 'Crop first, then resize', p: ['Crop before you resize or compress. Cropping removes pixels you do not need, so the part you keep stays at full detail.'] },
      { h: 'Need an exact shape?', p: ['This cropper is freeform. For a specific shape such as 1:1, 16:9, 4:5 or 9:16, use the Photo Editor on the <a href="/">home page</a>, which has ratio shapes. Or use a size guide, such as <a href="/youtube-thumbnail-size">YouTube thumbnails</a> or <a href="/instagram-post-size">Instagram posts</a>, which crop to the platform size for you.'] },
    ],
    faq: [['Does cropping reduce image quality?', 'No. The pixels inside the box are kept exactly as they were. Quality only drops if you save as JPEG or WebP at a low quality setting.'], ['How do I crop an image to a square?', 'Use the Photo Editor\'s 1:1 shape on the home page, or the Instagram post size guide, which crops to 1080×1080.'], ['Can I undo a crop?', 'Your original file is never changed. If you are not happy with the result, upload the original again and start over.']],
    related: [['/resize-image', 'Resize an image'], ['/compress-image', 'Compress an image'], ['/', 'Photo Editor with ratio shapes'], ['/#size-tools', 'Social media image sizes']],
  },
  {
    slug: 'compress-image', crumb: 'Image compressor',
    title: 'Compress Image Online: Reduce JPG and WebP File Size, Private', h1: 'Compress Image Online',
    description: 'Shrink image file size for faster pages, email and upload limits. Choose JPEG or WebP, set the quality and see how much you saved. Free, private, no upload.',
    intro: 'Make image files smaller for faster pages, email and upload limits. Choose a format, set the quality, and see exactly how much space you saved. Your image is compressed on your device and never uploaded.',
    steps: ['Click the upload box and choose your image, or drop it there.', 'Choose JPEG or WebP, which give the smallest files for photos.', 'Set the quality. Lower is smaller, with some loss of detail.', 'Click Compress image, check the percentage saved, and download.'],
    sections: [
      { h: 'Choose the right format', ul: ['<strong>JPEG:</strong> best for photos and works everywhere. Transparent areas turn white.', '<strong>WebP:</strong> often smaller than JPEG, but not accepted by every site or app.', '<strong>PNG:</strong> lossless, so re-saving as PNG often will not shrink the file and can make it larger. The tool tells you when the result is larger.'] },
      { h: 'How to get smaller files', ul: ['Lower the quality a little. Around 0.7 to 0.85 is often fine for photos on the web.', 'If the image is much bigger than you need, <a href="/resize-image">resize it</a> first.', 'Compare the result with your original, and keep the original.'] },
    ],
    faq: [['How much smaller will my image get?', 'It depends on the image and the settings. The tool shows the exact percentage saved after each compression.'], ['Will compression make the image look worse?', 'At lower quality settings you may see some softness or blockiness. Check the preview before downloading.'], ['Why did my file get bigger?', 'Usually the image was already well compressed, or you saved it as PNG. Try JPEG or WebP at a lower quality.']],
    related: [['/resize-image', 'Resize an image'], ['/jpg-to-webp', 'Convert JPG to WebP'], ['/png-to-jpg', 'Convert PNG to JPG'], ['/youtube-thumbnail-size', 'YouTube thumbnail size (under 2 MB)']],
  },
  {
    slug: 'aspect-ratio-calculator', crumb: 'Aspect ratio calculator',
    title: 'Aspect Ratio Calculator: Find a Ratio and Resize Dimensions', h1: 'Aspect Ratio Calculator',
    description: 'Find the aspect ratio of any width and height, see the closest common ratio, and calculate matching dimensions. Free and runs in your browser.',
    intro: 'Enter the width and height of an image or video to find its aspect ratio, then work out the matching height or width for any new size. It also shows the decimal ratio, the closest common ratio and the megapixels.',
    steps: ['Enter the original width and height to see the ratio.', 'To resize while keeping the shape, enter a new width and click "Calculate height from width".', 'Or enter a new height and click "Calculate width from height".'],
    sections: [
      { h: 'Common aspect ratios', table: { head: ['Ratio', 'Typically used for'], rows: [['16:9', 'YouTube videos and thumbnails, most monitors'], ['4:3', 'Older screens, many compact cameras'], ['3:2', 'DSLR photos and prints'], ['1:1', 'Square posts and profile pictures'], ['4:5', 'Instagram portrait posts'], ['9:16', 'Stories, Reels, Shorts and TikTok'], ['2:3', 'Pinterest pins and portrait photos'], ['1.91:1', 'Link preview images, about 1200×630']] } },
      { h: 'Worked examples', ul: ['1920×1080 is 16:9. Scaled to 1280 wide, the height is 720.', '4000×3000 is 4:3. Scaled to 1600 wide, the height is 1200.', '1080×1350 is 4:5, the Instagram portrait shape.'] },
      { h: 'How to calculate an aspect ratio by hand', p: ['Divide the width and the height by their greatest common divisor. For 1920×1080 that divisor is 120, which gives 16:9. To find a new height, multiply the new width by the original height and divide by the original width.'] },
    ],
    faq: [['What is the difference between aspect ratio and resolution?', 'Resolution is the number of pixels, like 1920×1080. Aspect ratio is the shape, like 16:9. Many different resolutions share one ratio.'], ['What if my image does not match the ratio I need?', 'You can crop it to the new shape or add padding. The <a href="/#size-tools">size guides</a> do this for each platform.'], ['Does changing the size change the ratio?', 'Not if you scale the width and height by the same factor. That is what this calculator does.']],
    related: [['/resize-image', 'Resize an image'], ['/crop-image', 'Crop an image'], ['/youtube-thumbnail-size', 'YouTube thumbnail size (16:9)'], ['/instagram-story-size', 'Instagram Story size (9:16)']],
  },
  {
    slug: 'find-replace', crumb: 'Find and replace',
    title: 'Find and Replace Text Online: Ctrl+H, Remove Spaces, Add Text | Sharesizer', h1: 'Find and Replace Text Online',
    description: 'Find and replace words in any text like Ctrl+H in Notepad. Match case, whole word and regex, remove spaces, and add text to the front or back of every line. Free and private.',
    intro: 'Paste your text, then find and replace words the way Ctrl+H works in Notepad. You can also remove spaces and add a word to the front or back of every line. Your text stays in your browser and is never uploaded.',
    steps: ['Paste or type your text in the box.', 'To replace a word, type it in Find what and its new version in Replace with. Press Find next, Replace or Replace all.', 'To tidy spaces, press Remove all spaces, Collapse extra spaces, Trim line edges or Remove blank lines.', 'To add a word at the start or end, fill in Add in front and Add at the end, choose every line, every word or whole text, then press Add.', 'Press Undo if you do not like a change, then Copy your text.'],
    sections: [
      { h: 'Match case, whole word and regular expressions', p: ['Match case treats Apple and apple as different words. Whole word skips matches inside longer words, so cat will not change category. Regular expressions let you search patterns, such as digits or a repeated word.'] },
      { h: 'Useful regular expressions', ul: ['<code>\\d+</code> finds any number.', '<code>\\s{2,}</code> finds two or more spaces in a row.', '<code>(\\w+) (\\w+)</code> with <code>$2 $1</code> swaps two words.', '<code>^</code> matches the start of every line and <code>$</code> the end, so replacing <code>^</code> with <code>- </code> puts a dash in front of each line.'] },
      { h: 'Remove spaces and clean up text', p: ['Remove all spaces deletes every space and tab but keeps your line breaks. Collapse extra spaces turns runs of spaces into one. Trim line edges removes spaces at the start and end of each line. Remove blank lines deletes empty lines.'] },
      { h: 'Add a word in front or back', p: ['Choose every line to put text before and after each line, such as quotes or a bullet. Choose every word to wrap each word. Choose whole text to add something once at the very start or end.'] },
    ],
    faq: [['Is this the same as Ctrl+H in Notepad?', 'It works the same way. Type what to find, type what to put instead, and choose Replace or Replace all. It adds an Undo button and a live match count.'], ['Is my text uploaded anywhere?', 'No. Everything runs in your browser on your own device, so your text is never sent to a server.'], ['How do I replace a line break?', 'Turn on Use regular expression, type <code>\\n</code> in Find what, and type a space or any other text in Replace with. In regular expression mode, <code>\\n</code> and <code>\\t</code> in Replace with mean a new line and a tab.'], ['Can I undo Replace all?', 'Yes. Press Undo to go back one step. Up to 50 steps are kept while the page is open.'], ['What does Whole word do?', 'It only matches the word on its own, not inside a longer word. With it on, finding <code>art</code> will not match <code>party</code>.']],
    related: [['/note', 'Notepad'], ['/snip-to-text', 'Snip to Text'], ['/calculator', 'Calculator + USD rates'], ['/resize-image', 'Resize an image']],
  },
];
export { PRIVATE };
export const utilityCards = UTILITIES.map((u) => ({ href: `/${u.slug}`, name: u.h1.replace(' Online', ''), sizes: ['Free tool'], does: 'Private, no upload' }));
