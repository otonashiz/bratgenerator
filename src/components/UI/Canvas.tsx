'use client';

import { useEffect, useRef, useCallback, useMemo, useState, useLayoutEffect } from 'react';
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
  onTextChange?: (text: string) => void;
}

export const Canvas = ({
  text,
  hasScribble,
  size,
  className = '',
  onRenderComplete,
  onError,
  onTextChange
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scribbleCacheRef = useRef(new Map<string, ScribbleStroke[]>());
  const animationFrameRef = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // 编辑状态管理
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // 编辑相关处理函数
  const handleCanvasClick = useCallback(() => {
    if (!isEditing && onTextChange) {
      setIsEditing(true);
      setEditValue(text || '');
    }
  }, [isEditing, text, onTextChange]);

  useLayoutEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // 限制最大行数为5行
    const lines = value.split('\n');
    if (lines.length > 5) {
      return; // 如果超过5行，不允许输入
    }
    
    // 检查每行字符数限制（建议30-40字符）
    const maxCharsPerLine = 35;
    const validLines = lines.every(line => line.length <= maxCharsPerLine);
    if (!validLines) {
      return; // 如果任何一行超过字符限制，不允许输入
    }
    
    setEditValue(value);
    
    // 自动调整高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter 结束编辑
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onTextChange?.(editValue);
      setIsEditing(false);
      return;
    }
    
    // 单独的Enter键换行（但要检查行数限制）
    if (e.key === 'Enter' && !e.shiftKey) {
      const lines = editValue.split('\n');
      if (lines.length >= 5) {
        e.preventDefault(); // 阻止换行如果已经达到最大行数
        return;
      }
    }
    
    if (e.key === 'Escape') {
      setEditValue(text || '');
      setIsEditing(false);
    }
  }, [editValue, text, onTextChange]);

  const handleInputBlur = useCallback(() => {
    onTextChange?.(editValue);
    setIsEditing(false);
  }, [editValue, onTextChange]);

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

      // 显示文字内容或默认提示
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
        // 显示默认的 'Text Here' 提示
        const placeholderConfig: RenderConfig = {
          ...renderConfig,
          text: 'Text Here'
        };
        renderText(ctx, placeholderConfig);
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
    <div className={`flex items-center justify-center relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={canvasStyle}
        className="border-2 border-gray-300 rounded-lg shadow-lg bg-white cursor-pointer"
        aria-label={`Brat generator preview: ${text || 'Text Here'}`}
        onClick={handleCanvasClick}
      />
      
      {/* 编辑输入框 - 改为textarea */}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="px-4 py-2 text-lg font-medium text-center bg-white border-2 border-brat-green rounded-lg shadow-lg outline-none max-w-[80%] resize-none"
            rows={3}
            maxLength={175} // 5行 × 35字符/行
            placeholder="Text here (Enter for new line)"
            enterKeyHint="enter"
            style={{ 
              minHeight: '60px',
              maxHeight: '150px',
              lineHeight: '1.4'
            }}
          />
        </div>
      )}
    </div>
  );
}; 