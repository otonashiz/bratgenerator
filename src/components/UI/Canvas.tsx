'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { RenderConfig } from '@/types/canvas';
import { CANVAS_SIZES } from '@/types/canvas';
import { BRAT_COLORS } from '@/constants/colors';
import { 
  getOptimizedContext, 
  clearCanvas, 
  renderText, 
  validateRenderConfig,
  CanvasError 
} from '@/utils/canvas';
import { 
  generateScribblePattern, 
  renderScribbleToCanvas,
  type ScribbleStroke 
} from '@/utils/scribbleGenerator';

interface CanvasProps {
  text: string;
  hasScribble: boolean;
  size: '1:1' | '4:5';
  className?: string;
  onRenderComplete?: () => void;
  onError?: (error: Error) => void;
}

export const Canvas = ({
  text,
  hasScribble,
  size,
  className = '',
  onRenderComplete,
  onError
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scribbleCacheRef = useRef(new Map<string, ScribbleStroke[]>());
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Memoize render config to prevent unnecessary re-renders
  const renderConfig: RenderConfig = useMemo(() => ({
    text,
    hasScribble,
    size,
    backgroundColor: BRAT_COLORS.green,
    textColor: BRAT_COLORS.text,
    fontSize: 0 // Will be calculated dynamically
  }), [text, hasScribble, size]);

  // Generate scribble cache key for consistent patterns
  const scribbleCacheKey = useMemo(() => {
    return `${text}-${size}-${hasScribble}`;
  }, [text, size, hasScribble]);

  // Get or create scribble pattern with text bounds
  const getScribblePattern = useCallback((textBounds?: { x: number; y: number; width: number; height: number; }): ScribbleStroke[] => {
    if (!hasScribble) return [];
    
    const cacheKey = `${scribbleCacheKey}-${textBounds ? `${textBounds.x}-${textBounds.y}-${textBounds.width}-${textBounds.height}` : 'no-bounds'}`;
    
    if (scribbleCacheRef.current.has(cacheKey)) {
      return scribbleCacheRef.current.get(cacheKey)!;
    }

    const canvasSize = CANVAS_SIZES[size];
    const pattern = generateScribblePattern({
      width: canvasSize.width,
      height: canvasSize.height,
      intensity: 0.6,
      seed: text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
      textBounds: textBounds
    });

    scribbleCacheRef.current.set(cacheKey, pattern);
    return pattern;
  }, [hasScribble, scribbleCacheKey, size, text]);

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Validate configuration
      if (text.trim()) {
        validateRenderConfig(renderConfig);
      }

      // Get optimized context
      const ctx = getOptimizedContext(canvas);
      const canvasSize = CANVAS_SIZES[size];

      // Set canvas dimensions
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // Clear with background color
      clearCanvas(ctx, canvasSize.width, canvasSize.height);

      // Only render text if provided
      if (text.trim()) {
        // Render text and get its bounding box
        const textBounds = renderText(ctx, renderConfig);

        // Render scribble effect if enabled, using text bounds
        if (hasScribble) {
          const scribblePattern = getScribblePattern(textBounds);
          if (scribblePattern.length > 0) {
            renderScribbleToCanvas(ctx, scribblePattern);
          }
        }
      } else {
        // Show placeholder text when empty
        ctx.font = 'normal 24px Arial, sans-serif';
        ctx.fillStyle = BRAT_COLORS.text;
        ctx.globalAlpha = 0.3;
        ctx.fillText('Enter text to preview', canvasSize.width / 2, canvasSize.height / 2);
        ctx.globalAlpha = 1.0;
      }

      onRenderComplete?.();
    } catch (error) {
      console.error('Canvas render error:', error);
      onError?.(error instanceof Error ? error : new CanvasError('Unknown render error'));
    }
  }, [renderConfig, size, text, hasScribble, getScribblePattern, onRenderComplete, onError]);

  // Debounced render using requestAnimationFrame
  const scheduleRender = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(render);
  }, [render]);

  // Effect to trigger re-render when props change
  useEffect(() => {
    scheduleRender();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scheduleRender]);

  // Canvas size styles
  const canvasSize = CANVAS_SIZES[size];
  const canvasStyle = {
    width: canvasSize.width,
    maxWidth: '100%',
    aspectRatio: `${canvasSize.width} / ${canvasSize.height}`
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={canvasStyle}
        className="border-2 border-gray-300 rounded-lg shadow-lg bg-white"
        aria-label={`Brat generator preview: ${text || 'Empty'}`}
      />
    </div>
  );
}; 