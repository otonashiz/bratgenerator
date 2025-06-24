// Generator Types - Core Application Types

export interface BratGeneratorState {
  text: string;
  hasScribble: boolean;
  size: '1:1' | '4:5';
  isLoading: boolean;
  error: string | null;
}

export interface BratGeneratorActions {
  setText: (text: string) => void;
  setHasScribble: (hasScribble: boolean) => void;
  setSize: (size: '1:1' | '4:5') => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  exportImage: () => Promise<void>;
  reset: () => void;
}

// Component Props Types
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export interface SizeSelectorProps {
  value: '1:1' | '4:5';
  onChange: (size: '1:1' | '4:5') => void;
  options: Array<{
    value: '1:1' | '4:5';
    label: string;
  }>;
}

export interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface CanvasProps {
  text: string;
  hasScribble: boolean;
  size: '1:1' | '4:5';
  onRenderComplete?: () => void;
  onError?: (error: Error) => void;
}

// Hook Return Types
export interface UseBratGeneratorReturn extends BratGeneratorState, BratGeneratorActions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  render: (config: import('./canvas').RenderConfig) => void;
  exportImage: (format: 'png', scale?: number) => Promise<Blob>;
  isReady: boolean;
  error: Error | null;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
} 