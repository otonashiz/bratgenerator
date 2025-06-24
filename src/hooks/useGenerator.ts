import { useState, useCallback, useRef } from 'react';
import type { BratGeneratorState, UseBratGeneratorReturn } from '@/types/generator';

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
    if (!state.text.trim()) {
      setError('Please enter some text first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Simulate async generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implement actual canvas rendering and download
      // For now, just simulate the process
      
      // Create a simple data URL for testing
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Simple green background with black text
        ctx.fillStyle = '#BEFF34';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(state.text, canvas.width / 2, canvas.height / 2);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `brat-${state.text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error('Failed to export image:', error);
      setError('Failed to export image. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [state.text, setLoading, setError]);

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