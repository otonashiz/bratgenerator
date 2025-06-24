// Brat Brand Colors - EXACT VALUES REQUIRED
// These colors CANNOT be modified - they are brand requirements

export const BRAT_COLORS = {
  // PRIMARY COLORS - DO NOT MODIFY
  green: '#BEFF34',    // Main background - EXACT match required
  text: '#000000',     // Text color - Pure black only
  accent: '#000000',   // UI elements - Pure black only
} as const;

// CSS Custom Properties for Tailwind
export const CSS_VARIABLES = {
  '--brat-green': '#BEFF34',
  '--brat-text': '#000000', 
  '--brat-accent': '#000000',
} as const;

// Type for color values
export type BratColor = typeof BRAT_COLORS[keyof typeof BRAT_COLORS]; 