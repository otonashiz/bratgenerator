// Canvas Types - MANDATORY INTERFACES
// These interfaces must be implemented exactly as specified

export interface RenderConfig {
  text: string;
  hasScribble: boolean;
  size: '1:1' | '4:5';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export interface CanvasSize {
  width: number;
  height: number;
  label: string;
}

export interface TextBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProcessedText {
  lines: string[];
  fontSize: number;
  layout: TextLayout;
}

export interface TextLayout {
  x: number;
  y: number;
  lineHeight: number;
  totalHeight: number;
}

// Canvas Renderer Interface - MUST IMPLEMENT ALL METHODS
export interface BratCanvasRenderer {
  // REQUIRED: Main rendering pipeline
  render(config: RenderConfig): void;
  
  // REQUIRED: Background rendering
  drawBackground(color: string): void;
  
  // REQUIRED: Text rendering with proper font handling
  drawText(config: RenderConfig): void;
  
  // REQUIRED: Scribble effect implementation
  drawScribbleEffect(config: RenderConfig): void;
  
  // REQUIRED: Canvas size management
  setCanvasSize(size: '1:1' | '4:5'): void;
  
  // REQUIRED: High-resolution export
  exportImage(format: 'png', scale?: number): Promise<Blob>;
  
  // REQUIRED: Memory management
  destroy(): void;
}

// Canvas Dimensions - EXACT VALUES REQUIRED
export const CANVAS_SIZES: Record<'1:1' | '4:5', CanvasSize> = {
  '1:1': {
    width: 600,
    height: 600,
    label: 'Post (1:1)'
  },
  '4:5': {
    width: 600,
    height: 750,
    label: 'Feed (4:5)'
  }
} as const;

export const EXPORT_SCALE = 2; // Always 2x for high quality 