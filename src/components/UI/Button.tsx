import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled, 
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Size variants
          {
            'px-3 py-2 text-sm min-h-[36px]': size === 'sm',
            'px-4 py-2 text-base min-h-[44px]': size === 'md', // 44px for touch targets
            'px-6 py-3 text-lg min-h-[48px]': size === 'lg',
          },
          
          // Style variants
          {
            // Primary: Brat green background
            'bg-brat-green text-brat-text hover:bg-brat-green/90 focus:ring-brat-green/50 hover:transform hover:-translate-y-0.5 hover:shadow-lg': 
              variant === 'primary',
            
            // Secondary: Black border with white background
            'border-2 border-brat-text bg-white text-brat-text hover:bg-brat-text hover:text-white focus:ring-brat-text/50': 
              variant === 'secondary',
            
            // Ghost: Transparent with black text
            'bg-transparent text-brat-text hover:bg-black/5 focus:ring-brat-text/50': 
              variant === 'ghost',
          },
          
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps }; 