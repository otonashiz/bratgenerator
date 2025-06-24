import { useCallback } from 'react';
import { clsx } from 'clsx';
import type { SizeSelectorProps } from '@/types/generator';
import { CANVAS_SIZES } from '@/types/canvas';

export const SizeSelector = ({ value, onChange, options }: SizeSelectorProps) => {
  const handleSizeChange = useCallback((size: '1:1' | '4:5') => {
    onChange(size);
  }, [onChange]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Image Size
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          const canvasSize = CANVAS_SIZES[option.value];
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSizeChange(option.value)}
              className={clsx(
                // Base styles
                'relative flex flex-col items-center justify-center p-4 rounded-lg border-2',
                'transition-all duration-150 ease-in-out min-h-[80px]',
                'focus:outline-none focus:ring-2 focus:ring-brat-green focus:ring-offset-2',
                
                // Selection states
                {
                  'border-brat-green bg-brat-green/10 text-gray-900': isSelected,
                  'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50': !isSelected,
                }
              )}
              aria-pressed={isSelected}
              aria-label={`Select ${option.label} size`}
            >
              {/* Visual representation of aspect ratio */}
              <div className="mb-2">
                <div 
                  className={clsx(
                    'border-2 bg-gray-100',
                    {
                      'border-brat-green': isSelected,
                      'border-gray-300': !isSelected,
                    }
                  )}
                  style={{
                    width: option.value === '1:1' ? '24px' : '20px',
                    height: option.value === '1:1' ? '24px' : '25px',
                  }}
                />
              </div>
              
              {/* Size label */}
              <div className="text-center">
                <div className={clsx(
                  'text-sm font-medium',
                  {
                    'text-gray-900': isSelected,
                    'text-gray-700': !isSelected,
                  }
                )}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {canvasSize.width} × {canvasSize.height}
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 bg-brat-green rounded-full flex items-center justify-center">
                    <svg 
                      className="w-3 h-3 text-black" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export type { SizeSelectorProps }; 