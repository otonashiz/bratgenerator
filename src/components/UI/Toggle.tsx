import { useCallback } from 'react';
import { clsx } from 'clsx';
import type { ToggleProps } from '@/types/generator';

export const Toggle = ({ checked, onChange, label, disabled = false }: ToggleProps) => {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, onChange, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label.toLowerCase()}`}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={clsx(
          // Base styles - minimum 48px width for touch targets
          'relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brat-green focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Background color based on state
          {
            'bg-brat-green': checked,
            'bg-gray-200': !checked,
          }
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={clsx(
            // Base thumb styles
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0',
            'transition-transform duration-200 ease-in-out',
            
            // Position based on state
            {
              'translate-x-6': checked,
              'translate-x-0': !checked,
            }
          )}
        />
      </button>
      
      <label 
        className={clsx(
          'text-sm font-medium select-none',
          {
            'text-gray-900': !disabled,
            'text-gray-400': disabled,
          }
        )}
        onClick={!disabled ? handleToggle : undefined}
      >
        {label}
      </label>
    </div>
  );
};

export type { ToggleProps }; 