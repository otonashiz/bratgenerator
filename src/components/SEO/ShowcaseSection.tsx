export default function ShowcaseSection() {
  const showcaseExamples = [
    {
      text: "HARD PASS",
      alt: "Brat generator example: 'HARD PASS' - Custom brat album cover created with free brat text generator, featuring scribble effect in square format",
      format: "square",
      hasScribble: true,
    },
    {
      text: "PLAY THE REMIX",
      alt: "Brat generator example: 'PLAY THE REMIX' - Custom brat album cover created with free brat text generator, featuring clean text in story format",
      format: "story",
      hasScribble: false,
    },
    {
      text: "I SAID NO",
      alt: "Brat generator example: 'I SAID NO' - Custom brat album cover created with free brat text generator, featuring scribble effect in square format",
      format: "square",
      hasScribble: true,
    },
    {
      text: "NOT MY PROBLEM",
      alt: "Brat generator example: 'NOT MY PROBLEM' - Custom brat album cover created with free brat text generator, featuring clean text in story format",
      format: "story",
      hasScribble: false,
    },
    {
      text: "READ THE ROOM",
      alt: "Brat generator example: 'READ THE ROOM' - Custom brat album cover created with free brat text generator, featuring scribble effect in square format",
      format: "square",
      hasScribble: true,
    },
    {
      text: "TRY AGAIN",
      alt: "Brat generator example: 'TRY AGAIN' - Custom brat album cover created with free brat text generator, featuring clean text in story format",
      format: "story",
      hasScribble: false,
    },
  ];

  return (
    <section className="mt-8 bg-gradient-to-br from-gray-50/50 to-gray-100/30 rounded-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Popular Brat Generator Examples
        </h2>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Get inspired by these trending <strong>brat covers</strong> created with our <strong>brat generator</strong>. 
          Click any example to try it yourself with our free <strong>brat text generator</strong>.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {showcaseExamples.map((example, index) => (
          <div
            key={index}
            className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* 图片容器 - 暂时使用占位符背景 */}
            <div 
              className={`
                w-full bg-brat-green flex items-center justify-center text-brat-text font-bold text-center p-4 relative
                ${example.format === 'story' ? 'aspect-[4/5]' : 'aspect-square'}
              `}
            >
              {/* 文字展示 */}
              <div className="relative z-10">
                <span 
                  className={`
                    text-lg md:text-xl leading-tight
                    ${example.hasScribble ? 'relative' : ''}
                  `}
                >
                  {example.text}
                  {/* 涂鸦效果模拟 */}
                  {example.hasScribble && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        className="w-full h-6 text-brat-text opacity-80" 
                        viewBox="0 0 200 20"
                        preserveAspectRatio="none"
                      >
                        <path 
                          d="M5 10 Q50 5 100 12 T195 8" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}
                </span>
              </div>

              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                  Click to try
                </div>
              </div>
            </div>

            {/* 图片信息 */}
            <div className="p-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    {example.format === 'story' ? (
                      <rect x="4" y="2" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    ) : (
                      <rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    )}
                  </svg>
                  {example.format === 'story' ? 'Story (4:5)' : 'Post (1:1)'}
                </span>
                <span className="flex items-center gap-1">
                  {example.hasScribble ? (
                    <>
                      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 8c1-2 3-1 4 0s2 2 4 0 3 2 4 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                      Scribble
                    </>
                  ) : (
                    'Clean'
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-xs">
          All examples created with our free <strong>brat generator</strong>. 
          Perfect for Instagram posts, stories, and social media sharing.
        </p>
      </div>
    </section>
  );
} 