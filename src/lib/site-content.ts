export const DEFAULT_HERO_IMAGE = '/lovable-uploads/cover.JPG.jpeg';

export const DEFAULT_HERO_IMAGE_ALT = 'HARV DREAMS campaign';

export const DEFAULT_ABOUT_EYEBROW = 'Our story';

export const DEFAULT_ABOUT_TITLE = 'About HARV DREAMS';

export const DEFAULT_ABOUT_PARAGRAPHS = [
  'HARV DREAMS is a brand built for dreamers who refuse to quit.',
  'We create bold, purpose-driven pieces that represent courage, resilience, and the pursuit of dreams that others call impossible.',
  'Every collection is a reminder to keep pushing, keep believing, and keep living your vision!',
];

export function formatAboutBody(paragraphs: string[]) {
  return paragraphs.join('\n\n');
}

export function parseAboutBody(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
