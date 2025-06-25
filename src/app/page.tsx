'use client';

import { useGenerator } from '@/hooks';
import { Toggle, Canvas } from '@/components/UI';
import { DownloadButton } from '@/components/Controls';
import { TutorialSection, FeatureSection } from '@/components/SEO';

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
      <header className="bg-brat-green px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-brat-text text-center">
            Brat Generator
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Preview Panel - 置顶显示 */}
        <div className="mb-8">
          
          {/* Canvas Container */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center w-full">
              <Canvas
                text={text}
                hasScribble={hasScribble}
                size={size}
                className="w-full max-w-md mx-auto"
                onError={(error) => console.error('Canvas error:', error)}
                onTextChange={setText}
              />
              
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

        {/* Controls Panel */}
        <div className="max-w-md mx-auto space-y-4">
          {/* Size Selector - 简化版本 */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setSize('1:1')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                size === '1:1'
                  ? 'border-brat-green bg-brat-green text-brat-text'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Post (1:1)
            </button>
            
            <button
              onClick={() => setSize('4:5')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                size === '4:5'
                  ? 'border-brat-green bg-brat-green text-brat-text'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <rect x="4" y="2" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Story (4:5)
            </button>
          </div>

          {/* Scribble Toggle - 简化版本 */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Scribble</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-600">
                <path d="M2 8c1-2 3-1 4 0s2 2 4 0 3 2 4 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M3 12c1-1 2 0 3 0s1-1 3 0 2 1 3 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <Toggle
              checked={hasScribble}
              onChange={setHasScribble}
              label=""
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
          <div>
            <DownloadButton
              onClick={exportImage}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="mt-16">
          <TutorialSection />
          <FeatureSection />
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Inspired by Charli XCX&apos;s &quot;Brat&quot; album cover. 
            Create your own custom covers with the signature style.
          </p>
        </div>
      </main>
    </div>
  );
}
