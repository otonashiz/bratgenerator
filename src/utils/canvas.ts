import type { RenderConfig } from '@/types/canvas';
import { CANVAS_SIZES } from '@/types/canvas';
import { BRAT_COLORS } from '@/constants/colors';

/**
 * Canvas utility functions for Brat Generator
 * Implements high-performance rendering with error handling
 */

export class CanvasError extends Error {
  constructor(message: string, public readonly context?: string) {
    super(message);
    this.name = 'CanvasError';
  }
}

/**
 * Creates and configures a canvas element with proper settings
 */
export function createCanvas(size: '1:1' | '4:5', scale: number = 1): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const canvasSize = CANVAS_SIZES[size];
  
  // Set actual size (scaled for high DPI)
  canvas.width = canvasSize.width * scale;
  canvas.height = canvasSize.height * scale;
  
  // Set display size
  canvas.style.width = `${canvasSize.width}px`;
  canvas.style.height = `${canvasSize.height}px`;
  
  return canvas;
}

/**
 * Gets canvas context with optimized settings
 */
export function getOptimizedContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d', {
    alpha: false, // No transparency needed for better performance
    desynchronized: true, // Allow async rendering
  });
  
  if (!ctx) {
    throw new CanvasError('Failed to get 2D context', 'context_creation');
  }
  
  // Optimize for text rendering
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  return ctx;
}

/**
 * Clears canvas with Brat green background
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = BRAT_COLORS.green;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Measures text dimensions with given font
 */
export function measureText(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  font: string
): TextMetrics {
  const originalFont = ctx.font;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  ctx.font = originalFont;
  return metrics;
}

/**
 * Calculates optimal font size to fit text within bounds
 */
export function calculateOptimalFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  fontFamily: string = 'Arial Narrow, Arial, sans-serif',
  minSize: number = 20,
  maxSize: number = 200
): number {
  let fontSize = maxSize;
  
  while (fontSize >= minSize) {
    const font = `bold ${fontSize}px ${fontFamily}`;
    const metrics = measureText(ctx, text, font);
    
    // Check if text fits within bounds
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.2; // Approximate height with line spacing
    
    if (textWidth <= maxWidth && textHeight <= maxHeight) {
      return fontSize;
    }
    
    fontSize -= 2; // Decrease by 2px each iteration
  }
  
  return minSize;
}

/**
 * Renders text with optimal sizing and positioning
 */
export function renderText(
  ctx: CanvasRenderingContext2D,
  config: RenderConfig
): void {
  const { text, size, hasScribble } = config;
  const canvasSize = CANVAS_SIZES[size];
  
  // Calculate text area (leave margin for scribble if enabled)
  const margin = hasScribble ? 40 : 20;
  const textWidth = canvasSize.width - (margin * 2);
  const textHeight = canvasSize.height - (margin * 2);
  
  // Calculate optimal font size
  const fontSize = calculateOptimalFontSize(
    ctx,
    text,
    textWidth,
    textHeight,
    'Arial Narrow, Arial, sans-serif'
  );
  
  // Apply font and color
  ctx.font = `bold ${fontSize}px Arial Narrow, Arial, sans-serif`;
  ctx.fillStyle = BRAT_COLORS.text;
  
  // Position text in center
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;
  
  // Handle multi-line text if needed
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > textWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Render each line
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = centerY - (totalHeight / 2) + (lineHeight / 2);
  
  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    ctx.fillText(line, centerX, y);
  });
}

/**
 * Exports canvas as blob with specified format and quality
 */
export function exportCanvasAsBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new CanvasError('Failed to export canvas as blob', 'export'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * Creates download link for canvas export
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  return exportCanvasAsBlob(canvas, format)
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
    });
}

/**
 * Validates render configuration
 */
export function validateRenderConfig(config: RenderConfig): void {
  if (!config.text || config.text.trim().length === 0) {
    throw new CanvasError('Text cannot be empty', 'validation');
  }
  
  if (!['1:1', '4:5'].includes(config.size)) {
    throw new CanvasError('Invalid canvas size', 'validation');
  }
  
  if (config.text.length > 100) {
    throw new CanvasError('Text too long (max 100 characters)', 'validation');
  }
} 