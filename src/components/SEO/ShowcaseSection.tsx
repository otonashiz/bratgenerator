'use client';

interface ShowcaseItem {
  id: number;
  text: string;
  format: "square" | "story";
  scribble: boolean;
}

export default function ShowcaseSection() {
  const showcaseItems: ShowcaseItem[] = [
    { id: 1, text: "HARD PASS", format: "square", scribble: true },
    { id: 2, text: "PLAY THE REMIX", format: "story", scribble: false },
    { id: 3, text: "I SAID NO", format: "square", scribble: true },
    { id: 4, text: "NOT MY PROBLEM", format: "square", scribble: false },
    { id: 5, text: "READ THE ROOM", format: "story", scribble: true },
    { id: 6, text: "TRY AGAIN", format: "square", scribble: false }
  ];

  // 生成SVG预览图片
  const generateSVG = (item: ShowcaseItem) => {
    const isSquare = item.format === "square";
    const width = 300;
    const height = isSquare ? 300 : 375;
    
    // 计算文本换行
    const words = item.text.split(' ');
    const maxCharsPerLine = isSquare ? 12 : 10;
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > maxCharsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // 计算字体大小和位置
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const baseFontSize = Math.min(40, Math.max(24, Math.floor((width * 0.8) / (maxLineLength * 0.6))));
    const fontSize = Math.floor(baseFontSize / Math.max(1, lines.length * 0.3));
    const lineHeight = fontSize * 1.2;
    
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + fontSize / 2;
    
    // 生成SVG
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#8ACE00"/>
        <g font-family="Arial" font-weight="bold" font-size="${fontSize}" text-anchor="middle" fill="#000">
          ${lines.map((line, index) => 
            `<text x="${width/2}" y="${startY + index * lineHeight}">${line}</text>`
          ).join('')}
        </g>
        ${item.scribble ? `
          <g stroke="#000" stroke-width="3" fill="none" stroke-linecap="round">
            <path d="M${width*0.15} ${height/2} Q${width*0.35} ${height/2-5} ${width*0.5} ${height/2} Q${width*0.65} ${height/2+5} ${width*0.85} ${height/2}"/>
            <path d="M${width*0.25} ${height/2-8} L${width*0.75} ${height/2+8}"/>
          </g>
        ` : ''}
      </svg>
    `;
  };

  return (
    <section className="mt-12 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Popular Brat Covers
        </h2>
        <p className="text-gray-600 text-sm">
          Trending designs created with our <strong>brat generator</strong>
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
        {showcaseItems.map((item) => {
          const svgContent = generateSVG(item);
          const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
          
          return (
            <div key={item.id} className="group relative">
              <img 
                src={dataUrl}
                alt={`Brat generator showcase: '${item.text}' album cover in ${item.format} format${item.scribble ? ' with scribble effect' : ' clean text'} - Created with free brat text generator`}
                className="w-full h-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
                width={300}
                height={item.format === 'story' ? 375 : 300}
              />
              
              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-300" />
            </div>
          );
        })}
      </div>
    </section>
  );
} 