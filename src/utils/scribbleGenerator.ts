import { BRAT_COLORS } from '@/constants/colors';

/**
 * Scribble Effect Generator for Brat Generator
 * Implements multi-layer Bezier curves for authentic scribble appearance
 */

export interface ScribblePoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface ScribbleStroke {
  points: ScribblePoint[];
  thickness: number;
  opacity: number;
}

export interface ScribbleConfig {
  width: number;
  height: number;
  intensity: number; // 0-1, controls density of scribbles
  seed?: number; // For reproducible randomness
}

/**
 * Pseudo-random number generator with seed support
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

/**
 * Generates a single scribble stroke using Bezier curves
 */
function generateStroke(
  startX: number,
  startY: number,
  length: number,
  random: SeededRandom
): ScribbleStroke {
  const points: ScribblePoint[] = [];
  const numPoints = Math.floor(random.range(8, 16));
  
  // Generate control points for natural curves
  let currentX = startX;
  let currentY = startY;
  
  points.push({ x: currentX, y: currentY, pressure: random.range(0.3, 0.8) });
  
  for (let i = 1; i < numPoints; i++) {
    // Add some randomness to direction
    const angle = random.range(-Math.PI, Math.PI);
    const distance = length / numPoints * random.range(0.5, 1.5);
    
    currentX += Math.cos(angle) * distance;
    currentY += Math.sin(angle) * distance;
    
    points.push({
      x: currentX,
      y: currentY,
      pressure: random.range(0.2, 0.9)
    });
  }
  
  return {
    points,
    thickness: random.range(1.5, 3.5),
    opacity: random.range(0.3, 0.7)
  };
}

/**
 * Generates multiple scribble strokes for a natural appearance
 */
export function generateScribblePattern(config: ScribbleConfig): ScribbleStroke[] {
  const { width, height, intensity, seed = Date.now() } = config;
  const random = new SeededRandom(seed);
  
  const strokes: ScribbleStroke[] = [];
  const numStrokes = Math.floor(intensity * 15 + 5); // 5-20 strokes based on intensity
  
  for (let i = 0; i < numStrokes; i++) {
    // Random starting position with bias toward corners and edges
    const edgeBias = random.next() < 0.6; // 60% chance to start near edges
    
    let startX: number, startY: number;
    
    if (edgeBias) {
      // Start near edges
      const edge = Math.floor(random.range(0, 4));
      switch (edge) {
        case 0: // Top edge
          startX = random.range(0, width);
          startY = random.range(0, height * 0.3);
          break;
        case 1: // Right edge
          startX = random.range(width * 0.7, width);
          startY = random.range(0, height);
          break;
        case 2: // Bottom edge
          startX = random.range(0, width);
          startY = random.range(height * 0.7, height);
          break;
        default: // Left edge
          startX = random.range(0, width * 0.3);
          startY = random.range(0, height);
          break;
      }
    } else {
      // Random position anywhere
      startX = random.range(width * 0.1, width * 0.9);
      startY = random.range(height * 0.1, height * 0.9);
    }
    
    const strokeLength = random.range(Math.min(width, height) * 0.1, Math.min(width, height) * 0.4);
    const stroke = generateStroke(startX, startY, strokeLength, random);
    strokes.push(stroke);
  }
  
  return strokes;
}

/**
 * Renders scribble strokes to canvas context
 */
export function renderScribbleToCanvas(
  ctx: CanvasRenderingContext2D,
  strokes: ScribbleStroke[]
): void {
  // Save context state
  const originalCompositeOperation = ctx.globalCompositeOperation;
  const originalStrokeStyle = ctx.strokeStyle;
  const originalLineWidth = ctx.lineWidth;
  const originalLineCap = ctx.lineCap;
  const originalLineJoin = ctx.lineJoin;
  
  // Set scribble rendering properties
  ctx.strokeStyle = BRAT_COLORS.text;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'multiply'; // For natural layering
  
  strokes.forEach((stroke) => {
    if (stroke.points.length < 2) return;
    
    ctx.globalAlpha = stroke.opacity;
    ctx.lineWidth = stroke.thickness;
    
    ctx.beginPath();
    
    // Move to first point
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    // Draw smooth curves through points
    for (let i = 1; i < stroke.points.length - 1; i++) {
      const current = stroke.points[i];
      const next = stroke.points[i + 1];
      
      // Calculate control point for smooth curve
      const cpX = (current.x + next.x) / 2;
      const cpY = (current.y + next.y) / 2;
      
      ctx.quadraticCurveTo(current.x, current.y, cpX, cpY);
    }
    
    // Draw to last point
    const lastPoint = stroke.points[stroke.points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    
    ctx.stroke();
  });
  
  // Restore context state
  ctx.globalCompositeOperation = originalCompositeOperation;
  ctx.strokeStyle = originalStrokeStyle;
  ctx.lineWidth = originalLineWidth;
  ctx.lineCap = originalLineCap;
  ctx.lineJoin = originalLineJoin;
  ctx.globalAlpha = 1.0;
}

/**
 * Creates a cached scribble pattern for consistent rendering
 */
export function createScribbleCache(config: ScribbleConfig): ScribbleStroke[] {
  // Use text content as part of seed for consistency
  const strokes = generateScribblePattern(config);
  
  // Optional: Filter out strokes that are too small or too large
  return strokes.filter(stroke => {
    const length = calculateStrokeLength(stroke);
    return length > 20 && length < Math.min(config.width, config.height) * 0.6;
  });
}

/**
 * Calculates the approximate length of a stroke
 */
function calculateStrokeLength(stroke: ScribbleStroke): number {
  if (stroke.points.length < 2) return 0;
  
  let length = 0;
  for (let i = 1; i < stroke.points.length; i++) {
    const prev = stroke.points[i - 1];
    const curr = stroke.points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  
  return length;
}

/**
 * Animates scribble appearance (for future enhancement)
 */
export function animateScribble(
  ctx: CanvasRenderingContext2D,
  strokes: ScribbleStroke[],
  progress: number // 0-1
): void {
  const strokesToRender = Math.floor(strokes.length * progress);
  const partialStroke = strokes.length * progress - strokesToRender;
  
  // Render complete strokes
  renderScribbleToCanvas(ctx, strokes.slice(0, strokesToRender));
  
  // Render partial stroke if needed
  if (partialStroke > 0 && strokesToRender < strokes.length) {
    const stroke = strokes[strokesToRender];
    const pointsToRender = Math.floor(stroke.points.length * partialStroke);
    
    if (pointsToRender > 1) {
      const partialStrokeData: ScribbleStroke = {
        ...stroke,
        points: stroke.points.slice(0, pointsToRender)
      };
      renderScribbleToCanvas(ctx, [partialStrokeData]);
    }
  }
} 