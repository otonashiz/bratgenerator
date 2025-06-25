import { useState, useCallback, useRef } from 'react';
import type { BratGeneratorState, UseBratGeneratorReturn } from '@/types/generator';
import type { RenderConfig } from '@/types/canvas';
import { clearCanvas, renderText } from '@/utils/canvas';
import { generateScribblePattern, renderScribbleToCanvas, type ScribbleConfig } from '@/utils/scribbleGenerator';
import { BRAT_COLORS } from '@/constants/colors';

const INITIAL_STATE: BratGeneratorState = {
  text: '',
  size: '1:1',
  hasScribble: true,
  isLoading: false,
  error: null,
};

export const useGenerator = (): UseBratGeneratorReturn => {
  const [state, setState] = useState<BratGeneratorState>(INITIAL_STATE);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // Update text content
  const setText = useCallback((text: string) => {
    setState((prev: BratGeneratorState) => ({ ...prev, text }));
  }, []);

  // Update canvas size
  const setSize = useCallback((size: '1:1' | '4:5') => {
    setState((prev: BratGeneratorState) => ({ ...prev, size }));
  }, []);

  // Toggle scribble effect
  const setHasScribble = useCallback((hasScribble: boolean) => {
    setState((prev: BratGeneratorState) => ({ ...prev, hasScribble }));
  }, []);

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev: BratGeneratorState) => ({ ...prev, isLoading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState((prev: BratGeneratorState) => ({ ...prev, error }));
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Export image (placeholder for now)
  const exportImage = useCallback(async (): Promise<void> => {
    console.log('exportImage函数被调用');
    
    if (!state.text.trim()) {
      console.log('文本为空，显示错误');
      setError('Please enter some text first');
      return;
    }

    console.log('开始导出图片，当前状态:', { text: state.text, size: state.size, hasScribble: state.hasScribble });
    setLoading(true);
    setError(null);
    
    try {
      // Simulate async generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('模拟异步处理完成');
      
      // Create a simple data URL for testing
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        console.log('Canvas context获取成功，开始渲染');
        
        // Clear canvas
        clearCanvas(ctx, canvas.width, canvas.height);
        
        // Create render configuration from current state
        const renderConfig: RenderConfig = {
          text: state.text,
          size: state.size,
          hasScribble: state.hasScribble,
          backgroundColor: BRAT_COLORS.green,
          textColor: BRAT_COLORS.text,
          fontSize: 0 // Will be calculated dynamically
        };
        
        // Render text and get its precise bounding box
        const textBounds = renderText(ctx, renderConfig);
        console.log('文本渲染完成，文本边界:', textBounds);
        
        // Render scribble if enabled, using the text's bounding box
        if (state.hasScribble) {
          const scribbleConfig: ScribbleConfig = {
            width: canvas.width,
            height: canvas.height,
            intensity: 0.6, // Default intensity
            seed: state.text.length, // Seed with text for consistency
            textBounds: textBounds // Pass precise bounds
          };
          
          const pattern = generateScribblePattern(scribbleConfig);
          renderScribbleToCanvas(ctx, pattern);
          console.log('涂鸦效果渲染完成');
        }
        
        // Generate data URL for download
        const dataUrl = canvas.toDataURL('image/png');
        console.log('图片dataUrl生成完成，长度:', dataUrl.length);
        
        // Create download link and trigger download
        const link = document.createElement('a');
        link.download = `brat-cover-${Date.now()}.png`;
        link.href = dataUrl;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('下载触发成功，文件名:', link.download);
        
        // Update data URL for preview
        setState(prev => ({ ...prev, previewUrl: dataUrl, isLoading: false }));
      } else {
        throw new Error('Failed to get canvas context');
      }
    } catch (error) {
      console.error('导出图片失败:', error);
      setError('Failed to export image. Please try again.');
    } finally {
      setLoading(false);
      console.log('exportImage函数执行完成');
    }
  }, [state.text, state.size, state.hasScribble, setLoading, setError]);

  return {
    // State properties (spread from BratGeneratorState)
    text: state.text,
    hasScribble: state.hasScribble,
    size: state.size,
    isLoading: state.isLoading,
    error: state.error,
    
    // Action methods (from BratGeneratorActions)
    setText,
    setHasScribble,
    setSize,
    setLoading,
    setError,
    exportImage,
    reset,
    
    // Canvas ref (from UseBratGeneratorReturn)
    canvasRef,
  };
};

export type { UseBratGeneratorReturn, BratGeneratorState }; 