import { forwardRef, useCallback } from 'react';
import { clsx } from 'clsx';
import type { TextInputProps } from '@/types/generator';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "Enter your text here...", 
    disabled = false, 
    maxLength = 100,
    className,
    ...props 
  }, ref) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    }, [onChange]);

    return (
      <div className="w-full">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={clsx(
            // Base styles
            'w-full px-4 py-3 text-base bg-white border-2 rounded-lg',
            'placeholder:text-gray-400 text-gray-900',
            'transition-all duration-150 ease-in-out',
            
            // Focus and interaction states
            'focus:outline-none focus:ring-2 focus:ring-brat-green focus:ring-offset-2',
            'focus:border-brat-green',
            
            // Default and hover states
            {
              'border-gray-200 hover:border-gray-300': !disabled,
              'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed': disabled,
            },
            
            className
          )}
          {...props}
        />
        
        {/* Character counter */}
        {maxLength && (
          <div className="flex justify-end mt-1">
            <span className={clsx(
              'text-xs',
              {
                'text-gray-500': value.length < maxLength * 0.8,
                'text-orange-500': value.length >= maxLength * 0.8 && value.length < maxLength,
                'text-red-500': value.length >= maxLength,
              }
            )}>
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export type { TextInputProps }; 