'use client';

import { useGenerator } from '@/hooks';
import { TextInput, Button, Toggle, Canvas } from '@/components/UI';
import { SizeSelector, DownloadButton } from '@/components/Controls';

const SIZE_OPTIONS = [
  { value: '1:1' as const, label: 'Square' },
  { value: '4:5' as const, label: 'Portrait' },
];

export default function BratGenerator() {
  const {
    text,
    hasScribble,
    size,
    isLoading,
    error,
    setText,
    setHasScribble,
    setSize,
    exportImage,
    reset,
    canvasRef,
  } = useGenerator();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-brat-green px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brat-text text-center">
            Brat Generator
          </h1>
          <p className="text-brat-text text-center mt-2 text-lg">
            Create your own Charli XCX Brat-style covers
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls Panel */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Customize Your Cover
              </h2>
              
              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Text
                </label>
                <TextInput
                  value={text}
                  onChange={setText}
                  placeholder="Enter your text (e.g., brat)"
                  maxLength={50}
                  disabled={isLoading}
                />
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <SizeSelector
                  value={size}
                  onChange={setSize}
                  options={SIZE_OPTIONS}
                />
              </div>

              {/* Scribble Toggle - positioned for mobile-first design */}
              <div className="mb-6">
                <Toggle
                  checked={hasScribble}
                  onChange={setHasScribble}
                  label="Scribble Effect"
                  disabled={isLoading}
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <DownloadButton
                  onClick={exportImage}
                  disabled={!text.trim() || isLoading}
                  isLoading={isLoading}
                />
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={reset}
                  disabled={isLoading}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Preview
            </h2>
            
            {/* Canvas Container */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
              <div className="text-center w-full">
                <Canvas
                  text={text}
                  hasScribble={hasScribble}
                  size={size}
                  className="w-full max-w-md mx-auto"
                  onError={(error) => console.error('Canvas error:', error)}
                />
                <p className="text-gray-500 text-sm mt-2">
                  Preview ({size === '1:1' ? 'Square' : 'Portrait'})
                </p>
                
                {/* Hidden canvas for exports */}
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  width={size === '1:1' ? 600 : 600}
                  height={size === '1:1' ? 600 : 750}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Inspired by Charli XCX&apos;s &quot;Brat&quot; album cover. 
            Create your own custom covers with the signature style.
          </p>
        </div>
      </main>
    </div>
  );
}
