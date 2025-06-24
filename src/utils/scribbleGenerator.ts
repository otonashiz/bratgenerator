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
  textBounds?: { x: number; y: number; width: number; height: number; }; // Precise text location
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
 * Currently unused but kept for potential future texture effects
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * Generates a crossing stroke from start to end point with natural variation
 */
function generateCrossingStroke(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  random: SeededRandom
): ScribbleStroke {
  const points: ScribblePoint[] = [];
  const numPoints = Math.floor(random.range(6, 12));
  
  // Calculate the main direction vector
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  
  for (let i = 0; i < numPoints; i++) {
    const progress = i / (numPoints - 1);
    
    // Base position along the line
    const baseX = startX + deltaX * progress;
    const baseY = startY + deltaY * progress;
    
    // Add natural variation perpendicular to the line
    const perpX = -deltaY;
    const perpY = deltaX;
    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
    
    if (perpLength > 0) {
      const normalizedPerpX = perpX / perpLength;
      const normalizedPerpY = perpY / perpLength;
      
      // Add random offset perpendicular to the line
      const offset = random.range(-8, 8);
      const finalX = baseX + normalizedPerpX * offset;
      const finalY = baseY + normalizedPerpY * offset;
      
      points.push({
        x: finalX,
        y: finalY,
        pressure: random.range(0.4, 0.8)
      });
    } else {
      points.push({
        x: baseX,
        y: baseY,
        pressure: random.range(0.4, 0.8)
      });
    }
  }
  
  return {
    points,
    thickness: random.range(2, 4),
    opacity: random.range(0.4, 0.8)
  };
}

/**
 * Generates crossing-out style scribble strokes over text area
 */
export function generateScribblePattern(config: ScribbleConfig): ScribbleStroke[] {
  const { width, height, intensity, seed = Date.now(), textBounds } = config;
  const random = new SeededRandom(seed);
  
  const strokes: ScribbleStroke[] = [];
  
  // Define text area: use precise textBounds if available, otherwise fallback to margin
  let textAreaX, textAreaY, textAreaWidth, textAreaHeight;
  
  if (textBounds) {
    textAreaX = textBounds.x;
    textAreaY = textBounds.y;
    textAreaWidth = textBounds.width;
    textAreaHeight = textBounds.height;
  } else {
    // Fallback for safety, though it should always receive textBounds now
    const margin = 40;
    textAreaX = margin;
    textAreaY = margin;
    textAreaWidth = width - (margin * 2);
    textAreaHeight = height - (margin * 2);
  }
  
  // Generate 4-8 main crossing lines based on intensity (more lines than before)
  const numMainStrokes = Math.floor(intensity * 6 + 4); // 4-10 main strokes
  
  for (let i = 0; i < numMainStrokes; i++) {
    // Generate lines that cross through the text area
    const isHorizontal = random.next() < 0.6; // 60% horizontal, 40% diagonal/vertical
    
    let startX: number, startY: number, endX: number, endY: number;
    
    if (isHorizontal) {
      // Horizontal crossing lines
      startX = textAreaX - random.range(10, 30);
      endX = textAreaX + textAreaWidth + random.range(10, 30);
      startY = endY = textAreaY + random.range(textAreaHeight * 0.2, textAreaHeight * 0.8);
      
      // Add slight vertical variation for natural look
      endY += random.range(-15, 15);
    } else {
      // Diagonal crossing lines
      const direction = random.next() < 0.5 ? 1 : -1; // Top-left to bottom-right or vice versa
      
      if (direction > 0) {
        // Top-left to bottom-right
        startX = textAreaX - random.range(10, 30);
        startY = textAreaY - random.range(10, 30);
        endX = textAreaX + textAreaWidth + random.range(10, 30);
        endY = textAreaY + textAreaHeight + random.range(10, 30);
      } else {
        // Top-right to bottom-left
        startX = textAreaX + textAreaWidth + random.range(10, 30);
        startY = textAreaY - random.range(10, 30);
        endX = textAreaX - random.range(10, 30);
        endY = textAreaY + textAreaHeight + random.range(10, 30);
      }
    }
    
    // Generate a crossing stroke
    const crossingStroke = generateCrossingStroke(startX, startY, endX, endY, random);
    strokes.push(crossingStroke);
  }
  
  // Texture strokes temporarily disabled for testing
  // const numTextureStrokes = Math.floor(intensity * 3 + 2); // 2-5 texture strokes
  
  // for (let i = 0; i < numTextureStrokes; i++) {
  //   const startX = random.range(textAreaX, textAreaX + textAreaWidth);
  //   const startY = random.range(textAreaY, textAreaY + textAreaHeight);
  //   const strokeLength = random.range(20, 60);
  //   
  //   const textureStroke = generateStroke(startX, startY, strokeLength, random);
  //   strokes.push(textureStroke);
  // }
  
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