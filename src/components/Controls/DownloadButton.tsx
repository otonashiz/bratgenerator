import { useCallback } from 'react';
import { Button } from '@/components/UI/Button';
import type { DownloadButtonProps } from '@/types/generator';

export const DownloadButton = ({ 
  onClick, 
  disabled = false, 
  isLoading = false 
}: DownloadButtonProps) => {
  const handleDownload = useCallback(() => {
    if (!disabled && !isLoading) {
      onClick();
    }
  }, [onClick, disabled, isLoading]);

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleDownload}
      disabled={disabled}
      isLoading={isLoading}
      className="w-full"
      aria-label="Download your Brat-style image"
    >
      {isLoading ? (
        'Generating Image...'
      ) : (
        <>
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          Download Image
        </>
      )}
    </Button>
  );
};

export type { DownloadButtonProps }; 