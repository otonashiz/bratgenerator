// Font Configuration - MANDATORY FONTS
// These font specifications are required for brand accuracy

export const FONTS = {
  // CANVAS TEXT FONT (REQUIRED for image generation)
  canvas: 'Arial Narrow, Helvetica Neue Condensed, sans-serif',
  
  // UI INTERFACE FONT (REQUIRED for interface)
  interface: 'Inter, Helvetica, system-ui, sans-serif',
} as const;

// Text Configuration Constants
export const TEXT_CONFIG = {
  fontFamily: FONTS.canvas,
  color: '#000000',
  textAlign: 'center' as const,
  textBaseline: 'middle' as const,
  padding: 40, // Minimum padding from edges
  lineHeight: 1.2,
  maxLines: 4,
  minFontSize: 24,
  maxFontSize: 120,
} as const;

// Font Loading URLs
export const FONT_URLS = {
  arialNarrow: '/fonts/arial-narrow.woff2',
  inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
} as const; 